"use client";

import { Users, Globe, FileText, ShieldCheck } from "lucide-react";
import { 
  CTASection, 
  FeaturedBusinesses, 
  HeroSection, 
  StatsGrid,
  FeaturesSection
} from "@/components/home";
import { StatItem, BusinessProfile } from "@/types";
export default function HomePage() {
  const homeStats: StatItem[] = [
    { value: 100, suffix: "k+", label: "Business Cards", icon: Users },
    { value: 190, suffix: "+", label: "Countries", icon: Globe },
    { value: 5, suffix: ",000+", label: "HSN Codes", icon: FileText },
    { value: 50, suffix: ",000+", label: "Verified Dealers", icon: ShieldCheck },
  ];

  const featuredBusinesses: BusinessProfile[] = [
    {
      name: "Elite Ceramics Ltd",
      location: "Morbi, India",
      hsnCode: "6908",
      imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Global Bearings Co.",
      location: "Dubai, UAE",
      hsnCode: "8482",
      imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Precision Tools Hub",
      location: "Munich, Germany",
      hsnCode: "8207",
      imageUrl: "https://images.unsplash.com/photo-1530124560612-4eb9a695d27b?auto=format&fit=crop&q=80&w=600",
    },
  ];

  return (
    <main className="bg-background overflow-x-hidden">
      <HeroSection />
      <StatsGrid stats={homeStats} />
      <FeaturesSection />
      <FeaturedBusinesses businesses={featuredBusinesses} />
      <CTASection />
    </main>
  );
}
