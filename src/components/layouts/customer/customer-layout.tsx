"use client";

import React from "react";
import { LayoutDashboard, Users, MessageSquare, Star, Settings, Globe } from "lucide-react";
import { DashboardShell } from "../dashboard-shell";
import { UserRole, ROLE_LABELS } from "@/types";

const customerNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/businesses", label: "My Businesses", icon: Users },
  { href: "/dashboard/trade-intelligence", label: "Trade Intelligence", icon: Globe },
  { href: "/dashboard/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/dashboard/favorites", label: "Favorites", icon: Star },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell links={customerNav} role={ROLE_LABELS[UserRole.USER]}>
      {children}
    </DashboardShell>
  );
}
