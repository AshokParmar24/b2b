"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, CheckCircle2, Crown, Zap, IndianRupee, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { AppRoutes } from "@/lib/routes";

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await api.get<any>("/api/plans");
      // Backward compatibility with endpoints returning raw arrays vs object with {data}
      const data = res.data || res;
      setPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/api/plans/${id}`, { isActive: !currentStatus });
      toast.success(`Plan ${currentStatus ? "archived" : "activated"}`);
      fetchPlans();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Predefined UI styling options for dynamic cards
  const colorSchemes = [
    { color: "from-violet-500/20 to-violet-500/5", iconColor: "text-violet-500", border: "border-violet-500/20", glow: "from-violet-500 via-violet-600 to-violet-700" },
    { color: "from-emerald-500/20 to-emerald-500/5", iconColor: "text-emerald-500", border: "border-emerald-500/20", glow: "from-emerald-500 via-emerald-600 to-emerald-700" },
    { color: "from-amber-500/20 to-amber-500/5", iconColor: "text-amber-500", border: "border-amber-500/20", glow: "from-amber-500 via-amber-600 to-amber-700" },
    { color: "from-pink-500/20 to-pink-500/5", iconColor: "text-pink-500", border: "border-pink-500/20", glow: "from-pink-500 via-pink-600 to-pink-700" },
    { color: "from-blue-500/20 to-blue-500/5", iconColor: "text-blue-500", border: "border-blue-500/20", glow: "from-blue-500 via-blue-600 to-blue-700" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl md:text-4xl font-black text-foreground flex items-center gap-5 tracking-tight group/title">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover/title:opacity-100 transition-opacity duration-700" />
              <div className="relative p-3.5 rounded-[22px] bg-primary/10 text-primary transition-transform duration-500 group-hover/title:scale-110">
                <Crown className="h-7 w-7 md:h-8 md:w-8" />
              </div>
            </div>
            Subscription Plans
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground/60 mt-1 max-w-xl font-medium leading-relaxed">
            Create or modify pricing tiers and strict feature limits for the platform.
          </p>
        </div>
        
        <Link href={AppRoutes.ADMIN_PLANS_ADD} className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto rounded-2xl h-12 px-6 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 text-base font-bold bg-primary hover:bg-primary/90">
            <Plus className="h-5 w-5 mr-2" />
            Create New Plan
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Loading Plans...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Crown className="h-10 w-10 text-primary opacity-50" />
          </div>
          <h3 className="text-2xl font-black text-foreground tracking-tight mb-2">No Plans Configured</h3>
          <p className="text-sm text-muted-foreground max-w-md">You haven't created any subscription plans yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4">
          {plans.map((plan, index) => {
            // Assign a stable scheme based on ID or index
            const scheme = colorSchemes[index % colorSchemes.length];
            const isPopular = plan.price > 0 && index === 1; // Dummy heuristic for demo

            return (
              <Card 
                key={plan._id} 
                className={cn(
                  "relative flex flex-col overflow-hidden rounded-[32px] border bg-card/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/5 group",
                  isPopular ? "border-primary/50 shadow-primary/10" : "border-border/40",
                  !plan.isActive && "opacity-60 grayscale"
                )}
              >
                {/* Glow effect */}
                <div className={cn("absolute top-0 right-0 h-40 w-40 rounded-full blur-[50px] opacity-40 transition-opacity group-hover:opacity-60 bg-gradient-to-br", scheme.color)} />
                
                {isPopular && (
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
                )}

                <div className="flex-1 p-8 relative z-10">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-2xl font-black text-foreground tracking-tight">{plan.name}</h3>
                    {isPopular && (
                      <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-600 border border-amber-500/20">
                        <Crown className="h-3 w-3" /> Popular
                      </span>
                    )}
                  </div>

                  <div className="mb-8 flex items-baseline gap-1 mt-4">
                    <IndianRupee className="h-5 w-5 text-muted-foreground/60" />
                    <span className="text-4xl font-black tracking-tighter text-foreground">{plan.price}</span>
                    <span className="text-sm font-bold text-muted-foreground/50">/mo</span>
                  </div>

                  <div className="mb-8 space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className={cn("h-5 w-5 shrink-0 mt-0.5", scheme.iconColor)} />
                      <span className="text-sm font-medium text-muted-foreground">
                        <b className="text-foreground">{plan.maxListings || "Unlimited"}</b> Business Cards
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className={cn("h-5 w-5 shrink-0 mt-0.5", scheme.iconColor)} />
                      <span className="text-sm font-medium text-muted-foreground">
                        <b className="text-foreground">{plan.maxImages || "Unlimited"}</b> Images per Card
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className={cn("h-5 w-5 shrink-0 mt-0.5", scheme.iconColor)} />
                      <span className="text-sm font-medium text-muted-foreground">
                        <b className="text-foreground">{plan.maxHsnCodes === null ? "Unlimited" : plan.maxHsnCodes}</b> HSN Codes
                      </span>
                    </div>
                    {plan.features?.map((feat: string, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <Zap className="h-5 w-5 shrink-0 mt-0.5 text-blue-500" />
                        <span className="text-sm font-medium text-muted-foreground">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between border-t border-border/40 bg-muted/20 px-8 py-5">
                  <span onClick={() => toggleStatus(plan._id, plan.isActive)} className={cn(
                    "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:opacity-80 transition-opacity",
                    plan.isActive 
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600" 
                      : "border-muted-foreground/20 bg-muted-foreground/10 text-muted-foreground"
                  )}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", plan.isActive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground")} />
                    {plan.isActive ? "Active" : "Archived"}
                  </span>
                  <div className="flex gap-2">
                    <Link href={`${AppRoutes.ADMIN_PLANS_EDIT}/${plan._id}`}>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
