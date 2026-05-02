import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Star, Heart, Clock, Search, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function CustomerFavoritesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const comingSoonFeatures = [
    {
      icon: Heart,
      title: "Save Businesses",
      desc: "Bookmark any business listing from the directory with one click.",
    },
    {
      icon: Star,
      title: "Quick Access",
      desc: "All your saved businesses in one place — no more searching again.",
    },
    {
      icon: Search,
      title: "Smart Collections",
      desc: "Organize favorites into custom collections by category or region.",
    },
    {
      icon: Building2,
      title: "Compare Businesses",
      desc: "Side-by-side comparison of saved listings across HSN codes and plans.",
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-amber-500/10">
            <Star className="h-6 w-6 text-amber-500" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground">Favorites</h1>
        </div>
        <p className="text-muted-foreground font-medium ml-14">
          Save and organize your favorite business listings for quick access.
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div className="premium-card p-10 mb-8 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />

        <div className="relative text-center py-6">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 ring-1 ring-amber-500/20">
            <Star className="h-10 w-10 text-amber-500" />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-amber-600 mb-4">
            <Clock className="h-3 w-3 animate-pulse" />
            Coming Soon
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground mb-3">
            Saved Favorites
          </h2>
          <p className="text-muted-foreground font-medium max-w-md mx-auto">
            Quickly bookmark businesses you&apos;re interested in. Your saved listings will appear
            here for instant access — no need to search again.
          </p>
        </div>
      </div>

      {/* Feature Preview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        {comingSoonFeatures.map(({ icon: Icon, title, desc }, idx) => (
          <div
            key={title}
            className="premium-card p-6 group animate-in fade-in zoom-in-95 duration-700"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-foreground/5 group-hover:bg-amber-500/10 transition-colors">
                <Icon className="h-5 w-5 text-muted-foreground group-hover:text-amber-500 transition-colors" />
              </div>
              <div>
                <p className="font-black text-sm text-foreground mb-1">{title}</p>
                <p className="text-xs font-medium text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="premium-card p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-black text-foreground mb-1">Discover businesses to save</p>
          <p className="text-sm text-muted-foreground font-medium">
            Browse the public directory and bookmark the ones you like.
          </p>
        </div>
        <Link
          href="/businesses"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-foreground text-background font-black text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Browse Directory <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
