import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Business from "@/models/Business";
import Plan from "@/models/Plan";
import User from "@/models/User";
import Link from "next/link";
import { Plus, Building2, CreditCard, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await dbConnect();
  const userId = (session.user as any).id;
  const [user, cardCount] = await Promise.all([
    User.findById(userId).populate("planId").lean(),
    Business.countDocuments({ userId, isActive: true }),
  ]);

  const plan = (user as any)?.planId as any;
  const usedPct = plan ? Math.round((cardCount / plan.maxListings) * 100) : 0;

  return (
    <div className="animate-fadeInUp">
      <h1 className="text-3xl font-black mb-2">Dashboard</h1>
      <p className="text-gray-400 mb-8">Welcome back, {session.user?.name}!</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[
          { label: "Business Cards", value: cardCount, icon: Building2, color: "#6c3fff" },
          { label: "Plan Limit", value: plan ? `${cardCount}/${plan.maxListings}` : "No Plan", icon: CreditCard, color: "#ff6b35" },
          { label: "Plan Expires", value: (user as any)?.planEndDate ? new Date((user as any).planEndDate).toLocaleDateString("en-IN") : "—", icon: Calendar, color: "#00d4aa" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-6 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}22` }}>
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">{label}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Plan usage bar */}
      {plan && (
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Listing Usage</span>
            <Badge style={{ background: "rgba(108,63,255,0.15)", color: "#9b7fff" }}>{plan.name} Plan</Badge>
          </div>
          <div className="w-full h-2 rounded-full" style={{ background: "var(--border-color)" }}>
            <div className="h-2 rounded-full transition-all" style={{ width: `${usedPct}%`, background: "linear-gradient(90deg, #6c3fff, #ff6b35)" }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">{cardCount} of {plan.maxListings} cards used ({usedPct}%)</p>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link href="/dashboard/add" className="glass-card p-6 flex items-center gap-4 cursor-pointer group">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(108,63,255,0.2)" }}>
            <Plus className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="font-bold group-hover:text-purple-400 transition-colors">Add New Business Card</p>
            <p className="text-sm text-gray-500">List a new business with HSN codes</p>
          </div>
        </Link>
        <Link href="/plans" className="glass-card p-6 flex items-center gap-4 cursor-pointer group">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,107,53,0.2)" }}>
            <CreditCard className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <p className="font-bold group-hover:text-orange-400 transition-colors">Upgrade Your Plan</p>
            <p className="text-sm text-gray-500">Add more cards and unlock features</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
