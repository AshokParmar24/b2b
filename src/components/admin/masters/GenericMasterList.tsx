"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Globe,
  Filter,
  Loader2,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArchiveRestore,
  Archive,
  Hash,
  CheckCircle2,
  Eye,
  EyeOff,
  Download,
  Check,
  MoreHorizontal,
  ChevronDown,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppRoutes } from "@/lib/routes";
import { MASTER_PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE } from "@/lib/constants";
import * as XLSX from 'xlsx';

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
  hideOnMobile?: boolean;
}

interface GenericMasterListProps {
  title: string;
  description: string;
  apiEndpoint: string;
  addPath: string;
  editPath: (id: string) => string;
  columns: Column[];
  searchPlaceholder?: string;
  icon?: React.ElementType;
  initialFilters?: Record<string, string>;
  renderExtraFilters?: (filters: Record<string, string>, setFilters: (f: Record<string, string>) => void) => React.ReactNode;
  statusTabs?: { id: string; label: string; icon: React.ElementType }[];
}

export function GenericMasterList({
  title,
  description,
  apiEndpoint,
  addPath,
  editPath,
  columns,
  searchPlaceholder = "Search records...",
  icon: Icon = Globe,
  initialFilters = {},
  renderExtraFilters,
  statusTabs = [
    { id: "active", label: "Active", icon: CheckCircle2 },
    { id: "archived", label: "Archived", icon: EyeOff },
    { id: "all", label: "All", icon: Filter },
  ]
}: GenericMasterListProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [extraFilters, setExtraFilters] = useState<Record<string, string>>(initialFilters);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<"active" | "archived" | "all">("all");
  const [isInitialized, setIsInitialized] = useState(false);

  // 📄 Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [archivedCount, setArchivedCount] = useState(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkAction, setIsBulkAction] = useState(false);
  const [currentBulkAction, setCurrentBulkAction] = useState<'archive' | 'restore' | null>(null);

  // ⏱️ Debounce search query to prevent API spam
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (isInitialized) {
      fetchItems();
    }
  }, [apiEndpoint, debouncedSearch, sortField, sortOrder, statusFilter, currentPage, pageSize, isInitialized, extraFilters]);

  // 💾 PERSISTENCE: Save preferences to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    const preferences = {
      pageSize,
      sortField,
      sortOrder,
      statusFilter,
      extraFilters
    };
    localStorage.setItem(`master_prefs_${apiEndpoint.split('/').pop()}`, JSON.stringify(preferences));
  }, [pageSize, sortField, sortOrder, statusFilter, extraFilters, apiEndpoint, isInitialized]);

  // 💾 PERSISTENCE: Load preferences from localStorage on mount
  useEffect(() => {
    const savedPrefs = localStorage.getItem(`master_prefs_${apiEndpoint.split('/').pop()}`);
    if (savedPrefs) {
      try {
        const { pageSize: pSize, sortField: sField, sortOrder: sOrder, extraFilters: eFilters } = JSON.parse(savedPrefs);
        if (pSize) setPageSize(pSize);
        if (sField) setSortField(sField);
        if (sOrder) setSortOrder(sOrder);
        // ⚠️ statusFilter intentionally NOT restored — always default to "all" so all records are visible
        if (eFilters) setExtraFilters(eFilters);
      } catch (e) {
        console.error("Failed to parse master preferences", e);
      }
    }
    setIsInitialized(true);
  }, [apiEndpoint]);


  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: debouncedSearch,
        sortField,
        sortOrder,
        status: statusFilter,
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...extraFilters
      });
      const response = await api.get<any>(`${apiEndpoint}?${params.toString()}`);

      // Handle both structured and flat responses for backward compatibility
      if (response && typeof response === 'object' && 'data' in response) {
        setItems(response.data);
        setTotalItems(response.total);
        setTotalPages(response.totalPages);
        setActiveCount(response.activeCount || 0);
        setArchivedCount(response.archivedCount || 0);
      } else {
        setItems(response);
      }
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (item: any) => {
    setIsBulkAction(false);
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleBulkToggle = (action: 'archive' | 'restore') => {
    setIsBulkAction(true);
    setCurrentBulkAction(action);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmAction = async () => {
    setIsSubmitting(true);
    try {
      if (isBulkAction && currentBulkAction) {
        const status = currentBulkAction === 'restore';
        const response = await api.patch<{ message: string }>(apiEndpoint, { ids: selectedIds, isActive: status });
        toast.success(response.message || `${selectedIds.length} records updated successfully`);
        setSelectedIds([]);
        setCurrentBulkAction(null);
      } else if (selectedItem) {
        const isRestoring = !selectedItem.isActive;
        await api.put(`${apiEndpoint}/${selectedItem._id}`, { isActive: isRestoring });
        toast.success(isRestoring ? "Record restored successfully" : "Record archived successfully");
      }
      setIsDeleteModalOpen(false);
      fetchItems();
    } catch (error) {
      // Handled by interceptor
    } finally {
      setIsSubmitting(false);
      setIsBulkAction(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handleExport = async (mode: 'current' | 'all' = 'current', format: 'csv' | 'excel' = 'csv') => {
    let dataToExport = items;

    if (mode === 'all') {
      const exportToast = toast.loading(`Preparing all records for ${format.toUpperCase()} export...`);
      try {
        const params = new URLSearchParams({
          ...extraFilters,
          export: 'true',
          status: statusFilter,
          sortField,
          sortOrder
        });
        const response = await api.get<any>(`${apiEndpoint}?${params.toString()}`);
        dataToExport = response.data || response;
        toast.dismiss(exportToast);
      } catch (error) {
        toast.error(`Failed to fetch data for ${format.toUpperCase()} export`);
        toast.dismiss(exportToast);
        return;
      }
    }

    if (dataToExport.length === 0) {
      toast.error("No data available to export");
      return;
    }

    const fileName = `${title.toLowerCase()}_${mode}_export_${new Date().toISOString().split('T')[0]}`;

    if (format === 'excel') {
      // 📊 EXCEL EXPORT
      const exportData = dataToExport.map(item => {
        const row: any = {};
        columns.forEach(col => {
          row[col.label] = item[col.key];
        });
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, title);
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    } else {
      // 📝 CSV EXPORT
      const csvHeaders = columns.map(c => c.label).join(',');
      const csvRows = dataToExport.map(item =>
        columns.map(col => {
          let val = item[col.key];
          if (val === null || val === undefined) return '""';
          const stringVal = String(val).replace(/"/g, '""');
          return `"${stringVal}"`;
        }).join(',')
      ).join('\n');

      const csvContent = `${csvHeaders}\n${csvRows}`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    toast.success(`Successfully exported ${dataToExport.length} records to ${format.toUpperCase()}`);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map(i => i._id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action: 'archive' | 'restore') => {
    if (selectedIds.length === 0) return;
    handleBulkToggle(action);
  };

  // We now use items directly as filtering and sorting happens on the server
  const filteredItems = items;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 🎭 HEADER SECTION */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-muted-foreground/40 mb-1 text-[9px] font-black uppercase tracking-[0.2em]">
            <Link href={AppRoutes.ADMIN_DASHBOARD} className="hover:text-primary transition-colors flex items-center gap-1.5">
              <LayoutDashboard className="h-3 w-3" />
              Admin
            </Link>
            <span className="opacity-20">/</span>
            <Link href={AppRoutes.ADMIN_MASTERS} className="hover:text-primary transition-colors">Masters</Link>
            <span className="opacity-20">/</span>
            <span className="text-primary/60">{title}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground flex items-center gap-5 tracking-tight group/title">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover/title:opacity-100 transition-opacity duration-700" />
              <div className="relative p-3.5 rounded-[22px] bg-primary/10 text-primary transition-transform duration-500 group-hover/title:scale-110">
                <Icon className="h-7 w-7 md:h-8 md:w-8" />
              </div>
            </div>
            {title}
            {statusFilter === "archived" && (
              <Badge variant="secondary" className="ml-2 bg-amber-500/10 text-amber-500 border-amber-500/20 uppercase text-[9px] py-1.5 px-3 font-black rounded-lg">
                Archive View
              </Badge>
            )}
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground/60 mt-1 max-w-xl font-medium leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* 🔘 Segmented Control Filter */}
          <div className="flex p-1.5 rounded-[22px] bg-muted/30 border border-border/40 backdrop-blur-sm self-stretch sm:self-auto shadow-inner shadow-black/[0.02]">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={cn(
                  "flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[11px] font-black transition-all cursor-pointer relative",
                  statusFilter === tab.id
                    ? "bg-card text-primary shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)] scale-[1.02] z-10"
                    : "text-muted-foreground/50 hover:text-muted-foreground/80 hover:bg-muted/40"
                )}
              >
                <tab.icon className={cn("h-4 w-4", statusFilter === tab.id ? "text-primary" : "opacity-40")} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none rounded-2xl h-12 px-5 border-border/40 bg-card/40 hover:bg-primary/5 hover:text-primary transition-all font-bold"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                    <ChevronDown className="h-3 w-3 ml-2 opacity-50" />
                  </Button>
                }
              />
              <DropdownMenuContent className="rounded-3xl border-border/40 bg-card/95 backdrop-blur-3xl p-2 shadow-3xl min-w-[220px]">
                <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 border-b border-border/10 mb-1">
                  Current View
                </div>
                <DropdownMenuItem
                  onClick={() => handleExport('current', 'csv')}
                  className="rounded-2xl font-black text-xs py-3 px-4 focus:bg-primary focus:text-primary-foreground transition-colors cursor-pointer"
                >
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleExport('current', 'excel')}
                  className="rounded-2xl font-black text-xs py-3 px-4 focus:bg-primary focus:text-primary-foreground transition-colors cursor-pointer"
                >
                  Export as Excel (.xlsx)
                </DropdownMenuItem>

                <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 border-b border-border/10 my-1">
                  Total Database
                </div>
                <DropdownMenuItem
                  onClick={() => handleExport('all', 'csv')}
                  className="rounded-2xl font-black text-xs py-3 px-4 focus:bg-primary focus:text-primary-foreground transition-colors cursor-pointer"
                >
                  Export All (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleExport('all', 'excel')}
                  className="rounded-2xl font-black text-xs py-3 px-4 focus:bg-primary focus:text-primary-foreground transition-colors cursor-pointer"
                >
                  Export All (Excel)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href={addPath} className="flex-1 sm:flex-none">
              <Button
                className="w-full rounded-2xl h-12 px-6 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 text-base font-bold bg-primary hover:bg-primary/90"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add {title.endsWith('ies') ? title.slice(0, -3) + 'y' : title.slice(0, -1)}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 📊 STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Records", value: totalItems, icon: Hash, color: "text-primary", bg: "bg-primary/5", border: "border-primary/20" },
          { label: "Active Directory", value: activeCount, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/5", border: "border-emerald-500/20" },
          { label: "Archived Assets", value: archivedCount, icon: Archive, color: "text-amber-500", bg: "bg-amber-500/5", border: "border-amber-500/20" },
        ].map((stat, i) => (
          <div key={i} className={cn(
            "group relative overflow-hidden rounded-[32px] border bg-card/40 p-1 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/5",
            stat.border
          )}>
            <div className="relative flex items-center gap-5 p-5 rounded-[28px] bg-card/40 transition-colors group-hover:bg-card/60">
              <div className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110 shadow-lg shadow-black/5",
                stat.bg, stat.color
              )}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">{stat.label}</span>
                {loading ? (
                  <div className="h-9 w-20 bg-muted/20 animate-pulse rounded-lg mt-1" />
                ) : (
                  <span className="text-3xl font-black text-foreground tracking-tight">{stat.value}</span>
                )}
              </div>
              {/* Subtle background glow */}
              <div className={cn("absolute -right-4 -bottom-4 h-24 w-24 rounded-full blur-[40px] opacity-20 transition-opacity group-hover:opacity-40", stat.bg)} />
            </div>
          </div>
        ))}
      </div>

      {/* 🔍 SEARCH & ACTION BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 !h-14 rounded-2xl bg-card/40 border-border/40 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all text-sm shadow-sm font-bold placeholder:text-muted-foreground/40"
          />
        </div>

        {renderExtraFilters && (
          <div className="w-full sm:w-auto">
            {renderExtraFilters(extraFilters, setExtraFilters)}
          </div>
        )}

        <Button
          variant="outline"
          onClick={fetchItems}
          disabled={loading}
          className="!h-14 !w-14 rounded-2xl border-border/40 bg-card/40 hover:bg-primary/5 hover:border-primary/20 transition-all shadow-sm shrink-0 flex items-center justify-center p-0"
        >
          <Loader2 className={cn("h-6 w-6 text-muted-foreground", loading && "animate-spin text-primary")} />
        </Button>
      </div>

      {/* 🚀 FLOATING BULK ACTIONS BAR */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center gap-6 px-8 py-4 rounded-[32px] bg-foreground text-background shadow-2xl backdrop-blur-2xl ring-1 ring-white/10">
            <div className="flex items-center gap-3 pr-6 border-r border-background/20">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center font-black text-sm">
                {selectedIds.length}
              </div>
              <span className="text-sm font-black uppercase tracking-widest opacity-80">Selected</span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkAction('archive')}
                className="rounded-2xl h-11 px-6 font-bold hover:bg-white/10 hover:text-white transition-all"
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkAction('restore')}
                className="rounded-2xl h-11 px-6 font-bold hover:bg-white/10 hover:text-white transition-all"
              >
                <ArchiveRestore className="h-4 w-4 mr-2" />
                Restore
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIds([])}
                className="rounded-2xl h-11 px-6 font-bold text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 DATA GRID */}
      <div className="rounded-[32px] border border-border/50 bg-card/30 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/30 border-b border-border/40">
              <tr>
                <th className="px-6 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60 w-16">
                  <div className="flex items-center justify-center">
                    <div
                      onClick={toggleSelectAll}
                      className={cn(
                        "h-5 w-5 rounded-md flex items-center justify-center cursor-pointer transition-all hover:scale-110",
                        selectedIds.length === items.length && items.length > 0 ? "bg-primary border border-primary shadow-md shadow-primary/20 text-white" : "border-2 border-muted-foreground/30 bg-background"
                      )}
                    >
                      {selectedIds.length === items.length && items.length > 0 && <Check className="h-3.5 w-3.5" />}
                    </div>
                  </div>
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={cn(
                      "px-6 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] transition-all cursor-pointer hover:bg-primary/[0.04] hover:text-primary group/th relative whitespace-nowrap",
                      col.hideOnMobile ? "hidden lg:table-cell" : "",
                      sortField === col.key ? "text-primary bg-primary/[0.02]" : "text-muted-foreground/60"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      {col.label}
                      <div className={cn(
                        "transition-all duration-300",
                        sortField === col.key ? "opacity-100 scale-100" : "opacity-0 scale-75 group-hover/th:opacity-50 group-hover/th:scale-100"
                      )}>
                        {sortOrder === "asc" ? <ChevronRight className="h-3 w-3 -rotate-90" /> : <ChevronRight className="h-3 w-3 rotate-90" />}
                      </div>
                    </div>
                  </th>
                ))}
                <th className="px-6 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 2} className="py-24 text-center">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
                    <p className="mt-4 text-sm font-black text-foreground">Syncing Database…</p>
                    <p className="text-xs font-medium text-muted-foreground mt-1">Fetching latest {title.toLowerCase()} records</p>
                  </td>
                </tr>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr
                    key={item._id}
                    className={cn(
                      "group transition-all duration-300 hover:bg-background/80 relative",
                      !item.isActive && "opacity-60 bg-muted/5 grayscale-[0.5]",
                      selectedIds.includes(item._id) && "bg-primary/[0.03] hover:bg-primary/[0.05]"
                    )}
                  >
                    {/* Active row indicator */}
                    <td className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-emerald-400 scale-y-0 group-hover:scale-y-100 transition-transform origin-center duration-300 rounded-r-full" />
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <div
                          onClick={() => toggleSelect(item._id)}
                          className={cn(
                            "h-5 w-5 rounded-md flex items-center justify-center cursor-pointer transition-all hover:scale-110",
                            selectedIds.includes(item._id) ? "bg-primary border border-primary text-white" : "border-2 border-muted-foreground/30 bg-background"
                          )}
                        >
                          {selectedIds.includes(item._id) && <Check className="h-3.5 w-3.5" />}
                        </div>
                      </div>
                    </td>
                    {columns.map((col, idx) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-6 py-4 relative whitespace-nowrap",
                          col.hideOnMobile ? "hidden lg:table-cell" : ""
                        )}
                      >
                        {col.render ? (
                          col.render(item[col.key], item)
                        ) : (
                          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                            {item[col.key]}
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                        {item.isActive ? (
                          <>
                            <Link href={editPath(item._id)} title="Edit Record">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-xl border-border/50 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all shadow-sm"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="icon"
                              title="Archive Record"
                              onClick={() => { setSelectedItem(item); setIsDeleteModalOpen(true); }}
                              className="h-9 w-9 rounded-xl border-border/50 hover:bg-destructive hover:text-white hover:border-destructive transition-all shadow-sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleToggleStatus(item)}
                            className="h-9 w-9 rounded-xl border-border/50 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all shadow-sm"
                            title="Restore Record"
                          >
                            <ArchiveRestore className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 2} className="py-24 text-center">
                    <div className="mx-auto h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-5 ring-8 ring-background/50">
                      <Icon className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                    <p className="text-xl font-black text-foreground">No records discovered</p>
                    <p className="text-sm font-medium text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
                      We couldn't find any {title.toLowerCase()} matching your criteria. Try adjusting your search or filters.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                        <Button
                          variant="outline"
                          onClick={() => { setSearchQuery(""); setExtraFilters({}); setStatusFilter("all"); }}
                          className="rounded-xl border-border/50 font-bold px-6"
                        >
                          Clear Filters
                        </Button>
                        <Link href={addPath}>
                          <Button
                            className="rounded-xl bg-primary hover:bg-primary/90 font-bold px-6 text-white border-0 shadow-lg shadow-primary/20"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Entry
                          </Button>
                        </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📊 PAGINATION FOOTER */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4 py-2">
        <div className="flex items-center gap-6">
          <p className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest">
            Showing <span className="text-foreground font-black">{Math.min((currentPage - 1) * pageSize + 1, totalItems)}</span> to <span className="text-foreground font-black">{Math.min(currentPage * pageSize, totalItems)}</span> of <span className="text-foreground font-black">{totalItems}</span> Results
          </p>

          <div className="hidden lg:flex items-center gap-3">
            <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-tighter">Rows per page</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                if (value) {
                  setPageSize(parseInt(value));
                  setCurrentPage(1);
                }
              }}
            >
              <SelectTrigger className="h-10 w-[100px] rounded-xl bg-card/40 border-border/40 font-black text-xs cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className="rounded-3xl border-border/40 bg-card/95 backdrop-blur-3xl p-2 shadow-3xl">
                {MASTER_PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem
                    key={size}
                    value={size.toString()}
                    className="rounded-2xl font-black text-[13px] py-3 px-4 focus:bg-primary focus:text-primary-foreground transition-colors cursor-pointer"
                  >
                    {size} Records
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => currentPage !== 1 && setCurrentPage(1)}
            aria-disabled={currentPage === 1}
            className={cn(
              "h-10 w-10 rounded-xl border-border/40 hover:bg-muted transition-all cursor-pointer",
              currentPage === 1 && "opacity-30 cursor-not-allowed hover:bg-transparent"
            )}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => currentPage !== 1 && setCurrentPage(prev => Math.max(prev - 1, 1))}
            aria-disabled={currentPage === 1}
            className={cn(
              "h-10 w-10 rounded-xl border-border/40 hover:bg-muted transition-all cursor-pointer",
              currentPage === 1 && "opacity-30 cursor-not-allowed hover:bg-transparent"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2 mx-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = 1;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;

              if (pageNum <= 0 || pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    "h-10 w-10 rounded-xl text-[13px] font-black transition-all cursor-pointer",
                    currentPage === pageNum
                      ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/40 scale-110 z-10"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => (currentPage !== totalPages && totalPages > 0) && setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            aria-disabled={currentPage === totalPages || totalPages === 0}
            className={cn(
              "h-10 w-10 rounded-xl border-border/40 hover:bg-muted transition-all cursor-pointer",
              (currentPage === totalPages || totalPages === 0) && "opacity-30 cursor-not-allowed hover:bg-transparent"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => (currentPage !== totalPages && totalPages > 0) && setCurrentPage(totalPages)}
            aria-disabled={currentPage === totalPages || totalPages === 0}
            className={cn(
              "h-10 w-10 rounded-xl border-border/40 hover:bg-muted transition-all cursor-pointer",
              (currentPage === totalPages || totalPages === 0) && "opacity-30 cursor-not-allowed hover:bg-transparent"
            )}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 🗑️ DELETE CONFIRMATION MODAL */}

      <Dialog
        open={isDeleteModalOpen}
        onOpenChange={() => { }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-md rounded-[40px] p-10 border-none text-center bg-card/80 backdrop-blur-2xl shadow-3xl"
        >
          {isBulkAction ? (
            <div className={cn(
              "mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] mb-8 animate-in zoom-in duration-500",
              currentBulkAction === 'archive' ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-500"
            )}>
              <div className="relative">
                {currentBulkAction === 'archive' ? <Trash2 className="h-10 w-10" /> : <ArchiveRestore className="h-10 w-10" />}
                <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center border-2 border-card">
                  {selectedIds.length}
                </div>
              </div>
            </div>
          ) : selectedItem?.isActive ? (
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] bg-destructive/10 text-destructive mb-8 animate-in zoom-in duration-500">
              <Trash2 className="h-10 w-10" />
            </div>
          ) : (
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] bg-emerald-500/10 text-emerald-500 mb-8 animate-in zoom-in duration-500">
              <ArchiveRestore className="h-10 w-10" />
            </div>
          )}

          <DialogTitle className="text-3xl font-black tracking-tight">
            {isBulkAction
              ? `${currentBulkAction === 'archive' ? 'Archive' : 'Restore'} Selected?`
              : selectedItem?.isActive ? "Archive Record?" : "Restore Record?"
            }
          </DialogTitle>

          <DialogDescription className="mt-4 text-muted-foreground font-bold text-base leading-relaxed">
            {isBulkAction ? (
              <>
                Are you sure you want to {currentBulkAction} <span className="text-foreground font-black">{selectedIds.length} records</span>?
                This action will update the visibility of all selected items.
              </>
            ) : selectedItem?.isActive ? (
              <>
                Are you sure you want to archive <span className="text-foreground font-black underline decoration-destructive/30 underline-offset-4">{selectedItem?.name}</span>?
                This record will be hidden from the active directory but preserved in the database.
              </>
            ) : (
              <>
                Are you sure you want to restore <span className="text-foreground font-black underline decoration-emerald-500/30 underline-offset-4">{selectedItem?.name}</span>?
                This record will be moved back to the active directory.
              </>
            )}
          </DialogDescription>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => { setIsDeleteModalOpen(false); setIsBulkAction(false); }}
              className="h-14 rounded-3xl font-black border-border/60 hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              variant={(isBulkAction ? currentBulkAction === 'archive' : selectedItem?.isActive) ? "destructive" : "success"}
              onClick={handleConfirmAction}
              disabled={isSubmitting}
              className={cn(
                "h-14 rounded-3xl font-black shadow-2xl transition-all hover:scale-[1.02] active:scale-95",
                (isBulkAction ? currentBulkAction === 'archive' : selectedItem?.isActive)
                  ? "bg-destructive hover:bg-destructive/90 shadow-destructive/20"
                  : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 text-white border-none"
              )}
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                isBulkAction
                  ? `Confirm ${currentBulkAction === 'archive' ? 'Archive' : 'Restore'}`
                  : selectedItem?.isActive ? "Confirm Archive" : "Confirm Restore"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
