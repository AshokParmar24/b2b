import Link from "next/link";
import { Search, MapPin, Building2, PhoneCall, Verified } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; hsn?: string }>;
}) {
  const { q, hsn: hsnParam } = await searchParams;
  const query = q || "";
  const hsn = hsnParam || "";
  
  // Dummy Results representing server DB fetch
  const results = [
    { slug: "acme-corp", name: "Acme Corp Ltd.", location: "Ahmedabad, Gujarat", hsn: ["6908", "6907"], src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" },
  ];

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "var(--bg-dark)" }}>
      {/* Public Navbar Component - Simplified */}
      <nav style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", background: "rgba(10,10,20,0.6)", backdropFilter: "blur(24px)", position: "sticky", top: 0, zIndex: 50, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "76px" }}>
        <Link href="/" className="flex items-center gap-3 text-decoration-none">
          <Logo width={36} height={36} />
          <span className="text-2xl font-black gradient-text">VyapaarBiz</span>
        </Link>
        <Link href="/businesses">
          <Button variant="ghost" className="text-purple-400">View All Businesses</Button>
        </Link>
      </nav>

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <div className="mb-10 animate-fadeInUp text-center">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
            Search Results for <span className="gradient-text">"{query || hsn || "Everything"}"</span>
          </h1>
          <p className="text-gray-400">Found {results.length} active global business listing based on your search criteria.</p>
        </div>

        <form action="/search" method="GET" className="relative animate-fadeInUp mb-12 max-w-2xl mx-auto">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
           <input 
             name="q"
             type="text" 
             defaultValue={query}
             placeholder="Try a new search string..." 
             className="w-full pl-12 pr-32 py-4 rounded-xl text-white outline-none border border-gray-800 bg-black/50 focus:border-purple-500"
           />
           <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-glow px-6 py-2 rounded-lg text-sm">Update</button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeInUp">
            {results.map((b) => (
              <div key={b.slug} className="glass-card overflow-hidden group flex flex-col hover:border-purple-500/50 transition-all cursor-pointer">
                <div className="h-48 relative w-full overflow-hidden">
                  <div className="absolute inset-0 bg-black/40 z-10 hidden group-hover:block transition-all" />
                  <img src={b.src} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 z-20">
                    <span className="bg-green-500/90 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg">
                      <Verified className="w-3 h-3" /> Verified Match
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-white flex items-center gap-2 mb-1">{b.name}</h3>
                  <p className="text-gray-400 text-sm flex items-center gap-1 mb-4"><MapPin className="w-4 h-4 text-orange-400" /> {b.location}</p>

                  <div className="flex gap-2 mb-6 flex-wrap">
                    {b.hsn.map(code => (
                      <span key={code} className={`px-2 py-1 flex items-center gap-1 text-xs rounded font-semibold ${hsn === code ? 'bg-purple-500 text-white' : 'bg-purple-500/10 border border-purple-500/20 text-purple-300'}`}>
                         HSN {code}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex gap-3">
                    <Link href={`/business/${b.slug}`} className="flex-1">
                      <button className="w-full bg-white/10 hover:bg-white/20 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                        <Building2 className="w-4 h-4" /> Expand Profile
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
