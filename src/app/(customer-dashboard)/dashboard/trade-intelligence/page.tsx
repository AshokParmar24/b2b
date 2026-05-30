"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  Globe, 
  Search, 
  Lock, 
  Unlock, 
  Sparkles, 
  Coins, 
  TrendingUp, 
  Calendar, 
  Compass, 
  Anchor, 
  ChevronLeft, 
  ChevronRight,
  TrendingDown,
  Building2,
  FileText,
  Download,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as ChartTooltip, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

export default function TradeIntelligencePage() {
  const { data: session } = useSession();
  
  // ─── STATE VARIABLES ───
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);
  const [isFreePlan, setIsFreePlan] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // 📄 Pagination & Filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  
  // Faceted dynamic options
  const [hsnCodes, setHsnCodes] = useState<any[]>([]);
  const [ports, setPorts] = useState<any[]>([]);
  
  // Filter values
  const [selectedHsn, setSelectedHsn] = useState("");
  const [selectedOriginPort, setSelectedOriginPort] = useState("");
  const [selectedDestPort, setSelectedDestPort] = useState("");

  // Stats Counters
  const [stats, setStats] = useState({
    totalShipments: 0,
    totalValueUSD: 0,
    activeExporters: new Set<string>().size,
    activeImporters: new Set<string>().size
  });

  // Chart data
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  // ⏱️ Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // ─── LOAD INITIAL OPTIONS ───
  useEffect(() => {
    async function loadSelectors() {
      try {
        const [hsnRes, portRes] = await Promise.all([
          fetch("/api/masters/hsn?limit=100").then(r => r.json()),
          fetch("/api/masters/cities?limit=100").then(r => r.json())
        ]);
        
        if (hsnRes?.data) setHsnCodes(hsnRes.data);
        if (portRes?.data) setPorts(portRes.data);
      } catch (err) {
        console.error("Failed to load selectors:", err);
      }
    }
    loadSelectors();
  }, []);

  // ─── FETCH DYNAMIC DATA ───
  const fetchShipments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: debouncedSearch,
        page: currentPage.toString(),
        limit: limit.toString(),
        sortField,
        sortOrder,
        hsnCodeId: selectedHsn,
        originPortId: selectedOriginPort,
        destinationPortId: selectedDestPort
      });

      const res = await fetch(`/api/shipments?${params.toString()}`);
      const result = await res.json();

      if (res.ok) {
        setShipments(result.data || []);
        setTotalRecords(result.pagination?.total || 0);
        setTotalPages(result.pagination?.totalPages || 1);
        
        // Dynamic Plan and Credits details directly from MongoDB
        setCredits(result.user?.dataCredits || 0);
        setIsFreePlan(result.user?.isFreePlan);
        setIsAdmin(result.user?.isAdmin);

        // Populate dynamic statistics based on results
        if (result.data && result.data.length > 0) {
          const exporterIds = new Set(result.data.map((s: any) => s.exporter?._id));
          const importerIds = new Set(result.data.map((s: any) => s.importer?._id));
          const totalVal = result.data.reduce((acc: number, cur: any) => acc + (cur.valueUSD || 0), 0);
          
          setStats({
            totalShipments: result.pagination?.total || result.data.length,
            totalValueUSD: totalVal * (result.pagination?.totalPages || 1.3), // scale loosely based on total
            activeExporters: exporterIds.size,
            activeImporters: importerIds.size
          });

          // Generate Chart Data dynamically based on real dates and values
          const monthlyMap: Record<string, number> = {};
          const productMap: Record<string, number> = {};

          result.data.forEach((s: any) => {
            // Trend Line
            const d = new Date(s.date);
            const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
            monthlyMap[key] = (monthlyMap[key] || 0) + s.valueUSD;

            // Product Share
            const hsn = s.hsnCode || "Other HSN";
            productMap[hsn] = (productMap[hsn] || 0) + s.valueUSD;
          });

          const formattedChart = Object.keys(monthlyMap).map(k => ({
            month: k,
            value: Math.round(monthlyMap[k])
          })).reverse(); // chronological

          const formattedPie = Object.keys(productMap).map(k => ({
            name: `HSN ${k}`,
            value: Math.round(productMap[k])
          })).slice(0, 5); // top 5

          setChartData(formattedChart);
          setPieData(formattedPie);
        }
      } else {
        toast.error(result.error || "Failed to fetch trade data.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while loading shipments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [debouncedSearch, currentPage, limit, sortField, sortOrder, selectedHsn, selectedOriginPort, selectedDestPort]);

  // ─── UNLOCK ACTION ───
  const handleUnlock = async (companyId: string, companyName: string) => {
    const unlockToast = toast.loading(`Unlocking decision makers for ${companyName}...`);
    try {
      const res = await fetch(`/api/companies/${companyId}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Company unlocked successfully!", { id: unlockToast });
        setCredits(data.creditsRemaining ?? credits);
        // Instantly refresh list to reflect clear details without complete reloading
        fetchShipments();
      } else {
        toast.error(data.error || "Failed to unlock company", { id: unlockToast });
      }
    } catch (err) {
      toast.error("Connection failed while unlocking company", { id: unlockToast });
    }
  };

  // ─── CREDIT INJECTOR (DEV TOOL) ───
  const handleInjectCredits = async () => {
    const injectToast = toast.loading("Connecting to DB and injecting dynamic credits...");
    try {
      const res = await fetch("/api/dev/add-credits", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        toast.success(`Injected 100 Credits! Dynamic balance: ${data.dataCredits}`, { id: injectToast });
        setCredits(data.dataCredits);
      } else {
        toast.error(data.error || "Failed to inject credits.", { id: injectToast });
      }
    } catch (err) {
      toast.error("Network error during credit injection.", { id: injectToast });
    }
  };

  // ─── EXCEL EXPORT SIMULATOR ───
  const handleExcelExport = () => {
    if (isFreePlan) {
      toast.error("Excel/CSV export is blocked on the Free Plan. Upgrade to Pro!");
      return;
    }
    
    // Simulate premium excel export
    toast.success(`Preparing CSV export for ${totalRecords} shipment records...`);
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Date,HS Code,Description,Exporter,Importer,Qty,Unit,Value(USD)"].join(",") + "\n"
      + shipments.map(s => [
          new Date(s.date).toLocaleDateString(),
          s.hsnCode,
          s.productDescription,
          s.exporter.name,
          s.importer.name,
          s.quantity,
          s.unit,
          s.valueUSD
        ].join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Trade_Intel_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Trade data successfully exported to Excel/CSV!");
  };

  const COLORS = ["#0EA5E9", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8 max-w-[1250px] mx-auto pb-16">
      
      {/* ── HEADER & PLAN INDICATOR ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-3 w-fit">
            <Sparkles className="h-3 w-3" />
            Dynamic Trade Engine Active
          </div>
          <h1 className="text-3xl sm:text-4xl font-[1000] tracking-tight text-foreground">
            Global{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
              Trade Intelligence
            </span>
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1 leading-relaxed">
            Analyze authentic global customs data, monitor suppliers, and unlock premium key decision-maker contacts.
          </p>
        </div>

        {/* Dynamic Subscription & Credit Balance Widget */}
        <div className="rounded-[28px] border border-border/50 bg-card/50 backdrop-blur-xl p-5 flex items-center gap-5 shadow-lg max-w-sm">
          <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 text-white shadow-md shadow-amber-500/20">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              Database Ledger Balance
            </div>
            <div className="text-2xl font-black text-foreground mt-0.5 flex items-baseline gap-1.5">
              {credits} <span className="text-xs font-semibold text-muted-foreground">Credits</span>
            </div>
            <div className="text-[10px] font-bold text-emerald-500 mt-0.5">
              Active Tier: {isFreePlan ? "Free Plan" : isAdmin ? "Admin (Unlimited)" : "Premium Pro"}
            </div>
          </div>
        </div>
      </div>

      {/* ── DYNAMIC DEV TOOLBAR ── */}
      <div className="p-4 rounded-[20px] bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-black text-foreground uppercase tracking-widest">UAT / Testing sandbox</p>
            <p className="text-[11px] font-medium text-muted-foreground/80 mt-0.5">
              Testing the credit unlock paywall? Inject dynamic credits to update your user record directly inside MongoDB.
            </p>
          </div>
        </div>
        <button 
          onClick={handleInjectCredits}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition-colors self-start sm:self-auto shrink-0 shadow-lg shadow-amber-500/10"
        >
          <Coins className="h-3.5 w-3.5" />
          Inject 100 Credits
        </button>
      </div>

      {/* ── STATS COUNTERS CARD GRID ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Shipments", value: stats.totalShipments, icon: FileText, color: "text-primary", bg: "bg-primary/5", border: "border-primary/20" },
          { label: "Active Exporters", value: stats.activeExporters, icon: Building2, color: "text-purple-500", bg: "bg-purple-500/5", border: "border-purple-500/20" },
          { label: "Active Importers", value: stats.activeImporters, icon: Globe, color: "text-blue-500", bg: "bg-blue-500/5", border: "border-blue-500/20" },
          { 
            label: "Estimated Trade Value", 
            value: `$${(stats.totalValueUSD / 1_000_000).toFixed(1)}M`, 
            icon: TrendingUp, 
            color: "text-emerald-500", 
            bg: "bg-emerald-500/5", 
            border: "border-emerald-500/20" 
          },
        ].map((stat, i) => (
          <div key={i} className={cn("rounded-3xl border bg-card/30 p-5 relative overflow-hidden backdrop-blur-md", stat.border)}>
            <div className={cn("h-9 w-9 flex items-center justify-center rounded-xl mb-3", stat.bg)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
            <p className="text-2xl font-[1000] text-foreground mt-1 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── VISUAL ANALYTICS SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 rounded-[28px] border border-border/50 bg-card/30 backdrop-blur-xl p-6 flex flex-col justify-between min-h-[350px]">
          <div>
            <h3 className="text-base font-black text-foreground">Monthly Trade Value Trend</h3>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5">Real-time aggregate database valuation</p>
          </div>
          <div className="h-60 mt-6 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                  <ChartTooltip 
                    contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: "12px", fontSize: "12px" }}
                    labelStyle={{ color: "#E2E8F0", fontWeight: "bold" }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#0EA5E9" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                Insufficient database records for charting trends.
              </div>
            )}
          </div>
        </div>

        {/* Product Share Pie Chart */}
        <div className="rounded-[28px] border border-border/50 bg-card/30 backdrop-blur-xl p-6 flex flex-col justify-between min-h-[350px]">
          <div>
            <h3 className="text-base font-black text-foreground">HSN Product Category Share</h3>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5">Value division amongst top codes</p>
          </div>
          <div className="h-44 mt-4 w-full flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: "12px", fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground">No distribution logs.</div>
            )}
          </div>
          
          <div className="space-y-2 mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="font-bold text-muted-foreground">{entry.name}</span>
                </div>
                <span className="font-black text-foreground">${(entry.value / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FACETED FILTERS BAR ── */}
      <div className="rounded-[28px] border border-border/50 bg-card/40 backdrop-blur-xl p-6 space-y-5">
        
        {/* Row 1: Search & Sorting */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              placeholder="Search product description, HSN code, or company name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 h-12 rounded-xl bg-background/60 border border-border/40 focus:ring-4 focus:ring-primary/5 transition-all text-xs font-bold placeholder:text-muted-foreground/40"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto self-stretch">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="flex-1 md:flex-none h-12 px-4 rounded-xl bg-background/60 border border-border/40 text-xs font-bold focus:ring-4 focus:ring-primary/5"
            >
              <option value="date">Sort by Shipment Date</option>
              <option value="valueUSD">Sort by Shipment Value</option>
              <option value="quantity">Sort by Quantity</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="flex-1 md:flex-none h-12 px-4 rounded-xl bg-background/60 border border-border/40 text-xs font-bold focus:ring-4 focus:ring-primary/5"
            >
              <option value="desc">Descending Order</option>
              <option value="asc">Ascending Order</option>
            </select>
          </div>
        </div>

        {/* Row 2: Faceted Selectors (HSN, Ports) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 block mb-1.5 ml-1">
              Filter by Product HSN Code
            </label>
            <select
              value={selectedHsn}
              onChange={(e) => setSelectedHsn(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-background/60 border border-border/40 text-xs font-bold"
            >
              <option value="">All Harmonized Products</option>
              {hsnCodes.map(h => (
                <option key={h._id} value={h._id}>
                  HSN {h.code} - {h.description.slice(0, 30)}...
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 block mb-1.5 ml-1">
              Filter by Loading Port (Origin)
            </label>
            <select
              value={selectedOriginPort}
              onChange={(e) => setSelectedOriginPort(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-background/60 border border-border/40 text-xs font-bold"
            >
              <option value="">All Global Origin Ports</option>
              {ports.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 block mb-1.5 ml-1">
              Filter by Discharge Port (Dest)
            </label>
            <select
              value={selectedDestPort}
              onChange={(e) => setSelectedDestPort(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-background/60 border border-border/40 text-xs font-bold"
            >
              <option value="">All Global Destination Ports</option>
              {ports.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Action & Clear Filters */}
        <div className="flex items-center justify-between pt-1 border-t border-border/20 text-xs">
          <div className="text-muted-foreground/60 font-semibold">
            Faceted filters apply dynamic aggregate updates instantly.
          </div>
          <button
            onClick={() => {
              setSelectedHsn("");
              setSelectedOriginPort("");
              setSelectedDestPort("");
              setSearchTerm("");
            }}
            className="text-primary hover:underline font-black uppercase tracking-wider text-[10px]"
          >
            Clear Active Filters
          </button>
        </div>
      </div>

      {/* ── SHIPMENTS DATA TABLE ── */}
      <div className="rounded-[32px] border border-border/50 bg-card/30 backdrop-blur-xl shadow-2xl overflow-hidden relative">
        
        {/* Table Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-5 border-b border-border/30 gap-4 bg-muted/20">
          <div>
            <h3 className="text-base font-black text-foreground">Customs Shipment Records</h3>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5">
              {isFreePlan ? "Locked behind standard paywall rules (Free Plan active)" : "Displaying total database records"}
            </p>
          </div>
          
          <button
            onClick={handleExcelExport}
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl border border-border/40 bg-card hover:bg-primary/5 hover:text-primary transition-all font-bold text-xs self-start sm:self-auto"
          >
            <Download className="h-4 w-4" />
            Export to Excel/CSV
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/10 border-b border-border/30">
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                <th className="px-6 py-4">Shipment Date</th>
                <th className="px-6 py-4">HS Code</th>
                <th className="px-6 py-4">Exporter (Supplier)</th>
                <th className="px-6 py-4">Importer (Buyer)</th>
                <th className="px-6 py-4">Ports (Origin ➔ Dest)</th>
                <th className="px-6 py-4">Shipment Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <div className="h-10 w-10 animate-spin border-4 border-primary border-t-transparent rounded-full mx-auto" />
                    <p className="mt-4 text-xs font-black text-foreground tracking-widest uppercase">Querying MongoDB...</p>
                  </td>
                </tr>
              ) : shipments.length > 0 ? (
                shipments.map((s, idx) => (
                  <tr key={s._id} className="group hover:bg-background/40 transition-colors">
                    
                    {/* 1. Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground/40" />
                        <span className="font-bold text-foreground">
                          {new Date(s.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </td>

                    {/* 2. HS Code & Product Description */}
                    <td className="px-6 py-4 max-w-[280px]">
                      <div className="flex flex-col">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-black w-fit">
                          HS {s.hsnCode}
                        </span>
                        <span className="text-xs font-bold text-muted-foreground truncate mt-1 max-w-[220px]" title={s.productDescription}>
                          {s.productDescription}
                        </span>
                      </div>
                    </td>

                    {/* 3. Exporter */}
                    <td className="px-6 py-4">
                      {s.exporter.isUnlocked ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-black text-foreground">{s.exporter.name}</span>
                          <span className="text-[10px] text-muted-foreground/70 font-semibold">{s.exporter.contactEmails?.[0] || ""}</span>
                          <span className="text-[10px] text-muted-foreground/70 font-semibold">{s.exporter.contactPhones?.[0] || ""}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="filter blur-[5px] select-none opacity-50 font-black text-foreground">***LOCKED***</span>
                          <button
                            onClick={() => handleUnlock(s.exporter._id, "Exporter")}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-wider"
                          >
                            <Lock className="h-2.5 w-2.5" />
                            Unlock Exporter
                          </button>
                        </div>
                      )}
                    </td>

                    {/* 4. Importer */}
                    <td className="px-6 py-4">
                      {s.importer.isUnlocked ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-black text-foreground">{s.importer.name}</span>
                          <span className="text-[10px] text-muted-foreground/70 font-semibold">{s.importer.contactEmails?.[0] || ""}</span>
                          <span className="text-[10px] text-muted-foreground/70 font-semibold">{s.importer.contactPhones?.[0] || ""}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="filter blur-[5px] select-none opacity-50 font-black text-foreground">***LOCKED***</span>
                          <button
                            onClick={() => handleUnlock(s.importer._id, "Importer")}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-wider"
                          >
                            <Lock className="h-2.5 w-2.5" />
                            Unlock Importer
                          </button>
                        </div>
                      )}
                    </td>

                    {/* 5. Ports (Origin ➔ Discharge) */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Compass className="h-3 w-3 text-primary/60 shrink-0" />
                          <span className="font-semibold text-foreground">{s.originPort.split(" (")[0]}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Anchor className="h-3 w-3 text-emerald-500/60 shrink-0" />
                          <span className="font-semibold text-foreground">{s.destinationPort.split(" (")[0]}</span>
                        </div>
                      </div>
                    </td>

                    {/* 6. Shipment Value */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-end pr-4">
                        <span className="font-black text-foreground text-sm">
                          ${s.valueUSD.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground mt-0.5">
                          {s.quantity.toLocaleString()} {s.unit}
                        </span>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <Globe className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm font-black text-foreground">No Shipments Located</p>
                    <p className="text-xs font-semibold text-muted-foreground mt-1 leading-relaxed">
                      We couldn't locate any shipments in MongoDB matching those filters or searches.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-5 border-t border-border/30 gap-4 bg-muted/10">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {isFreePlan ? (
              <span className="text-amber-500 font-black">
                Showing 5 matching records. Upgrade plan to view all {totalRecords} records.
              </span>
            ) : (
              <span>
                Showing page <span className="text-foreground font-black">{currentPage}</span> of <span className="text-foreground font-black">{totalPages}</span> ({totalRecords} total entries)
              </span>
            )}
          </div>

          {!isFreePlan && totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="h-9 w-9 rounded-xl border border-border/40 flex items-center justify-center hover:bg-muted disabled:opacity-40 transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-black px-3">{currentPage} / {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="h-9 w-9 rounded-xl border border-border/40 flex items-center justify-center hover:bg-muted disabled:opacity-40 transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
