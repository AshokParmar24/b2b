import Link from "next/link";
import { Search, MapPin, Building2, PhoneCall, Verified, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { SITE_NAME } from "@/lib/site-config";

export default function PublicBusinessesPage() {
  const dummyListings = [
    { slug: "stark-industries", name: "Stark Industries", location: "Mumbai, Maharashtra", hsn: ["8484", "8544"], src: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80" },
    { slug: "acme-corp", name: "Acme Corp Ltd.", location: "Ahmedabad, Gujarat", hsn: ["6908", "6907"], src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" },
    { slug: "globe-logistics", name: "Globe Logistics", location: "New York, USA", hsn: ["8708"], src: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&q=80" },
  ];

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "var(--bg-dark)" }}>
      {/* Public Navbar Component - Simplified */}
      <nav style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", background: "rgba(10,10,20,0.6)", backdropFilter: "blur(24px)", position: "sticky", top: 0, zIndex: 50, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "76px" }}>
        <Link href="/" className="flex items-center gap-3 text-decoration-none">
          <Logo width={36} height={36} />
          <span className="text-2xl font-black gradient-text">{SITE_NAME}</span>
        </Link>
        <div className="flex gap-4">
          <Link href="/login"><Button variant="ghost" className="text-purple-400">Log In</Button></Link>
          <Link href="/register"><button className="btn-glow px-6 py-2.5 text-sm rounded-lg">List Business</button></Link>
        </div>
      </nav>

      <div className="flex-1 flex max-w-[1400px] w-full mx-auto px-6 py-8 gap-8">
        {/* Sidebar Filters */}
        <aside className="w-72 hidden md:block flex-shrink-0 animate-fadeInUp">
          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" /> Filters
          </h2>

          <div className="space-y-6">
            <div className="p-5 rounded-xl border border-gray-800 bg-white/5">
              <h3 className="text-sm font-bold text-gray-300 mb-3">Location</h3>
              <input type="text" placeholder="Search City or State..." className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white mb-3 outline-none focus:border-purple-500" />
            </div>

            <div className="p-5 rounded-xl border border-gray-800 bg-white/5">
              <h3 className="text-sm font-bold text-gray-300 mb-3">HSN Code Matrix</h3>
              <input type="text" placeholder="Type HSN e.g. 6908" className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white mb-3 outline-none focus:border-purple-500" />
            </div>

            <button className="w-full py-3 bg-white/10 hover:bg-white/15 text-white rounded-lg text-sm font-semibold transition-colors">
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Main Grid */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <div className="relative animate-fadeInUp">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by exact business name or owner..."
              className="w-full pl-12 pr-4 py-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500 border border-gray-800 bg-black/50"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <p>Showing <b>{dummyListings.length}</b> verified businesses</p>
          </div>

          {/* Directory Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
            {dummyListings.map((b) => (
              <div key={b.slug} className="glass-card overflow-hidden group flex flex-col hover:border-purple-500/50 transition-all cursor-pointer">
                {/* Hero Banner inside Card */}
                <div className="h-40 relative w-full overflow-hidden">
                  <div className="absolute inset-0 bg-black/40 z-10 hidden group-hover:block transition-all" />
                  <img src={b.src} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 z-20">
                    <span className="bg-green-500/90 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg">
                      <Verified className="w-3 h-3" /> Verified Dealer
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-white flex items-center gap-2 mb-1">
                    {b.name}
                  </h3>
                  <p className="text-gray-400 text-sm flex items-center gap-1 mb-4">
                    <MapPin className="w-4 h-4 text-orange-400" /> {b.location}
                  </p>

                  <div className="flex gap-2 mb-6">
                    {b.hsn.map(code => (
                      <span key={code} className="bg-purple-500/10 border border-purple-500/20 text-purple-300 px-2 py-1 flex items-center gap-1 text-xs rounded font-semibold">
                        HSN {code}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex gap-3">
                    <Link href={`/business/${b.slug}`} className="flex-1">
                      <button className="w-full bg-white/10 hover:bg-white/20 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                        <Building2 className="w-4 h-4" /> View Profile
                      </button>
                    </Link>
                    <button className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2.5 transition-colors flex items-center justify-center shadow-lg shadow-green-500/20">
                      <PhoneCall className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
