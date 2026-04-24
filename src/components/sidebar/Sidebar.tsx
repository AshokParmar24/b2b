"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, LucideIcon, ChevronRight, Menu, ChevronLeft } from "lucide-react";
import { BrandName } from "@/components/ui/BrandName";
import { Logo } from "@/components/ui/Logo";
import { SITE_NAME } from "@/lib/site-config";
import { cn } from "@/lib/utils";

interface SidebarLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  links: SidebarLink[];
  role?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ links, role = "User", isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside 
      className={cn(
        "sticky top-0 z-50 flex h-screen flex-shrink-0 flex-col border-r border-border bg-card/50 backdrop-blur-3xl py-10 transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-left-8",
        isCollapsed ? "w-24 px-4" : "w-72 px-6"
      )}
    >
      {/* 🔘 Integrated Toggle Button (Floating at the edge) */}
      <button
        onClick={onToggle}
        className="absolute -right-4 top-10 z-50 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-lg transition-all hover:scale-110 hover:border-primary hover:text-primary group"
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? (
          <Menu className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* Decorative background glow */}
      <div className="absolute top-0 left-0 -z-10 h-64 w-full bg-gradient-to-b from-primary/5 to-transparent" />

      {/* Sidebar Header */}
      <div className={cn("mb-12 flex flex-col gap-2 transition-all", isCollapsed ? "items-center px-0" : "px-2")}>
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-4 no-underline group"
        >
          <div className="rounded-[14px] bg-primary p-2 shadow-lg shadow-primary/20 transition-transform group-hover:rotate-6 group-hover:scale-110">
            <Logo width={28} height={28} variant="white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in duration-500">
              <BrandName isSpan className="text-2xl whitespace-nowrap" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">
                {role} Panel
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        <div className={cn(
          "mb-4 px-4 text-[10px] font-black tracking-[0.2em] text-muted-foreground/50 uppercase transition-all",
          isCollapsed && "opacity-0 h-0 mb-0"
        )}>
          Main Menu
        </div>
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={isCollapsed ? label : undefined}
              className={cn(
                "flex cursor-pointer items-center rounded-2xl py-4 no-underline transition-all duration-300 group relative",
                isCollapsed ? "justify-center px-0" : "justify-between px-5",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02]"
                  : "font-bold text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              <div className="flex items-center gap-4">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform group-hover:scale-110",
                    isActive ? "text-primary-foreground" : "text-muted-foreground/60 group-hover:text-primary"
                  )}
                />
                {!isCollapsed && <span className="text-sm tracking-tight whitespace-nowrap animate-in fade-in duration-500">{label}</span>}
              </div>
              
              {!isCollapsed && isActive && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground/20">
                  <ChevronRight className="h-3 w-3" />
                </div>
              )}

              {/* Active glow effect */}
              {isActive && (
                <div className="absolute inset-0 -z-10 rounded-2xl bg-primary/20 blur-xl animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Account Section */}
      <div className="mt-auto border-t border-border pt-8">
        <p className={cn(
          "mb-4 px-4 text-[10px] font-black tracking-[0.2em] text-muted-foreground/50 uppercase transition-all",
          isCollapsed && "opacity-0 h-0 mb-0"
        )}>
          Security
        </p>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          title={isCollapsed ? "Logout Session" : undefined}
          className={cn(
            "flex w-full cursor-pointer items-center rounded-2xl py-4 text-sm font-black text-muted-foreground transition-all hover:bg-destructive/5 hover:text-destructive active:scale-95 group",
            isCollapsed ? "justify-center px-0" : "gap-4 px-5"
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/30 group-hover:bg-destructive/10 transition-colors">
            <LogOut className="h-5 w-5" />
          </div>
          {!isCollapsed && <span className="animate-in fade-in duration-500">Logout Session</span>}
        </button>
      </div>
    </aside>
  );
}
