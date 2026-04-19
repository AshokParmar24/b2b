import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import HsnCode from "@/models/HsnCode";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  await dbConnect();
  const hsns = await HsnCode.find(
    q
      ? {
          $or: [
            { code: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
          ],
        }
      : { isActive: true }
  )
    .limit(20)
    .lean();
  return NextResponse.json(hsns);
}
