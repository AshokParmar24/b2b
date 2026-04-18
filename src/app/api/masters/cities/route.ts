import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import City from "@/models/City";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const stateId = searchParams.get("stateId");
  await dbConnect();
  const query = stateId ? { stateId, isActive: true } : { isActive: true };
  const cities = await City.find(query).sort({ name: 1 }).lean();
  return NextResponse.json(cities);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const city = await City.create(body);
  return NextResponse.json(city, { status: 201 });
}
