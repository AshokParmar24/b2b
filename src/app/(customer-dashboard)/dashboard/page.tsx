import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Business from "@/models/Business";
import Plan from "@/models/Plan";
import User from "@/models/User";
import Link from "next/link";
import { Plus, Building2, CreditCard, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await dbConnect();
  // Ensure models are registered
  void User; void Plan; void Business;
  const userId = (session.user as any).id;
  const [user, cardCount] = await Promise.all([
    User.findById(userId).populate("planId").lean(),
    Business.countDocuments({ userId, isActive: true }),
  ]);

  const plan = (user as any)?.planId as any;
  const usedPct = plan ? Math.round((cardCount / plan.maxListings) * 100) : 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-foreground">Dashboard</h1>
        <p className="text-lg font-medium text-muted-foreground">
          Welcome back, <span className="text-foreground">{session.user?.name}</span>!
        </p>
      </div>

      {/* Stats Grid - Neutral Style */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { label: "Business Cards", value: cardCount, icon: Building2 },
          {
            label: "Plan Limit",
            value: plan ? `${cardCount} / ${plan.maxListings}` : "No Plan",
            icon: CreditCard,
          },
          {
            label: "Plan Expires",
            value: (user as any)?.planEndDate
              ? new Date((user as any).planEndDate).toLocaleDateString("en-IN")
              : "Never",
            icon: Calendar,
          },
        ].map(({ label, value, icon: Icon }, idx) => (
          <div 
            key={label} 
            className="premium-card p-8 group animate-in fade-in zoom-in-95 duration-700 fill-mode-both"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-center gap-6">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-foreground/5 transition-transform group-hover:scale-110">
                <Icon className="h-7 w-7 text-foreground" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                <p className="text-3xl font-black tracking-tighter text-foreground">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Usage Section */}
      {plan && (
        <div className="premium-card mb-10 p-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black tracking-tight">Listing Usage</h3>
              <p className="text-sm font-medium text-muted-foreground">You are using {usedPct}% of your capacity.</p>
            </div>
            <Badge className="bg-foreground px-4 py-1.5 text-xs font-black uppercase tracking-widest text-background">
              {plan.name}
            </Badge>
          </div>
          
          <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted/50 shadow-inner">
            <div
              className="h-full rounded-full bg-foreground transition-all duration-1000 ease-out shadow-lg shadow-black/10"
              style={{ width: `${usedPct}%` }}
            />
          </div>
          
          <div className="mt-4 flex items-center justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
            <span>{cardCount} Cards Used</span>
            <span>{plan.maxListings} Total Capacity</span>
          </div>
        </div>
      )}

      {/* Quick Actions - Modern Neutral */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Link
          href="/dashboard/add"
          className="premium-card group flex cursor-pointer items-center gap-6 p-8 no-underline animate-in fade-in slide-in-from-left-8 duration-700 delay-500 fill-mode-both"
        >
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-foreground text-background transition-transform group-hover:rotate-12 group-hover:scale-110">
            <Plus className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <p className="text-xl font-black tracking-tight text-foreground transition-all group-hover:underline">
              Add New Business Card
            </p>
            <p className="text-sm font-medium text-muted-foreground">List a new business with HSN codes</p>
          </div>
          <ArrowRight className="h-6 w-6 text-muted-foreground opacity-0 transition-all -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0" />
        </Link>

        <Link 
          href="/plans" 
          className="premium-card group flex cursor-pointer items-center gap-6 p-8 no-underline animate-in fade-in slide-in-from-right-8 duration-700 delay-500 fill-mode-both"
        >
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-foreground bg-transparent text-foreground transition-transform group-hover:-rotate-12 group-hover:scale-110">
            <CreditCard className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <p className="text-xl font-black tracking-tight text-foreground transition-all group-hover:underline">
              Upgrade Your Plan
            </p>
            <p className="text-sm font-medium text-muted-foreground">Add more cards and unlock features</p>
          </div>
          <ArrowRight className="h-6 w-6 text-muted-foreground opacity-0 transition-all -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0" />
        </Link>
      </div>
    </div>
  );
}
