import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import "@/models/Country";
import "@/models/State";
import "@/models/City";
import "@/models/Pincode";
import "@/models/Plan";
import { userSchema } from "@/lib/validations/users";
import bcrypt from "bcryptjs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await dbConnect();
    const user = await User.findById(resolvedParams.id)
      .populate("planId", "name")
      .populate("countryId", "name code")
      .populate("stateId", "name code")
      .populate("cityId", "name")
      .populate("pincodeId", "pincode")
      .lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    
    const { password, ...userWithoutPassword } = user as any;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await dbConnect();
    const body = await req.json();
    
    // Status toggle only
    if (Object.keys(body).length === 1 && 'isActive' in body) {
      const user = await User.findByIdAndUpdate(resolvedParams.id, { isActive: body.isActive }, { new: true });
      return NextResponse.json(user);
    }

    const validatedData = userSchema.parse(body);

    const existing = await User.findOne({ 
      email: validatedData.email.toLowerCase(),
      _id: { $ne: resolvedParams.id }
    });
    if (existing) {
      return NextResponse.json({ error: "Email is already in use by another user" }, { status: 400 });
    }

    const updateData: any = {
      name: validatedData.name,
      email: validatedData.email.toLowerCase(),
      mobile: validatedData.mobile,
      mobileCode: validatedData.mobileCode,
      mobileIso: validatedData.mobileIso,
      countryId: validatedData.countryId,
      stateId: validatedData.stateId,
      cityId: validatedData.cityId,
      pincodeId: validatedData.pincodeId,
      role: validatedData.role,
      isActive: validatedData.isActive,
      planId: validatedData.planId || null,
    };

    if (validatedData.password && validatedData.password.trim() !== "") {
      updateData.password = await bcrypt.hash(validatedData.password, 10);
    }

    const user = await User.findByIdAndUpdate(resolvedParams.id, updateData, { new: true });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { password, ...userWithoutPassword } = user.toObject();
    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await dbConnect();
    const user = await User.findByIdAndDelete(resolvedParams.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
