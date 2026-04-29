import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Country from "@/models/Country";
import State from "@/models/State";

export async function GET() {
  try {
    await dbConnect();

    // 1. Get or Create India
    let country = await Country.findOne({ code: "IND" });
    if (!country) {
      country = await Country.create({
        name: "India",
        code: "IND",
        phoneCode: "+91",
        currencyCode: "INR",
        currencySymbol: "₹",
        isActive: true
      });
    }

    // 2. Add 50 dummy States
    const states = [];
    const existingCount = await State.countDocuments({ countryId: country._id });
    
    if (existingCount < 50) {
      const startIdx = existingCount + 1;
      for (let i = startIdx; i <= 50; i++) {
        states.push({
          name: `State ${i}`,
          code: `S${i}`,
          countryId: country._id,
          isActive: true
        });
      }
      
      if (states.length > 0) {
        await State.insertMany(states);
      }
    }

    return NextResponse.json({ message: "States seeding completed successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
