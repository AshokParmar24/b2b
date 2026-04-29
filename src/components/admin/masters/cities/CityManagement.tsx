"use client";

import React from "react";
import { Building2 } from "lucide-react";
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
import { BadgeCheck, Map } from "lucide-react";

export function CityManagement() {
  const [countries, setCountries] = React.useState<any[]>([]);
  const [states, setStates] = React.useState<any[]>([]);

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
      return;
    }
    api.get<any[]>(`/api/masters/states?countryId=${countryId}&status=active`).then(res => {
      setStates(Array.isArray(res) ? res : (res as any).data || []);
    }).catch(() => {});
  };

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
          {/* 🌍 Country Filter */}
          <Select
            value={filters.countryId || "all"}
            onValueChange={(val) => {
              const countryId = val === "all" ? "" : val;
              setFilters({ ...filters, countryId, stateId: "" });
              fetchStates(countryId);
            }}
          >
            <SelectTrigger className="h-12 w-full sm:w-[180px] rounded-2xl bg-card/40 border-border/40 font-bold text-xs cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-primary/50" />
                <SelectValue placeholder="Filter by Country" />
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
            onValueChange={(val) => setFilters({ ...filters, stateId: val === "all" ? "" : val })}
            disabled={!filters.countryId}
          >
            <SelectTrigger className="h-12 w-full sm:w-[180px] rounded-2xl bg-card/40 border-border/40 font-bold text-xs cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all disabled:opacity-50">
              <div className="flex items-center gap-2">
                <Map className="h-4 w-4 text-primary/50" />
                <SelectValue placeholder="Filter by State" />
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
        </div>
      )}
    />
  );
}
