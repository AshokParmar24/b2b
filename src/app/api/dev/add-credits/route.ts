import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import CreditTransaction from "@/models/CreditTransaction";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add 100 credits
    user.dataCredits = (user.dataCredits || 0) + 100;
    await user.save();

    // Record transaction
    await CreditTransaction.create({
      userId: user._id,
      amount: 100,
      description: "Added 100 Free Test Credits for HETNEX Trade Intelligence"
    });

    return NextResponse.json({
      message: "Successfully added 100 dynamic database test credits!",
      dataCredits: user.dataCredits
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to add credits: " + error.message }, { status: 500 });
  }
}
