"use client";

import React from "react";
import { Search, Bell, User, Menu } from "lucide-react";

interface DashboardHeaderProps {
  userDisplayName: string;
  role: string;
  onMenuClick?: () => void;
}

export function DashboardHeader({ userDisplayName, role, onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-border bg-background/80 px-6 md:px-8 backdrop-blur-md">
      <div className="flex items-center gap-4 md:gap-6 flex-1">
        <button 
          onClick={onMenuClick}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-muted/30 lg:hidden hover:bg-background transition-all"
        >
          <Menu className="h-5 w-5" />
        </button>
        
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
            <span className="text-xs font-black text-foreground">{userDisplayName}</span>
            <span className="text-[10px] font-bold text-muted-foreground leading-none">Verified {role}</span>
          </div>
        </button>
      </div>
    </header>
  );
}
