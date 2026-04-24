"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Facebook, 
  X, 
  Linkedin, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Globe2,
  ShieldCheck,
  type LucideIcon
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { SITE_NAME, SITE_TAGLINE, SITE_COPYRIGHT } from "@/lib/site-config";

/**
 * 🎨 PREMIUM MULTI-COLUMN FOOTER
 * A high-fidelity, responsive footer with deep brand integration and trust signals.
 */

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

export function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const footerLinks: Record<string, FooterLink[]> = {
    platform: [
      { label: "Search Directory", href: "/search" },
      { label: "HSN Codes", href: "/hsn" },
      { label: "Verify Business", href: "/verify" },
      { label: "Pricing Plans", href: "/plans" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/story" },
      { label: "Press & News", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "GDPR", href: "/gdpr" },
    ],
  };

  const socials: SocialLink[] = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: X, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer className="relative border-t border-border bg-background pt-24 pb-12 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] translate-y-1/2 -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute top-0 right-0 -z-10 h-[300px] w-[300px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/5 blur-[100px]" />

      <div className="responsive-container">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          
          {/* Brand Identity Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="mb-8 inline-flex items-center gap-3 no-underline group">
              <Logo width={42} height={42} className="transition-transform group-hover:rotate-12" />
              <span className="gradient-text text-3xl font-black tracking-tighter">
                {SITE_NAME}
              </span>
            </Link>
            <p className="mb-8 max-w-sm text-lg font-medium text-muted-foreground leading-relaxed">
              {SITE_TAGLINE}. The world's most trusted B2B intelligence and partnership network.
            </p>
            <div className="flex gap-4">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <Link 
                    key={social.label} 
                    href={social.href}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h4 className="mb-6 text-sm font-black uppercase tracking-[0.2em] text-foreground">Platform</h4>
              <ul className="space-y-4">
                {footerLinks.platform.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center group">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-6 text-sm font-black uppercase tracking-[0.2em] text-foreground">Company</h4>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center group">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h4 className="mb-6 text-sm font-black uppercase tracking-[0.2em] text-foreground">Legal</h4>
              <ul className="space-y-4">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center group">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="mt-20 grid grid-cols-1 gap-6 rounded-3xl border border-border bg-muted/30 p-8 sm:grid-cols-3">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Support</div>
              <div className="font-bold text-foreground">hello@hetnex.com</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Call Center</div>
              <div className="font-bold text-foreground">+1 (800) HETNEX</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Globe2 className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Office</div>
              <div className="font-bold text-foreground">Dubai, UAE</div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="mt-16 flex flex-col items-center justify-between gap-8 border-t border-border pt-12 md:flex-row">
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
            <ShieldCheck className="h-5 w-5 text-primary" />
            ISO 27001 Certified & Secure
          </div>
          <p className="text-sm font-bold text-muted-foreground">
            {SITE_COPYRIGHT(currentYear)}
          </p>
          <div className="flex items-center gap-6 text-sm font-bold text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
