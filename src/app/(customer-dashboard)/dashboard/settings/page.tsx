import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Plan from "@/models/Plan";
import {
  Settings,
  User as UserIcon,
  Lock,
  Bell,
  CreditCard,
  Shield,
  ChevronRight,
  Calendar,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function CustomerSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await dbConnect();
  void Plan;
  const userId = (session.user as any).id;
  const user = await User.findById(userId).populate("planId").lean() as any;
  const plan = user?.planId as any;

  const settingGroups = [
    {
      label: "Account",
      icon: UserIcon,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      items: [
        { label: "Edit Profile", desc: "Update your name, email, and contact details", href: "#profile" },
        { label: "Change Password", desc: "Update your account password", href: "#password" },
      ],
    },
    {
      label: "Notifications",
      icon: Bell,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      items: [
        { label: "Email Notifications", desc: "Manage what emails you receive", href: "#notifications" },
        { label: "Inquiry Alerts", desc: "Get notified when someone contacts your listing", href: "#alerts" },
      ],
    },
    {
      label: "Privacy & Security",
      icon: Shield,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      items: [
        { label: "Two-Factor Authentication", desc: "Add an extra layer of security", href: "#2fa" },
        { label: "Data & Privacy", desc: "Control how your data is used", href: "#privacy" },
      ],
    },
    {
      label: "Subscription",
      icon: CreditCard,
      color: "text-primary",
      bg: "bg-primary/10",
      items: [
        { label: "View Current Plan", desc: plan ? `You are on the ${plan.name} plan` : "No active plan", href: "/dashboard/plan" },
        { label: "Upgrade Plan", desc: "Unlock more listings and features", href: "/plans" },
      ],
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-3xl">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-foreground/5">
            <Settings className="h-6 w-6 text-foreground" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground">Settings</h1>
        </div>
        <p className="text-muted-foreground font-medium ml-14">
          Manage your account preferences, security, and subscription.
        </p>
      </div>

      {/* Profile Summary Card */}
      <div className="premium-card p-6 mb-8">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-foreground text-background text-2xl font-black select-none">
            {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-foreground">{session.user?.name}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {session.user?.email && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Mail className="h-3.5 w-3.5" /> {session.user.email}
                </span>
              )}
              {user?.mobile && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Phone className="h-3.5 w-3.5" /> {user.mobile}
                </span>
              )}
            </div>
            {plan && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-black px-3 py-1">
                  <CreditCard className="h-3 w-3 mr-1.5" />
                  {plan.name} Plan
                </Badge>
                {user?.planEndDate && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                    <Calendar className="h-3 w-3" />
                    Expires {new Date(user.planEndDate).toLocaleDateString("en-IN")}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Groups */}
      <div className="space-y-5">
        {settingGroups.map(({ label, icon: Icon, color, bg, items }, gIdx) => (
          <div key={label} className="premium-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${gIdx * 80}ms` }}>
            {/* Group header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border/40">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <h3 className="text-sm font-black text-foreground uppercase tracking-wider">{label}</h3>
            </div>

            {/* Group items */}
            <div className="divide-y divide-border/30">
              {items.map(({ label: itemLabel, desc, href }) => (
                <Link
                  key={itemLabel}
                  href={href}
                  className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {itemLabel}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="mt-8 premium-card overflow-hidden border-destructive/20">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border/40">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
            <Lock className="h-4 w-4 text-destructive" />
          </div>
          <h3 className="text-sm font-black text-destructive uppercase tracking-wider">Danger Zone</h3>
        </div>
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-foreground">Delete Account</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Permanently delete your account and all associated listings.
            </p>
          </div>
          <button
            type="button"
            className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-black text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
