import { Crown, Zap, CheckCircle2, Calendar, IndianRupee, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SubscriberPlanPage() {
  // Mock current subscription data
  const currentPlan = {
    name: "Basic",
    price: 299,
    startDate: "2024-03-01",
    endDate: "2024-04-01",
    usage: {
      cards: 1,
      maxCards: 10,
      images: 5,
      hsn: 5
    }
  };

  return (
    <div className="animate-fadeInUp max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-2">My Subscription</h1>
        <p className="text-gray-400">Manage your plan and billing preference.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 relative overflow-hidden h-fit">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl rounded-full" />
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-purple-400 mb-1 block">Current Plan</span>
                <h2 className="text-4xl font-black text-white flex items-center gap-3">
                  {currentPlan.name} <Crown className="w-6 h-6 text-yellow-500" />
                </h2>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">Next Billing Date</p>
                <p className="text-white font-bold flex items-center gap-2 justify-end">
                  <Calendar className="w-4 h-4 text-purple-400" /> {currentPlan.endDate}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 rounded-xl bg-white/5 border border-gray-800">
                <p className="text-gray-500 text-xs uppercase mb-1">Listings Usage</p>
                <p className="text-xl font-bold text-white">{currentPlan.usage.cards} / {currentPlan.usage.maxCards}</p>
                <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2">
                  <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${(currentPlan.usage.cards / currentPlan.usage.maxCards) * 100}%` }}></div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-gray-800">
                <p className="text-gray-500 text-xs uppercase mb-1">Images / Card</p>
                <p className="text-xl font-bold text-white">Up to {currentPlan.usage.images}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-gray-800">
                <p className="text-gray-500 text-xs uppercase mb-1">HSN Limit</p>
                <p className="text-xl font-bold text-white">{currentPlan.usage.hsn} Codes</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Link href="/plans">
                <Button className="btn-glow gap-2 px-8">
                  <ArrowUpCircle className="w-4 h-4" /> Upgrade Plan
                </Button>
              </Link>
              <Button variant="outline" className="border-gray-800 text-gray-400">Cancel Subscription</Button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">Plan Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "10 Active Business Listings",
                "5 Products Images per Card",
                "Verified Badge on Listings",
                "Standard Email Support",
                "HSN Code Matrix (Up to 5)",
                "Full Address Reference"
              ].map(benefit => (
                <div key={benefit} className="flex items-center gap-3 text-sm text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upgrade Suggestion */}
        <div className="space-y-6">
          <div className="glass-card p-6 border-purple-500/30 bg-purple-500/5">
            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" /> Go Pro
            </h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Unlock unlimited power with our <b>Pro Plan</b>. Add up to 100 business listings and get priority placement in search results.
            </p>
            <div className="flex items-baseline gap-1 mb-6">
              <IndianRupee className="w-4 h-4 text-gray-400" />
              <span className="text-3xl font-black text-white">799</span>
              <span className="text-gray-500 text-xs">/ month</span>
            </div>
            <Link href="/plans">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold">
                See Pro Features
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
