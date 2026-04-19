import Link from "next/link";
import { MapPin, PhoneCall, Globe, Mail, Box, ShieldCheck, ChevronLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";

export default async function BusinessProfilePage({ params }: { params: Promise<{ slug: string }> }) {
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
      { code: "8544", desc: "Insulated wire, cable" }
    ],
    images: [
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80"
    ]
  };

  return (
    <main className="min-h-screen pb-20" style={{ background: "var(--bg-dark)" }}>
      {/* Public Navbar Component */}
      <nav style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", background: "rgba(10,10,20,0.6)", backdropFilter: "blur(24px)", position: "sticky", top: 0, zIndex: 50, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "76px" }}>
        <Link href="/" className="flex items-center gap-3 text-decoration-none">
          <Logo width={36} height={36} />
          <span className="text-2xl font-black gradient-text">VyapaarBiz</span>
        </Link>
        <Link href="/businesses">
          <Button variant="ghost" className="text-gray-300 gap-2"><ChevronLeft className="w-4 h-4"/> Back to Directory</Button>
        </Link>
      </nav>

      {/* Hero Header */}
      <div className="w-full h-64 md:h-80 relative overflow-hidden bg-black/80">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
        <img src={b.images[0]} alt="Hero" className="w-full h-full object-cover blur-sm opacity-50 absolute inset-0" />
        
     <div className="max-w-6xl mx-auto px-6 h-full relative z-20 flex items-end pb-10">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": b.name,
                "image": b.images,
                "@id": `https://vyapaarbiz.com/business/${b.slug}`,
                "url": `https://vyapaarbiz.com/business/${b.slug}`,
                "telephone": b.mobiles[0],
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": b.address,
                  "addressLocality": b.location
                }
              })
            }}
          />
          <div className="flex gap-6 items-end">
             {/* Logo Box */}
             <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-gray-900 bg-black/80 flex items-center justify-center overflow-hidden shadow-2xl relative group">
                <Building2 className="w-16 h-16 text-gray-600 group-hover:scale-110 transition-transform" />
             </div>
             
             <div className="mb-2">
               <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2.5 py-1 rounded-sm border border-green-500/30 flex items-center gap-1.5 mb-3 w-fit shadow-lg shadow-green-900/20">
                 <ShieldCheck className="w-3.5 h-3.5" /> GS1 Verified Dealer
               </span>
               <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">{b.name}</h1>
               <p className="text-gray-300 font-medium text-lg flex items-center gap-2">
                 <MapPin className="w-4 h-4 text-orange-400" /> {b.location}
               </p>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column (Main Info) */}
        <div className="flex-1 space-y-8">
          
          {/* About Contact Box */}
          <section className="glass-card p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
             <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Business Information</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                 <p className="text-gray-500 text-sm mb-1">Contact Person</p>
                 <p className="font-semibold text-lg text-white">{b.owner}</p>
               </div>
               <div>
                 <p className="text-gray-500 text-sm mb-1">GST Number</p>
                 <p className="font-semibold text-white tracking-widest bg-white/5 py-1 px-3 rounded w-fit border border-gray-800">{b.gst}</p>
               </div>
               <div className="md:col-span-2">
                 <p className="text-gray-500 text-sm mb-1">Full Address</p>
                 <p className="text-gray-300 leading-relaxed max-w-md">{b.address}</p>
               </div>
             </div>
          </section>

          {/* HSN Codes */}
          <section className="glass-card p-8">
             <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Authorized Products (HSN)</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {b.hsnCodes.map((hsn) => (
                 <div key={hsn.code} className="flex gap-4 p-4 rounded-xl bg-black/30 border border-gray-800 hover:border-purple-500/50 transition-colors">
                   <div className="w-12 h-12 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0 border border-purple-500/30">
                     <Box className="w-6 h-6 text-purple-400" />
                   </div>
                   <div>
                     <p className="font-bold text-white text-lg tracking-wide">{hsn.code}</p>
                     <p className="text-gray-400 text-sm leading-tight mt-1">{hsn.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
          </section>
          
          {/* Virtual Gallery */}
          <section className="glass-card p-8">
             <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Product Catalog & Cards</h2>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {b.images.map((img, idx) => (
                 <a key={idx} href={img} target="_blank" rel="noreferrer" className="aspect-square rounded-xl overflow-hidden border border-gray-800 group relative block">
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                     <span className="text-white text-sm font-bold border border-white/30 px-3 py-1.5 rounded-full backdrop-blur-md">View Full</span>
                   </div>
                   <img src={img} alt={`Catalog ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 </a>
               ))}
             </div>
          </section>

        </div>

        {/* Right Column (Sticky Contact Action) */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="glass-card p-6 sticky top-[100px]">
            <h3 className="font-bold text-white mb-6 items-center flex gap-2"><PhoneCall className="w-4 h-4 text-green-400"/> Direct Contact</h3>
            
            <div className="space-y-4 mb-8">
              {b.mobiles.map(mobile => (
                <a key={mobile} href={`tel:${mobile}`} className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors group">
                  <span className="font-bold text-green-400 tracking-wide text-lg">{mobile}</span>
                  <PhoneCall className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-800">
               {b.email && (
                 <a href={`mailto:${b.email}`} className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0"><Mail className="w-4 h-4" /></div>
                   <span className="text-sm truncate">{b.email}</span>
                 </a>
               )}
               {b.website && (
                 <a href={b.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0"><Globe className="w-4 h-4" /></div>
                   <span className="text-sm truncate">{b.website.replace("https://", "")}</span>
                 </a>
               )}
            </div>

          </div>
        </aside>

      </div>
    </main>
  );
}
