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
import Pincode from "@/models/Pincode";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BusinessFilterBar } from "@/components/admin/businesses/BusinessFilterBar";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    hsn?: string;
    status?: string;
    country?: string;
    state?: string;
    city?: string;
    pincode?: string;
    page?: string;
  }>;
}

export default async function AdminBusinessesPage({ searchParams }: PageProps) {
  const { 
    q = "", 
    hsn = "", 
    status = "all", 
    country = "", 
    state = "", 
    city = "", 
    pincode = "", 
    page: pageStr = "1" 
  } = await searchParams;
  
  const page = Math.max(1, parseInt(pageStr));
  const limit = 12;

  await dbConnect();
  void Country; void State; void City; void Pincode;

  const filter: Record<string, any> = {};
  if (q) filter.$or = [{ businessName: { $regex: q, $options: "i" } }, { gstNumber: { $regex: q, $options: "i" } }];
  if (hsn) filter["hsnCodes.code"] = { $regex: hsn, $options: "i" };
  if (country) filter.countryId = country;
  if (state) filter.stateId = state;
  if (city) filter.cityId = city;
  if (pincode) filter.pincodeId = pincode;
  
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

  const hasFilter = !!(q || hsn || country || state || city || pincode || status !== "all");

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

      <BusinessFilterBar 
        initialQ={q}
        initialHsn={hsn}
        initialStatus={status}
        initialCountry={country}
        initialState={state}
        initialCity={city}
        initialPincode={pincode}
      />

      {/* MAIN CONTENT - PRODUCT LIKE CARDS */}
      <div className="w-full pb-10">
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
            <div className="flex flex-col gap-5">
              {businesses.map((b: any, idx: number) => {
                const firstImage = b.cardImages?.[0] || b.logoUrl || null;
                const location = [b.cityId?.name, b.stateId?.name].filter(Boolean).join(", ");
                const owner = b.userId?.name || b.ownerName;

                return (
                  <div 
                    key={b._id.toString()}
                    className="group rounded-[28px] border border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden hover:bg-card/60 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col sm:flex-row"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    {/* Left Image Area */}
                    <div className="relative w-full sm:w-64 lg:w-72 h-56 sm:h-auto shrink-0 bg-muted/30 overflow-hidden flex items-center justify-center">
                      {firstImage ? (
                        <>
                          <img src={firstImage} alt={b.businessName} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-black/40" />
                        </>
                      ) : (
                        <Building2 className="h-16 w-16 text-muted-foreground/20" />
                      )}
                      
                      {/* Status Badge Over Image */}
                      <div className="absolute top-4 left-4">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-lg",
                          b.isActive 
                            ? "bg-emerald-500 text-white shadow-emerald-500/20"
                            : "bg-destructive text-white shadow-destructive/20"
                        )}>
                          {b.isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {b.isActive ? "Active" : "Archived"}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Details Area */}
                    <div className="p-5 sm:p-6 lg:p-8 flex-1 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-border/30">
                      <div className="mb-2">
                        <h3 className="text-xl sm:text-2xl font-black text-foreground truncate group-hover:text-primary transition-colors">
                          {b.businessName}
                        </h3>
                        {b.gstNumber && (
                          <p className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest mt-1">
                            GST: {b.gstNumber}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2.5 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                          <MapPin className="h-4 w-4 text-orange-400" />
                          <span className="truncate">{location || "Global Business"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                          <span className="truncate">{owner || "Unclaimed"}</span>
                        </div>
                      </div>
                      
                      {/* HSN Tags */}
                      {b.hsnCodes?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {b.hsnCodes.slice(0, 4).map((h: any) => (
                            <span key={h.code} className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
                              <Tag className="h-3 w-3 mr-1 opacity-50" /> {h.code}
                            </span>
                          ))}
                          {b.hsnCodes.length > 4 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted border border-border/50 text-muted-foreground text-[10px] font-black uppercase tracking-wider">
                              +{b.hsnCodes.length - 4} More
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Right: Actions Area */}
                    <div className="p-5 sm:p-6 lg:p-8 w-full sm:w-56 lg:w-64 shrink-0 flex flex-col justify-center gap-3 bg-card/20">
                      <div className="hidden sm:block mb-2 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Created</p>
                        <p className="text-foreground font-bold text-sm">{new Date(b.createdAt).toLocaleDateString()}</p>
                      </div>

                      <Link href={`/admin/businesses/${b._id}`} className="w-full">
                        <Button className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20">
                          <Edit className="h-4 w-4 mr-2" /> Edit Profile
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full h-12 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive hover:text-destructive font-black transition-all">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {total > limit && (
            <div className="mt-8 flex justify-center gap-2">
              <Link href={`/admin/businesses?q=${q}&hsn=${hsn}&status=${status}&country=${country}&state=${state}&city=${city}&pincode=${pincode}&page=${Math.max(1, page - 1)}`}>
                <Button variant="outline" disabled={page === 1} className="rounded-xl font-bold">Prev</Button>
              </Link>
              <span className="flex items-center px-4 font-black text-sm">{page} / {Math.ceil(total / limit)}</span>
              <Link href={`/admin/businesses?q=${q}&hsn=${hsn}&status=${status}&country=${country}&state=${state}&city=${city}&pincode=${pincode}&page=${page + 1}`}>
                <Button variant="outline" disabled={page * limit >= total} className="rounded-xl font-bold">Next</Button>
              </Link>
            </div>
          )}
        </div>
    </div>
  );
}
