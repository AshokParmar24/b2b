"use client";

import React from "react";
import { Building2 } from "lucide-react";
import { GenericMasterList } from "../GenericMasterList";
import { AppRoutes } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
import { CountrySelect } from "@/components/common/CountrySelect";
import { StateSelect } from "@/components/common/StateSelect";
import { cn } from "@/lib/utils";

export function CityManagement() {

  const columns = [
    { 
      key: "name", 
      label: "City Name",
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
      key: "stateName", 
      label: "State",
      render: (value: string) => (
        <span className="text-xs font-bold text-muted-foreground/70 uppercase tracking-tighter">
          {value || "Unknown"}
        </span>
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
            Archived
          </div>
        )
      )
    }
  ];

  return (
    <GenericMasterList 
      title="Cities"
      description="Urban centers and municipalities categorized by state and region."
      apiEndpoint="/api/masters/cities"
      addPath={AppRoutes.ADMIN_MASTERS_CITIES_ADD}
      editPath={(id) => `${AppRoutes.ADMIN_MASTERS_CITIES_EDIT}/${id}`}
      columns={columns}
      icon={Building2}
      searchPlaceholder="Identify city by name or state..."
      renderExtraFilters={(filters, setFilters) => (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <CountrySelect
            value={filters.countryId || "all"}
            onChange={(val) => {
              setFilters({ ...filters, countryId: val === "all" ? "" : val, stateId: "" } as any);
            }}
            variant="premium"
            placeholder="Filter by Country"
            showAllOption
            className="w-full sm:w-[200px]"
          />

          <StateSelect
            countryId={filters.countryId}
            value={filters.stateId || "all"}
            onChange={(val) => setFilters({ ...filters, stateId: val === "all" ? "" : val } as any)}
            variant="premium"
            placeholder="Filter by State"
            showAllOption
            className="w-full sm:w-[200px]"
          />
        </div>
      )}
    />
  );
}
