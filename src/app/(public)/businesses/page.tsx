import Link from "next/link";
import {
  Search,
  MapPin,
  Building2,
  PhoneCall,
  ShieldCheck,
  Tag,
  ChevronLeft,
  ChevronRight,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  Star,
  Clock,
} from "lucide-react";
import { PublicNav } from "@/components/layouts/public/PublicNav";
import dbConnect from "@/lib/dbConnect";
import Business from "@/models/Business";
import Country from "@/models/Country";
import State from "@/models/State";
import City from "@/models/City";
import Pincode from "@/models/Pincode";
import { PublicBusinessFilterSidebar } from "@/components/businesses/PublicBusinessFilterSidebar";
import { PublicBusinessToolbar } from "@/components/businesses/PublicBusinessToolbar";

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
    sort = "newest"
  } = await searchParams;

  const page = Math.max(1, parseInt(pageStr));
  const limit = 12;
  const hasFilter = !!(q || hsn || country || state || city || pincode);

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

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ── Page Header Area ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em]">
                <div className="h-1 w-8 bg-primary rounded-full" />
                Premium Directory
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Explore <span className="text-primary">Verified</span> Businesses
              </h1>
              <p className="text-slate-500 text-sm lg:text-base max-w-xl">
                The most trusted marketplace to find, connect, and collaborate with verified business partners globally.
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-sm">
               <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Listed</p>
                  <p className="text-xl font-black text-slate-900">{total.toLocaleString()}</p>
               </div>
               <div className="h-10 w-px bg-slate-200" />
               <Link href="/register">
                 <button className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:brightness-105 transition-all shadow-lg shadow-primary/20">
                    List Your Business
                 </button>
               </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Area (E-commerce Layout) ── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ── Sidebar Filters ── */}
          <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
            <div className="sticky top-24">
              <PublicBusinessFilterSidebar 
                initialQ={q}
                initialHsn={hsn}
                initialCountry={country}
                initialState={state}
                initialCity={city}
                initialPincode={pincode}
                totalResults={total}
              />
            </div>
          </aside>

          {/* ── Results Grid ── */}
          <div className="flex-1 min-w-0">
            <PublicBusinessToolbar 
              start={start}
              end={end}
              total={total}
              sort={sort}
            />

            {/* Empty State */}
            {businesses.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-[40px] p-20 flex flex-col items-center justify-center text-center animate-fadeInUp shadow-sm">
                <div className="w-24 h-24 rounded-3xl bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">No results found</h3>
                <p className="text-slate-500 mb-8 max-w-sm">
                  We couldn't find any businesses matching your filters. Try clearing some options or searching with different keywords.
                </p>
                <Link href="/businesses" className="h-12 px-8 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center hover:bg-black transition-all">
                  Clear All Filters
                </Link>
              </div>
            )}

            {/* Grid of Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {businesses.map((b: any, idx) => {
                const cityName = b.cityId?.name || "";
                const stateName = b.stateId?.name || "";
                const location = [cityName, stateName].filter(Boolean).join(", ");
                const firstImage = b.cardImages?.[0] || b.logoUrl || "";

                return (
                  <div 
                    key={b._id.toString()}
                    className="group bg-white rounded-[32px] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full animate-fadeInUp"
                    style={{ animationDelay: `${(idx % 12) * 40}ms`, animationFillMode: "both" }}
                  >
                    {/* Card Header: Image */}
                    <div className="relative h-64 overflow-hidden bg-slate-100">
                      {firstImage ? (
                        <img 
                          src={firstImage} 
                          alt={b.businessName} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="h-16 w-16 text-slate-200" />
                        </div>
                      )}
                      
                      {/* Badge Over Image */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white text-[10px] font-black uppercase tracking-widest text-emerald-600 shadow-sm">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </span>
                      </div>

                      <div className="absolute bottom-4 right-4 h-12 w-12 rounded-2xl bg-white/90 backdrop-blur-md p-2 shadow-xl border border-white">
                        <img src={b.logoUrl || "/placeholder-logo.png"} alt="logo" className="w-full h-full object-contain" />
                      </div>
                    </div>

                    {/* Card Body: Info */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex-1 mb-6">
                        <div className="flex items-start justify-between gap-2 mb-2">
                           <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight line-clamp-1">
                            {b.businessName}
                          </h3>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                          {b.ownerName || "Premium Partner"}
                        </p>
                        
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500">
                            <MapPin className="h-4 w-4 text-orange-400" />
                            {location || "Global Business"}
                          </div>
                          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>Active Since {new Date(b.createdAt).getFullYear()}</span>
                          </div>
                        </div>
                      </div>

                      {/* HSN Chips */}
                      {b.hsnCodes?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {b.hsnCodes.slice(0, 3).map((h: any) => (
                            <span key={h.code} className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider">
                              #{h.code}
                            </span>
                          ))}
                          {b.hsnCodes.length > 3 && (
                            <span className="text-[10px] font-bold text-slate-300">+{b.hsnCodes.length - 3} more</span>
                          )}
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="flex items-center gap-3 pt-6 border-t border-slate-100 mt-auto">
                        <Link href={`/business/${b.slug}`} className="flex-1">
                          <button className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all hover:scale-[1.02]">
                             View Details
                          </button>
                        </Link>
                        <a href={`tel:${b.mobiles?.[0]}`} className="h-12 w-12 rounded-2xl border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                          <PhoneCall className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Area */}
            {totalPages > 1 && (
              <div className="mt-16 flex flex-col items-center gap-6">
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/businesses?q=${q}&hsn=${hsn}&country=${country}&state=${state}&city=${city}&pincode=${pincode}&sort=${sort}&page=${Math.max(1, page - 1)}`}
                    className={`h-12 w-12 flex items-center justify-center rounded-2xl border border-slate-200 bg-white transition-all ${page === 1 ? 'opacity-30 pointer-events-none' : 'hover:border-primary hover:text-primary shadow-sm'}`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Link>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .reduce<(number | "...")[]>((acc, p, i, arr) => {
                        if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((item, i) =>
                        item === "..." ? (
                          <span key={`ellipsis-${i}`} className="w-10 h-12 flex items-center justify-center text-slate-300 font-bold">...</span>
                        ) : (
                          <Link
                            key={item}
                            href={`/businesses?q=${q}&hsn=${hsn}&country=${country}&state=${state}&city=${city}&pincode=${pincode}&sort=${sort}&page=${item}`}
                            className={`h-12 w-12 flex items-center justify-center rounded-2xl font-black text-sm transition-all ${
                              item === page
                                ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-110"
                                : "bg-white border border-slate-200 text-slate-400 hover:border-primary hover:text-primary"
                            }`}
                          >
                            {item}
                          </Link>
                        )
                      )}
                  </div>

                  <Link 
                    href={`/businesses?q=${q}&hsn=${hsn}&country=${country}&state=${state}&city=${city}&pincode=${pincode}&sort=${sort}&page=${Math.min(totalPages, page + 1)}`}
                    className={`h-12 w-12 flex items-center justify-center rounded-2xl border border-slate-200 bg-white transition-all ${page === totalPages ? 'opacity-30 pointer-events-none' : 'hover:border-primary hover:text-primary shadow-sm'}`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Page {page} of {totalPages}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
