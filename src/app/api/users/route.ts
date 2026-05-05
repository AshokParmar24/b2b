import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
// Must import models so Mongoose registers them before populate() calls
import "@/models/Country";
import "@/models/State";
import "@/models/City";
import "@/models/Pincode";
import "@/models/Plan";
import { userSchema } from "@/lib/validations/users";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const role = url.searchParams.get("role");
    const status = url.searchParams.get("status");

    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    const query: Record<string, any> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role === "1") query.role = 1;
    else if (role === "2") query.role = 2;

    if (status === "active") query.isActive = true;
    else if (status === "inactive") query.isActive = false;

    const [users, total] = await Promise.all([
      User.find(query)
        .populate("planId", "name price")
        .populate("countryId", "name code")
        .populate("stateId", "name")
        .populate("cityId", "name")
        .populate("pincodeId", "pincode")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(query)
    ]);

    const activeCount = await User.countDocuments({ ...query, isActive: true });
    const archivedCount = total - activeCount;

    const safeUsers = users.map((u: any) => {
      const { password, ...rest } = u;
      return rest;
    });

    return NextResponse.json({ 
      success: true, 
      data: safeUsers, 
      total, 
      page, 
      totalPages: Math.ceil(total / limit),
      activeCount,
      archivedCount
    });
  } catch (error: any) {
    console.error("[GET /api/users] Error:", error.message);
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const validatedData = userSchema.parse(body);

    const existingUser = await User.findOne({ email: validatedData.email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "User with this email already exists" }, { status: 400 });
    }

    if (!validatedData.password) {
      return NextResponse.json({ success: false, error: "Password is required for new users" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const userData = {
      ...validatedData,
      email: validatedData.email.toLowerCase(),
      password: hashedPassword,
      planId: validatedData.planId || null,
      countryId: validatedData.countryId || null,
      stateId: validatedData.stateId || null,
      cityId: validatedData.cityId || null,
      pincodeId: validatedData.pincodeId || null,
    };

    const user = await User.create(userData);
    const { password, ...userWithoutPassword } = user.toObject();
    return NextResponse.json({ success: true, data: userWithoutPassword }, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/users] Error:", error.message);
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { ids, isActive, action } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No users selected" }, { status: 400 });
    }

    if (isActive !== undefined) {
      await User.updateMany({ _id: { $in: ids } }, { $set: { isActive } });
    } else if (action === 'archive') {
      await User.updateMany({ _id: { $in: ids } }, { $set: { isActive: false } });
    } else if (action === 'restore') {
      await User.updateMany({ _id: { $in: ids } }, { $set: { isActive: true } });
    } else if (action === 'delete') {
      await User.deleteMany({ _id: { $in: ids } });
    } else {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    return NextResponse.json({ message: `Successfully processed ${ids.length} users` });
  } catch (error: any) {
    console.error("[PATCH /api/users] Error:", error.message);
    return NextResponse.json({ error: "Failed to process bulk action" }, { status: 500 });
  }
}
