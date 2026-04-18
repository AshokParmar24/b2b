import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Country from "@/models/Country";

export async function GET() {
  await dbConnect();
  const countries = await Country.find({ isActive: true }).sort({ name: 1 }).lean();
  return NextResponse.json(countries);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const country = await Country.create(body);
  return NextResponse.json(country, { status: 201 });
}
