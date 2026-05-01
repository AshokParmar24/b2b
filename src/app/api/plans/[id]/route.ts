import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Plan from "@/models/Plan";
import { planSchema } from "@/lib/validations/plans";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await dbConnect();
    const plan = await Plan.findById(resolvedParams.id).lean();
    if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plan" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await dbConnect();
    const body = await req.json();

    // If it's just a status toggle (soft delete/restore)
    if (Object.keys(body).length === 1 && 'isActive' in body) {
      const plan = await Plan.findByIdAndUpdate(resolvedParams.id, { isActive: body.isActive }, { new: true });
      return NextResponse.json(plan);
    }

    const validatedData = planSchema.parse(body);

    const existing = await Plan.findOne({ 
      name: { $regex: new RegExp(`^${validatedData.name}$`, "i") },
      _id: { $ne: resolvedParams.id }
    });
    if (existing) {
      return NextResponse.json({ error: "A plan with this name already exists" }, { status: 400 });
    }

    if (!validatedData.endDate) {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 10);
      validatedData.endDate = futureDate as any;
    }

    const plan = await Plan.findByIdAndUpdate(resolvedParams.id, validatedData, { new: true, runValidators: true });
    if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });

    return NextResponse.json(plan);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await dbConnect();
    const plan = await Plan.findByIdAndDelete(resolvedParams.id);
    if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    return NextResponse.json({ message: "Plan deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
  }
}
