"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Footer } from "@/components/footer/Footer";
import { LucideIcon, Search, Bell, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { SITE_NAME } from "@/lib/site-config";
import { DashboardHeader } from "./dashboard-header";

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 🔐 Guard: Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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

  // ⏳ Loading State (Premium Brand Experience)
  if (status === "loading") {
    return (
      <div className="relative flex h-screen w-full flex-col items-center justify-center bg-background overflow-hidden font-sans">
        {/* Decorative background gradients */}
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-primary/5 blur-[120px]" />

        <div className="relative z-10 flex flex-col items-center gap-10">
          {/* Logo with pulsing glow */}
          <div className="relative group">
            <div className="absolute -inset-6 rounded-full bg-primary/20 blur-2xl animate-pulse" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-[32px] bg-primary shadow-[0_20px_50px_-12px_rgba(var(--primary-rgb),0.5)] transition-transform duration-700 animate-in zoom-in-50 spin-in-12">
              <Logo width={48} height={48} variant="white" />
            </div>
          </div>

          {/* Text and small spinner */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-4 text-lg font-black uppercase tracking-[0.4em] text-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="h-px w-8 bg-border" />
              <span>{SITE_NAME}</span>
              <div className="h-px w-8 bg-border" />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">
                <Loader2 className="h-3 w-3 animate-spin" />
                Securing Environment
              </div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                Please wait while we verify your session
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic loading progress bar at the bottom */}
        <div className="absolute bottom-0 left-0 h-[3px] w-full bg-muted/30 overflow-hidden">
          <div className="h-full w-[40%] bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)] animate-[loading_2s_infinite_ease-in-out]" />
        </div>

        <style jsx>{`
          @keyframes loading {
            0% { transform: translateX(-150%) scaleX(0.5); }
            50% { transform: translateX(50%) scaleX(1.2); }
            100% { transform: translateX(250%) scaleX(0.5); }
          }
        `}</style>
      </div>
    );
  }

  if (status === "unauthenticated") return null;


  const userDisplayName = session?.user?.name || "Authorized User";

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
        <DashboardHeader 
          userDisplayName={userDisplayName} 
          role={role} 
          onMenuClick={() => setIsCollapsed(false)}
        />

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
