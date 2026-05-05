import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import HsnCode from "@/models/HsnCode";

import { hsnSchema } from "@/lib/validations/masters";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const isExport = searchParams.get("export") === "true";
  const statusParam = searchParams.get("status");

  await dbConnect();

  const query: any = {};

  if (search) {
    query.$or = [
      { code: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (statusParam === "active") query.isActive = true;
  else if (statusParam === "archived") query.isActive = false;

  // If export mode, fetch all
  if (isExport) {
    const allRecords = await HsnCode.find(query).sort({ code: 1 }).lean();
    return NextResponse.json(allRecords);
  }

  const [hsns, total] = await Promise.all([
    HsnCode.find(query)
      .sort({ code: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    HsnCode.countDocuments(query)
  ]);

  const activeCount = await HsnCode.countDocuments({ ...query, isActive: true });
  const archivedCount = total - activeCount;

  return NextResponse.json({ 
    data: hsns,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    activeCount,
    archivedCount
  });
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const validation = hsnSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Validation failed", details: validation.error.format() }, { status: 400 });
    }

    const existing = await HsnCode.findOne({ code: validation.data.code });
    if (existing) {
      return NextResponse.json({ error: "HSN Code already registered" }, { status: 409 });
    }

    const hsn = await HsnCode.create(validation.data);
    return NextResponse.json(hsn, { status: 201 });
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

    const result = await HsnCode.updateMany(
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
