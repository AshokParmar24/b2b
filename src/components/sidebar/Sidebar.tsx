"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  LogOut, 
  LucideIcon, 
  ChevronRight, 
  ChevronLeft,
  Settings,
  ShieldCheck,
  User as UserIcon,
  Sparkles
} from "lucide-react";
import { BrandName } from "@/components/ui/BrandName";
import { Logo } from "@/components/ui/Logo";
import { SITE_NAME } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarLink {
  href: string;
  label: string;
  icon: LucideIcon;
  children?: { href: string; label: string; icon: LucideIcon }[];
}

interface SidebarProps {
  links: SidebarLink[];
  role?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ links, role = "User", isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [openMenus, setOpenMenus] = React.useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const userInitial = session?.user?.name?.[0] || "U";
  const userName = session?.user?.name || "Authorized User";

  return (
    <TooltipProvider delay={0}>
      {/* 🌑 Mobile Overlay Backdrop */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          onClick={onToggle}
        />
      )}

      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-[70] flex h-screen flex-shrink-0 flex-col border-r border-border bg-card/95 backdrop-blur-3xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] lg:sticky lg:top-0 lg:z-50 lg:bg-card/40",
          isCollapsed 
            ? "-translate-x-full lg:translate-x-0 lg:w-24" 
            : "translate-x-0 w-[280px] sm:w-80 shadow-2xl lg:shadow-none"
        )}
      >
        {/* 🔘 Advanced Toggle Button (Desktop Only) */}
        <button
          onClick={onToggle}
          className="absolute -right-4 top-12 z-50 hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-background shadow-xl transition-all hover:scale-110 hover:border-primary hover:text-primary active:scale-90 group lg:flex"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          ) : (
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          )}
        </button>

        {/* 🎭 STATIC LOGO SECTION */}
        <div className={cn(
          "relative flex flex-col gap-6 pt-10 pb-8 transition-all",
          isCollapsed ? "items-center px-4" : "px-8"
        )}>
          {/* Decorative background glow */}
          <div className="absolute top-0 left-0 -z-10 h-40 w-full bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-2xl" />
          
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-4 no-underline group"
          >
            <div className="relative">
              <div className="absolute -inset-2 rounded-[18px] bg-primary/20 blur-lg opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative rounded-[16px] bg-primary p-2.5 shadow-2xl shadow-primary/30 transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110">
                <Logo width={30} height={30} variant="white" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
                <BrandName isSpan className="text-2xl font-black tracking-tight" />
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/70">
                    {role} Control
                  </span>
                </div>
              </div>
            )}
          </Link>
        </div>

        {/* 📜 SCROLLABLE CONTENT AREA */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar px-4 pb-8">
            <div className={cn(
              "mb-3 px-4 text-[10px] font-black tracking-[0.3em] text-muted-foreground/40 uppercase transition-all",
              isCollapsed && "opacity-0 h-0 mb-0"
            )}>
              Dashboard Services
            </div>

            {links.map(({ href, label, icon: Icon, children }) => {
              const isActive = pathname === href || (children?.some(child => pathname === child.href));
              const isMenuOpen = openMenus.includes(label);
              
              const linkContent = (
                <div
                  role="button"
                  onClick={() => children && !isCollapsed ? toggleMenu(label) : null}
                  className={cn(
                    "flex cursor-pointer items-center rounded-2xl py-3 no-underline transition-all duration-300 group relative overflow-hidden",
                    isCollapsed ? "justify-center px-0" : "justify-between px-5",
                    isActive && !children
                      ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/30"
                      : isActive && children
                      ? "bg-primary/5 text-primary"
                      : "font-semibold text-muted-foreground hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={cn(
                      "flex h-6 w-6 items-center justify-center transition-transform group-hover:scale-120",
                      isActive && !children ? "text-primary-foreground" : isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-primary"
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {!isCollapsed && (
                      <span className="text-sm tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-500">
                        {label}
                      </span>
                    )}
                  </div>
                  
                  {!isCollapsed && (
                    <div className="flex items-center relative z-10">
                      {children ? (
                        <ChevronRight className={cn("h-4 w-4 transition-transform duration-300", isMenuOpen && "rotate-90")} />
                      ) : isActive ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground/20">
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      ) : (
                        <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                      )}
                    </div>
                  )}

                  {isActive && !children && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-foreground/5 to-transparent" />
                  )}
                </div>
              );

              return (
                <div key={label} className="space-y-1">
                  {children ? (
                    isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger>{linkContent}</TooltipTrigger>
                        <TooltipContent side="right" sideOffset={20} className="font-bold">
                          {label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      linkContent
                    )
                  ) : (
                    <Link href={href} className="block no-underline">
                      {isCollapsed ? (
                        <Tooltip>
                          <TooltipTrigger>{linkContent}</TooltipTrigger>
                          <TooltipContent side="right" sideOffset={20} className="font-bold">
                            {label}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        linkContent
                      )}
                    </Link>
                  )}

                  {!isCollapsed && children && isMenuOpen && (
                    <div className="mt-1 space-y-1 overflow-hidden animate-in slide-in-from-top-2 duration-300">
                      {children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "group relative flex h-10 items-center gap-3 rounded-xl px-4 ml-6 transition-all duration-300",
                              isChildActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground"
                            )}
                          >
                            {isChildActive && (
                              <div className="absolute left-0 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.6)]" />
                            )}
                            <child.icon className={cn(
                              "h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110",
                              isChildActive ? "text-primary" : "text-muted-foreground/40 group-hover:text-primary/60"
                            )} />
                            <span className={cn(
                              "text-xs font-bold tracking-tight",
                              isChildActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"
                            )}>
                              {child.label}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Quick Actions for Admins or Special Users */}
            {!isCollapsed && role === "Admin" && (
              <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="mb-3 px-4 text-[10px] font-black tracking-[0.3em] text-muted-foreground/40 uppercase">
                  Management
                </div>
                <div className="px-2">
                  <div className="rounded-3xl bg-primary/5 p-4 border border-primary/10">
                    <p className="text-[10px] font-black text-primary/70 mb-2 uppercase flex items-center gap-2">
                      <Sparkles className="h-3 w-3" /> System Health
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Server Load</span>
                      <span className="text-xs font-black text-emerald-500">98% Optimal</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* 👤 USER PROFILE SECTION */}
          <div className="mt-auto border-t border-border/50 bg-muted/20 p-6 backdrop-blur-md">
            <div className={cn(
              "flex items-center gap-4 transition-all",
              isCollapsed ? "flex-col items-center gap-6" : "flex-row"
            )}>
              <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-xl ring-2 ring-background transition-transform hover:scale-110">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback className="bg-primary text-primary-foreground font-black text-lg">
                  {userInitial}
                </AvatarFallback>
              </Avatar>

              {!isCollapsed && (
                <div className="flex flex-1 flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
                  <span className="truncate text-sm font-black text-foreground">{userName}</span>
                  <span className="truncate text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider">
                    {role} Account
                  </span>
                </div>
              )}

              {!isCollapsed && (
                <Tooltip>
                  <TooltipTrigger>
                    <div 
                      role="button"
                      tabIndex={0}
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl bg-destructive/5 text-destructive transition-all hover:bg-destructive hover:text-white hover:shadow-lg hover:shadow-destructive/20 active:scale-90 group"
                    >
                      <LogOut className="h-5 w-5 transition-transform group-hover:rotate-12" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">Logout Session</TooltipContent>
                </Tooltip>
              )}

              {isCollapsed && (
                <Tooltip>
                  <TooltipTrigger>
                    <div 
                      role="button"
                      tabIndex={0}
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl bg-destructive/10 text-destructive transition-all hover:scale-110 active:scale-90"
                    >
                      <LogOut className="h-5 w-5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={20}>Logout</TooltipContent>
                </Tooltip>
              )}
            </div>

            {!isCollapsed && (
              <div className="mt-2 flex gap-2">
                <div 
                  role="button"
                  tabIndex={0}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background/50 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
                >
                  <Settings className="h-3 w-3" /> Settings
                </div>
                <div 
                  role="button"
                  tabIndex={0}
                  className="flex cursor-pointer items-center justify-center rounded-xl bg-emerald-500/10 px-3 py-2 text-emerald-600 transition-all hover:bg-emerald-500 hover:text-white"
                >
                  <ShieldCheck className="h-3 w-3" />
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
