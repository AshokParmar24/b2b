"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { BrandName } from "@/components/ui/BrandName";
import { SITE_NAME } from "@/lib/site-config";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { NavLink, NavbarProps } from "@/types";

export function Navbar({ mode = "public", links }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultLinks: Record<string, NavLink[]> = {
    public: [
      { label: "Browse", href: "/businesses" },
      { label: "Plans", href: "/plans" },
    ],
    admin: [
      { label: "Dashboard", href: "/admin" },
      { label: "Users", href: "/admin/users" },
      { label: "Settings", href: "/admin/settings" },
    ],
    customer: [
      { label: "My Profile", href: "/dashboard" },
      { label: "My Inquiries", href: "/dashboard/inquiries" },
      { label: "Favorites", href: "/dashboard/favorites" },
    ],
  };

  const activeLinks = links || defaultLinks[mode];

  return (
    <nav className="sticky top-0 z-[100] border-b border-border bg-background/80 shadow-sm backdrop-blur-xl transition-all">
      <div className="responsive-container flex h-16 md:h-24 items-center justify-between">
        {/* Logo Section - Abstracted Branding */}
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-3 no-underline transition-all hover:scale-105"
        >
          <Logo width={36} height={36} />
          <BrandName isSpan className="text-2xl md:text-3xl" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          <div className="flex items-center gap-2">
            {activeLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="no-underline rounded-full px-5 py-2 text-sm font-bold text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all cursor-pointer"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="h-6 w-[1px] bg-border mx-2" />

          {mode === "public" ? (
            <div className="flex items-center gap-4">
              <Link href="/login" className="no-underline px-4 py-2 text-sm font-black text-foreground hover:text-primary transition-colors cursor-pointer">
                Log In
              </Link>
              <Link href="/register" className="no-underline">
                <button className="btn-primary">
                  Get Started
                </button>
              </Link>
            </div>
          ) : (
            <Link href="/logout" className="no-underline">
              <button className="btn-outline h-11 px-6 text-sm font-black">
                Logout
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-border bg-muted/30 lg:hidden transition-all active:scale-90"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-border bg-background p-8 lg:hidden animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-6">
            {activeLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-xl font-black tracking-tight text-muted-foreground hover:text-primary no-underline cursor-pointer transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="my-4 h-[1px] w-full bg-border" />
            {mode === "public" ? (
              <div className="flex flex-col gap-4">
                <Link href="/login" onClick={() => setIsOpen(false)} className="no-underline text-center py-3 text-lg font-black text-foreground cursor-pointer">
                  Log In
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="no-underline">
                  <button className="btn-primary w-full py-5 text-xl">
                    Get Started
                  </button>
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = "/logout";
                }}
                className="btn-outline w-full py-5 text-xl font-black text-red-500 cursor-pointer"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
