"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Loader2, 
  Globe,
  ArrowUpDown,
  Filter
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { GenericMasterList } from "../GenericMasterList";
import { AppRoutes } from "@/lib/routes";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

export function CountryManagement() {
  const columns = [
    { 
      key: "name", 
      label: "Country Name",
      render: (value: string, item: any) => (
        <div className="flex items-center gap-4">
          <span className="text-2xl">{item.flag || "🏳️"}</span>
          <div className="flex flex-col">
            <span className="font-bold text-foreground text-sm tracking-tight">{value}</span>
            <span className="text-[10px] font-black text-primary uppercase lg:hidden">
              {item.code} • +{item.phoneCode}
            </span>
          </div>
        </div>
      )
    },
    { 
      key: "code", 
      label: "ISO Code",
      hideOnMobile: true,
      render: (value: string) => (
        <code className="rounded-xl bg-primary/5 px-3 py-1.5 text-xs font-black text-primary uppercase tracking-wider">
          {value}
        </code>
      )
    },
    { 
      key: "phoneCode", 
      label: "Phone Prefix",
      hideOnMobile: true,
      render: (value: string) => (
        <span className="font-black text-xs text-muted-foreground/80">+{value}</span>
      )
    },
    { 
      key: "currencyCode", 
      label: "Currency",
      hideOnMobile: true,
      render: (value: string, item: any) => (
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-primary">{item.currencySymbol || "—"}</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase">{value || "N/A"}</span>
        </div>
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
      title="Countries"
      description="Global directory of supported countries and international region codes."
      apiEndpoint={API_ENDPOINTS.MASTERS.COUNTRIES}
      addPath={AppRoutes.ADMIN_MASTERS_COUNTRIES_ADD}
      editPath={(id) => `${AppRoutes.ADMIN_MASTERS_COUNTRIES_EDIT}/${id}`}
      columns={columns}
      icon={Globe}
      searchPlaceholder="Identify country by name, code or prefix..."
    />
  );
}
