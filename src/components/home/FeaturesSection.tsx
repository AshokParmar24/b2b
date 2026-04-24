"use client";

import { Zap, Target, BarChart3, Fingerprint, Search, Globe } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Hyper-Targeted Search",
      description: "Filter by precise HSN codes, manufacturing capacity, and verified global locations.",
      icon: Search,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Verified Identities",
      description: "Every business profile is manually audited for tax compliance and operational legitimacy.",
      icon: Fingerprint,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Global Supply Chain",
      description: "Connect with distributors in over 190 countries with built-in logistics intelligence.",
      icon: Globe,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Direct Inquiries",
      description: "Real-time leads sent directly to your dashboard. No middleman, no hidden fees.",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Competitive Analytics",
      description: "Benchmark your pricing and visibility against industry leaders in your category.",
      icon: BarChart3,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Priority Placement",
      description: "Premium plans ensure your business appears at the top of every relevant search result.",
      icon: Target,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <section className="section-padding overflow-hidden">
      <div className="responsive-container">
        <div className="mb-20 max-w-3xl animate-in fade-in slide-in-from-left-8 duration-1000">
          <h2 className="mb-6 text-[clamp(36px,5vw,56px)] font-[1000] tracking-tighter leading-none text-foreground">
            Built for the <br />
            <span className="gradient-text italic">Elite Manufacturer.</span>
          </h2>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">
            Hetnex isn't just a directory—it's a high-performance growth engine designed to bridge 
            the gap between your production and global demand.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title}
                className="premium-card group p-10 transition-all hover:-translate-y-2 animate-in fade-in zoom-in-95 duration-700 fill-mode-both"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-[24px] ${feature.bg} ${feature.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mb-4 text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-8 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-16" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
