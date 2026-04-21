import Link from "next/link";
import {
  MapPin,
  PhoneCall,
  Globe,
  Mail,
  Box,
  ShieldCheck,
  ChevronLeft,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

export default async function BusinessProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Mock data representing a fetched Business document
  const b = {
    name: "Stark Industries",
    slug: slug,
    owner: "Tony Stark",
    gst: "22AAAAA0000A1Z5",
    address: "Stark Tower, 200 Park Avenue, Manhattan",
    location: "New York, USA",
    mobiles: ["+1 9876543210", "+1 3334445555"],
    email: "contact@starkindustries.com",
    website: "https://starkindustries.com",
    hsnCodes: [
      { code: "8484", desc: "Mechanical seals and parts" },
      { code: "8544", desc: "Insulated wire, cable" },
    ],
    images: [
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
    ],
  };

  return (
    <main className="min-h-screen pb-20" style={{ background: "var(--bg-dark)" }}>
      {/* Public Navbar Component */}
      <nav
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          background: "rgba(10,10,20,0.6)",
          backdropFilter: "blur(24px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "76px",
        }}
      >
        <Link href="/" className="text-decoration-none flex items-center gap-3">
          <Logo width={36} height={36} />
          <span className="gradient-text text-2xl font-black">{SITE_NAME}</span>
        </Link>
        <Link href="/businesses">
          <Button variant="ghost" className="gap-2 text-gray-300">
            <ChevronLeft className="h-4 w-4" /> Back to Directory
          </Button>
        </Link>
      </nav>

      {/* Hero Header */}
      <div className="relative h-64 w-full overflow-hidden bg-black/80 md:h-80">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <img
          src={b.images[0]}
          alt="Hero"
          className="absolute inset-0 h-full w-full object-cover opacity-50 blur-sm"
        />

        <div className="relative z-20 mx-auto flex h-full max-w-6xl items-end px-6 pb-10">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                name: b.name,
                image: b.images,
                "@id": `${SITE_URL}/business/${b.slug}`,
                url: `${SITE_URL}/business/${b.slug}`,
                telephone: b.mobiles[0],
                address: {
                  "@type": "PostalAddress",
                  streetAddress: b.address,
                  addressLocality: b.location,
                },
              }),
            }}
          />
          <div className="flex items-end gap-6">
            {/* Logo Box */}
            <div className="group relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border-4 border-gray-900 bg-black/80 shadow-2xl md:h-40 md:w-40">
              <Building2 className="h-16 w-16 text-gray-600 transition-transform group-hover:scale-110" />
            </div>

            <div className="mb-2">
              <span className="mb-3 flex w-fit items-center gap-1.5 rounded-sm border border-green-500/30 bg-green-500/20 px-2.5 py-1 text-xs font-bold text-green-400 shadow-lg shadow-green-900/20">
                <ShieldCheck className="h-3.5 w-3.5" /> GS1 Verified Dealer
              </span>
              <h1 className="mb-2 text-4xl font-black tracking-tight text-white md:text-5xl">
                {b.name}
              </h1>
              <p className="flex items-center gap-2 text-lg font-medium text-gray-300">
                <MapPin className="h-4 w-4 text-orange-400" /> {b.location}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:flex-row">
        {/* Left Column (Main Info) */}
        <div className="flex-1 space-y-8">
          {/* About Contact Box */}
          <section className="glass-card relative overflow-hidden p-8">
            <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />
            <h2 className="mb-6 border-b border-gray-800 pb-4 text-xl font-bold text-white">
              Business Information
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <p className="mb-1 text-sm text-gray-500">Contact Person</p>
                <p className="text-lg font-semibold text-white">{b.owner}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-gray-500">GST Number</p>
                <p className="w-fit rounded border border-gray-800 bg-white/5 px-3 py-1 font-semibold tracking-widest text-white">
                  {b.gst}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="mb-1 text-sm text-gray-500">Full Address</p>
                <p className="max-w-md leading-relaxed text-gray-300">{b.address}</p>
              </div>
            </div>
          </section>

          {/* HSN Codes */}
          <section className="glass-card p-8">
            <h2 className="mb-6 border-b border-gray-800 pb-4 text-xl font-bold text-white">
              Authorized Products (HSN)
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {b.hsnCodes.map((hsn) => (
                <div
                  key={hsn.code}
                  className="flex gap-4 rounded-xl border border-gray-800 bg-black/30 p-4 transition-colors hover:border-purple-500/50"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-900/30">
                    <Box className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold tracking-wide text-white">{hsn.code}</p>
                    <p className="mt-1 text-sm leading-tight text-gray-400">{hsn.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Virtual Gallery */}
          <section className="glass-card p-8">
            <h2 className="mb-6 border-b border-gray-800 pb-4 text-xl font-bold text-white">
              Product Catalog & Cards
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {b.images.map((img, idx) => (
                <a
                  key={idx}
                  href={img}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-xl border border-gray-800"
                >
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="rounded-full border border-white/30 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-md">
                      View Full
                    </span>
                  </div>
                  <img
                    src={img}
                    alt={`Catalog ${idx}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (Sticky Contact Action) */}
        <aside className="w-full flex-shrink-0 lg:w-80">
          <div className="glass-card sticky top-[100px] p-6">
            <h3 className="mb-6 flex items-center gap-2 font-bold text-white">
              <PhoneCall className="h-4 w-4 text-green-400" /> Direct Contact
            </h3>

            <div className="mb-8 space-y-4">
              {b.mobiles.map((mobile) => (
                <a
                  key={mobile}
                  href={`tel:${mobile}`}
                  className="group flex items-center justify-between rounded-lg border border-green-500/20 bg-green-500/10 p-3 transition-colors hover:bg-green-500/20"
                >
                  <span className="text-lg font-bold tracking-wide text-green-400">{mobile}</span>
                  <PhoneCall className="h-4 w-4 text-green-500 transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>

            <div className="space-y-4 border-t border-gray-800 pt-6">
              {b.email && (
                <a
                  href={`mailto:${b.email}`}
                  className="flex items-center gap-3 text-gray-300 transition-colors hover:text-white"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/5">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="truncate text-sm">{b.email}</span>
                </a>
              )}
              {b.website && (
                <a
                  href={b.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-gray-300 transition-colors hover:text-white"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/5">
                    <Globe className="h-4 w-4" />
                  </div>
                  <span className="truncate text-sm">{b.website.replace("https://", "")}</span>
                </a>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
