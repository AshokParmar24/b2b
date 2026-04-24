"use client";

import { RegisterForm } from "@/components/auth/Register/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#FDFDFD] py-20 px-6 selection:bg-primary/10">
      {/* 🎭 Minimal Background Decor */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
      
      {/* 🏢 High-Fidelity Registration Core */}
      <RegisterForm />
      
      {/* 🛡️ Static Trust Signal */}
      <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
        Trusted by 10,000+ Businesses Worldwide
      </p>
    </div>
  );
}
