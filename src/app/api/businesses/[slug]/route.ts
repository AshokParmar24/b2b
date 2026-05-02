import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Business from "@/models/Business";
import Country from "@/models/Country";
import State from "@/models/State";
import City from "@/models/City";
import Pincode from "@/models/Pincode";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await dbConnect();

  // Ensure referenced models are registered before populate
  void Country; void State; void City; void Pincode;

  const business = await Business.findOne({ slug, isActive: true })
    .populate("countryId", "name flag phoneCode")
    .populate("stateId", "name")
    .populate("cityId", "name")
    .populate("pincodeId", "pincode area")
    .lean();

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  return NextResponse.json(business);
}
