"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { BusinessProfile } from "@/types";

interface FeaturedBusinessesProps {
  businesses: BusinessProfile[];
}

export function FeaturedBusinesses({ businesses }: FeaturedBusinessesProps) {
  return (
    <section className="section-padding bg-muted/10 border-y border-border overflow-hidden">
      <div className="responsive-container">
        <div className="mb-14 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end animate-in fade-in duration-1000">
          <div className="max-w-2xl">
            <h2 className="mb-4 text-4xl font-black tracking-tighter text-foreground md:text-5xl">
              Featured <span className="text-primary opacity-60">Businesses</span>
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
              The most active and verified partners in our network this month.
            </p>
          </div>
          <Link href="/businesses" className="no-underline w-full md:w-auto cursor-pointer">
            <button className="btn-outline btn-lg group w-full md:w-auto cursor-pointer">
              Browse All <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((item, idx) => (
            <div 
              key={idx} 
              className="premium-card group cursor-pointer animate-in fade-in zoom-in-95 duration-1000 fill-mode-both"
              style={{ animationDelay: `${300 + idx * 150}ms` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
                <div className="absolute top-4 right-4">
                  <span className="rounded-sm bg-primary px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
                    Verified
                  </span>
                </div>
              </div>
              <div className="p-10">
                <h3 className="mb-3 text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-all line-clamp-1">
                  {item.name}
                </h3>
                <div className="mb-8 flex items-center gap-3 text-sm font-bold text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" /> {item.location}
                </div>
                <div className="flex items-center justify-between border-t border-border pt-8">
                  <span className="text-xs font-black text-primary uppercase tracking-tighter bg-primary/10 px-3 py-1.5 rounded">
                    HSN {item.hsnCode}
                  </span>
                  <button className="text-sm font-black text-foreground hover:text-primary transition-all flex items-center gap-1 group/btn cursor-pointer">
                    Profile <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
