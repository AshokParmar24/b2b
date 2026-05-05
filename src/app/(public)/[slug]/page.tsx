import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  MapPin,
  PhoneCall,
  Globe,
  Mail,
  Box,
  ShieldCheck,
  Building2,
  MessageCircle,
  ChevronLeft,
  Clock,
  Tag,
  ExternalLink,
  Copy,
} from "lucide-react";
import { PublicNav } from "@/components/layouts/public/PublicNav";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import dbConnect from "@/lib/dbConnect";
import Business from "@/models/Business";
import Country from "@/models/Country";
import State from "@/models/State";
import City from "@/models/City";
import Pincode from "@/models/Pincode";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getBusiness(slug: string) {
  await dbConnect();
  void Country; void State; void City; void Pincode;

  return Business.findOne({ slug, isActive: true })
    .populate("countryId", "name flag phoneCode")
    .populate("stateId", "name")
    .populate("cityId", "name")
    .populate("pincodeId", "pincode area")
    .lean() as Promise<any>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const b = await getBusiness(slug);
  if (!b) return { title: "Business Not Found" };

  const city = b.cityId?.name || "";
  const state = b.stateId?.name || "";
  const location = [city, state].filter(Boolean).join(", ");

  return {
    title: `${b.businessName} — ${SITE_NAME}`,
    description: `Contact ${b.businessName} (${b.ownerName}) in ${location}. View HSN codes, phone numbers & business details on ${SITE_NAME}.`,
    openGraph: {
      title: `${b.businessName} | ${SITE_NAME}`,
      description: `Verified business listing of ${b.businessName}.`,
      images: b.cardImages?.[0] ? [b.cardImages[0]] : [],
    },
  };
}

