"use client";

import React from "react";
import { Users, Phone, MapPin, Crown, UserCheck, ShieldAlert, CheckCircle2, Crown as CrownIcon } from "lucide-react";
import { GenericMasterList } from "@/components/admin/masters/GenericMasterList";
import { AppRoutes } from "@/lib/routes";
import { UserRole } from "@/types/models";
import RoleBadge from "@/components/ui/role-badge";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const columns = [
    { 
      key: "name", 
      label: "User",
      render: (value: string, item: any) => (
        <div className="flex items-center gap-4">
          <div className={cn(
            "h-12 w-12 flex-shrink-0 rounded-2xl flex items-center justify-center font-[1000] text-lg shadow-inner",
            item.role === UserRole.ADMIN 
              ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/20" 
              : "bg-gradient-to-br from-primary/80 to-emerald-500 text-white shadow-primary/20"
          )}>
            {value?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">{value}</p>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5 truncate max-w-[200px]">{item.email}</p>
          </div>
        </div>
      )
    },
    { 
      key: "mobile", 
      label: "Contact",
      hideOnMobile: true,
      render: (value: string, item: any) => (
        value ? (
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
            <div className="p-1.5 rounded-lg bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Phone className="h-3.5 w-3.5" />
            </div>
            {item.mobileCode} {value}
          </div>
        ) : <span className="text-xs text-muted-foreground/30 font-bold">—</span>
      )
    },
    { 
      key: "location", 
      label: "Location",
      hideOnMobile: true,
      render: (value: any, item: any) => (
        item.cityId?.name || item.stateId?.name ? (
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
            <div className="p-1.5 rounded-lg bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <MapPin className="h-3.5 w-3.5" />
            </div>
            <span className="truncate max-w-[150px]">
              {[item.cityId?.name, item.stateId?.name].filter(Boolean).join(", ")}
            </span>
          </div>
        ) : <span className="text-xs text-muted-foreground/30 font-bold">—</span>
      )
    },
    { 
      key: "role", 
      label: "Role",
      render: (value: number) => (
        <div className="inline-flex scale-95 origin-left">
          <RoleBadge role={value} />
        </div>
      )
    },
    { 
      key: "planId", 
      label: "Plan",
      hideOnMobile: true,
      render: (value: any) => (
        value ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 font-bold text-xs shadow-sm shadow-violet-500/5">
            <CrownIcon className="h-3.5 w-3.5" />
            {value.name}
          </div>
        ) : <span className="text-[11px] font-bold text-muted-foreground/40 bg-muted/30 px-2.5 py-1 rounded-lg">Free / Basic</span>
      )
    },
    { 
      key: "isActive", 
      label: "Status",
      render: (value: boolean) => (
        value ? (
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full font-black text-[11px] uppercase tracking-wider transition-all duration-300 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            Active
          </div>
        ) : (
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full font-black text-[11px] uppercase tracking-wider transition-all duration-300 bg-destructive/10 text-destructive border border-destructive/20">
            Suspended
          </div>
        )
      )
    }
  ];

  return (
    <GenericMasterList 
      title="Users Directory"
      description="Manage administrators and members. Activate, suspend, or update permissions."
      apiEndpoint="/api/users"
      addPath={AppRoutes.ADMIN_USERS_ADD}
      editPath={(id) => `${AppRoutes.ADMIN_USERS_EDIT}/${id}`}
      columns={columns}
      icon={Users}
      searchPlaceholder="Search user name or email..."
    />
  );
}
