import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Country from "@/models/Country";
import State from "@/models/State";
import City from "@/models/City";
import Pincode from "@/models/Pincode";
import { pincodeSchema } from "@/lib/validations/masters";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  
  const countryId = searchParams.get("countryId");
  const stateId = searchParams.get("stateId");
  const cityId = searchParams.get("cityId");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "active";
  const sortField = searchParams.get("sortField") || "pincode";
  const sortOrder = searchParams.get("sortOrder") === "desc" ? -1 : 1;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const isExport = searchParams.get("export") === "true";
  const skip = (page - 1) * limit;

  const query: any = {};
  
  // 🏛️ CASCADING FILTERS
  if (cityId) query.cityId = cityId;
  else if (stateId) {
    const cities = await City.find({ stateId }).select("_id").lean();
    query.cityId = { $in: cities.map(c => c._id) };
  } else if (countryId) {
    const states = await State.find({ countryId }).select("_id").lean();
    const cities = await City.find({ stateId: { $in: states.map(s => s._id) } }).select("_id").lean();
    query.cityId = { $in: cities.map(c => c._id) };
  }

  // 🏛️ STATUS FILTERING
  if (status === "active") query.isActive = true;
  else if (status === "archived") query.isActive = false;

  if (search) {
    query.$or = [
      { pincode: { $regex: search, $options: "i" } },
      { area: { $regex: search, $options: "i" } }
    ];
  }

  // If export mode, fetch all
  if (isExport) {
    const allRecords = await Pincode.find(query)
      .populate("cityId", "name")
      .sort({ [sortField]: sortOrder })
      .lean();
    
    return NextResponse.json(allRecords.map((p: any) => ({
      ...p,
      cityName: p.cityId?.name || "N/A"
    })));
  }

  const [pincodes, total, activeCount, archivedCount] = await Promise.all([
    Pincode.find(query)
      .populate("cityId", "name")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),
    Pincode.countDocuments(query),
    Pincode.countDocuments({ ...query, isActive: true }),
    Pincode.countDocuments({ ...query, isActive: false })
  ]);
    
  const formattedPincodes = pincodes.map((p: any) => ({
    ...p,
    cityName: p.cityId?.name || "N/A"
  }));

  return NextResponse.json({
    data: formattedPincodes,
    total,
    activeCount,
    archivedCount,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  });
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const validation = pincodeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Validation failed", details: validation.error.format() }, { status: 400 });
    }

    // Duplicate check per city
    const existing = await Pincode.findOne({ pincode: validation.data.pincode, cityId: validation.data.cityId });
    if (existing) {
      return NextResponse.json({ error: "Pincode already exists for this city" }, { status: 409 });
    }

    const pincode = await Pincode.create(validation.data);
    return NextResponse.json(pincode, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { ids, isActive } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Invalid IDs provided" }, { status: 400 });
    }

    const result = await Pincode.updateMany(
      { _id: { $in: ids } },
      { $set: { isActive } }
    );

    return NextResponse.json({ 
      message: `${result.modifiedCount} records updated successfully`,
      modifiedCount: result.modifiedCount 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
