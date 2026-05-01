import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import City from "@/models/City";
import { citySchema } from "@/lib/validations/masters";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  const city = await City.findById(id).populate("stateId", "name countryId").lean();
  if (!city) return NextResponse.json({ error: "City not found" }, { status: 404 });
  return NextResponse.json(city);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();

    const validation = citySchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Validation failed", details: validation.error.format() }, { status: 400 });
    }

    // Duplicate name check within same state (excluding current)
    if (validation.data.name && validation.data.stateId) {
      const existing = await City.findOne({
        name: { $regex: new RegExp(`^${validation.data.name}$`, "i") },
        stateId: validation.data.stateId,
        _id: { $ne: id }
      });
      if (existing) {
        return NextResponse.json({ error: "City already exists in this state" }, { status: 409 });
      }
    }

    const city = await City.findByIdAndUpdate(id, validation.data, { new: true });
    if (!city) return NextResponse.json({ error: "City not found" }, { status: 404 });
    return NextResponse.json(city);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  const city = await City.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!city) return NextResponse.json({ error: "City not found" }, { status: 404 });
  return NextResponse.json({ message: "City archived successfully" });
}
