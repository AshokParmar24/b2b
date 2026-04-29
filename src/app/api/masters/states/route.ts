import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import State from "@/models/State";

import { stateSchema } from "@/lib/validations/masters";

export async function GET(req: Request) {
  // ... existing GET logic ...
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const countryId = searchParams.get("countryId");
  const search = searchParams.get("search") || "";
  const sortField = searchParams.get("sortField") || "name";
  const sortOrder = searchParams.get("sortOrder") === "desc" ? -1 : 1;
  const status = searchParams.get("status") || "active";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const isExport = searchParams.get("export") === "true";
  const skip = (page - 1) * limit;

  const query: any = {};
  if (countryId) query.countryId = countryId;

  // 🏛️ STATUS FILTERING
  if (status === "active") query.isActive = true;
  else if (status === "archived") query.isActive = false;

  if (search) {
    query.$and = [
      ...(query.countryId ? [{ countryId: query.countryId }] : []),
      ...(query.isActive !== undefined ? [{ isActive: query.isActive }] : []),
      {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { code: { $regex: search, $options: "i" } }
        ]
      }
    ];
    // Clear top-level filters if using $and
    delete query.countryId;
    delete query.isActive;
  }

  // If export mode, fetch all without pagination
  if (isExport) {
    const allRecords = await State.find(query)
      .populate("countryId", "name")
      .sort({ [sortField]: sortOrder })
      .lean();

    return NextResponse.json(allRecords.map((s: any) => ({
      ...s,
      countryName: s.countryId?.name || "Global"
    })));
  }

  const [states, total, activeCount, archivedCount] = await Promise.all([
    State.find(query)
      .populate("countryId", "name")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),
    State.countDocuments(query),
    State.countDocuments({ isActive: true, ...(countryId ? { countryId } : {}) }),
    State.countDocuments({ isActive: false, ...(countryId ? { countryId } : {}) })
  ]);

  const formattedStates = states.map((s: any) => ({
    ...s,
    countryName: s.countryId?.name || "Global"
  }));

  return NextResponse.json({
    data: formattedStates,
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
    const validation = stateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({
        error: "Validation failed",
        details: validation.error.format()
      }, { status: 400 });
    }

    // Normalize code to uppercase
    const normalizedCode = validation.data.code.toUpperCase();

    // 🚫 DUPLICATE PROTECTION (Per Country)
    const existing = await State.findOne({
      code: normalizedCode,
      countryId: validation.data.countryId
    });
    if (existing) {
      return NextResponse.json({ error: "State code already exists for this country" }, { status: 409 });
    }

    const state = await State.create({
      ...validation.data,
      code: normalizedCode
    });
    return NextResponse.json(state, { status: 201 });
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

    const result = await State.updateMany(
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
