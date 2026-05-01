"use client";

import React from "react";
import { Building2 } from "lucide-react";
import { GenericMasterList } from "../GenericMasterList";
import { AppRoutes } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
import { CountrySelect } from "@/components/common/CountrySelect";
import { StateSelect } from "@/components/common/StateSelect";

export function CityManagement() {

  const columns = [
    { 
      key: "name", 
      label: "City Name",
      render: (value: string) => (
        <span className="font-bold text-foreground text-sm tracking-tight">{value}</span>
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
        <Badge variant={value ? "success" : "secondary"} className="text-[9px] px-2.5 py-1 uppercase tracking-tighter">
          {value ? "Active" : "Archived"}
        </Badge>
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
