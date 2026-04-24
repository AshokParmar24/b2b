import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import State from "@/models/State";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const countryId = searchParams.get("countryId");
  await dbConnect();
  const query = countryId ? { countryId, isActive: true } : { isActive: true };
  const states = await State.find(query).sort({ name: 1 }).lean();
  return NextResponse.json(states);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const state = await State.create(body);
  return NextResponse.json(state, { status: 201 });
}
