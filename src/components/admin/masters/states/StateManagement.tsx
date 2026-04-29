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
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Map className="h-4 w-4 text-primary" />
          </div>
          <span className="font-bold text-foreground text-sm tracking-tight">{value}</span>
        </div>
      )
    },
    {
      key: "countryName", // Assuming the API returns joined country name
      label: "Country",
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
      render: (value: boolean) => (
        <Badge variant={value ? "success" : "destructive"} className={cn(
          "text-[10px] px-3 py-1.5 uppercase tracking-widest font-black rounded-xl border-2 transition-all",
          value 
            ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" 
            : "bg-rose-500/10 text-rose-700 border-rose-500/20"
        )}>
          {value ? "Active" : "Archived"}
        </Badge>
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
            onChange={(val) => setFilters({ ...filters, countryId: val === "all" ? "" : val })}
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
