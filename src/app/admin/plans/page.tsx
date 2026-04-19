import { Plus, Edit, Trash2, CheckCircle2, Crown, Zap, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPlansPage() {
  const dummyPlans = [
    { id: 1, name: "Free", price: "0", maxCards: "1", maxImages: "3", hsn: "2", status: "active", color: "#6c3fff" },
    { id: 2, name: "Basic", price: "299", maxCards: "10", maxImages: "5", hsn: "5", status: "active", color: "#00d4aa" },
    { id: 3, name: "Pro", price: "799", maxCards: "100", maxImages: "10", hsn: "Unlimited", status: "active", color: "#f59e0b" },
    { id: 4, name: "Enterprise", price: "1999", maxCards: "Unlimited", maxImages: "10", hsn: "Unlimited", status: "active", color: "#ec4899" },
  ];

  return (
    <div className="animate-fadeInUp">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Subscription Plans</h1>
          <p className="text-gray-400">Create or modify pricing tiers and strict feature limits.</p>
        </div>
        <button className="btn-glow flex items-center gap-2 text-sm px-5 py-2.5 rounded-lg">
          <Plus className="w-4 h-4" /> Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dummyPlans.map((plan) => (
          <div key={plan.id} className="glass-card relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20 -mr-10 -mt-10 blur-xl" style={{ background: plan.color }} />
            
            <div className="p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                {plan.name === "Pro" && <Crown className="w-5 h-5 text-yellow-500" />}
              </div>
              
              <div className="flex items-baseline gap-1 mb-6">
                <IndianRupee className="w-5 h-5 text-gray-400" />
                <span className="text-4xl font-black text-white tracking-tight">{plan.price}</span>
                <span className="text-gray-500 text-sm">/mo</span>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300"><b>{plan.maxCards}</b> Business Cards</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300"><b>{plan.maxImages}</b> Images per Card</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300"><b>{plan.hsn}</b> HSN Codes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-400">Standard Support</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-black/40 border-t border-gray-800/80 flex items-center justify-between">
              <span className="text-xs font-semibold px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20">Active</span>
              <div className="flex gap-3">
                <button className="text-gray-400 hover:text-white transition-colors"><Edit className="w-4 h-4" /></button>
                <button className="text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
