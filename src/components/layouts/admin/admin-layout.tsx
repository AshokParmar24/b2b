"use client";

import React from "react";
import {
    LayoutDashboard,
    Building2,
    Users,
    CreditCard,
    MapPin,
    Upload,
} from "lucide-react";
import { DashboardShell } from "../dashboard-shell";
import { UserRole, ROLE_LABELS } from "@/types";

const adminNav = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/businesses", label: "Businesses", icon: Building2 },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/plans", label: "Plans", icon: CreditCard },
    { href: "/admin/masters", label: "Masters", icon: MapPin },
    { href: "/admin/import", label: "Bulk Import", icon: Upload },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardShell links={adminNav} role={ROLE_LABELS[UserRole.ADMIN]}>
            {children}
        </DashboardShell>
    );
}
