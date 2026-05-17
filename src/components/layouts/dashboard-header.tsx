"use client";

import React from "react";
import { Search, Bell, User, Menu, X, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { BrandName } from "@/components/ui/BrandName";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  userDisplayName: string;
  role: string;
  onMenuClick?: () => void;
}

export function DashboardHeader({ userDisplayName, role, onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-border/50 bg-background/60 px-4 md:px-8 backdrop-blur-xl">
      <div className="flex items-center gap-4 md:gap-6 flex-1">
        {/* 🍔 Mobile Hamburger Trigger */}
        <button 
          onClick={onMenuClick}
          className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-muted/30 lg:hidden hover:bg-background transition-all active:scale-90"
          aria-label="Toggle Menu"
        >
          <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Menu className="h-5 w-5 text-foreground/70 group-hover:text-primary transition-colors" />
        </button>

        {/* 🏢 Mobile Logo (Hidden on Desktop) */}
        <div className="flex lg:hidden items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Logo width={20} height={20} variant="white" />
          </div>
          <BrandName isSpan className="text-lg font-black tracking-tight" />
        </div>
        
        {/* 🔍 Desktop Search Bar */}
        <div className="relative w-full max-w-md group hidden lg:block">
          <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search data, reports or logs..."
              className="h-11 w-full rounded-2xl border border-border/50 bg-muted/20 pl-11 pr-4 text-sm outline-none transition-all focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/5 font-bold"
            />
          </div>
        </div>
      </div>

      {/* 🔔 Notifications & Profile */}
      <div className="flex items-center gap-3 md:gap-4">
        <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-muted/30 transition-all hover:bg-background hover:shadow-sm active:scale-90 group">
          <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Bell className="h-5 w-5 text-muted-foreground/60 group-hover:text-primary transition-colors" />
          <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
        </button>
        
        <div className="h-8 w-[1px] bg-border/50 mx-1 hidden sm:block" />

        <button className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 p-1 pr-4 transition-all hover:bg-background hover:shadow-xl hover:shadow-black/5 group active:scale-[0.98]">
          <div className="relative">
            <div className="absolute -inset-1 bg-primary/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <User className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="flex flex-col text-left hidden sm:flex">
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-foreground">{userDisplayName}</span>
              <Sparkles className="h-3 w-3 text-primary animate-pulse" />
            </div>
            <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest leading-none">
              {role}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
}
