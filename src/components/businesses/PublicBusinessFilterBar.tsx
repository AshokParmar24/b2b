"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search, Tag, X, MapPin, Hash, Filter, Globe, Map,
  SlidersHorizontal, ChevronDown, RotateCcw, Building2
} from "lucide-react";
import { CountrySelect } from "@/components/common/CountrySelect";
import { StateSelect } from "@/components/common/StateSelect";
import { CitySelect } from "@/components/common/CitySelect";
import { PincodeSelect } from "@/components/common/PincodeSelect";
import { HsnSelect } from "@/components/common/HsnSelect";
import { cn } from "@/lib/utils";

interface Props {
  initialQ?: string;
  initialHsn?: string;
  initialCountry?: string;
  initialState?: string;
  initialCity?: string;
  initialPincode?: string;
  totalResults: number;
}

export function PublicBusinessFilterBar({
  initialQ = "",
  initialHsn = "",
  initialCountry = "",
  initialState = "",
  initialCity = "",
  initialPincode = "",
  totalResults,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(initialQ);
  const [hsn, setHsn] = useState(initialHsn);
  const [countryId, setCountryId] = useState(initialCountry);
  const [stateId, setStateId] = useState(initialState);
  const [cityId, setCityId] = useState(initialCity);
  const [pincodeId, setPincodeId] = useState(initialPincode);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setQ(searchParams.get("q") || "");
    setHsn(searchParams.get("hsn") || "");
    setCountryId(searchParams.get("country") || "");
    setStateId(searchParams.get("state") || "");
    setCityId(searchParams.get("city") || "");
    setPincodeId(searchParams.get("pincode") || "");
  }, [searchParams]);

  const activeCount = [hsn, countryId, stateId, cityId, pincodeId].filter(Boolean).length;

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (hsn) params.set("hsn", hsn);
    if (countryId && countryId !== "all") params.set("country", countryId);
    if (stateId && stateId !== "all") params.set("state", stateId);
    if (cityId && cityId !== "all") params.set("city", cityId);
    if (pincodeId && pincodeId !== "all") params.set("pincode", pincodeId);
    const sort = searchParams.get("sort");
    if (sort) params.set("sort", sort);
    router.push(`/businesses?${params.toString()}`);
    setSidebarOpen(false);
  };

  const handleClear = () => {
    setQ(""); setHsn(""); setCountryId(""); setStateId(""); setCityId(""); setPincodeId("");
    router.push("/businesses");
    setSidebarOpen(false);
  };

  return (
    <div className="mb-8">
      {/* ── Main Unified Search Bar ── */}
      <div className="group relative flex flex-col md:flex-row items-stretch gap-2 bg-white p-2 rounded-[24px] border border-slate-200 shadow-xl shadow-slate-200/40 transition-all focus-within:border-primary/30 focus-within:shadow-primary/5">
        
        {/* Search Input */}
        <div className="relative flex-[2] min-w-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Search by name, category or service..."
            className="w-full h-14 pl-12 pr-10 rounded-[18px] bg-slate-50/50 border-transparent text-sm font-bold focus:bg-white transition-all outline-none"
          />
          {q && (
            <button onClick={() => setQ("")} className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Industry Shortcut (Visible on md+) */}
        <div className="hidden lg:flex flex-1 min-w-[200px] items-center">
          <div className="h-8 w-px bg-slate-200 mx-2" />
          <HsnSelect
            value={hsn || "all"}
            onChange={(val) => setHsn(val === "all" ? "" : val)}
            showAllOption
            placeholder="Select Industry"
            className="h-14 border-none bg-transparent text-sm font-bold shadow-none focus:ring-0"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className={cn(
              "flex items-center gap-2.5 h-14 px-6 rounded-[18px] border font-black text-xs uppercase tracking-widest transition-all",
              activeCount > 0 
                ? "bg-primary/5 text-primary border-primary/20" 
                : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-white hover:border-slate-200"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[10px]">
                {activeCount}
              </span>
            )}
          </button>

          <button
            onClick={applyFilters}
            className="flex items-center justify-center gap-2 h-14 px-8 rounded-[18px] bg-primary text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>

      {/* ── Active Filter Pills ── */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 animate-in fade-in slide-in-from-top-2">
          {hsn && <FilterPill label={`HSN: ${hsn}`} onRemove={() => setHsn("")} />}
          {countryId && countryId !== "all" && <FilterPill label="Country Active" onRemove={() => { setCountryId(""); setStateId(""); setCityId(""); setPincodeId(""); }} />}
          {cityId && cityId !== "all" && <FilterPill label="City Active" onRemove={() => { setCityId(""); setPincodeId(""); }} />}
          <button onClick={handleClear} className="text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest ml-2">Clear All</button>
        </div>
      )}

      {/* ── Filter Sidebar (Slide-in) ── */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-[101] w-full max-w-[400px] bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            
            {/* Sidebar Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Filter className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Advanced Filters</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Refine your results</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              <FilterSection label="Industry Segment" icon={Tag}>
                <HsnSelect value={hsn || "all"} onChange={(val) => setHsn(val === "all" ? "" : val)} showAllOption placeholder="All Industries" className="h-12 rounded-xl bg-slate-50 border-slate-100 text-sm font-bold" />
              </FilterSection>

              <FilterSection label="Geographic Location" icon={Globe}>
                <div className="space-y-4">
                  <CountrySelect value={countryId || "all"} onChange={(val) => { setCountryId(val === "all" ? "" : val); setStateId(""); setCityId(""); setPincodeId(""); }} showAllOption className="h-12 rounded-xl bg-slate-50 border-slate-100 text-sm font-bold" />
                  <StateSelect countryId={countryId} value={stateId || "all"} onChange={(val) => { setStateId(val === "all" ? "" : val); setCityId(""); setPincodeId(""); }} showAllOption className="h-12 rounded-xl bg-slate-50 border-slate-100 text-sm font-bold" disabled={!countryId} />
                  <CitySelect stateId={stateId} value={cityId || "all"} onChange={(val) => { setCityId(val === "all" ? "" : val); setPincodeId(""); }} showAllOption className="h-12 rounded-xl bg-slate-50 border-slate-100 text-sm font-bold" disabled={!stateId} />
                  <PincodeSelect cityId={cityId} value={pincodeId || "all"} onChange={(val) => setPincodeId(val === "all" ? "" : val)} showAllOption className="h-12 rounded-xl bg-slate-50 border-slate-100 text-sm font-bold" disabled={!cityId} />
                </div>
              </FilterSection>
            </div>

            {/* Sidebar Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-200">
              <div className="flex gap-3">
                <button onClick={handleClear} className="flex-1 h-12 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Reset</button>
                <button onClick={applyFilters} className="flex-[2] h-12 rounded-xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all">Apply Filters</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FilterSection({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</span>
      </div>
      {children}
    </div>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/15 text-primary text-[11px] font-bold">
      {label}
      <button onClick={onRemove} className="hover:text-rose-500 transition-colors">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
