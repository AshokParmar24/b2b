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
      hsn: 5,
    },
  };

  return (
    <div className="animate-fadeInUp mx-auto max-w-5xl">
      <div className="mb-10">
        <h1 className="mb-2 text-3xl font-black text-white">My Subscription</h1>
        <p className="text-gray-400">Manage your plan and billing preference.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Current Plan Card */}
        <div className="space-y-6 lg:col-span-2">
          <div className="glass-card relative h-fit overflow-hidden p-8">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-purple-600/10 blur-3xl" />

            <div className="mb-8 flex items-center justify-between">
              <div>
                <span className="mb-1 block text-xs font-black tracking-widest text-purple-400 uppercase">
                  Current Plan
                </span>
                <h2 className="flex items-center gap-3 text-4xl font-black text-white">
                  {currentPlan.name} <Crown className="h-6 w-6 text-yellow-500" />
                </h2>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Next Billing Date</p>
                <p className="flex items-center justify-end gap-2 font-bold text-white">
                  <Calendar className="h-4 w-4 text-purple-400" /> {currentPlan.endDate}
                </p>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-gray-800 bg-white/5 p-4">
                <p className="mb-1 text-xs text-gray-500 uppercase">Listings Usage</p>
                <p className="text-xl font-bold text-white">
                  {currentPlan.usage.cards} / {currentPlan.usage.maxCards}
                </p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-gray-800">
                  <div
                    className="h-1.5 rounded-full bg-purple-600"
                    style={{
                      width: `${(currentPlan.usage.cards / currentPlan.usage.maxCards) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="rounded-xl border border-gray-800 bg-white/5 p-4">
                <p className="mb-1 text-xs text-gray-500 uppercase">Images / Card</p>
                <p className="text-xl font-bold text-white">Up to {currentPlan.usage.images}</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-white/5 p-4">
                <p className="mb-1 text-xs text-gray-500 uppercase">HSN Limit</p>
                <p className="text-xl font-bold text-white">{currentPlan.usage.hsn} Codes</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Link href="/plans">
                <Button className="btn-glow gap-2 px-8">
                  <ArrowUpCircle className="h-4 w-4" /> Upgrade Plan
                </Button>
              </Link>
              <Button variant="outline" className="border-gray-800 text-gray-400">
                Cancel Subscription
              </Button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="mb-4 text-lg font-bold text-white">Plan Benefits</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                "10 Active Business Listings",
                "5 Products Images per Card",
                "Verified Badge on Listings",
                "Standard Email Support",
                "HSN Code Matrix (Up to 5)",
                "Full Address Reference",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 text-sm text-gray-400">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upgrade Suggestion */}
        <div className="space-y-6">
          <div className="glass-card border-purple-500/30 bg-purple-500/5 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-white">
              <Zap className="h-5 w-5 text-yellow-500" /> Go Pro
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              Unlock unlimited power with our <b>Pro Plan</b>. Add up to 100 business listings and
              get priority placement in search results.
            </p>
            <div className="mb-6 flex items-baseline gap-1">
              <IndianRupee className="h-4 w-4 text-gray-400" />
              <span className="text-3xl font-black text-white">799</span>
              <span className="text-xs text-gray-500">/ month</span>
            </div>
            <Link href="/plans">
              <Button className="w-full bg-purple-600 font-bold text-white hover:bg-purple-700">
                See Pro Features
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
