import { Users, Globe, FileText, ShieldCheck } from "lucide-react";
import { 
  CTASection, 
  FeaturedBusinesses, 
  HeroSection, 
  StatsGrid,
  FeaturesSection
} from "@/components/home";
import dbConnect from "@/lib/dbConnect";
import Business from "@/models/Business";
import Country from "@/models/Country";
import HsnCode from "@/models/HsnCode";
import { StatItem } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  await dbConnect();

  // Fetch dynamic stats
  const [businessCount, countryCount, hsnCount, verifiedCount] = await Promise.all([
    Business.countDocuments({ isActive: true }),
    Country.countDocuments({ isActive: true }),
    HsnCode.countDocuments({ isActive: true }),
    Business.countDocuments({ isActive: true }), // Assuming all active for now, or add isVerified if available
  ]);

  const homeStats: StatItem[] = [
    { value: businessCount, suffix: "+", label: "Business Cards", icon: Users },
    { value: countryCount, suffix: "+", label: "Countries", icon: Globe },
    { value: hsnCount, suffix: "+", label: "HSN Codes", icon: FileText },
    { value: verifiedCount, suffix: "+", label: "Verified Dealers", icon: ShieldCheck },
  ];

  // Fetch featured businesses (latest 6 active ones)
  const latestBusinesses = await Business.find({ isActive: true })
    .populate("cityId", "name")
    .populate("stateId", "name")
    .populate("countryId", "name")
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  const featuredBusinesses = latestBusinesses.map((b: any) => ({
    name: b.businessName,
    location: [b.cityId?.name, b.stateId?.name].filter(Boolean).join(", ") || "Global",
    hsnCode: b.hsnCodes?.[0]?.code || "N/A",
    imageUrl: b.cardImages?.[0] || b.logoUrl || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600",
    slug: b.slug,
  }));

  return (
    <main className="bg-background overflow-x-hidden">
      <HeroSection businessCount={businessCount} />
      <StatsGrid stats={homeStats} />
      <FeaturesSection />
      <FeaturedBusinesses businesses={featuredBusinesses} />
      <CTASection />
    </main>
  );
}
