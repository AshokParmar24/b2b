import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Plan from "@/models/Plan";
import Business from "@/models/Business";
import Inquiry from "@/models/Inquiry";
import Favorite from "@/models/Favorite";
import Country from "@/models/Country";
import State from "@/models/State";
import City from "@/models/City";
import Pincode from "@/models/Pincode";
import {
  Settings,
  User as UserIcon,
  Shield,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Heart,
  Globe,
  Building2,
  Calendar,
  Zap,
  Bell,
  FileText,
  Download
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BillingHistory } from "@/components/dashboard/settings/BillingHistory";

export default async function CustomerSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await dbConnect();

  // Ensure models are registered
  void Plan;
  void Business;
  void Country;
  void State;
  void City;
  void Pincode;

  const userId = (session.user as any).id;

  // Fetch comprehensive user data
  const [user, businessCount, inquiryCount, favoriteCount] = await Promise.all([
    User.findById(userId)
      .populate("planId")
      .populate("countryId")
      .populate("stateId")
      .populate("cityId")
      .populate("pincodeId")
      .lean() as any,
    Business.countDocuments({ userId }),
    Inquiry.countDocuments({ targetUserId: userId }),
    Favorite.countDocuments({ userId }),
  ]);

  const plan = user?.planId as any;
  const usedPct = plan ? Math.min(Math.round((businessCount / plan.maxListings) * 100), 100) : 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
      {/* 👑 Settings Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Settings className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-[1000] tracking-tighter text-foreground">Account Settings</h1>
          </div>
          <p className="text-sm font-medium text-muted-foreground ml-14">
            Manage your personal identity, business location, and global preferences.
          </p>
        </div>

        <div className="flex items-center gap-2 ml-14 md:ml-0">
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 py-1.5 px-3 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Shield className="h-3 w-3 mr-1.5" />
            Verified Profile
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── LEFT COLUMN: IDENTITY & LOCATION ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Identity Card */}
          <div className="premium-card overflow-hidden">
            <div className="p-6 border-b border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <UserIcon className="h-5 w-5" />
                </div>
                <h3 className="font-black tracking-tight">Personal Identity</h3>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Edit Info</button>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-[1000] uppercase tracking-[0.2em] text-muted-foreground/50">Full Name</p>
                <p className="text-base font-black text-foreground">{user?.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-[1000] uppercase tracking-[0.2em] text-muted-foreground/50">Email Address</p>
                <p className="text-base font-black text-foreground">{user?.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-[1000] uppercase tracking-[0.2em] text-muted-foreground/50">Mobile Number</p>
                <p className="text-base font-black text-foreground">{user?.mobile || "Not Linked"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-[1000] uppercase tracking-[0.2em] text-muted-foreground/50">Account Role</p>
                <div className="flex items-center gap-2 text-primary font-black text-sm">
                  <Zap className="h-3.5 w-3.5" />
                  Premium {user?.role === 1 ? "Admin" : "Subscriber"}
                </div>
              </div>
            </div>
          </div>

          {/* Location Intelligence Card */}
          <div className="premium-card overflow-hidden">
            <div className="p-6 border-b border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Globe className="h-5 w-5" />
                </div>
                <h3 className="font-black tracking-tight">Location Intelligence</h3>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Update Region</button>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-[1000] uppercase tracking-[0.2em] text-muted-foreground/50">Country</p>
                <p className="text-base font-black text-foreground">{user?.countryId?.name || "India"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-[1000] uppercase tracking-[0.2em] text-muted-foreground/50">State / Province</p>
                <p className="text-base font-black text-foreground">{user?.stateId?.name || "Gujarat"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-[1000] uppercase tracking-[0.2em] text-muted-foreground/50">Primary City</p>
                <p className="text-base font-black text-foreground">{user?.cityId?.name || "Morbi"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-[1000] uppercase tracking-[0.2em] text-muted-foreground/50">Postal Code</p>
                <p className="text-base font-black text-foreground">{user?.pincodeId?.pincode || "363641"}</p>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { label: "Notifications", icon: Bell, href: "#notif", color: "text-rose-500", bg: "bg-rose-500/5" },
              { label: "Security & 2FA", icon: Shield, href: "#secure", color: "text-emerald-500", bg: "bg-emerald-500/5" },
              { label: "Connected Apps", icon: Zap, href: "#apps", color: "text-violet-500", bg: "bg-violet-500/5" },
            ].map((s) => (
              <Link key={s.label} href={s.href} className="premium-card p-5 flex items-center justify-between group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center transition-colors", s.bg, s.color)}>
                    <s.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-black text-foreground group-hover:text-primary transition-colors">{s.label}</span>
                </div>
                <ChevronRight className="h-3 w-3 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN: SUBSCRIPTION & STATS ── */}
        <div className="space-y-8">

          {/* Subscription Insight */}
          <div className="premium-card overflow-hidden bg-primary/5 border-primary/20 relative">
            <div className="absolute -right-6 -top-6 h-24 w-24 bg-primary/10 rounded-full blur-2xl" />
            <div className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
                  <CreditCard className="h-6 w-6" />
                </div>
                <Badge className="bg-primary text-primary-foreground font-black text-[9px] px-2 py-1 rounded-lg uppercase tracking-widest">
                  {plan?.name || "Free"} Plan
                </Badge>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Subscription Usage</p>
                  <h4 className="text-2xl font-[1000] text-foreground tracking-tight">{businessCount} <span className="text-sm font-medium text-muted-foreground">/ {plan?.maxListings || 1} Listings</span></h4>
                </div>

                <div className="space-y-2">
                  <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary shadow-lg shadow-primary/20 transition-all duration-1000"
                      style={{ width: `${usedPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                    <span>{usedPct}% Capacity Used</span>
                    <Link href="/plans" className="text-primary hover:underline">Upgrade</Link>
                  </div>
                </div>

                <div className="pt-4 border-t border-primary/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Expiry Date</p>
                      <p className="text-xs font-black text-foreground mt-0.5">
                        {user?.planEndDate ? new Date(user.planEndDate).toLocaleDateString("en-IN") : "No Active Plan"}
                      </p>
                    </div>
                  </div>
                  <Link href="/plans">
                    <button className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                      Manage
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Billing & Invoices */}
          <BillingHistory plan={plan} planStartDate={user?.planStartDate} />

          {/* Quick Platform Stats */}
          <div className="premium-card p-8 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 border-b border-border/40 pb-4">Platform Insights</h4>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold text-foreground">Inquiries</span>
                </div>
                <span className="text-sm font-black text-foreground">{inquiryCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                    <Heart className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold text-foreground">Favorites</span>
                </div>
                <span className="text-sm font-black text-foreground">{favoriteCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold text-foreground">Listings</span>
                </div>
                <span className="text-sm font-black text-foreground">{businessCount}</span>
              </div>
            </div>

            <Link href="/dashboard/inquiries">
              <button className="w-full h-11 mt-2 rounded-xl bg-muted/40 border border-border/60 text-xs font-black uppercase tracking-widest hover:bg-muted/60 transition-all">
                View Full Analytics
              </button>
            </Link>
          </div>

          {/* Danger Zone */}
          <div className="premium-card border-destructive/20 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
                <Shield className="h-4 w-4" />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-destructive">Danger Zone</h4>
            </div>
            <p className="text-[10px] font-medium text-muted-foreground">Permanently delete your account and all associated business listings from the platform.</p>
            <button className="w-full py-2.5 rounded-xl border border-destructive/30 text-destructive text-[10px] font-black uppercase tracking-widest hover:bg-destructive/10 transition-colors">
              Delete Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
