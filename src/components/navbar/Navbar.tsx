"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { 
  Menu, 
  X, 
  ArrowRight, 
  LayoutDashboard,
  LogOut
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { BrandName } from "@/components/ui/BrandName";
import { SITE_NAME } from "@/lib/site-config";
import { UserRole, NavLink, NavbarProps } from "@/types";
import { AppRoutes } from "@/lib/routes";

export function Navbar({ mode = "public", links }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const defaultLinks: Record<string, NavLink[]> = {
    public: [
      { label: "Browse", href: AppRoutes.BUSINESSES },
      { label: "Plans", href: AppRoutes.PLANS },
    ],
    admin: [
      { label: "Dashboard", href: AppRoutes.ADMIN_DASHBOARD },
      { label: "Users", href: AppRoutes.ADMIN_USERS },
      { label: "Settings", href: "/admin/settings" },
    ],
    customer: [
      { label: "My Profile", href: "/dashboard" },
      { label: "My Inquiries", href: "/dashboard/inquiries" },
      { label: "Favorites", href: "/dashboard/favorites" },
    ],
  };

  const activeLinks = links || defaultLinks[mode];
  const dashboardLink = session?.user?.role === UserRole.ADMIN ? "/admin" : "/dashboard";

  return (
    <nav className="sticky top-0 z-[100] border-b border-border bg-background/80 shadow-sm backdrop-blur-xl transition-all">
      <div className="responsive-container flex h-16 md:h-24 items-center justify-between">
        {/* Logo Section */}
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

          {isAuthenticated ? (
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Welcome back</span>
                <span className="text-xs font-bold text-foreground">{session.user?.name}</span>
              </div>
              <Link href={dashboardLink} className="no-underline">
                <button className="btn-primary h-11 px-6 text-sm font-black flex items-center gap-2 group">
                  Dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </div>
          ) : mode === "public" ? (
            <div className="flex items-center gap-4">
              <Link href="/login" className="no-underline px-4 py-2 text-sm font-black text-foreground hover:text-primary transition-colors cursor-pointer">
                Log In
              </Link>
              <Link href="/register" className="no-underline">
                <button className="btn-primary h-11 px-6 text-sm font-black">
                  Get Started
                </button>
              </Link>
            </div>
          ) : (
            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="btn-outline h-11 px-6 text-sm font-black"
            >
              Logout
            </button>
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
            
            {isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col px-2">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Authorized User</span>
                  <span className="text-xl font-black text-foreground">{session.user?.name}</span>
                </div>
                <Link href={dashboardLink} onClick={() => setIsOpen(false)} className="no-underline">
                  <button className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3">
                    <LayoutDashboard className="h-6 w-6" /> Go to Dashboard
                  </button>
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full py-4 text-sm font-black text-destructive flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            ) : mode === "public" ? (
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
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-outline w-full py-5 text-xl font-black text-destructive cursor-pointer"
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
