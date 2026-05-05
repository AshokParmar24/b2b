"use client";

import React from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Hash,
  CheckCircle2,
  Archive,
  ArrowUpDown,
  Tag,
  Package,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GenericMasterList } from "../GenericMasterList";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

export function HsnManagement() {
  const columns = [
    { 
      key: "code", 
      label: "HSN Code",
      render: (value: string, item: any) => (
        <div className="flex items-center gap-4">
          <div className={cn(
            "h-12 w-12 flex-shrink-0 rounded-2xl flex items-center justify-center font-[1000] text-xl shadow-inner",
            "bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-violet-500/20"
          )}>
            <Tag className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">{value}</p>
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">
              Standard Classification
            </p>
          </div>
        </div>
      )
    },
    { 
      key: "description", 
      label: "Description",
      hideOnMobile: true,
      render: (value: string) => (
        <div className="max-w-[300px] xl:max-w-[450px]">
          <p className="text-sm font-medium text-muted-foreground line-clamp-2 leading-relaxed">
            {value}
          </p>
        </div>
      )
    },
    { 
      key: "unit", 
      label: "Unit",
      hideOnMobile: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
            <Package className="h-3.5 w-3.5 text-purple-500/50" />
            <code className="rounded-lg bg-purple-500/5 px-2.5 py-1 text-[10px] font-black text-purple-600 uppercase tracking-widest">
              {value || "PCS"}
            </code>
        </div>
      )
    },
    { 
      key: "isActive", 
      label: "Status",
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
      title="HSN Codes"
      description="Centralized product classification codes for global trade and GST categorization."
      apiEndpoint={API_ENDPOINTS.MASTERS.HSN}
      addPath="/admin/masters/hsn/add"
      editPath={(id) => `/admin/masters/hsn/edit/${id}`}
      columns={columns}
      icon={Layers}
      searchPlaceholder="Identify HSN by code or description..."
    />
  );
}
