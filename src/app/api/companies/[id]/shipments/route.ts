import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import ShipmentRecord from "@/models/ShipmentRecord";
import Company from "@/models/Company";
import HsnCode from "@/models/HsnCode";
import City from "@/models/City";
// Import FollowedEntity or UnlockedEntity model if needed for unlocking logic

// Force evaluation for Mongoose schema registration to avoid MissingSchemaError
void Company;
void HsnCode;
void City;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const companyId = params.id;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    // Fetch the target company to verify it exists
    const targetCompany = await Company.findById(companyId);
    if (!targetCompany) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // 1. Fetch Shipments
    const query = {
      $or: [{ exporterId: companyId }, { importerId: companyId }],
    };

    const shipments = await ShipmentRecord.find(query)
      .populate("exporterId", "name countryId")
      .populate("importerId", "name countryId")
      .populate("hsnCodeId", "code description")
      .populate("originPortId", "name")
      .populate("destinationPortId", "name")
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(); // Use lean() for fast POJO returns

    const total = await ShipmentRecord.countDocuments(query);

    // 2. The Paywall Logic (Data Blurring)
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role; // 1 = Admin, 2 = User
    
    // In a real scenario, we'd check if the user has explicitly 'unlocked' this company via CreditTransaction.
    // For this sprint implementation, we blur data if they aren't authenticated or if they are a regular user 
    // who hasn't unlocked it (we'll assume all regular users haven't unlocked it for this demo, unless they are Admin).
    const isUnlocked = userRole === 1; // Admins see everything. For Users, we blur it initially.

    // 3. Process the data
    const processedShipments = shipments.map((shipment: any) => {
      const isExporter = shipment.exporterId?._id.toString() === companyId;
      
      // The "Partner" is the other company in the transaction
      const partner = isExporter ? shipment.importerId : shipment.exporterId;
      
      return {
        _id: shipment._id,
        date: shipment.date,
        hsnCode: shipment.hsnCodeId?.code,
        productDescription: shipment.productDescription,
        quantity: shipment.quantity,
        unit: shipment.unitType,
        valueUSD: shipment.valueUSD,
        originPort: shipment.originPortId?.name || "Unknown",
        destinationPort: shipment.destinationPortId?.name || "Unknown",
        type: isExporter ? "Export" : "Import",
        
        // --- PAYWALL BLURRING ---
        partnerName: isUnlocked ? partner?.name : "***LOCKED***",
        isBlurred: !isUnlocked
      };
    });

    return NextResponse.json({
      data: processedShipments,
      company: {
        id: targetCompany._id,
        name: targetCompany.name,
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      isUnlocked // Tells frontend whether to show the "Unlock" button
    });
  } catch (error) {
    console.error("Error fetching company shipments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
