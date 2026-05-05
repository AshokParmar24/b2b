import React from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Building2,
  Tag,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Filter,
  SlidersHorizontal
} from "lucide-react";
import dbConnect from "@/lib/dbConnect";
import Business from "@/models/Business";
import Country from "@/models/Country";
import State from "@/models/State";
import City from "@/models/City";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    hsn?: string;
    city?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function AdminBusinessesPage({ searchParams }: PageProps) {
  const { q = "", hsn = "", city = "", status = "all", page: pageStr = "1" } = await searchParams;
  const page = Math.max(1, parseInt(pageStr));
  const limit = 12;

  await dbConnect();
  void Country; void State; void City;

  const filter: Record<string, any> = {};
  if (q) filter.$or = [{ businessName: { $regex: q, $options: "i" } }, { gstNumber: { $regex: q, $options: "i" } }];
  if (hsn) filter["hsnCodes.code"] = { $regex: hsn, $options: "i" };
  if (city) filter.cityId = city;
  if (status === "active") filter.isActive = true;
  if (status === "archived") filter.isActive = false;

  const [businesses, total] = await Promise.all([
    Business.find(filter)
      .populate("cityId", "name")
      .populate("stateId", "name")
      .populate("userId", "name email")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),
    Business.countDocuments(filter),
  ]);

  const hasFilter = !!(q || hsn || city || status !== "all");

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-[1400px] mx-auto pb-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 text-muted-foreground/40 mb-1 text-[9px] font-black uppercase tracking-[0.2em]">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span className="opacity-20">/</span>
            <span className="text-primary/60">Directory</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground flex items-center gap-5 tracking-tight group/title">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover/title:opacity-100 transition-opacity duration-700" />
              <div className="relative p-3.5 rounded-[22px] bg-primary/10 text-primary transition-transform duration-500 group-hover/title:scale-110">
                <Building2 className="h-7 w-7 md:h-8 md:w-8" />
              </div>
            </div>
            Business Listings
          </h2>
          <p className="text-sm font-semibold text-muted-foreground/80 mt-2 max-w-xl leading-relaxed">
            Manage all directory listings. View, edit, or remove business profiles, locations, and HSN catalogs.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR FILTER */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-24 rounded-[32px] border border-border/50 bg-card/40 backdrop-blur-xl p-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2 mb-6 text-foreground font-black">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              Refine Results
            </div>
            
            <form method="GET" action="/admin/businesses" className="space-y-5">
              <div>
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2 block ml-1">
                  Search Keyword
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    name="q" 
                    defaultValue={q} 
                    placeholder="Name, GST, Owner..." 
                    className="w-full pl-9 pr-4 py-3 rounded-2xl bg-muted/30 border-border/50 text-sm font-semibold focus:bg-background transition-colors outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2 block ml-1">
                  HSN Code
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    name="hsn" 
                    defaultValue={hsn} 
                    placeholder="e.g. 6908" 
                    className="w-full pl-9 pr-4 py-3 rounded-2xl bg-muted/30 border-border/50 text-sm font-semibold focus:bg-background transition-colors outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2 block ml-1">
                  Status
                </label>
                <select 
                  name="status" 
                  defaultValue={status}
                  className="w-full px-4 py-3 rounded-2xl bg-muted/30 border-border/50 text-sm font-semibold focus:bg-background transition-colors outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                >
                  <option value="all">All Listings</option>
                  <option value="active">Active Only</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="pt-4 border-t border-border/30">
                <Button type="submit" className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Apply Filters
                </Button>
                {hasFilter && (
                  <Link href="/admin/businesses" className="block mt-3 text-center">
                    <span className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center gap-1">
                      <XCircle className="h-3.5 w-3.5" /> Clear All Filters
                    </span>
                  </Link>
                )}
              </div>
            </form>
          </div>
        </aside>

        {/* MAIN CONTENT - PRODUCT LIKE CARDS */}
        <div className="flex-1 min-w-0">
          {total > 0 && (
            <div className="mb-6 flex items-center justify-between text-sm font-bold text-muted-foreground">
              <p>Showing <span className="text-foreground">{total}</span> total records</p>
            </div>
          )}

          {businesses.length === 0 ? (
            <div className="rounded-[32px] border border-border/50 bg-card/20 p-16 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-[24px] bg-primary/10 flex items-center justify-center mb-6 shadow-xl shadow-primary/5">
                <Building2 className="w-10 h-10 text-primary/40" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-2">No Listings Found</h3>
              <p className="text-sm font-medium text-muted-foreground max-w-sm leading-relaxed">
                {hasFilter ? "No businesses match your current filter criteria." : "The directory is currently empty."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {businesses.map((b: any, idx: number) => {
                const firstImage = b.cardImages?.[0] || b.logoUrl || null;
                const location = [b.cityId?.name, b.stateId?.name].filter(Boolean).join(", ");
                const owner = b.userId?.name || b.ownerName;

                return (
                  <div 
                    key={b._id.toString()}
                    className="group rounded-[28px] border border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* Header Image Area */}
                    <div className="relative h-48 bg-muted/30 overflow-hidden flex items-center justify-center">
                      {firstImage ? (
                        <>
                          <img src={firstImage} alt={b.businessName} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </>
                      ) : (
                        <Building2 className="h-16 w-16 text-muted-foreground/20" />
                      )}
                      
                      {/* Status Badge Over Image */}
                      <div className="absolute top-4 left-4">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-lg",
                          b.isActive 
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-destructive/20 text-red-300 border border-destructive/30"
                        )}>
                          {b.isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {b.isActive ? "Active" : "Archived"}
                        </div>
                      </div>

                      {/* HSN Count Over Image */}
                      <div className="absolute top-4 right-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                          <Tag className="h-3 w-3 text-primary" />
                          {b.hsnCodes?.length || 0} HSN
                        </div>
                      </div>

                      {/* Business Name Over Image */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-black text-white truncate shadow-black/50 drop-shadow-md">
                          {b.businessName}
                        </h3>
                        {b.gstNumber && (
                          <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-0.5">
                            GST: {b.gstNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="h-8 w-8 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 text-primary">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <span className="font-semibold truncate">{location || "Global Business"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="h-8 w-8 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 text-primary">
                            <ShieldCheck className="h-4 w-4" />
                          </div>
                          <span className="font-semibold truncate">{owner || "Unclaimed"}</span>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <Link href={`/admin/businesses/${b._id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {total > limit && (
            <div className="mt-8 flex justify-center gap-2">
              <Link href={`/admin/businesses?q=${q}&hsn=${hsn}&city=${city}&status=${status}&page=${Math.max(1, page - 1)}`}>
                <Button variant="outline" disabled={page === 1} className="rounded-xl font-bold">Prev</Button>
              </Link>
              <span className="flex items-center px-4 font-black text-sm">{page} / {Math.ceil(total / limit)}</span>
              <Link href={`/admin/businesses?q=${q}&hsn=${hsn}&city=${city}&status=${status}&page=${page + 1}`}>
                <Button variant="outline" disabled={page * limit >= total} className="rounded-xl font-bold">Next</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
