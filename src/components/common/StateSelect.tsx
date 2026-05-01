"use client";

import React, { useState, useEffect } from "react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { Filter, Map } from "lucide-react";

interface StateSelectProps {
  countryId?: string;
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

export function StateSelect({
  countryId,
  value,
  onChange,
  label,
  subLabel,
  placeholder = "Select State",
  variant = "default",
  className,
  showAllOption = false,
  disabled = false,
  error,
}: StateSelectProps) {
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!countryId || countryId === "all") {
      setStates([]);
      return;
    }

    async function fetchStates() {
      setLoading(true);
      try {
        const response = await api.get<any>(API_ENDPOINTS.MASTERS.STATES, { 
          params: { countryId, limit: 1000, status: "active" } 
        });
        const rawData = Array.isArray(response) ? response : response.data || [];
        setStates(rawData);
      } catch (err) {
        console.error("Failed to load states:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStates();
  }, [countryId]);

  const options = React.useMemo(() => {
    const list = states.map((s) => ({
      id: s._id,
      name: s.name,
      subName: s.code,
    }));

    if (showAllOption) {
      return [{ id: "all", name: "All States", icon: Filter }, ...list];
    }
    return list;
  }, [states, showAllOption]);

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
      disabled={disabled || loading || !countryId || countryId === "all"}
      error={error}
      icon={Map}
    />
  );
}