export default async function BusinessProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const b = await getBusiness(slug);
  if (!b) notFound();

  const city = b.cityId?.name || "";
  const state = b.stateId?.name || "";
  const country = b.countryId?.name || "";
  const pincode = b.pincodeId?.pincode || "";
  const area = b.pincodeId?.area || "";
  const location = [city, state, country].filter(Boolean).join(", ");
  const heroImage = b.cardImages?.[0] || b.logoUrl || "";
  const fullAddress = [b.address, area, city, pincode, state, country]
    .filter(Boolean)
    .join(", ");

  const cleanWebsite = b.website?.replace(/^https?:\/\//, "") || "";

  return (
    <main className="pub-dark">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: b.businessName,
            image: b.cardImages,
            "@id": `${SITE_URL}/business/${b.slug}`,
            url: `${SITE_URL}/business/${b.slug}`,
            telephone: b.mobiles?.[0],
            email: b.email || undefined,
            address: {
              "@type": "PostalAddress",
              streetAddress: b.address,
              addressLocality: city,
              addressRegion: state,
              postalCode: pincode,
              addressCountry: country,
            },
          }),
        }}
      />

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="blob-float absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-purple-600/6 blur-3xl" />
        <div className="blob-float absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-3xl" style={{ animationDelay: "6s" }} />
      </div>

      {/* ── Nav ── */}

      {/* ── Hero Banner ── */}
      <div className="relative h-52 sm:h-64 md:h-80 w-full overflow-hidden">
        {/* bg layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-indigo-950" />

        {/* hero image */}
        {heroImage && (
          <img
            src={heroImage}
            alt={b.businessName}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04050f] via-black/40 to-transparent" />

        {/* Back button on mobile */}
        <Link
          href="/businesses"
          className="absolute top-4 left-4 sm:hidden flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-black/40 backdrop-blur-sm border border-white/10 px-3 py-2 rounded-full hover:bg-white/10 transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </Link>
      </div>

      {/* ── Identity bar (overlaps hero) ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="-mt-16 sm:-mt-20 md:-mt-24 mb-8 sm:mb-10 flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 animate-fadeInUp">
          {/* Logo avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden bg-slate-900 border-4 border-slate-800 shadow-2xl">
              {b.logoUrl ? (
                <img
                  src={b.logoUrl}
                  alt={`${b.businessName} logo`}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-slate-600" />
                </div>
              )}
            </div>
            {/* Verified dot */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          {/* Name + location */}
          <div className="flex-1 min-w-0 pb-1">
            <div className="badge-verified stat-pill w-fit mb-2.5 text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
              <ShieldCheck className="w-3 h-3" /> GST Verified Business
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight line-clamp-2">
              {b.businessName}
            </h1>
            {location && (
              <p className="flex items-center gap-1.5 text-sm text-slate-400 mt-1.5">
                <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                {location}
              </p>
            )}
          </div>
        </div>

        {/* ── Main content + sidebar ── */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 pb-20">

          {/* ── Left: Details ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Quick stats bar */}
            <div className="glass-card p-4 sm:p-5">
              <div className="flex flex-wrap gap-4 sm:gap-6 divide-x divide-white/6">
                {b.ownerName && (
                  <div className="flex-1 min-w-[120px]">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Contact Person</p>
                    <p className="text-sm font-bold text-white">{b.ownerName}</p>
                  </div>
                )}
                {b.gstNumber && (
                  <div className="flex-1 min-w-[140px] pl-4 sm:pl-6">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">GST Number</p>
                    <p className="text-sm font-mono font-bold text-white tracking-wider">{b.gstNumber}</p>
                  </div>
                )}
                {b.hsnCodes?.length > 0 && (
                  <div className="flex-1 min-w-[100px] pl-4 sm:pl-6">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">HSN Codes</p>
                    <p className="text-sm font-bold text-white">{b.hsnCodes.length} listed</p>
                  </div>
                )}
                {b.mobiles?.length > 0 && (
                  <div className="flex-1 min-w-[100px] pl-4 sm:pl-6">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Phone Numbers</p>
                    <p className="text-sm font-bold text-white">{b.mobiles.length} contact{b.mobiles.length !== 1 ? "s" : ""}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Business information */}
            <section className="glass-card p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-base font-bold text-white mb-5 pb-3 border-b border-white/6">
                <Building2 className="w-4 h-4 text-purple-400" />
                Business Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {b.ownerName && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Contact Person</p>
                    <p className="text-sm font-semibold text-white">{b.ownerName}</p>
                  </div>
                )}
                {b.gstNumber && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">GST Number</p>
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/8 rounded-lg px-3 py-1.5">
                      <span className="text-sm font-mono font-bold text-white tracking-wider">{b.gstNumber}</span>
                    </div>
                  </div>
                )}
                {fullAddress && (
                  <div className="sm:col-span-2">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Address</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{fullAddress}</p>
                  </div>
                )}
                {b.email && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Email</p>
                    <a href={`mailto:${b.email}`} className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                      {b.email}
                    </a>
                  </div>
                )}
                {b.website && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Website</p>
                    <a
                      href={b.website.startsWith("http") ? b.website : `https://${b.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {cleanWebsite} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </section>

            {/* HSN Codes */}
            {b.hsnCodes?.length > 0 && (
              <section className="glass-card p-5 sm:p-6">
                <h2 className="flex items-center gap-2 text-base font-bold text-white mb-5 pb-3 border-b border-white/6">
                  <Tag className="w-4 h-4 text-purple-400" />
                  Authorized HSN Codes
                  <span className="ml-auto text-xs font-semibold text-slate-500 bg-white/5 px-2.5 py-1 rounded-full">
                    {b.hsnCodes.length} codes
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {b.hsnCodes.map((h: any) => (
                    <div
                      key={h.code}
                      className="flex gap-3.5 p-3.5 rounded-xl bg-white/4 border border-white/6 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-200"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
                        <Box className="w-4.5 h-4.5 text-purple-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-white tracking-wide">{h.code}</p>
                        {h.productName && (
                          <p className="text-xs font-semibold text-purple-300 mt-0.5 line-clamp-1">{h.productName}</p>
                        )}
                        {h.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{h.description}</p>
                        )}
                        {h.unit && (
                          <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-white/5 px-2 py-0.5 rounded">
                            {h.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery */}
            {b.cardImages?.length > 0 && (
              <section className="glass-card p-5 sm:p-6">
                <h2 className="flex items-center gap-2 text-base font-bold text-white mb-5 pb-3 border-b border-white/6">
                  <Building2 className="w-4 h-4 text-purple-400" />
                  Product Catalog &amp; Business Cards
                  <span className="ml-auto text-xs font-semibold text-slate-500 bg-white/5 px-2.5 py-1 rounded-full">
                    {b.cardImages.length} image{b.cardImages.length !== 1 ? "s" : ""}
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {b.cardImages.map((img: string, idx: number) => (
                    <a
                      key={idx}
                      href={img}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative aspect-[4/3] block rounded-xl overflow-hidden bg-slate-900 border border-white/6 hover:border-purple-500/40 transition-all"
                    >
                      <img
                        src={img}
                        alt={`Card ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs font-bold text-white bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <ExternalLink className="w-3 h-3" /> View
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Right: Contact Card (sticky) ── */}
          <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0">
            <div className="glass-card p-5 sm:p-6 sticky top-24">
              <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-5 pb-3 border-b border-white/6">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                Contact Business
              </h3>

              {/* Phone numbers */}
              {b.mobiles?.length > 0 && (
                <div className="space-y-2.5 mb-4">
                  {b.mobiles.map((mobile: string, i: number) => (
                    <a
                      key={mobile}
                      href={`tel:${mobile}`}
                      className="group flex items-center justify-between p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15 hover:bg-emerald-500/15 hover:border-emerald-500/35 transition-all"
                    >
                      <div>
                        {i === 0 && (
                          <p className="text-[10px] uppercase tracking-wider text-emerald-500/70 font-bold mb-0.5">Primary</p>
                        )}
                        <span className="text-sm font-bold text-emerald-400 tracking-wide">{mobile}</span>
                      </div>
                      <PhoneCall className="w-4 h-4 text-emerald-500 transition-transform group-hover:scale-110 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              )}

              {/* WhatsApp */}
              {b.whatsapp && (
                <a
                  href={`https://wa.me/${b.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-green-500/8 border border-green-500/15 hover:bg-green-500/15 hover:border-green-500/35 transition-all mb-4"
                >
                  <MessageCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-green-500/70 font-bold mb-0.5">WhatsApp</p>
                    <span className="text-sm font-bold text-green-400">{b.whatsapp}</span>
                  </div>
                </a>
              )}

              {/* Email */}
              {b.email && (
                <a
                  href={`mailto:${b.email}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-white/6 hover:bg-white/5 hover:border-white/12 transition-all mb-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <span className="text-sm text-slate-300 truncate">{b.email}</span>
                </a>
              )}

              {/* Website */}
              {b.website && (
                <a
                  href={b.website.startsWith("http") ? b.website : `https://${b.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-white/6 hover:bg-white/5 hover:border-white/12 transition-all mb-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <span className="text-sm text-slate-300 truncate">{cleanWebsite}</span>
                  <ExternalLink className="w-3 h-3 text-slate-600 flex-shrink-0" />
                </a>
              )}

              {/* Primary CTA */}
              {b.mobiles?.[0] && (
                <a
                  href={`tel:${b.mobiles[0]}`}
                  className="btn-glow flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm"
                >
                  <PhoneCall className="w-4 h-4" /> Call Now
                </a>
              )}

              {b.whatsapp && (
                <a
                  href={`https://wa.me/${b.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 mt-2.5 rounded-xl font-bold text-sm bg-green-600/20 hover:bg-green-600/35 border border-green-500/25 hover:border-green-500/50 text-green-400 transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              )}

              <p className="mt-4 text-center text-[10px] text-slate-600">
                Listed on {SITE_NAME} · Verified Business
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
