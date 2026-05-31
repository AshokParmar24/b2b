import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Favorite from "@/models/Favorite";
import Business from "@/models/Business";
import City from "@/models/City";
import State from "@/models/State";
import { Star, MapPin, Building2, ExternalLink, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CustomerFavoritesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await dbConnect();
  // Ensure models are registered
  void Business;
  void City;
  void State;
  
  const userId = (session.user as any).id;
  
  const favorites = await Favorite.find({ userId })
    .populate({
      path: "businessId",
      populate: [
        { path: "cityId", select: "name" },
        { path: "stateId", select: "name" }
      ]
    })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
            <div className="relative p-3.5 rounded-[22px] bg-amber-500/10 text-amber-500">
              <Star className="h-7 w-7" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-[1000] tracking-tight text-foreground">My Favorites</h1>
            <p className="text-sm font-medium text-muted-foreground mt-1">
              Your bookmarked business listings for quick access.
            </p>
          </div>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="premium-card p-20 text-center">
          <div className="mx-auto h-24 w-24 rounded-[32px] bg-muted/30 flex items-center justify-center mb-6 ring-8 ring-background/50">
            <Star className="h-10 w-10 text-muted-foreground/30" />
          </div>
          <h2 className="text-2xl font-black text-foreground">No favorites yet</h2>
          <p className="text-sm font-medium text-muted-foreground mt-3 max-w-sm mx-auto leading-relaxed">
            Browse the public directory and bookmark businesses you&apos;re interested in to see them here.
          </p>
          <Link href="/businesses">
            <button className="mt-8 inline-flex items-center gap-2 h-12 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              Browse Directory
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav: any) => {
            const b = fav.businessId;
            if (!b) return null;
            return (
              <div key={fav._id.toString()} className="group premium-card p-6 hover:border-amber-500/30 transition-all duration-500">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center font-[1000] text-xl shadow-inner",
                    "bg-gradient-to-br from-primary/80 to-blue-600 text-white shadow-primary/20"
                  )}>
                    {b.businessName?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/business/${b.slug}`} target="_blank">
                      <button className="h-10 w-10 rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </Link>
                    {/* Add un-favorite logic client-side if needed, for now just UI */}
                    <button className="h-10 w-10 rounded-xl bg-destructive/5 flex items-center justify-center text-destructive hover:bg-destructive hover:text-white transition-all">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-black text-foreground truncate group-hover:text-primary transition-colors">
                  {b.businessName}
                </h3>
                
                <div className="flex items-center gap-2 mt-2 text-xs font-bold text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary/60" />
                  <span className="truncate">
                    {[b.cityId?.name, b.stateId?.name].filter(Boolean).join(", ")}
                  </span>
                </div>

                <div className="mt-6 pt-5 border-t border-border/30 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
                    {b.isActive ? "Active" : "Inactive"}
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground/50">
                    Saved {new Date(fav.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
