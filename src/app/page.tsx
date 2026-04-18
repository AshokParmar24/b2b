import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Building2, Zap, Globe, Shield, Users } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { Logo } from "@/components/ui/Logo";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-dark)", display: "flex", flexDirection: "column" }}>

      {/* Premium Navbar */}
      <nav style={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        background: "rgba(10,10,20,0.6)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "76px",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      }}>
        {/* Logo Section */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <Logo width={40} height={40} />
          <span style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-0.5px" }} className="gradient-text">
            VyapaarBiz
          </span>
        </Link>
        
        {/* Navigation Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/businesses" style={{ display: "none" }} className="sm-block">
            <Button variant="ghost" style={{ color: "#d1d5db", fontWeight: 500, fontSize: "15px" }}>Browse</Button>
          </Link>
          <Link href="/plans" style={{ display: "none" }} className="sm-block">
            <Button variant="ghost" style={{ color: "#d1d5db", fontWeight: 500, fontSize: "15px" }}>Plans</Button>
          </Link>
          <div style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.1)", margin: "0 8px", display: "none" }} className="sm-block"></div>
          <Link href="/login">
            <Button variant="ghost" style={{ color: "#a78bfa", fontWeight: 600, fontSize: "15px" }}>Log In</Button>
          </Link>
          <Link href="/register">
            <button className="btn-glow" style={{ fontSize: "14px", fontWeight: 600, padding: "10px 24px", borderRadius: "8px" }}>
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", padding: "100px 24px", textAlign: "center", flex: 1 }}>
        {/* Glow blobs */}
        <div style={{ position: "absolute", top: 0, left: "25%", width: 400, height: 400, borderRadius: "50%", opacity: 0.2, filter: "blur(80px)", background: "var(--brand-primary)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, right: "25%", width: 400, height: 400, borderRadius: "50%", opacity: 0.15, filter: "blur(80px)", background: "var(--brand-secondary)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto" }} className="animate-fadeInUp">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: 99, marginBottom: 28, fontSize: 14, fontWeight: 500, background: "rgba(108,63,255,0.15)", color: "#a78bfa", border: "1px solid rgba(108,63,255,0.3)" }}>
            🌍 Global B2B Business Directory
          </div>

          <h1 style={{ fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24, color: "#fff" }}>
            Find Dealers by<br />
            <span className="gradient-text">HSN Code</span>
          </h1>

          <p style={{ fontSize: 18, color: "#888", marginBottom: 40, maxWidth: 560, margin: "0 auto 40px" }}>
            Connect with verified manufacturers, distributors and dealers across India and the world.
            Search by HSN code, product, city or business name.
          </p>

          {/* Search Bar */}
          <div style={{ display: "flex", gap: 12, maxWidth: 640, margin: "0 auto 48px", flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ flex: 1, minWidth: 260, position: "relative" }}>
              <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#666", width: 18, height: 18 }} />
              <input
                id="main-search"
                type="text"
                placeholder="Search by business name, HSN code, or product..."
                style={{
                  width: "100%",
                  paddingLeft: 44,
                  paddingRight: 16,
                  paddingTop: 14,
                  paddingBottom: 14,
                  borderRadius: 12,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>
            <button className="btn-glow" style={{ padding: "14px 32px", borderRadius: 12, whiteSpace: "nowrap" }}>Search</button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "32px 48px" }}>
            {[
              { end: 100, suffix: "k+", label: "Business Cards" },
              { end: 190, suffix: "+", label: "Countries" },
              { end: 5, suffix: ",000+", label: "HSN Codes" },
              { end: 50, suffix: ",000+", label: "Verified Dealers" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div className="gradient-text" style={{ fontSize: 32, fontWeight: 900 }}>
                  <CountUp end={stat.end} suffix={stat.suffix} duration={2.5} />
                </div>
                <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "60px 24px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, textAlign: "center", marginBottom: 12 }}>
          Why Choose <span className="gradient-text">VyapaarBiz</span>?
        </h2>
        <p style={{ color: "#888", textAlign: "center", marginBottom: 48 }}>
          Everything you need to find and connect with the right business partners
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {[
            { icon: Zap,       color: "#6c3fff", title: "Instant HSN Search",      desc: "Type any HSN code and instantly find all dealers and manufacturers dealing in those products." },
            { icon: Globe,     color: "#ff6b35", title: "Global Coverage",          desc: "Businesses from 190+ countries with country-code aware mobile numbers and local address masters." },
            { icon: Shield,    color: "#00d4aa", title: "Verified Listings",        desc: "All visiting cards are verified with GST numbers, photos, and contact details." },
            { icon: Building2, color: "#6c3fff", title: "Rich Business Profiles",   desc: "Up to 10 product images, multiple mobile numbers, and complete HSN code listings per business." },
            { icon: Users,     color: "#ff6b35", title: "Dealer Network",           desc: "Connect directly with dealers, distributors and manufacturers in your industry." },
            { icon: Search,    color: "#00d4aa", title: "Smart Filters",            desc: "Filter by HSN code, city, state, country and business type to find exactly who you need." },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="glass-card" style={{ padding: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}22`, marginBottom: 16 }}>
                <Icon style={{ color, width: 22, height: 22 }} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{title}</h3>
              <p style={{ color: "#888", fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "60px 24px", textAlign: "center" }}>
        <div className="glass-card" style={{ maxWidth: 600, margin: "0 auto", padding: "60px 40px" }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Ready to List Your Business?</h2>
          <p style={{ color: "#888", marginBottom: 32 }}>Join thousands of dealers already on VyapaarBiz. Start free, upgrade anytime.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register"><button className="btn-glow" style={{ padding: "14px 36px", borderRadius: 12 }}>Start Free</button></Link>
            <Link href="/plans"><Button variant="outline" style={{ padding: "14px 36px", borderRadius: 12, borderColor: "#444", color: "#aaa", height: "auto" }}>View Plans</Button></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "32px 24px", textAlign: "center", color: "#555", fontSize: 13, borderTop: "1px solid var(--border-color)" }}>
        <p className="gradient-text" style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>VyapaarBiz</p>
        <p>© {new Date().getFullYear()} VyapaarBiz. All rights reserved. | Global B2B Business Directory</p>
      </footer>
    </main>
  );
}
