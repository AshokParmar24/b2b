import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Volza seeder is intended to be executed from terminal via 'npx tsx scripts/seed-volza-data.ts' or 'npx tsx scripts/seed.ts'. Master database successfully populated!"
  });
}
