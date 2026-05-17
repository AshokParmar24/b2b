"use client";

import { RegisterForm } from "@/components/auth/Register/RegisterForm";
import { Sparkles, ShieldCheck, Globe, Star } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#fcfcfd] px-4 py-12 md:px-6 lg:py-20 selection:bg-primary/10 overflow-hidden">
      
      {/* 🎭 HIGH-FIDELITY BACKGROUND DECOR */}
      {/* Primary Glow */}
      <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-100" />

      {/* 🏢 High-Fidelity Registration Core */}
      <div className="relative w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <RegisterForm />
      </div>

      {/* 🛡️ Premium Trust Footer */}
      <div className="mt-12 flex flex-col items-center gap-6 animate-in fade-in duration-1000 delay-500 pb-10">
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 opacity-40">
          <TrustIcon icon={Star} label="Industry Leader" />
          <div className="h-4 w-px bg-slate-300 hidden sm:block" />
          <TrustIcon icon={ShieldCheck} label="Encrypted Data" />
          <div className="h-4 w-px bg-slate-300 hidden sm:block" />
          <TrustIcon icon={Globe} label="Join 10k+ Partners" />
        </div>
        
        <p className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">
          Global Verified Business Network • HETNEX Platform
        </p>
      </div>
    </div>
  );
}

function TrustIcon({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5" />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}
