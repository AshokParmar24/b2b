"use client";

import React from "react";
import {
    LayoutDashboard,
    Building2,
    Users,
    CreditCard,
    MapPin,
    Upload,
    Globe,
    Map,
    MapPinned,
    Milestone,
    Hash
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "../dashboard-shell";
import { UserRole, ROLE_LABELS } from "@/types";

import { AppRoutes } from "@/lib/routes";

const adminNav = [
    { href: AppRoutes.ADMIN_DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
    { href: AppRoutes.ADMIN_USERS, label: "Users", icon: Users },
    { href: AppRoutes.ADMIN_PLANS, label: "Plans", icon: CreditCard },
    { 
        href: AppRoutes.ADMIN_MASTERS, 
        label: "Masters", 
        icon: MapPin,
        children: [
            { href: AppRoutes.ADMIN_MASTERS_COUNTRIES, label: "Countries", icon: Globe },
            { href: "/admin/masters/states", label: "States", icon: Map },

            { href: "/admin/masters/cities", label: "Cities", icon: Milestone },
            { href: "/admin/masters/pincodes", label: "Pincodes", icon: Hash },
        ]
    },
    { href: AppRoutes.ADMIN_IMPORT, label: "Bulk Import", icon: Upload },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    // 🛡️ Authorization: Ensure user is an Admin
    if (status === "authenticated" && (session?.user as any)?.role !== UserRole.ADMIN) {
        router.push("/dashboard");
        return null;
    }

    return (
        <DashboardShell links={adminNav} role={ROLE_LABELS[UserRole.ADMIN]}>
            {children}
        </DashboardShell>
    );
}
