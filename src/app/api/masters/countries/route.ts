import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Country from "@/models/Country";

import { countrySchema } from "@/lib/validations/masters";

export async function GET(req: Request) {
  // ... existing GET logic ...
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const sortField = searchParams.get("sortField") || "name";
  const sortOrder = searchParams.get("sortOrder") === "desc" ? -1 : 1;
  const status = searchParams.get("status") || "active";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const isExport = searchParams.get("export") === "true";
  const skip = (page - 1) * limit;

  const query: any = {};

  // 🏛️ STATUS FILTERING
  if (status === "active") query.isActive = true;
  else if (status === "archived") query.isActive = false;

  if (search) {
    query.$and = [
      ...(query.isActive !== undefined ? [{ isActive: query.isActive }] : []),
      {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { code: { $regex: search, $options: "i" } },
          { currencyCode: { $regex: search, $options: "i" } }
        ]
      }
    ];
    // Clear top-level isActive if using $and
    delete query.isActive;
  }

  // If export mode, fetch all without pagination
  if (isExport) {
    const allRecords = await Country.find(query).sort({ [sortField]: sortOrder }).lean();
    return NextResponse.json(allRecords);
  }

  const [countries, total, activeCount, archivedCount] = await Promise.all([
    Country.find(query)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),
    Country.countDocuments(query),
    Country.countDocuments({ isActive: true }),
    Country.countDocuments({ isActive: false })
  ]);
    
  return NextResponse.json({
    data: countries,
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

    // 🛡️ SERVER-SIDE VALIDATION
    const validation = countrySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: validation.error.format() 
      }, { status: 400 });
    }

    // Normalize code to uppercase
    const normalizedCode = validation.data.code.toUpperCase();

    // 🚫 DUPLICATE PROTECTION
    const existing = await Country.findOne({ code: normalizedCode });
    if (existing) {
      return NextResponse.json({ error: "Country code already exists" }, { status: 409 });
    }

    const country = await Country.create({
      ...validation.data,
      code: normalizedCode
    });
    return NextResponse.json(country, { status: 201 });
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

    const result = await Country.updateMany(
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
