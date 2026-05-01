"use client";

import React from "react";
import { Hash } from "lucide-react";
import { GenericMasterList } from "../GenericMasterList";
import { AppRoutes } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
import { CountrySelect } from "@/components/common/CountrySelect";
import { StateSelect } from "@/components/common/StateSelect";
import { CitySelect } from "@/components/common/CitySelect";

export function PincodeManagement() {
  const columns = [
    { 
      key: "pincode", 
      label: "Postal Code",
      render: (value: string) => (
        <code className="rounded-xl bg-primary/5 px-3 py-1.5 text-xs font-black text-primary tracking-widest">
          {value}
        </code>
      )
    },
    { 
      key: "area", 
      label: "Area Name",
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
      render: (value: boolean) => (
        <Badge variant={value ? "success" : "secondary"} className="text-[9px] px-2.5 py-1 uppercase tracking-tighter">
          {value ? "Active" : "Archived"}
        </Badge>
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
