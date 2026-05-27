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
  Share2,
  Calendar,
  Building,
  ArrowRight
} from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import { cn } from "@/lib/utils";
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
    title: `${b.businessName} — Verified Partner on ${SITE_NAME}`,
    description: `Official profile of ${b.businessName}. Verified GST and HSN listed business in ${location}. Contact now for inquiries.`,
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
    <main className="min-h-screen bg-[#f8fafc] pb-20">
      
      {/* ── 🎭 PREMIUM HERO SECTION ── */}
      <div className="relative h-[300px] sm:h-[350px] lg:h-[400px] w-full bg-slate-900 overflow-hidden">
        {heroImage && (
          <img
            src={heroImage}
            alt={b.businessName}
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-slate-900/60 to-slate-900/20" />
        
        <div className="absolute top-8 left-8">
          <Link
            href="/businesses"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold hover:bg-white/20 transition-all"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Directory
          </Link>
        </div>
      </div>

      {/* ── 🚀 IDENTITY CARD (Overlapping) ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-32 relative z-10">
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl shadow-slate-200/60 p-6 sm:p-10 flex flex-col md:flex-row items-center md:items-end gap-8">
            
            {/* Logo Wrapper */}
            <div className="relative shrink-0 group">
              <div className="absolute -inset-2 bg-primary/10 rounded-[36px] blur-2xl group-hover:bg-primary/20 transition-all" />
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-[32px] bg-white border-2 border-slate-50 overflow-hidden shadow-xl flex items-center justify-center p-4">
                {b.logoUrl ? (
                  <img src={b.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Building2 className="h-16 w-16 text-slate-100" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-emerald-500 border-4 border-white flex items-center justify-center text-white shadow-lg">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>

            {/* Name and Basic Info */}
            <div className="flex-1 text-center md:text-left space-y-3 pb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="h-3 w-3" /> Verified Partner
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {b.businessName}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 font-bold text-sm">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-orange-400" />
                  {location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  Since {new Date(b.createdAt).getFullYear()}
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
              <a href={`tel:${b.mobiles?.[0]}`} className="h-14 px-8 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                <PhoneCall className="h-5 w-5" /> Call Now
              </a>
              <button className="h-14 px-8 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-white hover:border-primary/20 hover:text-primary transition-all flex items-center justify-center gap-3">
                <Share2 className="h-4 w-4" /> Share Profile
              </button>
            </div>
          </div>
        </div>

        {/* ── 📚 MAIN CONTENT GRID ── */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Business Details (Read-Only) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Business Info Section */}
            <section className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Building className="h-4 w-4" />
                </div>
                Company Credentials
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <InfoItem label="Owner/Representative" value={b.ownerName} icon={Globe} />
                <InfoItem label="GST Registration" value={b.gstNumber} icon={ShieldCheck} isMono />
                <InfoItem label="Operational Address" value={fullAddress} icon={MapPin} isFullWidth />
                <InfoItem label="Official Website" value={cleanWebsite} icon={ExternalLink} isLink href={b.website} />
                <InfoItem label="Email Correspondence" value={b.email} icon={Mail} isLink href={`mailto:${b.email}`} />
              </div>
            </section>

            {/* HSN Codes Section */}
            {b.hsnCodes?.length > 0 && (
              <section className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500">
                      <Tag className="h-4 w-4" />
                    </div>
                    Market Segments (HSN)
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase text-slate-400">
                    {b.hsnCodes.length} Categories
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {b.hsnCodes.map((h: any) => (
                    <div key={h.code} className="group p-5 rounded-2xl bg-slate-50 border border-transparent hover:border-primary/20 hover:bg-white transition-all">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                          <Box className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-black text-slate-900 tracking-tight">{h.code}</p>
                          {h.productName && <p className="text-xs font-bold text-primary mt-0.5">{h.productName}</p>}
                          {h.description && <p className="text-xs text-slate-500 mt-2 leading-relaxed">{h.description}</p>}
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT: High-End Contact Widget */}
          <div className="space-y-8">
            <section className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl shadow-slate-900/20 sticky top-10">
              <h3 className="text-lg font-black mb-8 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-primary">
                  <PhoneCall className="h-4 w-4" />
                </div>
                Contact Desk
              </h3>
              
              <div className="space-y-4">
                {b.mobiles?.map((m: string, i: number) => (
                  <a key={m} href={`tel:${m}`} className="group block p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1.5">{i === 0 ? "Primary Mobile" : "Secondary Contact"}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black tracking-tight">{m}</span>
                      <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <PhoneCall className="h-4 w-4" />
                      </div>
                    </div>
                  </a>
                ))}

                {b.whatsapp && (
                  <a href={`https://wa.me/${b.whatsapp.replace(/[^0-9]/g, "")}`} className="group block p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500 transition-all">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1.5">WhatsApp Inquiry</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-emerald-400 tracking-tight">{b.whatsapp}</span>
                      <div className="h-8 w-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                    </div>
                  </a>
                )}
              </div>

              <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-white/5 text-center">
                <p className="text-xs font-bold text-slate-400 mb-2">Need bulk pricing?</p>
                <button className="w-full py-3 rounded-xl bg-white text-slate-900 font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all">
                  Request A Quote
                </button>
              </div>

              <p className="mt-6 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Protected by {SITE_NAME}
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoItem({ label, value, icon: Icon, isMono = false, isFullWidth = false, isLink = false, href = "" }: { label: string; value: string; icon: any; isMono?: boolean; isFullWidth?: boolean; isLink?: boolean; href?: string }) {
  if (!value) return null;
  const content = (
    <div className={cn("space-y-1.5", isFullWidth ? "sm:col-span-2" : "")}>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
        <Icon className="h-3 w-3 text-primary/60" /> {label}
      </p>
      {isLink ? (
        <a href={href} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
          {value} <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <p className={cn("text-sm font-bold text-slate-700", isMono ? "font-mono tracking-wider" : "")}>
          {value}
        </p>
      )}
    </div>
  );
  return content;
}
