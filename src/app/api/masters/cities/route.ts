import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Country from "@/models/Country";
import State from "@/models/State";
import City from "@/models/City";

import { citySchema } from "@/lib/validations/masters";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  
  const countryId = searchParams.get("countryId");
  const stateId = searchParams.get("stateId");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "active";
  const sortField = searchParams.get("sortField") || "name";
  const sortOrder = searchParams.get("sortOrder") === "desc" ? -1 : 1;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const isExport = searchParams.get("export") === "true";
  const skip = (page - 1) * limit;

  const query: any = {};
  
  // 🏛️ CASCADING FILTERS
  if (stateId) query.stateId = stateId;
  else if (countryId) {
    // If only country is selected, find all states in that country
    const states = await State.find({ countryId }).select("_id").lean();
    query.stateId = { $in: states.map(s => s._id) };
  }

  // 🏛️ STATUS FILTERING
  if (status === "active") query.isActive = true;
  else if (status === "archived") query.isActive = false;

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  // If export mode, fetch all
  if (isExport) {
    const allRecords = await City.find(query)
      .populate("stateId", "name")
      .sort({ [sortField]: sortOrder })
      .lean();
    
    return NextResponse.json(allRecords.map((c: any) => ({
      ...c,
      stateName: c.stateId?.name || "N/A"
    })));
  }

  const [cities, total, activeCount, archivedCount] = await Promise.all([
    City.find(query)
      .populate("stateId", "name")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),
    City.countDocuments(query),
    City.countDocuments({ isActive: true, ...(stateId ? { stateId } : {}) }),
    City.countDocuments({ isActive: false, ...(stateId ? { stateId } : {}) })
  ]);
    
  const formattedCities = cities.map((c: any) => ({
    ...c,
    stateName: c.stateId?.name || "N/A"
  }));

  return NextResponse.json({
    data: formattedCities,
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

    const validation = citySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Validation failed", details: validation.error.format() }, { status: 400 });
    }

    // Duplicate check
    const existing = await City.findOne({ name: { $regex: new RegExp(`^${validation.data.name}$`, "i") }, stateId: validation.data.stateId });
    if (existing) {
      return NextResponse.json({ error: "City already exists in this state" }, { status: 409 });
    }

    const city = await City.create(validation.data);
    return NextResponse.json(city, { status: 201 });
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

    const result = await City.updateMany(
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
