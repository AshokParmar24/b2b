import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { UserRole } from "@/types";
import dbConnect from "@/lib/dbConnect";
import Business from "@/models/Business";
import User from "@/models/User";
import Plan from "@/models/Plan";
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  CreditCard,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Tag,
  Activity,
  Clock,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== UserRole.ADMIN) redirect("/login");

  await dbConnect();
  void Plan;

  // Real aggregate data
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    totalBusinesses,
    businessesThisMonth,
    businessesLastMonth,
    totalUsers,
    usersThisMonth,
    usersLastMonth,
    activePlans,
    totalActiveListings,
    recentBusinesses,
    topHsnCodes,
  ] = await Promise.all([
    Business.countDocuments(),
    Business.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Business.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),
    User.countDocuments({ role: UserRole.USER }),
    User.countDocuments({ role: UserRole.USER, createdAt: { $gte: startOfMonth } }),
    User.countDocuments({ role: UserRole.USER, createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),
    Plan.countDocuments({ isActive: true }),
    Business.countDocuments({ isActive: true }),
    Business.find().sort({ createdAt: -1 }).limit(8).lean(),
    Business.aggregate([
      { $unwind: "$hsnCodes" },
      { $group: { _id: "$hsnCodes.code", count: { $sum: 1 }, desc: { $first: "$hsnCodes.description" } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
  ]);

  const businessGrowth = businessesLastMonth > 0
    ? Math.round(((businessesThisMonth - businessesLastMonth) / businessesLastMonth) * 100)
    : businessesThisMonth > 0 ? 100 : 0;
  const userGrowth = usersLastMonth > 0
    ? Math.round(((usersThisMonth - usersLastMonth) / usersLastMonth) * 100)
    : usersThisMonth > 0 ? 100 : 0;

  const stats = [
    {
      label: "Total Businesses",
      value: totalBusinesses,
      sub: `+${businessesThisMonth} this month`,
      growth: businessGrowth,
      icon: Building2,
      color: "bg-blue-500",
      glow: "shadow-blue-500/15",
    },
    {
      label: "Total Users",
      value: totalUsers,
      sub: `+${usersThisMonth} this month`,
      growth: userGrowth,
      icon: Users,
      color: "bg-primary",
      glow: "shadow-primary/15",
    },
    {
      label: "Active Listings",
      value: totalActiveListings,
      sub: `${Math.round((totalActiveListings / Math.max(totalBusinesses, 1)) * 100)}% of total`,
      growth: null,
      icon: Activity,
      color: "bg-emerald-500",
      glow: "shadow-emerald-500/15",
    },
    {
      label: "Subscription Plans",
      value: activePlans,
      sub: "Live pricing tiers",
      growth: null,
      icon: CreditCard,
      color: "bg-amber-500",
      glow: "shadow-amber-500/15",
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-[1000] tracking-tighter text-foreground">Reports</h1>
          </div>
          <p className="text-sm font-medium text-muted-foreground ml-11">
            Live platform analytics —{" "}
            <span className="text-foreground font-black">
              {now.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </span>
          </p>
        </div>
        <div className="ml-11 sm:ml-0 flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
          <Clock className="h-3 w-3 animate-pulse" />
          Live data
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className={`premium-card p-6 group hover:-translate-y-1 transition-all duration-300 shadow-lg ${stat.glow}`}>
            <div className="flex items-center justify-between mb-5">
              <div className={`p-3 rounded-2xl text-white shadow-md ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              {stat.growth !== null && (
                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${stat.growth >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-500"}`}>
                  {stat.growth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(stat.growth)}%
                </div>
              )}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">{stat.label}</p>
            <h2 className="text-4xl font-[1000] tracking-tighter text-foreground mb-1">{stat.value.toLocaleString()}</h2>
            <p className="text-xs text-muted-foreground font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Bottom two-col ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Registrations */}
        <div className="premium-card overflow-hidden">
          <div className="px-6 py-5 border-b border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <h3 className="text-sm font-black tracking-tight text-foreground">Recent Registrations</h3>
            </div>
            <Link href="/admin/businesses" className="flex items-center gap-1 text-xs font-black text-primary hover:underline underline-offset-4">
              View All <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border/20">
            {recentBusinesses.length === 0 ? (
              <div className="py-10 text-center">
                <Building2 className="h-8 w-8 mx-auto text-muted-foreground/20 mb-2" />
                <p className="text-xs text-muted-foreground">No businesses yet</p>
              </div>
            ) : (
              recentBusinesses.map((b: any) => (
                <div key={b._id.toString()} className="px-6 py-3.5 flex items-center gap-4 hover:bg-muted/10 transition-colors group">
                  <div className="h-9 w-9 flex-shrink-0 rounded-xl bg-muted flex items-center justify-center text-xs font-black text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all">
                    {b.businessName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{b.businessName}</p>
                    <p className="text-xs text-muted-foreground">{b.ownerName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-muted-foreground font-medium">
                      {new Date(b.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </p>
                    <span className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${b.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-500"}`}>
                      {b.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top HSN Codes */}
        <div className="premium-card overflow-hidden">
          <div className="px-6 py-5 border-b border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <h3 className="text-sm font-black tracking-tight text-foreground">Top HSN Codes</h3>
            </div>
            <span className="text-xs text-muted-foreground font-medium">By frequency</span>
          </div>
          <div className="divide-y divide-border/20">
            {topHsnCodes.length === 0 ? (
              <div className="py-10 text-center">
                <Tag className="h-8 w-8 mx-auto text-muted-foreground/20 mb-2" />
                <p className="text-xs text-muted-foreground">No HSN data yet</p>
              </div>
            ) : (
              topHsnCodes.map((hsn: any, i: number) => (
                <div key={hsn._id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-muted/10 transition-colors">
                  <span className="text-[10px] font-black text-muted-foreground/40 w-5 text-right flex-shrink-0">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-foreground">{hsn._id}</p>
                    <p className="text-xs text-muted-foreground truncate">{hsn.desc || "No description"}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.round((hsn.count / (topHsnCodes[0]?.count || 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground w-6 text-right">{hsn.count}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Month-over-month summary ── */}
      <div className="premium-card p-6">
        <div className="flex items-center gap-2.5 mb-6">
          <Calendar className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-black tracking-tight text-foreground">Month-over-Month Growth</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              label: "Businesses Added",
              thisMonth: businessesThisMonth,
              lastMonth: businessesLastMonth,
              growth: businessGrowth,
              icon: Building2,
            },
            {
              label: "New Users",
              thisMonth: usersThisMonth,
              lastMonth: usersLastMonth,
              growth: userGrowth,
              icon: Users,
            },
            {
              label: "Active Rate",
              thisMonth: totalActiveListings,
              lastMonth: totalBusinesses - totalActiveListings,
              growth: null,
              icon: Globe,
              custom: `${Math.round((totalActiveListings / Math.max(totalBusinesses, 1)) * 100)}% of all listings are active`,
            },
          ].map(({ label, thisMonth, lastMonth, growth, icon: Icon, custom }) => (
            <div key={label} className="flex gap-4 items-start">
              <div className="p-2.5 rounded-xl bg-foreground/5 flex-shrink-0">
                <Icon className="h-5 w-5 text-foreground/60" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-1">{label}</p>
                <p className="text-2xl font-[1000] tracking-tight text-foreground">{thisMonth}</p>
                {custom ? (
                  <p className="text-xs text-muted-foreground mt-1">{custom}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    vs {lastMonth} last month{" "}
                    {growth !== null && (
                      <span className={growth >= 0 ? "text-emerald-600 font-bold" : "text-red-500 font-bold"}>
                        ({growth >= 0 ? "+" : ""}{growth}%)
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
