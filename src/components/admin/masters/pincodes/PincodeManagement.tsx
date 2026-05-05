"use client";

import React from "react";
import { Hash } from "lucide-react";
import { GenericMasterList } from "../GenericMasterList";
import { AppRoutes } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
import { CountrySelect } from "@/components/common/CountrySelect";
import { StateSelect } from "@/components/common/StateSelect";
import { CitySelect } from "@/components/common/CitySelect";
import { cn } from "@/lib/utils";

export function PincodeManagement() {
  const columns = [
    { 
      key: "pincode", 
      label: "Postal Code",
      render: (value: string) => (
        <div className="flex items-center gap-4">
          <div className={cn(
            "h-12 w-12 flex-shrink-0 rounded-2xl flex items-center justify-center font-[1000] text-xl shadow-inner",
            "bg-gradient-to-br from-primary/80 to-blue-600 text-white shadow-primary/20"
          )}>
            {value?.charAt(0)}
          </div>
          <div className="min-w-0">
            <code className="rounded-xl bg-primary/5 px-3 py-1.5 text-xs font-black text-primary tracking-widest">{value}</code>
          </div>
        </div>
      )
    },
    { 
      key: "area", 
      label: "Area Name",
      hideOnMobile: true,
      render: (value: string) => (
        <span className="font-bold text-foreground text-sm tracking-tight">{value}</span>
      )
    },
    { 
      key: "cityName", 
      label: "City",
      render: (value: string) => (
        <span className="text-xs font-bold text-muted-foreground/70 uppercase tracking-tighter">
          {value || "Unknown"}
        </span>
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
      title="Pincodes"
      description="Postal identification codes mapped to areas and cities for logistics."
      apiEndpoint="/api/masters/pincodes"
      addPath={AppRoutes.ADMIN_MASTERS_PINCODES_ADD}
      editPath={(id) => `${AppRoutes.ADMIN_MASTERS_PINCODES_EDIT}/${id}`}
      columns={columns}
      icon={Hash}
      searchPlaceholder="Identify postal code by number, area or city..."
      renderExtraFilters={(filters, setFilters) => (
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <CountrySelect
            value={filters.countryId || "all"}
            onChange={(val) => {
              setFilters({ ...filters, countryId: val === "all" ? "" : val, stateId: "", cityId: "" } as any);
            }}
            variant="premium"
            placeholder="Country"
            showAllOption
            className="w-full sm:w-[150px]"
          />

          <StateSelect
            countryId={filters.countryId}
            value={filters.stateId || "all"}
            onChange={(val) => {
              setFilters({ ...filters, stateId: val === "all" ? "" : val, cityId: "" } as any);
            }}
            variant="premium"
            placeholder="State"
            showAllOption
            className="w-full sm:w-[150px]"
          />

          <CitySelect
            stateId={filters.stateId}
            value={filters.cityId || "all"}
            onChange={(val) => setFilters({ ...filters, cityId: val === "all" ? "" : val } as any)}
            variant="premium"
            placeholder="City"
            showAllOption
            className="w-full sm:w-[150px]"
          />
        </div>
      )}
    />
  );
}
