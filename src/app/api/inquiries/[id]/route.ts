import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Inquiry from "@/models/Inquiry";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();
    
    if (body.isActive !== undefined) {
      const status = body.isActive ? "pending" : "closed";
      await Inquiry.findByIdAndUpdate(id, { $set: { status } });
    }

    return NextResponse.json({ message: "Success" });
  } catch(e: any) {
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    await Inquiry.findByIdAndUpdate(id, { $set: { status: "closed" } });
    return NextResponse.json({ message: "Success" });
  } catch(e: any) {
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
