"use client";

import React from "react";
import { Hash } from "lucide-react";
import { GenericMasterList } from "../GenericMasterList";
import { AppRoutes } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { BadgeCheck, Map, Building2 } from "lucide-react";

export function PincodeManagement() {
  const [countries, setCountries] = React.useState<any[]>([]);
  const [states, setStates] = React.useState<any[]>([]);
  const [cities, setCities] = React.useState<any[]>([]);

  // Fetch Countries
  React.useEffect(() => {
    api.get<any[]>("/api/masters/countries?status=active").then(res => {
      setCountries(Array.isArray(res) ? res : (res as any).data || []);
    }).catch(() => {});
  }, []);

  // Fetch States when country changes
  const fetchStates = (countryId: string) => {
    if (!countryId) {
      setStates([]);
      setCities([]);
      return;
    }
    api.get<any[]>(`/api/masters/states?countryId=${countryId}&status=active`).then(res => {
      setStates(Array.isArray(res) ? res : (res as any).data || []);
    }).catch(() => {});
  };

  // Fetch Cities when state changes
  const fetchCities = (stateId: string) => {
    if (!stateId) {
      setCities([]);
      return;
    }
    api.get<any[]>(`/api/masters/cities?stateId=${stateId}&status=active`).then(res => {
      setCities(Array.isArray(res) ? res : (res as any).data || []);
    }).catch(() => {});
  };

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
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* 🌍 Country Filter */}
          <Select
            value={filters.countryId || "all"}
            onValueChange={(val) => {
              const countryId = (val === "all" ? "" : val) as string;
              setFilters({ ...filters, countryId, stateId: "", cityId: "" } as any);
              fetchStates(countryId);
            }}
          >
            <SelectTrigger className="h-12 w-full sm:w-[150px] rounded-2xl bg-card/40 border-border/40 font-bold text-xs cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-primary/50" />
                <SelectValue placeholder="Country" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-3xl border-border/40 bg-card/95 backdrop-blur-3xl p-2 shadow-3xl">
              <SelectItem value="all" className="rounded-2xl font-bold text-xs py-3 cursor-pointer">
                All Countries
              </SelectItem>
              {countries.map(c => (
                <SelectItem key={c._id} value={c._id} className="rounded-2xl font-bold text-xs py-3 cursor-pointer">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 🗺️ State Filter */}
          <Select
            value={filters.stateId || "all"}
            onValueChange={(val) => {
              const stateId = (val === "all" ? "" : val) as string;
              setFilters({ ...filters, stateId, cityId: "" } as any);
              fetchCities(stateId);
            }}
            disabled={!filters.countryId}
          >
            <SelectTrigger className="h-12 w-full sm:w-[150px] rounded-2xl bg-card/40 border-border/40 font-bold text-xs cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all disabled:opacity-50">
              <div className="flex items-center gap-2">
                <Map className="h-4 w-4 text-primary/50" />
                <SelectValue placeholder="State" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-3xl border-border/40 bg-card/95 backdrop-blur-3xl p-2 shadow-3xl">
              <SelectItem value="all" className="rounded-2xl font-bold text-xs py-3 cursor-pointer">
                All States
              </SelectItem>
              {states.map(s => (
                <SelectItem key={s._id} value={s._id} className="rounded-2xl font-bold text-xs py-3 cursor-pointer">
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 🏙️ City Filter */}
          <Select
            value={filters.cityId || "all"}
            onValueChange={(val) => setFilters({ ...filters, cityId: val === "all" ? "" : val } as any)}
            disabled={!filters.stateId}
          >
            <SelectTrigger className="h-12 w-full sm:w-[150px] rounded-2xl bg-card/40 border-border/40 font-bold text-xs cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all disabled:opacity-50">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary/50" />
                <SelectValue placeholder="City" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-3xl border-border/40 bg-card/95 backdrop-blur-3xl p-2 shadow-3xl">
              <SelectItem value="all" className="rounded-2xl font-bold text-xs py-3 cursor-pointer">
                All Cities
              </SelectItem>
              {cities.map(c => (
                <SelectItem key={c._id} value={c._id} className="rounded-2xl font-bold text-xs py-3 cursor-pointer">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    />
  );
}
