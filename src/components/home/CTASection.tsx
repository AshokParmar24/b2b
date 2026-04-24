"use client";

import Link from "next/link";

export function CTASection() {
  return (
    <section className="section-padding">
      <div className="responsive-container">
        <div className="relative overflow-hidden rounded-[48px] bg-foreground px-6 py-24 md:px-10 md:py-32 text-center text-background shadow-2xl animate-in fade-in slide-in-from-bottom-16 duration-1000">
          {/* Animated Glow Elements */}
          <div className="absolute top-0 right-0 h-full w-1/2 bg-primary/10 blur-[100px] animate-glow" />
          <div className="absolute bottom-0 left-0 h-full w-1/2 bg-primary/5 blur-[100px] animate-glow [animation-delay:3s]" />

          <div className="relative z-10">
            <h2 className="mb-10 text-4xl font-black tracking-tighter md:text-7xl animate-in slide-in-from-top-4 duration-700 delay-300 fill-mode-both">
              Ready to Scale Your <br />
              <span className="text-primary italic">Global Presence?</span>
            </h2>
            <p className="mx-auto mb-16 max-w-3xl text-lg md:text-2xl text-background/60 font-medium leading-relaxed animate-in fade-in duration-700 delay-500 fill-mode-both">
              Join 50,000+ verified dealers. List your products and start receiving qualified global inquiries today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 animate-in zoom-in-90 duration-700 delay-700 fill-mode-both">
              <Link href="/register" className="no-underline cursor-pointer">
                <button className="rounded-xl bg-primary px-12 py-6 text-xl font-black text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20 w-full sm:w-auto cursor-pointer">
                  Start Free Now
                </button>
              </Link>
              <Link href="/plans" className="no-underline cursor-pointer">
                <button className="rounded-xl border-2 border-primary/20 bg-transparent px-12 py-6 text-xl font-black text-background transition-all hover:bg-primary/10 w-full sm:w-auto cursor-pointer">
                  View Pricing
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
