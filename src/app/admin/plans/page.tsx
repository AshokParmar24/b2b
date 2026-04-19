import { Plus, Edit, Trash2, CheckCircle2, Crown, Zap, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPlansPage() {
  const dummyPlans = [
    {
      id: 1,
      name: "Free",
      price: "0",
      maxCards: "1",
      maxImages: "3",
      hsn: "2",
      status: "active",
      color: "#6c3fff",
    },
    {
      id: 2,
      name: "Basic",
      price: "299",
      maxCards: "10",
      maxImages: "5",
      hsn: "5",
      status: "active",
      color: "#00d4aa",
    },
    {
      id: 3,
      name: "Pro",
      price: "799",
      maxCards: "100",
      maxImages: "10",
      hsn: "Unlimited",
      status: "active",
      color: "#f59e0b",
    },
    {
      id: 4,
      name: "Enterprise",
      price: "1999",
      maxCards: "Unlimited",
      maxImages: "10",
      hsn: "Unlimited",
      status: "active",
      color: "#ec4899",
    },
  ];

  return (
    <div className="animate-fadeInUp">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 text-3xl font-black text-white">Subscription Plans</h1>
          <p className="text-gray-400">Create or modify pricing tiers and strict feature limits.</p>
        </div>
        <button className="btn-glow flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm">
          <Plus className="h-4 w-4" /> Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dummyPlans.map((plan) => (
          <div key={plan.id} className="glass-card relative flex flex-col overflow-hidden">
            <div
              className="absolute top-0 right-0 -mt-10 -mr-10 h-24 w-24 rounded-full opacity-20 blur-xl"
              style={{ background: plan.color }}
            />

            <div className="flex-1 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                {plan.name === "Pro" && <Crown className="h-5 w-5 text-yellow-500" />}
              </div>

              <div className="mb-6 flex items-baseline gap-1">
                <IndianRupee className="h-5 w-5 text-gray-400" />
                <span className="text-4xl font-black tracking-tight text-white">{plan.price}</span>
                <span className="text-sm text-gray-500">/mo</span>
              </div>

              <div className="mb-8 space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">
                    <b>{plan.maxCards}</b> Business Cards
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">
                    <b>{plan.maxImages}</b> Images per Card
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">
                    <b>{plan.hsn}</b> HSN Codes
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-gray-400">Standard Support</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-800/80 bg-black/40 px-6 py-4">
              <span className="rounded border border-green-500/20 bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-400">
                Active
              </span>
              <div className="flex gap-3">
                <button className="text-gray-400 transition-colors hover:text-white">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-gray-400 transition-colors hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
