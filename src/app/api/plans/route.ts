import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Plan from "@/models/Plan";
import { planSchema } from "@/lib/validations/plans";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    
    let query: any = {};
    if (status === "active") query.isActive = true;
    if (status === "archived") query.isActive = false;

    const plans = await Plan.find(query).sort({ price: 1 }).lean();
    return NextResponse.json({ data: plans });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const validatedData = planSchema.parse(body);

    // Default endDate if not provided (e.g. 10 years from now for infinite plans)
    if (!validatedData.endDate) {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 10);
      validatedData.endDate = futureDate as any;
    }

    // Check for duplicate name
    const existing = await Plan.findOne({ name: { $regex: new RegExp(`^${validatedData.name}$`, "i") } });
    if (existing) {
      return NextResponse.json({ error: "A plan with this name already exists" }, { status: 400 });
    }

    const plan = await Plan.create(validatedData);
    return NextResponse.json(plan, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}
