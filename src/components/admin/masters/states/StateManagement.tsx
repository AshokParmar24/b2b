"use client";

import React from "react";
import { Map, BadgeCheck, Loader2, Globe, Filter } from "lucide-react";
import { GenericMasterList } from "../GenericMasterList";
import { AppRoutes } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
import { CountrySelect } from "@/components/common/CountrySelect";
import { cn } from "@/lib/utils";

export function StateManagement() {
  const columns = [
    {
      key: "name",
      label: "State Name",
      render: (value: string) => (
        <div className="flex items-center gap-4">
          <div className={cn(
            "h-12 w-12 flex-shrink-0 rounded-2xl flex items-center justify-center font-[1000] text-xl shadow-inner",
            "bg-gradient-to-br from-primary/80 to-blue-600 text-white shadow-primary/20"
          )}>
            {value?.charAt(0)?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">{value}</p>
          </div>
        </div>
      )
    },
    {
      key: "countryName", // Assuming the API returns joined country name
      label: "Country",
      hideOnMobile: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            {value || "Global"}
          </span>
        </div>
      )
    },
    {
      key: "code",
      label: "State Code",
      hideOnMobile: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <code className="rounded-xl bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-black text-primary uppercase tracking-widest shadow-sm">
            {value || "N/A"}
          </code>
        </div>
      )
    },
    {
      key: "isActive",
      label: "Status",
      hideOnMobile: true,
      render: (value: boolean) => (
        value ? (
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full font-black text-[11px] uppercase tracking-wider transition-all duration-300 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            Active
          </div>
        ) : (
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full font-black text-[11px] uppercase tracking-wider transition-all duration-300 bg-destructive/10 text-destructive border border-destructive/20">
            Archived
          </div>
        )
      )
    }
  ];

  return (
    <GenericMasterList
      title="States"
      description="Regional administrative divisions and territories mapped to countries."
      apiEndpoint="/api/masters/states"
      addPath={AppRoutes.ADMIN_MASTERS_STATES_ADD}
      editPath={(id) => `${AppRoutes.ADMIN_MASTERS_STATES_EDIT}/${id}`}
      columns={columns}
      icon={Map}
      searchPlaceholder="Identify state by name, country or code..."
      renderExtraFilters={(filters, setFilters) => (
        <div className="flex items-center gap-3">
          <CountrySelect
            value={filters.countryId || "all"}
            onChange={(val) => setFilters({ ...filters, countryId: val === "all" ? "" : val } as any)}
            variant="premium"
            subLabel="Region Filter"
            placeholder="Filter by Country"
            showAllOption
            className="w-full sm:w-[240px]"
          />
        </div>
      )}
    />
  );
}
