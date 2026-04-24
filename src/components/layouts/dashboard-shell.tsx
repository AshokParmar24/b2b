"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Footer } from "@/components/footer/Footer";
import { LucideIcon, Search, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
  links: { href: string; label: string; icon: LucideIcon }[];
  role?: string;
  showFooter?: boolean;
}

export function DashboardShell({
  children,
  links,
  role = "User",
  showFooter = false,
}: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Automatically collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-background selection:bg-primary selection:text-primary-foreground overflow-hidden">
      {/* 🎭 Sidebar with integrated toggle button */}
      <Sidebar 
        links={links} 
        role={role} 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Dashboard Header - Cleaner version without toggle */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur-md">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative w-full max-w-md group hidden md:block">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search analytics or inquiries..."
                className="h-11 w-full rounded-2xl border border-border bg-muted/30 pl-11 pr-4 text-sm outline-none transition-all focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/5 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-muted/30 transition-all hover:bg-background hover:shadow-sm group">
              <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
            </button>
            
            <div className="h-10 w-[1px] bg-border mx-2" />

            <button className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 p-1.5 pr-4 transition-all hover:bg-background hover:shadow-sm group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left hidden sm:flex">
                <span className="text-xs font-black text-foreground">John Doe</span>
                <span className="text-[10px] font-bold text-muted-foreground leading-none">Verified {role}</span>
              </div>
            </button>
          </div>
        </header>

        {/* Dynamic Content Body */}
        <main className="flex-1 overflow-auto custom-scrollbar relative">
          <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-primary/[0.03] blur-[120px] rounded-full pointer-events-none" />
          
          <div className="mx-auto w-full max-w-[1400px] px-8 py-10 md:px-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {children}
          </div>
        </main>

        {showFooter && <Footer />}
      </div>
    </div>
  );
}
