import Link from "next/link";
import { CheckCircle2, ChevronLeft, Crown, Zap, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";

export default function PublicPlansPage() {
  const plans = [
    { name: "Free", price: "0", desc: "Try VyapaarBiz with basic features", limits: { cards: "1", images: "3", hsn: "2" }, recommended: false },
    { name: "Basic", price: "299", desc: "Perfect for small dealers getting started", limits: { cards: "10", images: "5", hsn: "5" }, recommended: false },
    { name: "Pro", price: "799", desc: "For growing businesses with large catalogs", limits: { cards: "100", images: "10", hsn: "Unlimited" }, recommended: true },
    { name: "Enterprise", price: "1999", desc: "Unlimited power for large-scale distributors", limits: { cards: "Unlimited", images: "10", hsn: "Unlimited" }, recommended: false },
  ];

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "var(--bg-dark)" }}>
      {/* Public Navbar Component */}
      <nav style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", background: "rgba(10,10,20,0.6)", backdropFilter: "blur(24px)", position: "sticky", top: 0, zIndex: 50, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "76px" }}>
        <Link href="/" className="flex items-center gap-3 text-decoration-none">
          <Logo width={36} height={36} />
          <span className="text-2xl font-black gradient-text">VyapaarBiz</span>
        </Link>
        <Link href="/">
          <Button variant="ghost" className="text-gray-300 gap-2"><ChevronLeft className="w-4 h-4"/> Back to Home</Button>
        </Link>
      </nav>

      <section className="flex-1 py-20 px-6 animate-fadeInUp">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-400">Choose the perfect plan to grow your B2B network globally.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((p) => (
            <div key={p.name} className={`glass-card p-8 flex flex-col relative overflow-hidden transition-all duration-300 ${p.recommended ? "border-purple-500 shadow-2xl shadow-purple-900/20 scale-105 z-10" : "hover:border-gray-500"}`}>
              {p.recommended && (
                <div className="absolute top-0 inset-x-0 w-full bg-gradient-to-r from-purple-600 to-blue-600 py-1.5 text-center text-xs font-black text-white uppercase tracking-widest shadow-md">
                  Most Popular
                </div>
              )}
              
              <div className="mt-4 mb-2 flex items-center justify-between">
                <h3 className="text-2xl font-black text-white">{p.name}</h3>
                {p.name === "Pro" && <Crown className="w-6 h-6 text-yellow-500 drop-shadow-md" />}
              </div>
              
              <p className="text-sm text-gray-400 mb-6 h-10">{p.desc}</p>
              
              <div className="flex items-baseline gap-1 mb-8 pb-8 border-b border-gray-800">
                <IndianRupee className="w-6 h-6 text-gray-400" />
                <span className="text-5xl font-black text-white tracking-tighter">{p.price}</span>
                <span className="text-gray-500 font-medium ml-1">/ mo</span>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <span className="text-gray-300"><b>{p.limits.cards}</b> Business Cards</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <span className="text-gray-300"><b>{p.limits.images}</b> Images per Card</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <span className="text-gray-300"><b>{p.limits.hsn}</b> HSN Codes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-purple-400 shrink-0" />
                  <span className="text-gray-400">Search Placement Boost</span>
                </div>
              </div>

              <Link href="/register" className="w-full">
                <button className={`w-full py-4 rounded-xl font-bold transition-all text-white ${p.recommended ? "btn-glow shadow-lg" : "bg-white/10 hover:bg-white/20 border border-white/5"}`}>
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
