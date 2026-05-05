import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Inquiry from "@/models/Inquiry";
import "@/models/Business";
import "@/models/User";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    const query: Record<string, any> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    // Inquiries don't use 'isActive', they use 'status'. For generic list, map active to pending/responded?
    // Let's just return all for now or filter if status is provided
    const statusParam = url.searchParams.get("status");
    if (statusParam === "active") query.status = { $in: ["pending", "responded"] };
    if (statusParam === "archived") query.status = "closed";

    const [inquiries, total] = await Promise.all([
      Inquiry.find(query)
        .populate("businessId", "businessName")
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Inquiry.countDocuments(query)
    ]);

    const activeCount = await Inquiry.countDocuments({ ...query, status: { $in: ["pending", "responded"] } });
    const archivedCount = await Inquiry.countDocuments({ ...query, status: "closed" });

    return NextResponse.json({ 
      success: true, 
      data: inquiries, 
      total, 
      page, 
      totalPages: Math.ceil(total / limit),
      activeCount,
      archivedCount
    });
  } catch (error: any) {
    console.error("[GET /api/inquiries] Error:", error.message);
    return NextResponse.json({ success: false, error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { ids, isActive, action } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No inquiries selected" }, { status: 400 });
    }

    // For inquiries, isActive = false means closed, isActive = true means pending
    if (isActive !== undefined) {
      const status = isActive ? "pending" : "closed";
      await Inquiry.updateMany({ _id: { $in: ids } }, { $set: { status } });
    } else if (action === 'archive') {
      await Inquiry.updateMany({ _id: { $in: ids } }, { $set: { status: "closed" } });
    } else if (action === 'restore') {
      await Inquiry.updateMany({ _id: { $in: ids } }, { $set: { status: "pending" } });
    } else if (action === 'delete') {
      await Inquiry.deleteMany({ _id: { $in: ids } });
    } else {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    return NextResponse.json({ message: `Successfully processed ${ids.length} inquiries` });
  } catch (error: any) {
    console.error("[PATCH /api/inquiries] Error:", error.message);
    return NextResponse.json({ error: "Failed to process bulk action" }, { status: 500 });
  }
}


