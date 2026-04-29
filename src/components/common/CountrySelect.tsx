"use client";

import React, { useState, useEffect } from "react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { Filter, Globe } from "lucide-react";

interface CountrySelectProps {
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

/**
 * 🌍 REUSABLE COUNTRY SELECTION COMPONENT
 * Handles API fetching, loading states, and premium "Elite" branding.
 */
export function CountrySelect({
  value,
  onChange,
  label,
  subLabel,
  placeholder = "Select Country",
  variant = "default",
  className,
  showAllOption = false,
  disabled = false,
  error,
}: CountrySelectProps) {
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCountries() {
      setLoading(true);
      try {
        const response = await api.get<any>(API_ENDPOINTS.MASTERS.COUNTRIES, { 
          params: { limit: 1000, status: "active" } 
        });
        const rawData = Array.isArray(response) ? response : response.data || [];
        setCountries(rawData);
      } catch (err) {
        console.error("Failed to load countries:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCountries();
  }, []);

  const options = React.useMemo(() => {
    const list = countries.map((c) => ({
      id: c._id,
      name: c.name,
      flag: c.flag,
    }));

    if (showAllOption) {
      return [{ id: "all", name: "All Global Regions", icon: Filter }, ...list];
    }
    return list;
  }, [countries, showAllOption]);

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
      disabled={disabled || loading}
      error={error}
      icon={Globe}
    />
  );
}
