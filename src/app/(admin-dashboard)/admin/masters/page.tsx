"use client";

import Link from "next/link";
import { AppRoutes } from "@/lib/routes";
import { Globe, Map, Milestone, Hash, ChevronRight, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function MastersPage() {
  const masters = [
    {
      title: "Countries Master",
      description: "Manage sovereign states, ISO codes, and international dial codes.",
      href: AppRoutes.ADMIN_MASTERS_COUNTRIES,
      icon: Globe,
      color: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "States / Provinces Master",
      description: "Manage regional territories, state codes, and map them to parent countries.",
      href: "/admin/masters/states",
      icon: Map,
      color: "from-emerald-500/20 to-emerald-500/5",
      iconColor: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Cities / Municipalities Master",
      description: "Manage urban centers, map them to states, and organize location hierarchies.",
      href: "/admin/masters/cities",
      icon: Milestone,
      color: "from-amber-500/20 to-amber-500/5",
      iconColor: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Pincodes / Postal Codes",
      description: "Manage detailed postal codes, associate specific areas, and map to cities.",
      href: "/admin/masters/pincodes",
      icon: Hash,
      color: "from-violet-500/20 to-violet-500/5",
      iconColor: "text-violet-500",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      title: "HSN Codes Master",
      description: "Manage harmonized system nomenclature for standardized product classification.",
      href: "/admin/masters/hsn",
      icon: Hash,
      color: "from-purple-500/20 to-purple-500/5",
      iconColor: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-4xl font-black text-foreground flex items-center gap-5 tracking-tight group/title">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover/title:opacity-100 transition-opacity duration-700" />
            <div className="relative p-3.5 rounded-[22px] bg-primary/10 text-primary transition-transform duration-500 group-hover/title:scale-110">
              <MapPin className="h-7 w-7 md:h-8 md:w-8" />
            </div>
          </div>
          Location Masters
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground/60 mt-1 max-w-xl font-medium leading-relaxed">
          Centralized administrative hub for managing the platform's cascading geographical database hierarchy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {masters.map((master, idx) => (
          <Link key={idx} href={master.href}>
            <Card className={cn(
              "relative flex flex-col p-8 overflow-hidden rounded-[32px] border bg-card/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/5 group border-border/40 h-full cursor-pointer"
            )}>
              <div className={cn("absolute top-0 right-0 h-40 w-40 rounded-full blur-[50px] opacity-40 transition-opacity group-hover:opacity-60 bg-gradient-to-br", master.color)} />
              
              <div className="relative z-10 flex items-start justify-between mb-6">
                <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 border", master.bg, master.iconColor, master.border)}>
                  <master.icon className="h-7 w-7" />
                </div>
                <div className="h-10 w-10 rounded-full bg-muted/30 flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                  <ChevronRight className="h-5 w-5 text-foreground" />
                </div>
              </div>

              <div className="relative z-10 flex-1">
                <h3 className="text-2xl font-black text-foreground tracking-tight mb-3 group-hover:text-primary transition-colors">
                  {master.title}
                </h3>
                <p className="text-sm font-medium text-muted-foreground/70 leading-relaxed">
                  {master.description}
                </p>
              </div>
              
              <div className="relative z-10 mt-8">
                <span className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  Access Directory <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
