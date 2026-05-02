import Link from "next/link";
import { Search, MapPin, Building2, PhoneCall, ShieldCheck, Tag, ArrowLeft } from "lucide-react";
import { PublicNav } from "@/components/layouts/public/PublicNav";
import dbConnect from "@/lib/dbConnect";
import Business from "@/models/Business";
import Country from "@/models/Country";
import State from "@/models/State";
import City from "@/models/City";
import Pincode from "@/models/Pincode";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; hsn?: string }>;
}) {
  const { q, hsn: hsnParam } = await searchParams;
  const query = q?.trim() || "";
  const hsn = hsnParam?.trim() || "";
  const searchTerm = query || hsn || "";

  await dbConnect();
  void Country; void State; void City; void Pincode;

  const filter: Record<string, any> = { isActive: true };
  if (query) filter.$text = { $search: query };
  if (hsn)   filter["hsnCodes.code"] = { $regex: hsn, $options: "i" };

  const results = await Business.find(filter)
    .populate("stateId", "name")
    .populate("cityId", "name")
    .limit(30)
    .sort({ createdAt: -1 })
    .lean();

  return (
    <main className="pub-dark">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="blob-float absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-600/5 blur-3xl" />
        <div className="blob-float absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-3xl" style={{ animationDelay: "5s" }} />
      </div>

      {/* ── Nav ── */}
      <PublicNav backHref="/businesses" backLabel="Directory" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* ── Hero ── */}
        <div className="text-center mb-8 sm:mb-12 animate-fadeInUp">
          {searchTerm && (
            <div className="stat-pill w-fit mx-auto mb-4">
              <Search className="w-3.5 h-3.5 text-purple-400" />
              Search Results
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {results.length > 0 ? (
              <>
                <span className="gradient-text">{results.length}</span>{" "}
                result{results.length !== 1 ? "s" : ""} found
              </>
            ) : (
              "No results found"
            )}
          </h1>

          {searchTerm && (
            <p className="mt-3 text-slate-400 text-lg">
              for &ldquo;<span className="text-purple-300 font-semibold">{searchTerm}</span>&rdquo;
            </p>
          )}

          {results.length === 0 && (
            <p className="mt-2 text-slate-500">
              Try a different keyword or browse all businesses.
            </p>
          )}
        </div>

        {/* ── Search Form ── */}
        <form
          action="/search"
          method="GET"
          className="animate-fadeInUp flex flex-col sm:flex-row gap-3 mb-10"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 pointer-events-none" />
            <input
              name="q"
              type="text"
              defaultValue={query}
              placeholder="Business name, owner..."
              className="input-dark w-full pl-11 pr-4 py-3.5 text-sm"
            />
          </div>
          <div className="relative sm:w-40">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            <input
              name="hsn"
              type="text"
              defaultValue={hsn}
              placeholder="HSN code"
              className="input-dark w-full pl-10 pr-4 py-3.5 text-sm"
            />
          </div>
          <button
            type="submit"
            className="btn-glow px-6 py-3.5 rounded-xl text-sm font-bold whitespace-nowrap"
          >
            Search
          </button>
        </form>

        {/* ── Results ── */}
        {results.length === 0 ? (
          <div className="glass-card p-14 flex flex-col items-center text-center animate-fadeInUp">
            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-5">
              <Building2 className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Nothing matches</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-sm">
              We couldn&apos;t find any verified businesses for your search.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <Link href="/businesses">
                <span className="btn-glow px-7 py-3 rounded-xl text-sm font-bold">
                  Browse All Businesses
                </span>
              </Link>
              <Link
                href="/search"
                className="text-sm font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Clear search
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 animate-fadeInUp">
            {results.map((b: any, idx) => {
              const city = b.cityId?.name || "";
              const state = b.stateId?.name || "";
              const location = [city, state].filter(Boolean).join(", ");
              const firstImage = b.cardImages?.[0] || b.logoUrl || "";

              return (
                <article
                  key={b._id.toString()}
                  className="glass-card overflow-hidden flex flex-col group"
                  style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "both" }}
                >
                  {/* Banner */}
                  <div className="relative h-44 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
                    {firstImage ? (
                      <>
                        <img
                          src={firstImage}
                          alt={b.businessName}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Building2 className="w-14 h-14 text-slate-700" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="badge-verified flex items-center gap-1 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <h3 className="text-base font-black text-white leading-snug mb-0.5 line-clamp-1">
                      {b.businessName}
                    </h3>
                    <p className="text-xs text-slate-500 mb-2.5">{b.ownerName}</p>

                    {location && (
                      <p className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                        <span className="line-clamp-1">{location}</span>
                      </p>
                    )}

                    {/* HSN tags — highlight matching */}
                    {b.hsnCodes?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {b.hsnCodes.slice(0, 4).map((h: any) => (
                          <span
                            key={h.code}
                            className={`hsn-tag ${hsn && h.code.includes(hsn) ? "active" : ""}`}
                          >
                            {h.code}
                          </span>
                        ))}
                        {b.hsnCodes.length > 4 && (
                          <span className="hsn-tag">+{b.hsnCodes.length - 4}</span>
                        )}
                      </div>
                    )}

                    <div className="mt-auto flex gap-2.5 pt-3 border-t border-white/5">
                      <Link href={`/business/${b.slug}`} className="flex-1">
                        <button className="w-full flex items-center justify-center gap-1.5 bg-white/8 hover:bg-white/14 border border-white/8 hover:border-purple-500/40 text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-200">
                          <Building2 className="w-3.5 h-3.5" /> View Profile
                        </button>
                      </Link>
                      {b.mobiles?.[0] && (
                        <a
                          href={`tel:${b.mobiles[0]}`}
                          title="Call Now"
                          className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/25 hover:border-emerald-500/60 text-emerald-400 transition-all flex-shrink-0"
                        >
                          <PhoneCall className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* View all link */}
        {results.length > 0 && (
          <div className="mt-10 text-center animate-fadeInUp">
            <Link href="/businesses" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-purple-400 transition-colors">
              Browse all verified businesses →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
