import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Pincode from "@/models/Pincode";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cityId = searchParams.get("cityId");
  await dbConnect();
  const query = cityId ? { cityId, isActive: true } : { isActive: true };
  const pincodes = await Pincode.find(query).sort({ pincode: 1 }).lean();
  return NextResponse.json(pincodes);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const pincode = await Pincode.create(body);
  return NextResponse.json(pincode, { status: 201 });
}
