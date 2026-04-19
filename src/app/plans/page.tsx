import Link from "next/link";
import { CheckCircle2, ChevronLeft, Crown, Zap, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";

export default function PublicPlansPage() {
  const plans = [
    {
      name: "Free",
      price: "0",
      desc: "Try VyapaarBiz with basic features",
      limits: { cards: "1", images: "3", hsn: "2" },
      recommended: false,
    },
    {
      name: "Basic",
      price: "299",
      desc: "Perfect for small dealers getting started",
      limits: { cards: "10", images: "5", hsn: "5" },
      recommended: false,
    },
    {
      name: "Pro",
      price: "799",
      desc: "For growing businesses with large catalogs",
      limits: { cards: "100", images: "10", hsn: "Unlimited" },
      recommended: true,
    },
    {
      name: "Enterprise",
      price: "1999",
      desc: "Unlimited power for large-scale distributors",
      limits: { cards: "Unlimited", images: "10", hsn: "Unlimited" },
      recommended: false,
    },
  ];

  return (
    <main className="flex min-h-screen flex-col" style={{ background: "var(--bg-dark)" }}>
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
          <span className="gradient-text text-2xl font-black">VyapaarBiz</span>
        </Link>
        <Link href="/">
          <Button variant="ghost" className="gap-2 text-gray-300">
            <ChevronLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </nav>

      <section className="animate-fadeInUp flex-1 px-6 py-20">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400">
            Choose the perfect plan to grow your B2B network globally.
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`glass-card relative flex flex-col overflow-hidden p-8 transition-all duration-300 ${p.recommended ? "z-10 scale-105 border-purple-500 shadow-2xl shadow-purple-900/20" : "hover:border-gray-500"}`}
            >
              {p.recommended && (
                <div className="absolute inset-x-0 top-0 w-full bg-gradient-to-r from-purple-600 to-blue-600 py-1.5 text-center text-xs font-black tracking-widest text-white uppercase shadow-md">
                  Most Popular
                </div>
              )}

              <div className="mt-4 mb-2 flex items-center justify-between">
                <h3 className="text-2xl font-black text-white">{p.name}</h3>
                {p.name === "Pro" && <Crown className="h-6 w-6 text-yellow-500 drop-shadow-md" />}
              </div>

              <p className="mb-6 h-10 text-sm text-gray-400">{p.desc}</p>

              <div className="mb-8 flex items-baseline gap-1 border-b border-gray-800 pb-8">
                <IndianRupee className="h-6 w-6 text-gray-400" />
                <span className="text-5xl font-black tracking-tighter text-white">{p.price}</span>
                <span className="ml-1 font-medium text-gray-500">/ mo</span>
              </div>

              <div className="mb-10 flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
                  <span className="text-gray-300">
                    <b>{p.limits.cards}</b> Business Cards
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
                  <span className="text-gray-300">
                    <b>{p.limits.images}</b> Images per Card
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
                  <span className="text-gray-300">
                    <b>{p.limits.hsn}</b> HSN Codes
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 shrink-0 text-purple-400" />
                  <span className="text-gray-400">Search Placement Boost</span>
                </div>
              </div>

              <Link href="/register" className="w-full">
                <button
                  className={`w-full rounded-xl py-4 font-bold text-white transition-all ${p.recommended ? "btn-glow shadow-lg" : "border border-white/5 bg-white/10 hover:bg-white/20"}`}
                >
                  Get Started with {p.name}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
