import Link from "next/link";
import {
  Search,
  MapPin,
  Building2,
  PhoneCall,
  ShieldCheck,
  SlidersHorizontal,
  Tag,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { PublicNav } from "@/components/layouts/public/PublicNav";
import dbConnect from "@/lib/dbConnect";
import Business from "@/models/Business";
import Country from "@/models/Country";
import State from "@/models/State";
import City from "@/models/City";
import Pincode from "@/models/Pincode";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    hsn?: string;
    city?: string;
    page?: string;
  }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PublicBusinessesPage({ searchParams }: PageProps) {
  const { q = "", hsn = "", city = "", page: pageStr = "1" } = await searchParams;
  const page = Math.max(1, parseInt(pageStr));
  const limit = 12;
  const hasFilter = !!(q || hsn || city);

  await dbConnect();
  void Country; void State; void City; void Pincode;

  const filter: Record<string, any> = { isActive: true };
  if (q) filter.$text = { $search: q };
  if (hsn) filter["hsnCodes.code"] = { $regex: hsn, $options: "i" };
  if (city) filter.cityId = city;

  const [businesses, total] = await Promise.all([
    Business.find(filter)
      .populate("countryId", "name flag")
      .populate("stateId", "name")
      .populate("cityId", "name")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),
    Business.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  const start = Math.min((page - 1) * limit + 1, total);
  const end = Math.min(page * limit, total);

  return (
    <main className="pub-dark">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="blob-float absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-600/5 blur-3xl" />
        <div className="blob-float absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-indigo-600/5 blur-3xl" style={{ animationDelay: "4s" }} />
        <div className="blob-float absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-teal-600/4 blur-3xl" style={{ animationDelay: "8s" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* ── Page Header ── */}
        <div className="py-8 sm:py-10 lg:py-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="animate-fadeInUp">
              <div className="stat-pill w-fit mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Business Directory
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Find Trusted{" "}
                <span className="gradient-text">Businesses</span>
              </h1>
              <p className="mt-2 text-slate-400 text-base sm:text-lg">
                Search by name, HSN code, or location across thousands of verified listings
              </p>
            </div>

            {total > 0 && (
              <div className="animate-fadeInUp flex items-center gap-2 text-slate-500 text-sm whitespace-nowrap">
                <span className="text-2xl font-black text-white">{total.toLocaleString()}</span>
                <span>listings</span>
              </div>
            )}
          </div>

          {/* ── Top Search Bar ── */}
          <form
            method="GET"
            action="/businesses"
            className="animate-fadeInUp mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3"
          >
            {/* Main search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 pointer-events-none" />
              <input
                name="q"
                type="text"
                defaultValue={q}
                placeholder="Search business name, owner..."
                className="input-dark w-full pl-11 pr-4 py-3.5 text-sm"
              />
              {q && (
                <Link href={`/businesses?hsn=${hsn}&city=${city}`} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  <X className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* HSN filter */}
            <div className="relative w-full sm:w-44">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                name="hsn"
                type="text"
                defaultValue={hsn}
                placeholder="HSN Code"
                className="input-dark w-full pl-10 pr-4 py-3.5 text-sm"
              />
            </div>

            <button
              type="submit"
              className="btn-glow px-7 py-3.5 rounded-xl text-sm font-bold whitespace-nowrap"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </button>
          </form>

          {/* Active filters chips */}
          {hasFilter && (
            <div className="mt-4 flex flex-wrap items-center gap-2 animate-fadeInUp">
              <span className="text-xs text-slate-500">Active filters:</span>
              {q && (
                <Link
                  href={`/businesses?hsn=${hsn}&city=${city}`}
                  className="inline-flex items-center gap-1.5 bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full hover:bg-purple-500/25 transition-colors"
                >
                  Name: {q} <X className="w-3 h-3" />
                </Link>
              )}
              {hsn && (
                <Link
                  href={`/businesses?q=${q}&city=${city}`}
                  className="inline-flex items-center gap-1.5 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full hover:bg-indigo-500/25 transition-colors"
                >
                  HSN: {hsn} <X className="w-3 h-3" />
                </Link>
              )}
              <Link
                href="/businesses"
                className="inline-flex items-center gap-1.5 text-slate-400 text-xs font-semibold px-3 py-1 rounded-full border border-slate-700 hover:border-slate-500 transition-colors"
              >
                Clear all <X className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

        {/* ── Content layout: List ── */}
        <div className="w-full pb-20">
          <div className="flex-1 min-w-0">
            {/* Result count + sort */}
            {total > 0 && (
              <div className="flex items-center justify-between mb-5 text-sm text-slate-500">
                <p>
                  Showing{" "}
                  <span className="font-bold text-slate-200">{start}–{end}</span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-200">{total}</span>{" "}
                  businesses
                  {q && (
                    <span>
                      {" "}for &ldquo;<span className="text-purple-400">{q}</span>&rdquo;
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Empty state */}
            {businesses.length === 0 && (
              <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-5">
                  <Building2 className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">No Businesses Found</h3>
                <p className="text-slate-400 mb-6 max-w-xs">
                  {hasFilter
                    ? "Try different keywords or remove some filters."
                    : "No businesses have been listed yet."}
                </p>
                {hasFilter && (
                  <Link href="/businesses" className="btn-glow px-8 py-3 rounded-xl text-sm font-bold">
                    Clear Filters
                  </Link>
                )}
              </div>
            )}

            {/* Product List */}
            {businesses.length > 0 && (
              <div className="flex flex-col gap-5">
                {businesses.map((b: any, idx) => {
                  const city = b.cityId?.name || "";
                  const state = b.stateId?.name || "";
                  const location = [city, state].filter(Boolean).join(", ");
                  const firstImage = b.cardImages?.[0] || b.logoUrl || "";
                  const phone = b.mobiles?.[0];

                  return (
                    <article
                      key={b._id.toString()}
                      className="glass-card overflow-hidden flex flex-col sm:flex-row group animate-fadeInUp hover:bg-white/5 transition-colors"
                      style={{ animationDelay: `${(idx % 12) * 40}ms`, animationFillMode: "both" }}
                    >
                      {/* Left: Product Image */}
                      <div className="relative w-full sm:w-64 lg:w-72 h-56 sm:h-auto shrink-0 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
                        {firstImage ? (
                          <>
                            <img
                              src={firstImage}
                              alt={b.businessName}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-black/40" />
                          </>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50">
                            <Building2 className="w-16 h-16 text-slate-600" />
                          </div>
                        )}

                        <div className="absolute top-4 left-4">
                          <span className="flex items-center gap-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg shadow-emerald-500/20">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        </div>

                        {b.logoUrl && b.cardImages?.[0] && (
                          <div className="absolute bottom-4 left-4 sm:bottom-auto sm:top-4 sm:right-4 sm:left-auto w-12 h-12 rounded-xl overflow-hidden bg-black/80 backdrop-blur-md border border-white/10 shadow-xl">
                            <img src={b.logoUrl} alt="logo" className="w-full h-full object-contain p-1" />
                          </div>
                        )}
                      </div>

                      {/* Middle: Details */}
                      <div className="p-5 sm:p-6 lg:p-8 flex flex-col flex-1 justify-center border-b sm:border-b-0 sm:border-r border-white/5">
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight line-clamp-1 group-hover:text-purple-400 transition-colors">
                            {b.businessName}
                          </h3>
                        </div>
                        <p className="text-sm font-semibold text-slate-400 mb-4">{b.ownerName}</p>

                        {location && (
                          <p className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-5">
                            <MapPin className="w-4 h-4 text-orange-400" />
                            {location}
                          </p>
                        )}

                        {/* HSN Tags */}
                        {b.hsnCodes?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-auto">
                            {b.hsnCodes.slice(0, 5).map((h: any) => (
                              <span key={h.code} className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-wider">
                                {h.code}
                              </span>
                            ))}
                            {b.hsnCodes.length > 5 && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 text-[10px] font-black uppercase tracking-wider">
                                +{b.hsnCodes.length - 5} More
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="p-5 sm:p-6 lg:p-8 w-full sm:w-56 lg:w-64 shrink-0 flex flex-col justify-center gap-3 bg-white/[0.02]">
                        <div className="hidden sm:block mb-4 text-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Status</p>
                          <p className="text-emerald-400 font-bold text-sm flex items-center justify-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Listing</p>
                        </div>

                        <Link href={`/business/${b.slug}`} className="w-full">
                          <button className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-500/20 active:scale-95 group/btn">
                            <Building2 className="w-4 h-4" /> View Profile
                          </button>
                        </Link>

                        {phone && (
                          <a
                            href={`tel:${phone}`}
                            className="w-full flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-sm font-bold py-3.5 rounded-xl transition-all active:scale-95"
                          >
                            <PhoneCall className="w-4 h-4" /> Contact Direct
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                {page > 1 ? (
                  <Link
                    href={`/businesses?q=${q}&hsn=${hsn}&city=${city}&page=${page - 1}`}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-white/6 border border-white/8 hover:bg-white/12 hover:border-white/16 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </Link>
                ) : (
                  <span className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white/3 border border-white/5 cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                  </span>
                )}

                <div className="flex gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | "...")[]>((acc, p, i, arr) => {
                      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, i) =>
                      item === "..." ? (
                        <span key={`ellipsis-${i}`} className="px-3 py-2.5 text-sm text-slate-600">…</span>
                      ) : (
                        <Link
                          key={item}
                          href={`/businesses?q=${q}&hsn=${hsn}&city=${city}&page=${item}`}
                          className={`min-w-[40px] px-3 py-2.5 rounded-xl text-sm font-bold text-center transition-all ${item === page
                              ? "btn-glow"
                              : "text-slate-300 bg-white/6 border border-white/8 hover:bg-white/12 hover:border-purple-500/30"
                            }`}
                        >
                          {item}
                        </Link>
                      )
                    )}
                </div>

                {page < totalPages ? (
                  <Link
                    href={`/businesses?q=${q}&hsn=${hsn}&city=${city}&page=${page + 1}`}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-white/6 border border-white/8 hover:bg-white/12 hover:border-white/16 transition-all"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <span className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white/3 border border-white/5 cursor-not-allowed">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
