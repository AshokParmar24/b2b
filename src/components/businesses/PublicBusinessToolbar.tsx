"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, LayoutGrid, List, ArrowUpDown } from "lucide-react";

interface PublicBusinessToolbarProps {
  start: number;
  end: number;
  total: number;
  sort: string;
}

export function PublicBusinessToolbar({
  start,
  end,
  total,
  sort,
}: PublicBusinessToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.set("page", "1"); // Reset to page 1 on sort change
    router.push(`/businesses?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
          <Filter className="h-5 w-5 text-slate-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">
            Showing {start}–{end}
          </p>
          <p className="text-xs text-slate-500 font-medium">of {total} results</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
          <button className="h-8 w-8 flex items-center justify-center rounded-md bg-white shadow-sm text-primary">
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button className="h-8 w-8 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 transition-colors">
            <List className="h-4 w-4" />
          </button>
        </div>
        
        <div className="h-8 w-px bg-slate-200 hidden sm:block" />

        <div className="relative group">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <select 
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer hover:border-primary/30 transition-all"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="name_asc">Sort: A-Z Name</option>
            <option value="name_desc">Sort: Z-A Name</option>
          </select>
        </div>
      </div>
    </div>
  );
}
