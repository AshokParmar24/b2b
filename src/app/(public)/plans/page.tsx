"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  ChevronLeft, 
  Crown, 
  Zap, 
  IndianRupee, 
  ShieldCheck, 
  TrendingUp, 
  Globe,
  ArrowRight,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { SITE_NAME } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export default function PublicPlansPage() {
  const [activePlan, setActivePlan] = useState<string | null>(null);

  const plans = [
    {
      name: "Free",
      price: "0",
      validity: "Forever",
      tagline: "Basic Entry",
      features: ["1 Business Profile", "3 Gallery Images", "2 HSN Code Search", "Standard Listing"],
      theme: "bg-slate-500",
    },
    {
      name: "Basic",
      price: "299",
      validity: "30 Days",
      tagline: "Popular Choice",
      features: ["10 Business Profiles", "5 Gallery Images", "5 HSN Code Search", "Verified Account", "Basic Analytics"],
      theme: "bg-blue-600",
    },
    {
      name: "Pro",
      price: "799",
      validity: "30 Days",
      tagline: "Best Seller",
      features: ["100 Business Profiles", "10 Gallery Images", "Unlimited HSN Codes", "Priority Placement", "Market Insights", "24/7 Support"],
      theme: "bg-primary",
      recommended: true,
    },
    {
      name: "Enterprise",
      price: "1999",
      validity: "30 Days",
      tagline: "Elite Performance",
      features: ["Unlimited Profiles", "Unlimited Images", "Unlimited HSN Search", "Elite Dominance", "Competitor Intel", "Account Manager"],
      theme: "bg-purple-600",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <section className="px-6 pt-20 pb-16 text-center">
        <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-top-8 duration-700">
          <h1 className="mb-4 text-4xl font-[1000] tracking-tight text-slate-900 md:text-6xl">
            Choose Your <span className="text-primary">Growth Plan</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-medium text-slate-500">
            Click a plan to see its full potential. Instant activation guaranteed.
          </p>
        </div>
      </section>

      <section className="responsive-container pb-32">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((p, idx) => {
            const isSelected = activePlan === p.name;
            return (
              <div
                key={p.name}
                onClick={() => setActivePlan(p.name)}
                className={cn(
                  "relative flex flex-col overflow-hidden rounded-[28px] bg-white transition-all duration-500 cursor-pointer animate-in fade-in zoom-in-95",
                  isSelected 
                    ? "ring-4 ring-primary ring-offset-8 scale-[1.02] shadow-[0_40px_80px_-15px_rgba(var(--primary-rgb),0.3)]" 
                    : "shadow-xl shadow-slate-200/50 hover:-translate-y-2 hover:shadow-2xl active:scale-95",
                  p.recommended && !isSelected && "ring-2 ring-primary/20"
                )}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* 💫 Central Click Effect */}
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                    <div className="h-0 w-0 rounded-full bg-primary/10 animate-[ping_1.5s_ease-out_infinite]" />
                    <div className="absolute h-0 w-0 rounded-full bg-primary/5 animate-[ping_2s_ease-out_infinite_delay-300]" />
                  </div>
                )}

                <div className={`${p.theme} px-6 py-4 text-center relative z-10`}>
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/80">
                    {p.tagline}
                  </div>
                  <h3 className="text-xl font-black text-white">{p.name}</h3>
                </div>

                <div className="flex flex-col items-center bg-slate-50/50 py-8 border-b border-slate-100 relative z-10">
                  <div className="flex items-baseline gap-1">
                    <IndianRupee className={cn("h-5 w-5 transition-colors", isSelected ? "text-primary" : "text-slate-400")} />
                    <span className={cn("text-5xl font-[1000] tracking-tighter transition-colors", isSelected ? "text-primary" : "text-slate-900")}>
                      {p.price}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Validity: {p.validity}
                  </div>
                </div>

                <div className="flex-1 p-8 relative z-10">
                  <div className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-300">
                    What's Included
                  </div>
                  <ul className="space-y-4">
                    {p.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full transition-colors",
                          isSelected ? "bg-primary text-white" : "bg-emerald-100 text-emerald-600"
                        )}>
                          <CheckCircle2 className="h-3 w-3" />
                        </div>
                        <span className={cn("text-sm font-bold transition-colors", isSelected ? "text-slate-900" : "text-slate-600")}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-8 pt-0 relative z-10">
                  <Link href="/register" className="block">
                    <button
                      className={cn(
                        "flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black transition-all",
                        isSelected || p.recommended
                          ? "bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50" 
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      )}
                    >
                      {isSelected ? "Proceed with " + p.name : "Select Plan"} <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                  {(isSelected || p.recommended) && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest animate-bounce">
                      <Star className="h-3 w-3 fill-current" />
                      {isSelected ? "Plan Selected" : "Bestseller Plan"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3 rounded-[32px] bg-white border border-slate-200 p-10 text-center shadow-lg shadow-slate-100">
          <div className="flex items-center gap-4 px-6 justify-center sm:justify-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-slate-900">Secure Payments</div>
              <div className="text-[10px] font-bold text-slate-400">100% Encrypted</div>
            </div>
          </div>
          <div className="flex items-center gap-4 px-6 justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-slate-900">Instant Activation</div>
              <div className="text-[10px] font-bold text-slate-400">Zero Wait Time</div>
            </div>
          </div>
          <div className="flex items-center gap-4 px-6 justify-center sm:justify-end">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <Globe className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-slate-900">Global Reach</div>
              <div className="text-[10px] font-bold text-slate-400">190+ Countries</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
