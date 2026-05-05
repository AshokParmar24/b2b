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
          <div className={cn(
            "h-12 w-12 flex-shrink-0 rounded-2xl flex items-center justify-center font-[1000] text-xl shadow-inner",
            "bg-gradient-to-br from-primary/80 to-blue-600 text-white shadow-primary/20"
          )}>
            {item.flag ? item.flag : value?.charAt(0)?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">{value}</p>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5 truncate lg:hidden">
              {item.code} • +{item.phoneCode}
            </p>
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
