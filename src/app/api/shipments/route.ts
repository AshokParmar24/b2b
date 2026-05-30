import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import ShipmentRecord from "@/models/ShipmentRecord";
import Company from "@/models/Company";
import HsnCode from "@/models/HsnCode";
import City from "@/models/City";
import User from "@/models/User";
import CreditTransaction from "@/models/CreditTransaction";

// Ensure mongoose registrations are loaded
void Company;
void HsnCode;
void City;
void User;
void CreditTransaction;

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    // Parse query params
    const search = searchParams.get("search") || searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limitParam = parseInt(searchParams.get("limit") || "10");
    const sortField = searchParams.get("sortField") || "date";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    // Filters
    const exporterId = searchParams.get("exporterId");
    const importerId = searchParams.get("importerId");
    const hsnCodeId = searchParams.get("hsnCodeId");
    const originPortId = searchParams.get("originPortId");
    const destinationPortId = searchParams.get("destinationPortId");

    // 1. Get current session and check subscription status
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    
    let activeUser = null;
    let isFreePlan = true;
    let dataCredits = 0;
    let unlockedCompanyIds: string[] = [];

    if (userId) {
      activeUser = await User.findById(userId).populate("planId").lean();
      if (activeUser) {
        dataCredits = activeUser.dataCredits || 0;
        const planName = (activeUser.planId as any)?.name || "";
        isFreePlan = !planName || planName.toLowerCase() === "free plan";
        
        // Find all companies unlocked by this user
        const unlocks = await CreditTransaction.find({
          userId,
          amount: -1,
          description: { $regex: /Unlocked Company/i }
        }).lean();

        // Extract company IDs from descriptions (e.g., "Unlocked Company: Apple Inc. (ID: 60a...7c)")
        unlockedCompanyIds = unlocks.map(u => {
          const match = u.description.match(/\(ID:\s*([a-f\d]{24})\)/i);
          return match ? match[1] : "";
        }).filter(Boolean);
      }
    }

    // Admins see everything unblurred and are not marked as Free Plan
    const isAdmin = (session?.user as any)?.role === 1;
    if (isAdmin) {
      isFreePlan = false;
    }

    // 2. Enforce limits for free plan
    const limit = isFreePlan ? Math.min(limitParam, 5) : limitParam;

    // 3. Build mongoose query
    const query: any = {};

    // Fuzzy search across HSN, product description, or Company names
    if (search) {
      // Find matching HSN codes
      const matchedHsns = await HsnCode.find({
        $or: [
          { code: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }
        ]
      }).select("_id").lean();
      const hsnIds = matchedHsns.map(h => h._id);

      // Find matching Companies
      const matchedCompanies = await Company.find({
        name: { $regex: search, $options: "i" }
      }).select("_id").lean();
      const companyIds = matchedCompanies.map(c => c._id);

      query.$or = [
        { productDescription: { $regex: search, $options: "i" } },
        { hsnCodeId: { $in: hsnIds } },
        { exporterId: { $in: companyIds } },
        { importerId: { $in: companyIds } }
      ];
    }

    // Add specific filters
    if (exporterId) query.exporterId = exporterId;
    if (importerId) query.importerId = importerId;
    if (hsnCodeId) query.hsnCodeId = hsnCodeId;
    if (originPortId) query.originPortId = originPortId;
    if (destinationPortId) query.destinationPortId = destinationPortId;

    // 4. Fetch dynamic data from database
    const sort: any = {};
    sort[sortField] = sortOrder;

    const skipCount = isFreePlan ? 0 : (page - 1) * limit; // Free plan only shows the first 5 records

    const [shipments, total] = await Promise.all([
      ShipmentRecord.find(query)
        .populate("exporterId", "name countryId isBlurred website contactEmails contactPhones")
        .populate("importerId", "name countryId isBlurred website contactEmails contactPhones")
        .populate("hsnCodeId", "code description")
        .populate("originPortId", "name")
        .populate("destinationPortId", "name")
        .sort(sort)
        .skip(skipCount)
        .limit(limit)
        .lean(),
      ShipmentRecord.countDocuments(query)
    ]);

    // 5. Blur/Gate data based on paywall rules
    const processedShipments = shipments.map((shipment: any) => {
      const exporter = shipment.exporterId;
      const importer = shipment.importerId;

      const exporterIdStr = exporter?._id?.toString() || "";
      const importerIdStr = importer?._id?.toString() || "";

      // Check if this specific shipment's exporter or importer is unlocked
      const isExporterUnlocked = isAdmin || unlockedCompanyIds.includes(exporterIdStr) || !exporter?.isBlurred;
      const isImporterUnlocked = isAdmin || unlockedCompanyIds.includes(importerIdStr) || !importer?.isBlurred;

      return {
        _id: shipment._id,
        date: shipment.date,
        productDescription: shipment.productDescription,
        quantity: shipment.quantity,
        unit: shipment.unitType,
        valueUSD: shipment.valueUSD,
        hsnCode: shipment.hsnCodeId?.code || "N/A",
        hsnDescription: shipment.hsnCodeId?.description || "",
        originPort: shipment.originPortId?.name || "Unknown Port",
        destinationPort: shipment.destinationPortId?.name || "Unknown Port",
        
        // Exporter details (Supplier)
        exporter: {
          _id: exporterIdStr,
          name: isExporterUnlocked ? exporter?.name : "***LOCKED***",
          countryId: exporter?.countryId,
          website: isExporterUnlocked ? exporter?.website : "***LOCKED***",
          contactEmails: isExporterUnlocked ? exporter?.contactEmails : ["***LOCKED***"],
          contactPhones: isExporterUnlocked ? exporter?.contactPhones : ["***LOCKED***"],
          isUnlocked: isExporterUnlocked
        },

        // Importer details (Buyer)
        importer: {
          _id: importerIdStr,
          name: isImporterUnlocked ? importer?.name : "***LOCKED***",
          countryId: importer?.countryId,
          website: isImporterUnlocked ? importer?.website : "***LOCKED***",
          contactEmails: isImporterUnlocked ? importer?.contactEmails : ["***LOCKED***"],
          contactPhones: isImporterUnlocked ? importer?.contactPhones : ["***LOCKED***"],
          isUnlocked: isImporterUnlocked
        },

        isBlurred: !isExporterUnlocked || !isImporterUnlocked
      };
    });

    return NextResponse.json({
      data: processedShipments,
      pagination: {
        total: isFreePlan ? Math.min(total, 5) : total,
        page,
        limit,
        totalPages: isFreePlan ? 1 : Math.ceil(total / limit)
      },
      user: {
        isFreePlan,
        dataCredits,
        isAdmin
      }
    });

  } catch (error: any) {
    console.error("Failed to query shipments:", error);
    return NextResponse.json({ error: "Failed to fetch shipments: " + error.message }, { status: 500 });
  }
}
