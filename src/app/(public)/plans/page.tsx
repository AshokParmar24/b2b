import React from "react";
import dbConnect from "@/lib/dbConnect";
import Plan from "@/models/Plan";
import { PlansView } from "@/components/plans/PlansView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PublicPlansPage() {
  await dbConnect();
  const plans = await Plan.find({ isActive: true }).sort({ price: 1 }).lean();

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <section className="px-6 pt-20 pb-16 text-center">
        <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-top-8 duration-700">
          <h1 className="mb-4 text-4xl font-[1000] tracking-tight text-slate-900 md:text-6xl">
            Choose Your <span className="text-primary">Growth Plan</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-medium text-slate-500">
            Click a plan to see its full potential. Instant activation guaranteed.
          </p>
        </div>
      </section>

      <PlansView plans={plans.map(p => ({ ...p, _id: p._id.toString() }))} />
    </main>
  );
}
