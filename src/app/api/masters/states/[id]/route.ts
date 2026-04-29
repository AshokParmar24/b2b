import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import State from "@/models/State";
import { stateSchema } from "@/lib/validations/masters";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  const state = await State.findById(id).lean();
  if (!state) return NextResponse.json({ error: "State not found" }, { status: 404 });
  return NextResponse.json(state);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();

    // 🛡️ SERVER-SIDE VALIDATION - Use partial to allow updating only some fields
    const validation = stateSchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: validation.error.format() 
      }, { status: 400 });
    }

    // 🚫 DUPLICATE PROTECTION (Per Country, Exclude current record)
    // We only check if both code and countryId are available (either from body or we might need to fetch existing if only one is provided)
    // For simplicity, if only code is provided, we'd need the countryId of the existing record.
    if (validation.data.code) {
      const currentState = await State.findById(id);
      if (!currentState) return NextResponse.json({ error: "State not found" }, { status: 404 });
      
      const countryIdToCheck = validation.data.countryId || currentState.countryId.toString();
      const uppercaseCode = validation.data.code.toUpperCase();

      const existing = await State.findOne({ 
        code: uppercaseCode,
        countryId: countryIdToCheck,
        _id: { $ne: id }
      });
      if (existing) {
        return NextResponse.json({ error: "State code already exists for this country" }, { status: 409 });
      }
      
      // Normalize code
      validation.data.code = uppercaseCode;
    }

    const state = await State.findByIdAndUpdate(id, validation.data, { new: true });
    if (!state) return NextResponse.json({ error: "State not found" }, { status: 404 });
    return NextResponse.json(state);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  // Soft delete
  const state = await State.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!state) return NextResponse.json({ error: "State not found" }, { status: 404 });
  return NextResponse.json({ message: "State archived successfully" });
}
