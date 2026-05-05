import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Plan from "@/models/Plan";
import Business from "@/models/Business";
import { Crown, Zap, CheckCircle2, Calendar, IndianRupee, ArrowUpCircle, TrendingUp, ShieldCheck, Sparkles, Building2, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SubscriberPlanPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await dbConnect();
  // Ensure models are registered
  void Plan; void Business;
  
  const userId = (session.user as any).id;
  const [user, businessCount] = await Promise.all([
    User.findById(userId).populate("planId").lean() as any,
    Business.countDocuments({ userId, isActive: true }),
  ]);

  const plan = user?.planId;
  const usedPct = plan ? Math.min(100, Math.round((businessCount / plan.maxListings) * 100)) : 0;
  const daysLeft = user?.planEndDate
    ? Math.max(0, Math.ceil((new Date(user.planEndDate).getTime() - Date.now()) / 86_400_000))
    : null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto pb-10">
      
      {/* 🎭 HEADER */}
      <div className="mb-10">
        <div className="flex items-center gap-3 text-muted-foreground/40 mb-2 text-[9px] font-black uppercase tracking-[0.2em]">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <span className="opacity-20">/</span>
          <span className="text-primary/60">Subscription</span>
        </div>
        <h1 className="text-3xl font-[1000] tracking-tight text-foreground">My Plan</h1>
        <p className="text-sm font-medium text-muted-foreground mt-1">
          Manage your subscription and monitor listing limits.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Current Plan Card */}
        <div className="space-y-6 lg:col-span-2">
          <div className="premium-card relative overflow-hidden p-8 sm:p-10">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl -mr-10 -mt-10" />
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                  <Sparkles className="h-3 w-3" />
                  Active Subscription
                </div>
                <h2 className="text-4xl font-[1000] text-foreground tracking-tight flex items-center gap-3">
                  {plan?.name || "Free"} <Crown className="h-8 w-8 text-amber-500" />
                </h2>
              </div>
              
              <div className="sm:text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">Status</p>
                <div className="inline-flex items-center gap-2 text-emerald-500 font-bold text-sm">
                  <ShieldCheck className="h-4 w-4" /> Healthy & Verified
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="rounded-[24px] border border-border/40 bg-muted/20 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-3">Listings Usage</p>
                <p className="text-2xl font-black text-foreground">
                  {businessCount} <span className="text-sm text-muted-foreground/50">/ {plan?.maxListings || 0}</span>
                </p>
                <div className="mt-3 h-2 w-full rounded-full bg-muted/50 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-primary shadow-lg shadow-primary/30 transition-all duration-1000"
                    style={{ width: `${usedPct}%` }}
                  />
                </div>
              </div>
              
              <div className="rounded-[24px] border border-border/40 bg-muted/20 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-3">Plan Validity</p>
                <p className="text-2xl font-black text-foreground">
                  {daysLeft !== null ? `${daysLeft} Days` : "Lifetime"}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground/50 mt-1 uppercase tracking-wider">
                  {user?.planEndDate ? `Until ${new Date(user.planEndDate).toLocaleDateString("en-IN")}` : "No expiry"}
                </p>
              </div>

              <div className="rounded-[24px] border border-border/40 bg-muted/20 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-3">Plan Cost</p>
                <p className="text-2xl font-black text-foreground flex items-center gap-1">
                  <IndianRupee className="h-5 w-5 text-muted-foreground/60" /> {plan?.price || 0}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground/50 mt-1 uppercase tracking-wider">One Time / Monthly</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/plans">
                <button className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-[1000] text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5">
                  <ArrowUpCircle className="h-5 w-5" /> Upgrade Plan
                </button>
              </Link>
              <button className="h-14 px-8 rounded-2xl border border-border/50 text-muted-foreground font-black text-sm hover:bg-muted/50 transition-all">
                Billing History
              </button>
            </div>
          </div>

          <div className="premium-card p-8">
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" /> Included Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              {[
                `${plan?.maxListings || 0} Active Business Listings`,
                `${plan?.maxImagesPerBusiness || 5} Product Images per Card`,
                "Verified Brand Badge on Search",
                "Advanced HSN Analytics",
                "Direct Buyer Inquiries",
                "Priority Listing Placement",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 text-sm font-semibold text-muted-foreground/80">
                  <div className="h-5 w-5 shrink-0 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  </div>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upgrade Suggestion */}
        <div className="space-y-6">
          <div className="premium-card border-primary/20 bg-primary/5 p-8 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 h-32 w-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            
            <h3 className="text-2xl font-[1000] text-foreground mb-4 flex items-center gap-3">
              <Zap className="h-6 w-6 text-amber-500 fill-amber-500" /> Go Pro
            </h3>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-8">
              Unlock the full potential of your business network. Get <b>Unlimited</b> listings, higher image limits, and top placement in category results.
            </p>
            
            <div className="mb-8">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Starting from</p>
              <div className="flex items-baseline gap-1.5 text-foreground">
                <span className="text-4xl font-[1000]">₹999</span>
                <span className="text-sm font-bold text-muted-foreground">/ month</span>
              </div>
            </div>
            
            <Link href="/plans">
              <button className="w-full h-14 rounded-2xl bg-foreground text-background font-black text-sm hover:bg-primary hover:text-primary-foreground hover:shadow-xl hover:shadow-primary/20 transition-all">
                View All Plans
              </button>
            </Link>
          </div>
          
          <div className="premium-card p-8 border-dashed flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <LayoutDashboard className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <p className="text-xs font-bold text-muted-foreground/60 mb-4">Need help choosing a plan?</p>
            <button className="text-sm font-black text-primary hover:underline underline-offset-4">
              Contact Sales Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
