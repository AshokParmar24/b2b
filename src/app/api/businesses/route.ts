import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Business from "@/models/Business";
import User from "@/models/User";
import Plan from "@/models/Plan";
import slugify from "@/lib/slugify";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const page  = parseInt(searchParams.get("page")  || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const q     = searchParams.get("q") || "";
  const hsn   = searchParams.get("hsn") || "";
  const city  = searchParams.get("city") || "";

  const filter: any = { isActive: true };
  if (hsn) filter["hsnCodes.code"] = { $regex: hsn, $options: "i" };
  if (city) filter.cityId = city;
  if (q)    filter.$text = { $search: q };

  const [businesses, total] = await Promise.all([
    Business.find(filter)
      .populate("countryId", "name flag phoneCode")
      .populate("stateId",   "name")
      .populate("cityId",    "name")
      .populate("pincodeId", "pincode area")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),
    Business.countDocuments(filter),
  ]);

  return NextResponse.json({ businesses, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const userId = (session.user as any).id;
  const user   = await User.findById(userId).populate("planId");
  if (!user)    return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Check plan limits
  const plan        = user.planId as any;
  const currentCount = await Business.countDocuments({ userId, isActive: true });
  if (plan && currentCount >= plan.maxListings)
    return NextResponse.json({ error: `Plan limit reached. Upgrade to add more listings.` }, { status: 403 });

  const body = await req.json();

  // Validate cardImages max 10
  if (body.cardImages && body.cardImages.length > 10)
    return NextResponse.json({ error: "Maximum 10 card images allowed" }, { status: 400 });

  // Validate HSN codes per plan
  if (plan?.maxHsnCodes && body.hsnCodes?.length > plan.maxHsnCodes)
    return NextResponse.json({ error: `Plan allows max ${plan.maxHsnCodes} HSN codes` }, { status: 400 });

  const slug = slugify(body.businessName + "-" + Date.now());
  const business = await Business.create({ ...body, slug, userId });

  return NextResponse.json(business, { status: 201 });
}
