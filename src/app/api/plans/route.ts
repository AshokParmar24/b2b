import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Plan from "@/models/Plan";

export async function GET() {
  await dbConnect();
  const plans = await Plan.find({ isActive: true }).sort({ price: 1 }).lean();
  return NextResponse.json(plans);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const plan = await Plan.create(body);
  return NextResponse.json(plan, { status: 201 });
}
