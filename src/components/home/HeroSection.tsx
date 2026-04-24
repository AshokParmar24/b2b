"use client";

import { Sparkles, Rocket, Globe2, Search, TrendingUp, Users, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SITE_TAGLINE } from "@/lib/site-config";

export function HeroSection() {
  return (
    <section className="section-padding relative text-center hero-gradient overflow-hidden pb-40">
      {/* 🎭 Visual Spectacle: Animated Background Layers */}
      <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-full -translate-x-1/2 bg-primary/5 blur-[140px] rounded-full animate-glow" />
      <div className="absolute -top-24 right-0 -z-10 h-[500px] w-[500px] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-full bg-gradient-to-t from-background to-transparent" />
      
      {/* ✨ Floating "Market Intelligence" Cards */}
      <div className="absolute top-24 left-[8%] -z-10 hidden 2xl:block animate-float opacity-30">
        <div className="rounded-3xl bg-white/80 backdrop-blur-md p-6 shadow-2xl border border-primary/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Live Market Data</span>
          </div>
          <div className="text-xl font-black text-foreground">HSN 6908 <span className="text-emerald-500">↑ 12%</span></div>
        </div>
      </div>

      <div className="absolute bottom-48 right-[8%] -z-10 hidden 2xl:block animate-float [animation-delay:3s] opacity-30">
        <div className="rounded-3xl bg-white/80 backdrop-blur-md p-6 shadow-2xl border border-primary/10">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Verification</span>
          </div>
          <div className="text-xl font-black text-foreground">Global Bearings Co.</div>
        </div>
      </div>

      <div className="responsive-container relative z-10 max-w-5xl">
        {/* 🔥 High-Conversion Badge */}
        <div className="mb-12 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-6 py-2.5 text-sm font-black text-primary backdrop-blur-2xl animate-in zoom-in-50 duration-700 shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)]">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <span>{SITE_TAGLINE}</span>
          <div className="h-4 w-[1px] bg-primary/20 mx-1" />
          <span className="text-primary/60 italic font-medium underline underline-offset-4">Join 50k+ Businesses</span>
        </div>

        <h1 className="mb-8 text-[clamp(52px,10vw,100px)] font-[1000] tracking-tighter leading-[0.85] text-foreground animate-in fade-in slide-in-from-top-16 duration-1000 ease-out">
          Your Bridge to <br />
          <span className="gradient-text italic px-2">Global Trade.</span>
        </h1>

        <p className="mx-auto mb-16 max-w-3xl text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
          Stop searching, start growing. Connect with verified manufacturers and elite distributors 
          through our advanced HSN-powered B2B intelligence platform.
        </p>

        {/* 🔍 Elite Search Experience */}
        <div className="mx-auto w-full max-w-4xl animate-in zoom-in-95 duration-1000 delay-400 fill-mode-both relative">
          <div className="absolute -inset-4 -z-10 rounded-[40px] bg-primary/5 blur-3xl opacity-50 group-focus-within:opacity-100 transition-opacity" />
          
          <form
            action="/search"
            method="GET"
            className="flex flex-col gap-3 sm:flex-row p-4 rounded-[32px] bg-white border-2 border-primary/5 shadow-[0_32px_80px_rgba(0,0,0,0.12)] transition-all hover:shadow-primary/20 hover:border-primary/20 group cursor-pointer relative"
          >
            <div className="relative flex-1 cursor-text">
              <Search className="absolute top-1/2 left-6 h-7 w-7 -translate-y-1/2 text-muted-foreground/40 transition-colors group-focus-within:text-primary" />
              <input
                id="main-search"
                name="q"
                type="text"
                placeholder="Search manufacturer, distributor or HSN code..."
                className="w-full h-16 rounded-2xl border-none bg-transparent pl-16 pr-6 text-xl outline-none placeholder:text-muted-foreground/50 focus:ring-0 font-bold cursor-text"
              />
            </div>
            <button type="submit" className="btn-primary h-16 px-14 text-xl font-[900] whitespace-nowrap shadow-[0_15px_35px_rgba(var(--primary-rgb),0.3)] hover:scale-[1.03] active:scale-95 transition-all cursor-pointer">
              Get Started
            </button>
          </form>

          {/* 📊 Trust Bar */}
          <div className="mt-12 flex flex-wrap justify-center gap-10 text-[11px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
            <div className="flex items-center gap-3 group cursor-default">
              <ShieldCheck className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform" />
              100% Verified Identity
            </div>
            <div className="flex items-center gap-3 group cursor-default">
              <TrendingUp className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              Real-time Inquiries
            </div>
            <div className="flex items-center gap-3 group cursor-default">
              <Users className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
              Global Partner Network
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
