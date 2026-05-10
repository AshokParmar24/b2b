"use client";

import React, { useState, useEffect } from "react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { Filter, Hash } from "lucide-react";

interface PincodeSelectProps {
  cityId?: string;
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

export function PincodeSelect({
  cityId,
  value,
  onChange,
  label,
  subLabel,
  placeholder = "Select Pincode",
  variant = "default",
  className,
  showAllOption = false,
  disabled = false,
  error,
}: PincodeSelectProps) {
  const [pincodes, setPincodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cityId || cityId === "all") {
      setPincodes([]);
      return;
    }

    async function fetchPincodes() {
      setLoading(true);
      try {
        const response = await api.get<any>(API_ENDPOINTS.MASTERS.PINCODES, { 
          params: { cityId, limit: 1000, status: "active" } 
        });
        const rawData = Array.isArray(response) ? response : response.data || [];
        setPincodes(rawData);
      } catch (err) {
        console.error("Failed to load pincodes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPincodes();
  }, [cityId]);

  const options = React.useMemo(() => {
    const list = pincodes.map((c) => ({
      id: c._id,
      name: c.area ? `${c.pincode} - ${c.area}` : c.pincode,
    }));

    if (showAllOption) {
      return [{ id: "all", name: "All Pincodes", icon: Filter }, ...list];
    }
    return list;
  }, [pincodes, showAllOption]);

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
      disabled={disabled || loading || !cityId || cityId === "all"}
      error={error}
      icon={Hash}
    />
  );
}
