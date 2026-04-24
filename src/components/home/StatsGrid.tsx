"use client";

import { CountUp } from "@/components/ui/CountUp";
import { StatItem } from "@/types";

interface StatsGridProps {
  stats: StatItem[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="responsive-container -mt-16 relative z-30">
      {/* 
        🎨 Clean Design: 
        Removed all dividers for a seamless, modern look as requested.
        The cards now sit in a clean grid with no border lines between them.
      */}
      <div className="mx-auto grid grid-cols-1 overflow-hidden rounded-[32px] bg-background shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-border/50 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label} 
              className="relative p-10 transition-all hover:bg-primary/[0.02] group animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
              style={{ animationDelay: `${400 + idx * 100}ms` }}
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 -z-10 bg-primary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:bg-primary/[0.03]" />
              
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
                {Icon && <Icon className="h-6 w-6" />}
              </div>

              <div className="text-5xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-300">
                <CountUp end={stat.value} suffix={stat.suffix} duration={2.5} />
              </div>
              
              <div className="mt-3 text-[11px] font-black text-muted-foreground uppercase tracking-[0.25em] group-hover:text-primary/60 transition-colors">
                {stat.label}
              </div>

              {/* Bottom decorative bar */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
