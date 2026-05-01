"use client";

import React, { useState, useEffect } from "react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { Filter, Building2 } from "lucide-react";

interface CitySelectProps {
  stateId?: string;
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  subLabel?: string;
  placeholder?: string;
  variant?: "default" | "premium";
  className?: string;
  showAllOption?: boolean;
  disabled?: boolean;
  error?: string | boolean;
}

export function CitySelect({
  stateId,
  value,
  onChange,
  label,
  subLabel,
  placeholder = "Select City",
  variant = "default",
  className,
  showAllOption = false,
  disabled = false,
  error,
}: CitySelectProps) {
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stateId || stateId === "all") {
      setCities([]);
      return;
    }

    async function fetchCities() {
      setLoading(true);
      try {
        const response = await api.get<any>(API_ENDPOINTS.MASTERS.CITIES, { 
          params: { stateId, limit: 1000, status: "active" } 
        });
        const rawData = Array.isArray(response) ? response : response.data || [];
        setCities(rawData);
      } catch (err) {
        console.error("Failed to load cities:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCities();
  }, [stateId]);

  const options = React.useMemo(() => {
    const list = cities.map((c) => ({
      id: c._id,
      name: c.name,
    }));

    if (showAllOption) {
      return [{ id: "all", name: "All Cities", icon: Filter }, ...list];
    }
    return list;
  }, [cities, showAllOption]);

  return (
    <SearchableSelect
      label={label}
      subLabel={subLabel}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={loading ? "Loading directory..." : placeholder}
      variant={variant}
      className={className}
      disabled={disabled || loading || !stateId || stateId === "all"}
      error={error}
      icon={Building2}
    />
  );
}
