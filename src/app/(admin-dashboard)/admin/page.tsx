import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Business from "@/models/Business";
import User from "@/models/User";
import Plan from "@/models/Plan";
import Country from "@/models/Country";
import { 
  Building2, 
  Users, 
  CreditCard, 
  Globe, 
  TrendingUp, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  LayoutDashboard
} from "lucide-react";
import { SITE_NAME } from "@/lib/site-config";
import Link from "next/link";
import { UserRole } from "@/types";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== UserRole.ADMIN) redirect("/login");

  await dbConnect();
  const [totalBusinesses, totalUsers, totalPlans, totalCountries, recentBusinesses] = await Promise.all([
    Business.countDocuments(),
    User.countDocuments({ role: UserRole.USER }),
    Plan.countDocuments({ isActive: true }),
    Country.countDocuments({ isActive: true }),
    Business.find().sort({ createdAt: -1 }).limit(5),
  ]);

  const stats = [
    {
      label: "Total Businesses",
      value: totalBusinesses.toLocaleString(),
      icon: Building2,
      trend: "+12.5%",
      color: "bg-blue-500",
      glow: "shadow-blue-500/20",
    },
    {
      label: "Active Subscribers",
      value: totalUsers.toLocaleString(),
      icon: Users,
      trend: "+8.2%",
      color: "bg-emerald-500",
      glow: "shadow-emerald-500/20",
    },
    { 
      label: "Live Plans", 
      value: totalPlans, 
      icon: CreditCard, 
      trend: "Steady",
      color: "bg-primary",
      glow: "shadow-primary/20",
    },
    { 
      label: "Global Reach", 
      value: totalCountries, 
      icon: Globe, 
      trend: "6 Regions",
      color: "bg-amber-500",
      glow: "shadow-amber-500/20",
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 👑 Welcome Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-[1000] tracking-tighter text-foreground">Admin Overview</h1>
          </div>
          <p className="text-sm font-medium text-muted-foreground ml-11">
            Managing the pulse of {SITE_NAME} Global Directory
          </p>
        </div>
        
        <div className="flex items-center gap-3 ml-11 md:ml-0">
          <div className="flex -space-x-3 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-[10px] font-black">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <span className="text-xs font-bold text-muted-foreground">3 Admins Online</span>
        </div>
      </div>

      {/* 📊 High-Performance Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className={cn("premium-card p-8 group hover:-translate-y-1 transition-all duration-300", stat.glow)}>
            <div className="flex items-center justify-between mb-6">
              <div className={cn("p-3 rounded-2xl text-white shadow-lg", stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3" />
                {stat.trend}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                {stat.label}
              </p>
              <h2 className="text-4xl font-[1000] tracking-tighter text-foreground">
                {stat.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* 🏢 Recent Business Registrations */}
        <div className="lg:col-span-2 premium-card overflow-hidden">
          <div className="p-8 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <h3 className="font-black tracking-tight">Recent Registrations</h3>
            </div>
            <Link href="/admin/businesses" className="text-xs font-black text-primary hover:underline underline-offset-4 flex items-center gap-1">
              View All <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/30 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                <tr>
                  <th className="px-8 py-4">Business Name</th>
                  <th className="px-8 py-4">Location</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentBusinesses.map((b) => (
                  <tr key={b._id.toString()} className="group hover:bg-primary/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-xs font-black text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all">
                          {b.businessName.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-foreground">{b.businessName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-muted-foreground">
                      Morbi, India
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black text-emerald-600 uppercase">
                        <ShieldCheck className="h-3 w-3" /> Active
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-muted-foreground/40 italic">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ⚡ Quick Management Actions */}
        <div className="space-y-6">
          <h3 className="px-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">
            Global Operations
          </h3>
          
          {[
            { href: "/admin/users", label: "Subscriber Management", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
            { href: "/admin/plans", label: "Pricing & Tier Strategy", icon: Zap, color: "text-primary", bg: "bg-primary/10" },
            { href: "/admin/masters", label: "Location Master Data", icon: Globe, color: "text-amber-500", bg: "bg-amber-500/10" },
            { href: "/admin/import", label: "High-Volume Bulk Import", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          ].map((action) => (
            <Link 
              key={action.href} 
              href={action.href}
              className="premium-card p-6 flex items-center justify-between group hover:border-primary transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-2xl transition-colors", action.bg, action.color)}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors">
                  {action.label}
                </span>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper for Tailwind classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
