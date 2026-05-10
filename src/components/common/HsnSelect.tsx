"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Tag } from "lucide-react";

interface HsnCode {
  _id: string;
  code: string;
  description?: string;
}

interface HsnSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showAllOption?: boolean;
  variant?: "default" | "premium";
}

export function HsnSelect({
  value,
  onChange,
  placeholder = "Select HSN Code",
  className,
  disabled = false,
  showAllOption = false,
  variant = "default",
}: HsnSelectProps) {
  const [hsnCodes, setHsnCodes] = useState<HsnCode[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHsnCodes = async () => {
      try {
        setLoading(true);
        const response = await api.get(API_ENDPOINTS.MASTERS.HSN);
        // API might return { data: [...] } or just [...]
        const data = response.data || response;
        if (Array.isArray(data)) {
          setHsnCodes(data);
        }
      } catch (error) {
        console.error("Error fetching HSN codes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHsnCodes();
  }, []);

  const options = hsnCodes.map((h) => ({
    value: h.code, // We filter by code string in the URL
    label: `${h.code}${h.description ? ` - ${h.description}` : ""}`,
    icon: <Tag className="w-3.5 h-3.5" />,
  }));

  if (showAllOption) {
    options.unshift({
      value: "all",
      label: "All HSN Codes",
      icon: <Tag className="w-3.5 h-3.5" />,
    });
  }

  return (
    <SearchableSelect
      options={options}
      value={value || (showAllOption ? "all" : "")}
      onChange={onChange}
      placeholder={loading ? "Loading HSN..." : placeholder}
      className={className}
      disabled={disabled || loading}
      variant={variant}
    />
  );
}
