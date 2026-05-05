import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import HsnCode from "@/models/HsnCode";
import { hsnSchema } from "@/lib/validations/masters";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const hsn = await HsnCode.findById(id).lean();
    if (!hsn) {
      return NextResponse.json({ error: "HSN Code not found" }, { status: 404 });
    }
    return NextResponse.json(hsn);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    // Partial update for isActive toggle
    if (Object.keys(body).length === 1 && body.isActive !== undefined) {
      const hsn = await HsnCode.findByIdAndUpdate(id, { isActive: body.isActive }, { new: true });
      return NextResponse.json(hsn);
    }

    const validation = hsnSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Validation failed", details: validation.error.format() }, { status: 400 });
    }

    // Check if code is already used by another record
    const existing = await HsnCode.findOne({ 
        code: validation.data.code, 
        _id: { $ne: id } 
    });
    if (existing) {
      return NextResponse.json({ error: "HSN Code already in use by another record" }, { status: 409 });
    }

    const hsn = await HsnCode.findByIdAndUpdate(id, validation.data, { new: true });
    if (!hsn) {
      return NextResponse.json({ error: "HSN Code not found" }, { status: 404 });
    }

    return NextResponse.json(hsn);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const hsn = await HsnCode.findByIdAndDelete(id);
    if (!hsn) {
      return NextResponse.json({ error: "HSN Code not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "HSN Code deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
