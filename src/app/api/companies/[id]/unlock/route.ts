import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Company from "@/models/Company";
import User from "@/models/User";
import CreditTransaction from "@/models/CreditTransaction";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const companyId = resolvedParams.id;

    // 1. Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // 2. Fetch the target company to verify it exists
    const company = await Company.findById(companyId);
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // 3. Check if user is an Admin (Admins have free access, no credit required)
    const isAdmin = (session.user as any).role === 1;
    if (isAdmin) {
      return NextResponse.json({
        message: "Admin access granted. Company details unlocked successfully.",
        company: {
          _id: company._id,
          name: company.name,
          website: company.website,
          contactEmails: company.contactEmails,
          contactPhones: company.contactPhones
        }
      });
    }

    // 4. Fetch the user in database to inspect credits
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 5. Check if they have already unlocked this company (to avoid double charging)
    const existingTransaction = await CreditTransaction.findOne({
      userId,
      amount: -1,
      description: { $regex: new RegExp(companyId, "i") }
    });

    if (existingTransaction) {
      return NextResponse.json({
        message: "Company already unlocked.",
        company: {
          _id: company._id,
          name: company.name,
          website: company.website,
          contactEmails: company.contactEmails,
          contactPhones: company.contactPhones
        }
      });
    }

    // 6. Check credit ledger balance
    if (user.dataCredits < 1) {
      return NextResponse.json(
        { error: "Insufficient credits. Please upgrade your subscription plan to unlock more companies." },
        { status: 403 }
      );
    }

    // 7. Deduct 1 credit & create transaction ledger entry
    user.dataCredits -= 1;
    await user.save();

    await CreditTransaction.create({
      userId: user._id,
      amount: -1,
      description: `Unlocked Company: ${company.name} (ID: ${company._id})`
    });

    return NextResponse.json({
      message: "Company unlocked successfully! 1 credit deducted.",
      creditsRemaining: user.dataCredits,
      company: {
        _id: company._id,
        name: company.name,
        website: company.website,
        contactEmails: company.contactEmails,
        contactPhones: company.contactPhones
      }
    });

  } catch (error: any) {
    console.error("Unlock company error:", error);
    return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}
