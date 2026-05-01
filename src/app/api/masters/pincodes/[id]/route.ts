import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Pincode from "@/models/Pincode";
import { pincodeSchema } from "@/lib/validations/masters";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  const pincode = await Pincode.findById(id).populate("cityId", "name stateId").lean();
  if (!pincode) return NextResponse.json({ error: "Pincode not found" }, { status: 404 });
  return NextResponse.json(pincode);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();

    const validation = pincodeSchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Validation failed", details: validation.error.format() }, { status: 400 });
    }

    // Duplicate check (excluding current)
    if (validation.data.pincode && validation.data.cityId) {
      const existing = await Pincode.findOne({
        pincode: validation.data.pincode,
        cityId: validation.data.cityId,
        _id: { $ne: id }
      });
      if (existing) {
        return NextResponse.json({ error: "Pincode already exists for this city" }, { status: 409 });
      }
    }

    const pincode = await Pincode.findByIdAndUpdate(id, validation.data, { new: true });
    if (!pincode) return NextResponse.json({ error: "Pincode not found" }, { status: 404 });
    return NextResponse.json(pincode);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  const pincode = await Pincode.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!pincode) return NextResponse.json({ error: "Pincode not found" }, { status: 404 });
  return NextResponse.json({ message: "Pincode archived successfully" });
}
