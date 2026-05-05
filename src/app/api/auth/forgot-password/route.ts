import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    await dbConnect();
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return NextResponse.json({ message: "If that email is in our database, we will send a password reset link to it." }, { status: 200 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    console.log(`\n\n-----------------------------------------`);
    console.log(`🔐 PASSWORD RESET LINK (MOCK EMAIL)`);
    console.log(`To: ${email}`);
    console.log(`Link: http://localhost:3000/reset-password?token=${resetToken}`);
    console.log(`-----------------------------------------\n\n`);

    return NextResponse.json(
      { 
        message: "Password reset link sent successfully! (Check console or auto-redirecting...)",
        devToken: resetToken 
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
