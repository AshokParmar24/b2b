import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Country from "@/models/Country";
import { countrySchema } from "@/lib/validations/masters";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  const country = await Country.findById(id);
  if (!country) return NextResponse.json({ error: "Country not found" }, { status: 404 });
  return NextResponse.json(country);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();

    // 🛡️ SERVER-SIDE VALIDATION - Use partial to allow updating only some fields
    const validation = countrySchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: validation.error.format() 
      }, { status: 400 });
    }

    // 🚫 DUPLICATE PROTECTION (Exclude current record)
    if (validation.data.code) {
      const existing = await Country.findOne({ 
        code: validation.data.code.toUpperCase(),
        _id: { $ne: id }
      });
      if (existing) {
        return NextResponse.json({ error: "Country code already exists" }, { status: 409 });
      }
      
      // Ensure code is stored in uppercase
      validation.data.code = validation.data.code.toUpperCase();
    }

    const country = await Country.findByIdAndUpdate(id, validation.data, { new: true });
    if (!country) return NextResponse.json({ error: "Country not found" }, { status: 404 });
    return NextResponse.json(country);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  // We do a soft delete by setting isActive to false
  const country = await Country.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!country) return NextResponse.json({ error: "Country not found" }, { status: 404 });
  return NextResponse.json({ message: "Country deleted successfully" });
}
