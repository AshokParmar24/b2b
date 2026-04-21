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
  // Explicitly ensure models are registered before querying (Next.js module caching can skip them)
  void User; void Plan; void Business;
  const userId = (session.user as any).id;
  const [user, cardCount] = await Promise.all([
    User.findById(userId).populate("planId").lean(),
    Business.countDocuments({ userId, isActive: true }),
  ]);

  const plan = (user as any)?.planId as any;
  const usedPct = plan ? Math.round((cardCount / plan.maxListings) * 100) : 0;

  return (
    <div className="animate-fadeInUp">
      <h1 className="mb-2 text-3xl font-black">Dashboard</h1>
      <p className="mb-8 text-gray-400">Welcome back, {session.user?.name}!</p>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {[
          { label: "Business Cards", value: cardCount, icon: Building2, color: "#6c3fff" },
          {
            label: "Plan Limit",
            value: plan ? `${cardCount}/${plan.maxListings}` : "No Plan",
            icon: CreditCard,
            color: "#ff6b35",
          },
          {
            label: "Plan Expires",
            value: (user as any)?.planEndDate
              ? new Date((user as any).planEndDate).toLocaleDateString("en-IN")
              : "—",
            icon: Calendar,
            color: "#00d4aa",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card flex items-center gap-5 p-6">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
              style={{ background: `${color}22` }}
            >
              <Icon className="h-6 w-6" style={{ color }} />
            </div>
            <div>
              <p className="text-sm text-gray-400">{label}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Plan usage bar */}
      {plan && (
        <div className="glass-card mb-8 p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-gray-400">Listing Usage</span>
            <Badge style={{ background: "rgba(108,63,255,0.15)", color: "#9b7fff" }}>
              {plan.name} Plan
            </Badge>
          </div>
          <div className="h-2 w-full rounded-full" style={{ background: "var(--border-color)" }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${usedPct}%`,
                background: "linear-gradient(90deg, #6c3fff, #ff6b35)",
              }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {cardCount} of {plan.maxListings} cards used ({usedPct}%)
          </p>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Link
          href="/dashboard/add"
          className="glass-card group flex cursor-pointer items-center gap-4 p-6"
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: "rgba(108,63,255,0.2)" }}
          >
            <Plus className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <p className="font-bold transition-colors group-hover:text-purple-400">
              Add New Business Card
            </p>
            <p className="text-sm text-gray-500">List a new business with HSN codes</p>
          </div>
        </Link>
        <Link href="/plans" className="glass-card group flex cursor-pointer items-center gap-4 p-6">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: "rgba(255,107,53,0.2)" }}
          >
            <CreditCard className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <p className="font-bold transition-colors group-hover:text-orange-400">
              Upgrade Your Plan
            </p>
            <p className="text-sm text-gray-500">Add more cards and unlock features</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
