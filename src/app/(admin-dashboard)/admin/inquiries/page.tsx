"use client";

import React from "react";
import { MessageSquare, Mail, Phone, Building2, Trash2 } from "lucide-react";
import { GenericMasterList } from "@/components/admin/masters/GenericMasterList";
import { cn } from "@/lib/utils";

export default function AdminInquiriesPage() {
  const columns = [
    {
      key: "sender",
      label: "Sender",
      render: (value: string, item: any) => (
        <div className="flex flex-col">
          <span className="font-black text-foreground group-hover:text-primary transition-colors">{item.name}</span>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
              <Mail className="h-3 w-3" /> {item.email}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
              <Phone className="h-3 w-3" /> {item.mobile}
            </span>
          </div>
        </div>
      )
    },
    {
      key: "businessTarget",
      label: "Business Target",
      hideOnMobile: true,
      render: (value: string, item: any) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary/40" />
          <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
            {item.businessId?.businessName || "Deleted Business"}
          </span>
        </div>
      )
    },
    {
      key: "message",
      label: "Message Snippet",
      hideOnMobile: true,
      render: (value: string) => (
        <p className="text-xs font-medium text-muted-foreground truncate max-w-[250px]">
          {value}
        </p>
      )
    },
    {
      key: "isActive",
      label: "Status",
      render: (value: boolean, item: any) => (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
          item.status === "pending"
            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
            : item.status === "responded"
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            : "bg-red-500/10 text-red-600 border-red-500/20"
        )}>
          {item.status || "Unknown"}
        </div>
      )
    }
  ];

  return (
    <GenericMasterList 
      title="Manage Inquiries"
      description="Monitor and moderate messages sent by potential buyers to registered businesses."
      apiEndpoint="/api/inquiries"
      addPath=""
      editPath={(id) => `#`} // Normally an inquiry detail page
      columns={columns}
      icon={MessageSquare}
      searchPlaceholder="Search sender name, email, or message..."
    />
  );
}
