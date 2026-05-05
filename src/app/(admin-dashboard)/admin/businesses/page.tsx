"use client";

import React from "react";
import { Building2, MapPin, Tag, CheckCircle, XCircle } from "lucide-react";
import { GenericMasterList } from "@/components/admin/masters/GenericMasterList";
import { cn } from "@/lib/utils";

export default function AdminBusinessesPage() {
  const columns = [
    { 
      key: "businessName", 
      label: "Business",
      render: (value: string, item: any) => (
        <div className="flex items-center gap-4">
          <div className={cn(
            "h-12 w-12 flex-shrink-0 rounded-2xl flex items-center justify-center font-[1000] text-lg shadow-inner",
            item.logoUrl 
                ? "bg-white border border-border/50" 
                : "bg-gradient-to-br from-primary/80 to-blue-600 text-white shadow-primary/20"
          )}>
            {item.logoUrl ? (
              <img src={item.logoUrl} alt={value} className="w-full h-full object-contain p-1 rounded-2xl" />
            ) : (
              value.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0 max-w-[200px] sm:max-w-[300px]">
            <p className="font-black text-sm text-foreground truncate group-hover:text-primary transition-colors">{value}</p>
            {item.gstNumber && (
              <p className="text-[11px] font-mono font-bold text-muted-foreground/60 mt-0.5">{item.gstNumber}</p>
            )}
          </div>
        </div>
      )
    },
    { 
      key: "ownerName", 
      label: "Owner",
      render: (value: string, item: any) => (
        <div>
          <p className="text-sm font-bold text-foreground">{value}</p>
          {item.userId?.email && (
            <p className="text-xs font-semibold text-muted-foreground mt-0.5">{item.userId.email}</p>
          )}
        </div>
      )
    },
    { 
      key: "location", 
      label: "Location",
      hideOnMobile: true,
      render: (value: any, item: any) => {
        const city = item.cityId?.name;
        const state = item.stateId?.name;
        return (city || state) ? (
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
            <div className="p-1.5 rounded-lg bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <MapPin className="h-3.5 w-3.5" />
            </div>
            <span className="truncate max-w-[150px]">
              {[city, state].filter(Boolean).join(", ")}
            </span>
          </div>
        ) : <span className="text-xs text-muted-foreground/30 font-bold">—</span>
      }
    },
    { 
      key: "hsnCodes", 
      label: "HSN",
      hideOnMobile: true,
      render: (value: any[]) => (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs shadow-sm shadow-blue-500/5">
          <Tag className="h-3.5 w-3.5" />
          {value?.length || 0}
        </div>
      )
    },
    { 
      key: "isActive", 
      label: "Status",
      render: (value: boolean) => (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-[11px] uppercase tracking-wider transition-all duration-300",
          value 
            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
            : "bg-red-500/10 text-red-500 border border-red-500/20"
        )}>
          {value ? <><CheckCircle className="h-3 w-3" /> Active</> : <><XCircle className="h-3 w-3" /> Inactive</>}
        </div>
      )
    },
    {
      key: "createdAt",
      label: "Date",
      hideOnMobile: true,
      render: (value: string) => (
        <span className="text-xs font-bold text-muted-foreground">
          {new Date(value).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      )
    }
  ];

  return (
    <GenericMasterList 
      title="Business Listings"
      description="Manage all directory listings. View, edit, or remove business profiles, locations, and HSN catalog assignments."
      apiEndpoint="/api/businesses"
      addPath="/dashboard/add"
      editPath={(id) => `/admin/businesses/${id}`}
      columns={columns}
      icon={Building2}
      searchPlaceholder="Search business name, owner, or GST..."
    />
  );
}
