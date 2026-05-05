import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Business from "@/models/Business";
import Plan from "@/models/Plan";
import User from "@/models/User";
import Link from "next/link";
import {
  Plus,
  Building2,
  CreditCard,
  Calendar,
  ArrowRight,
  TrendingUp,
  Star,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await dbConnect();
  void User; void Plan;

  const userId = (session.user as any).id;

  const [user, cardCount, recentBusinesses] = await Promise.all([
    User.findById(userId).populate("planId").lean(),
    Business.countDocuments({ userId }),
    Business.find({ userId })
      .populate("cityId", "name")
      .populate("stateId", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const plan = (user as any)?.planId as any;
  const planEndDate = (user as any)?.planEndDate;
  const activeCards = await Business.countDocuments({ userId, isActive: true });
  const usedPct = plan ? Math.min(100, Math.round((activeCards / plan.maxListings) * 100)) : 0;

  const daysLeft = planEndDate
    ? Math.max(0, Math.ceil((new Date(planEndDate).getTime() - Date.now()) / 86_400_000))
    : null;

  const isExpiringSoon = daysLeft !== null && daysLeft <= 7;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8 max-w-[1200px] mx-auto pb-10">

      {/* ── HEADER ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">
            {greeting()}, {session.user?.name?.split(" ")[0]}!
          </p>
          <h1 className="text-3xl sm:text-4xl font-[1000] tracking-tight text-foreground">
            Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
              Dashboard
            </span>
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Manage your business listings and monitor your plan usage.
          </p>
        </div>
        <Link href="/dashboard/add">
          <button className="inline-flex items-center gap-2.5 h-12 px-6 rounded-[20px] bg-primary text-primary-foreground hover:bg-primary/90 font-black text-sm shadow-xl shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300">
            <Plus className="h-4 w-4" />
            Add Business
          </button>
        </Link>
      </div>

      {/* ── EXPIRY ALERT ── */}
      {isExpiringSoon && (
        <div className="flex items-start sm:items-center gap-4 rounded-[24px] border border-amber-500/20 bg-amber-500/5 px-6 py-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-black text-sm text-foreground">Plan Expiring Soon</p>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5">
              Your <span className="text-amber-500 font-black">{plan?.name}</span> plan expires in{" "}
              <span className="text-amber-500 font-black">{daysLeft} day{daysLeft !== 1 ? "s" : ""}</span>. Renew to avoid interruption.
            </p>
          </div>
          <Link href="/plans" className="shrink-0">
            <button className="h-9 px-4 rounded-xl bg-amber-500 text-white text-xs font-black hover:bg-amber-600 transition-colors">
              Renew Now
            </button>
          </Link>
        </div>
      )}

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            label: "Total Listings",
            value: cardCount,
            sub: `${activeCards} active`,
            icon: Building2,
            color: "text-primary",
            bg: "bg-primary/5",
            border: "border-primary/20",
          },
          {
            label: "Active Listings",
            value: activeCards,
            sub: cardCount > 0 ? `${Math.round((activeCards / cardCount) * 100)}% of total` : "No listings yet",
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-500/5",
            border: "border-emerald-500/20",
          },
          {
            label: "Plan Limit",
            value: plan ? `${activeCards}/${plan.maxListings}` : "No Plan",
            sub: plan ? `${plan.name} tier` : "Upgrade to add listings",
            icon: BarChart3,
            color: "text-blue-500",
            bg: "bg-blue-500/5",
            border: "border-blue-500/20",
          },
          {
            label: "Plan Expires",
            value: planEndDate
              ? new Date(planEndDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
              : "Never",
            sub: daysLeft !== null ? `${daysLeft} days remaining` : "Lifetime / No plan",
            icon: Calendar,
            color: isExpiringSoon ? "text-amber-500" : "text-violet-500",
            bg: isExpiringSoon ? "bg-amber-500/5" : "bg-violet-500/5",
            border: isExpiringSoon ? "border-amber-500/20" : "border-violet-500/20",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={cn(
              "group relative overflow-hidden rounded-[28px] border bg-card/40 p-1 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/5",
              stat.border
            )}
          >
            <div
              className={cn(
                "absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-40",
                stat.bg
              )}
            />
            <div className="relative rounded-[24px] bg-background/60 p-5 h-full border border-white/5">
              <div className={cn("h-11 w-11 flex items-center justify-center rounded-[16px] mb-4 transition-transform duration-500 group-hover:scale-110", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-1">{stat.label}</p>
              <p className="text-2xl font-[1000] text-foreground tracking-tighter">{stat.value}</p>
              <p className="text-xs font-semibold text-muted-foreground/60 mt-0.5">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── PLAN USAGE ── */}
      {plan ? (
        <div className="rounded-[28px] border border-border/50 bg-card/40 backdrop-blur-xl p-6 sm:p-8 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 h-32 w-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
                <Sparkles className="h-3 w-3" />
                {plan.name} Plan
              </div>
              <h3 className="text-xl font-black tracking-tight text-foreground">Listing Usage</h3>
              <p className="text-sm font-medium text-muted-foreground mt-0.5">
                You are using{" "}
                <span className={cn("font-black", usedPct >= 90 ? "text-red-500" : usedPct >= 70 ? "text-amber-500" : "text-primary")}>
                  {usedPct}%
                </span>{" "}
                of your plan capacity.
              </p>
            </div>
            <Link href="/plans">
              <button className="inline-flex items-center gap-2 h-10 px-5 rounded-[16px] bg-primary text-primary-foreground font-black text-xs shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                <TrendingUp className="h-3.5 w-3.5" />
                Upgrade Plan
              </button>
            </Link>
          </div>

          <div className="space-y-3 relative z-10">
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted/50 shadow-inner">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000 ease-out shadow-lg shadow-black/5",
                  usedPct >= 90
                    ? "bg-gradient-to-r from-red-500 to-rose-400"
                    : usedPct >= 70
                    ? "bg-gradient-to-r from-amber-500 to-orange-400"
                    : "bg-gradient-to-r from-primary to-emerald-400"
                )}
                style={{ width: `${usedPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
              <span>{activeCards} Used</span>
              <span>{plan.maxListings - activeCards} Remaining</span>
              <span>{plan.maxListings} Total</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-border/50 bg-card/20 p-10 flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="h-20 w-20 shrink-0 flex items-center justify-center rounded-[28px] bg-primary/10 text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
            <Star className="h-10 w-10 fill-primary/20" />
          </div>
          <div className="flex-1 relative z-10">
            <h3 className="text-2xl font-[1000] text-foreground tracking-tight">No Active Plan</h3>
            <p className="text-sm font-medium text-muted-foreground mt-2 max-w-md">
              Upgrade to a professional plan to add more business listings, unlock advanced features, and grow your digital presence globally.
            </p>
          </div>
          <Link href="/plans" className="shrink-0 relative z-10">
            <button className="inline-flex items-center gap-3 h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
              View Plans <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      )}

      {/* ── RECENT BUSINESSES ── */}
      {recentBusinesses.length > 0 && (
        <div className="rounded-[28px] border border-border/50 bg-card/40 backdrop-blur-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-border/30">
            <div>
              <h3 className="text-base font-black text-foreground">Recent Listings</h3>
              <p className="text-xs font-semibold text-muted-foreground mt-0.5">Your latest business cards</p>
            </div>
            <Link href="/dashboard/businesses" className="inline-flex items-center gap-1.5 text-xs font-black text-primary hover:underline underline-offset-4">
              View All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border/30">
            {recentBusinesses.map((b: any) => (
              <div key={b._id.toString()} className="group flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors duration-200">
                {/* Avatar */}
                <div className={cn(
                  "h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center font-[1000] text-base shadow-inner",
                  "bg-gradient-to-br from-primary/80 to-blue-600 text-white"
                )}>
                  {b.logoUrl ? (
                    <img src={b.logoUrl} alt={b.businessName} className="w-full h-full object-contain p-1 rounded-2xl" />
                  ) : (
                    b.businessName?.charAt(0)?.toUpperCase()
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">
                    {b.businessName}
                  </p>
                  {(b.cityId?.name || b.stateId?.name) && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                      <p className="text-xs font-semibold text-muted-foreground truncate">
                        {[b.cityId?.name, b.stateId?.name].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="shrink-0 hidden sm:flex items-center gap-3">
                  <div className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                    b.isActive
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-muted/50 text-muted-foreground border-border/40"
                  )}>
                    {b.isActive ? "Active" : "Inactive"}
                  </div>
                </div>

                {/* Date & link */}
                <div className="shrink-0 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/50 hidden md:flex">
                    <Clock className="h-3 w-3" />
                    {new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </div>
                  <Link href={`/business/${b.slug}`} target="_blank">
                    <button className="h-8 w-8 rounded-xl border border-border/50 flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── QUICK ACTIONS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link
          href="/dashboard/add"
          className="group relative overflow-hidden rounded-[28px] border border-border/50 bg-card/40 backdrop-blur-xl p-6 flex items-center gap-5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 no-underline"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative h-14 w-14 shrink-0 flex items-center justify-center rounded-[20px] bg-primary text-primary-foreground transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-primary/20">
            <Plus className="h-7 w-7" />
          </div>
          <div className="relative flex-1 min-w-0">
            <p className="text-base font-black text-foreground group-hover:text-primary transition-colors">Add New Business</p>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5">List a business with HSN codes</p>
          </div>
          <ArrowRight className="relative h-5 w-5 text-muted-foreground opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </Link>

        <Link
          href="/plans"
          className="group relative overflow-hidden rounded-[28px] border border-border/50 bg-card/40 backdrop-blur-xl p-6 flex items-center gap-5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 no-underline"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative h-14 w-14 shrink-0 flex items-center justify-center rounded-[20px] border-2 border-primary/20 bg-primary/5 text-primary transition-all duration-500 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:-rotate-3 shadow-lg shadow-primary/5">
            <CreditCard className="h-7 w-7" />
          </div>
          <div className="relative flex-1 min-w-0">
            <p className="text-base font-black text-foreground group-hover:text-primary transition-colors">
              {plan ? "Manage Plan" : "Upgrade Your Plan"}
            </p>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5">
              {plan ? `Currently on ${plan.name}` : "Unlock more listings & features"}
            </p>
          </div>
          <ArrowRight className="relative h-5 w-5 text-muted-foreground opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </Link>
      </div>
    </div>
  );
}
