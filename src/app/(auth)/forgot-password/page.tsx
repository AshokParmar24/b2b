"use client";

import { ForgotPasswordForm } from "@/components/auth/ForgotPassword/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#FDFDFD] px-6 py-12 selection:bg-primary/10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
      <ForgotPasswordForm />
      <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
        Secure • Global • Verified
      </p>
    </div>
  );
}
