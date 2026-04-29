import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import HsnCode from "@/models/HsnCode";

import { hsnSchema } from "@/lib/validations/masters";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const isExport = searchParams.get("export") === "true";

  await dbConnect();

  const query: any = q ? {
    $or: [
      { code: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ],
  } : { isActive: true };

  // If export mode, fetch all
  if (isExport) {
    const allRecords = await HsnCode.find(query).sort({ code: 1 }).lean();
    return NextResponse.json(allRecords);
  }

  const hsns = await HsnCode.find(query)
    .limit(20)
    .lean();
  return NextResponse.json({ data: hsns });
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
