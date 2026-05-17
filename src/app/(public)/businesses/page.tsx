import Link from "next/link";
import {
  Search,
  Building2,
  PhoneCall,
  ShieldCheck,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PublicBusinessFilterBar } from "@/components/businesses/PublicBusinessFilterBar";
import { PublicBusinessToolbar } from "@/components/businesses/PublicBusinessToolbar";
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
    country?: string;
    state?: string;
    city?: string;
    pincode?: string;
    page?: string;
    sort?: string;
  }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PublicBusinessesPage({ searchParams }: PageProps) {
  const {
    q = "",
    hsn = "",
    country = "",
    state = "",
    city = "",
    pincode = "",
    page: pageStr = "1",
    sort = "newest",
  } = await searchParams;

  const page = Math.max(1, parseInt(pageStr));
  const limit = 12;

  await dbConnect();
  void Country; void State; void City; void Pincode;

  const filter: Record<string, any> = { isActive: true };
  if (q) filter.$text = { $search: q };
  if (hsn) filter["hsnCodes.code"] = { $regex: hsn, $options: "i" };
  if (country) filter.countryId = country;
  if (state) filter.stateId = state;
  if (city) filter.cityId = city;
  if (pincode) filter.pincodeId = pincode;

  const sortOption: Record<string, any> = {};
  if (sort === "newest") sortOption.createdAt = -1;
  else if (sort === "oldest") sortOption.createdAt = 1;
  else if (sort === "name_asc") sortOption.businessName = 1;
  else if (sort === "name_desc") sortOption.businessName = -1;

  const [businesses, total] = await Promise.all([
    Business.find(filter)
      .populate("countryId", "name flag")
      .populate("stateId", "name")
      .populate("cityId", "name")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortOption)
      .lean(),
    Business.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  const start = Math.min((page - 1) * limit + 1, total);
  const end = Math.min(page * limit, total);

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (hsn) params.set("hsn", hsn);
    if (country) params.set("country", country);
    if (state) params.set("state", state);
    if (city) params.set("city", city);
    if (pincode) params.set("pincode", pincode);
    if (sort) params.set("sort", sort);
    params.set("page", String(p));
    return `/businesses?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                <div className="h-1 w-6 bg-primary rounded-full" />
                Premium Directory
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Explore <span className="text-primary">Verified</span> Businesses
              </h1>
              <p className="text-slate-500 text-sm hidden sm:block">
                The most trusted marketplace to find and connect with verified business partners.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 hidden sm:block">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Listed</p>
                <p className="text-xl font-black text-slate-900">{total.toLocaleString()}</p>
              </div>
              <Link href="/register">
                <button className="h-11 px-5 rounded-xl bg-primary text-white font-bold text-sm hover:brightness-105 transition-all shadow-lg shadow-primary/20 whitespace-nowrap">
                  List Your Business
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

        {/* Filter Bar */}
        <PublicBusinessFilterBar
          initialQ={q}
          initialHsn={hsn}
          initialCountry={country}
          initialState={state}
          initialCity={city}
          initialPincode={pincode}
          totalResults={total}
        />

        {/* Toolbar: result count + sort */}
        <PublicBusinessToolbar start={start} end={end} total={total} sort={sort} />

        {/* Empty State */}
        {businesses.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center mt-4">
            <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center mb-5 border border-slate-100">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No results found</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm">
              We couldn't find any businesses matching your filters. Try clearing some options.
            </p>
            <Link
              href="/businesses"
              className="h-11 px-8 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center hover:bg-black transition-all"
            >
              Clear All Filters
            </Link>
          </div>
        )}

        {/* ── Beautiful Animated Business Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mt-4">
          {businesses.map((b: any, idx) => {
            const cityName = b.cityId?.name || "";
            const stateName = b.stateId?.name || "";
            const location = [cityName, stateName].filter(Boolean).join(", ");
            const firstImage = b.cardImages?.[0] || b.logoUrl || "";

            return (
              <div
                key={b._id.toString()}
                className="group relative bg-white rounded-[32px] border border-slate-200 overflow-hidden hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-700 hover:-translate-y-3 flex flex-col h-full animate-in fade-in slide-in-from-bottom-8"
                style={{ 
                  animationDelay: `${(idx % 12) * 50}ms`,
                  animationFillMode: "both" 
                }}
              >
                {/* 🖼️ Premium Image Section */}
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  {firstImage ? (
                    <img
                      src={firstImage}
                      alt={b.businessName}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="h-14 w-14 text-slate-200" />
                    </div>
                  )}

                  {/* Glassmorphic Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white text-[10px] font-black uppercase tracking-wider text-emerald-600 shadow-sm">
                      <ShieldCheck className="h-3.5 w-3.5" /> Verified
                    </div>
                  </div>

                  {/* Brand Logo Floating */}
                  {b.logoUrl && (
                    <div className="absolute bottom-4 right-4 h-12 w-12 rounded-2xl bg-white/90 backdrop-blur-md p-2 shadow-2xl border border-white transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      <img src={b.logoUrl} alt="brand" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>

                {/* 📝 Elegant Details Section */}
                <div className="p-6 flex flex-col flex-1 relative">
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors leading-tight line-clamp-1 mb-1">
                      {b.businessName}
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                      {b.ownerName || "Premium Partner"}
                    </p>

                    <div className="space-y-2.5 mb-6">
                      <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                        <div className="h-8 w-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <span className="truncate">{location || "Global Business"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                        <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                          <Clock className="h-4 w-4" />
                        </div>
                        <span>Active Since {new Date(b.createdAt).getFullYear()}</span>
                      </div>
                    </div>
                  </div>

                  {/* 🔘 Smooth Footer Actions */}
                  <div className="flex items-center gap-3 pt-6 border-t border-slate-100 mt-auto">
                    <Link href={`/business/${b.slug}`} className="flex-1">
                      <button className="w-full h-12 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-primary hover:shadow-xl hover:shadow-primary/30 transition-all">
                        View Details
                      </button>
                    </Link>
                    {b.mobiles?.[0] && (
                      <a
                        href={`tel:${b.mobiles[0]}`}
                        className="h-12 w-12 rounded-2xl border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                      >
                        <PhoneCall className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              <Link
                href={buildPageUrl(Math.max(1, page - 1))}
                className={`h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white transition-all ${
                  page === 1 ? "opacity-30 pointer-events-none" : "hover:border-primary hover:text-primary shadow-sm"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, i) =>
                  item === "..." ? (
                    <span key={`e-${i}`} className="w-10 h-10 flex items-center justify-center text-slate-300 font-bold text-sm">…</span>
                  ) : (
                    <Link
                      key={item}
                      href={buildPageUrl(item as number)}
                      className={`h-10 w-10 flex items-center justify-center rounded-xl font-black text-sm transition-all ${
                        item === page
                          ? "bg-primary text-white shadow-lg shadow-primary/25 scale-110"
                          : "bg-white border border-slate-200 text-slate-500 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {item}
                    </Link>
                  )
                )}

              <Link
                href={buildPageUrl(Math.min(totalPages, page + 1))}
                className={`h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white transition-all ${
                  page === totalPages ? "opacity-30 pointer-events-none" : "hover:border-primary hover:text-primary shadow-sm"
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Page {page} of {totalPages}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
