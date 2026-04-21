import Link from "next/link";
import { Search, MapPin, Building2, PhoneCall, Verified } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { SITE_NAME } from "@/lib/site-config";

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
    {
      slug: "acme-corp",
      name: "Acme Corp Ltd.",
      location: "Ahmedabad, Gujarat",
      hsn: ["6908", "6907"],
      src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col" style={{ background: "var(--bg-dark)" }}>
      {/* Public Navbar Component - Simplified */}
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
          <Button variant="ghost" className="text-purple-400">
            View All Businesses
          </Button>
        </Link>
      </nav>

      <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <div className="animate-fadeInUp mb-10 text-center">
          <h1 className="mb-4 text-3xl font-black text-white md:text-4xl">
            Search Results for{" "}
            <span className="gradient-text">"{query || hsn || "Everything"}"</span>
          </h1>
          <p className="text-gray-400">
            Found {results.length} active global business listing based on your search criteria.
          </p>
        </div>

        <form
          action="/search"
          method="GET"
          className="animate-fadeInUp relative mx-auto mb-12 max-w-2xl"
        >
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-500" />
          <input
            name="q"
            type="text"
            defaultValue={query}
            placeholder="Try a new search string..."
            className="w-full rounded-xl border border-gray-800 bg-black/50 py-4 pr-32 pl-12 text-white outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="btn-glow absolute top-1/2 right-2 -translate-y-1/2 rounded-lg px-6 py-2 text-sm"
          >
            Update
          </button>
        </form>

        <div className="animate-fadeInUp grid grid-cols-1 gap-6 md:grid-cols-2">
          {results.map((b) => (
            <div
              key={b.slug}
              className="glass-card group flex cursor-pointer flex-col overflow-hidden transition-all hover:border-purple-500/50"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <div className="absolute inset-0 z-10 hidden bg-black/40 transition-all group-hover:block" />
                <img
                  src={b.src}
                  alt={b.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 z-20">
                  <span className="flex items-center gap-1 rounded bg-green-500/90 px-2 py-1 text-xs font-bold text-white shadow-lg backdrop-blur">
                    <Verified className="h-3 w-3" /> Verified Match
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-1 flex items-center gap-2 text-xl font-black text-white">
                  {b.name}
                </h3>
                <p className="mb-4 flex items-center gap-1 text-sm text-gray-400">
                  <MapPin className="h-4 w-4 text-orange-400" /> {b.location}
                </p>

                <div className="mb-6 flex flex-wrap gap-2">
                  {b.hsn.map((code) => (
                    <span
                      key={code}
                      className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold ${hsn === code ? "bg-purple-500 text-white" : "border border-purple-500/20 bg-purple-500/10 text-purple-300"}`}
                    >
                      HSN {code}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex gap-3">
                  <Link href={`/business/${b.slug}`} className="flex-1">
                    <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20">
                      <Building2 className="h-4 w-4" /> Expand Profile
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
