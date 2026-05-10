"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Tag, X, MapPin, Hash, Filter, Globe, Building2, Map } from "lucide-react";
import { CountrySelect } from "@/components/common/CountrySelect";
import { StateSelect } from "@/components/common/StateSelect";
import { CitySelect } from "@/components/common/CitySelect";
import { PincodeSelect } from "@/components/common/PincodeSelect";
import { HsnSelect } from "@/components/common/HsnSelect";
import { Button } from "@/components/ui/button";

interface PublicBusinessFilterSidebarProps {
  initialQ?: string;
  initialHsn?: string;
  initialCountry?: string;
  initialState?: string;
  initialCity?: string;
  initialPincode?: string;
  totalResults: number;
}

export function PublicBusinessFilterSidebar({
  initialQ = "",
  initialHsn = "",
  initialCountry = "",
  initialState = "",
  initialCity = "",
  initialPincode = "",
  totalResults,
}: PublicBusinessFilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(initialQ);
  const [hsn, setHsn] = useState(initialHsn);
  const [countryId, setCountryId] = useState(initialCountry);
  const [stateId, setStateId] = useState(initialState);
  const [cityId, setCityId] = useState(initialCity);
  const [pincodeId, setPincodeId] = useState(initialPincode);

  // Sync with URL when it changes
  useEffect(() => {
    setQ(searchParams.get("q") || "");
    setHsn(searchParams.get("hsn") || "");
    setCountryId(searchParams.get("country") || "");
    setStateId(searchParams.get("state") || "");
    setCityId(searchParams.get("city") || "");
    setPincodeId(searchParams.get("pincode") || "");
  }, [searchParams]);

  const hasFilter = !!(q || hsn || countryId || stateId || cityId || pincodeId);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (hsn) params.set("hsn", hsn);
    if (countryId && countryId !== "all") params.set("country", countryId);
    if (stateId && stateId !== "all") params.set("state", stateId);
    if (cityId && cityId !== "all") params.set("city", cityId);
    if (pincodeId && pincodeId !== "all") params.set("pincode", pincodeId);
    
    // Preserve sort if exists
    const sort = searchParams.get("sort");
    if (sort) params.set("sort", sort);

    router.push(`/businesses?${params.toString()}`);
  };

  const handleClear = () => {
    setQ("");
    setHsn("");
    setCountryId("");
    setStateId("");
    setCityId("");
    setPincodeId("");
    router.push("/businesses");
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm flex flex-col max-h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Filters</h2>
        </div>
        {hasFilter && (
          <button 
            onClick={handleClear}
            className="text-[10px] font-black text-slate-400 hover:text-destructive transition-colors uppercase tracking-widest"
          >
            Reset
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Search */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Search className="h-3 w-3" /> Keyword Search
          </label>
          <div className="relative">
            <input 
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Name, Owner, Service..."
              className="w-full h-11 pl-4 pr-10 rounded-xl bg-slate-50 border-transparent text-xs font-bold focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
            />
            {q && (
              <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* HSN */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Tag className="h-3 w-3" /> Industry (HSN)
          </label>
          <HsnSelect 
            value={hsn || "all"}
            onChange={(val) => setHsn(val === "all" ? "" : val)}
            showAllOption
            placeholder="Select HSN Code"
            className="h-11 rounded-xl bg-slate-50 border-none text-xs font-bold"
          />
        </div>

        {/* Geographic Cascading */}
        <div className="space-y-6 pt-2">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Globe className="h-3 w-3" /> Country
            </label>
            <CountrySelect 
              value={countryId || "all"}
              onChange={(val) => {
                setCountryId(val === "all" ? "" : val);
                setStateId("");
                setCityId("");
                setPincodeId("");
              }}
              showAllOption
              placeholder="All Countries"
              className="h-11 rounded-xl bg-slate-50 border-none text-xs font-bold"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Map className="h-3 w-3" /> State
            </label>
            <StateSelect 
              countryId={countryId}
              value={stateId || "all"}
              onChange={(val) => {
                setStateId(val === "all" ? "" : val);
                setCityId("");
                setPincodeId("");
              }}
              showAllOption
              placeholder="All States"
              className="h-11 rounded-xl bg-slate-50 border-none text-xs font-bold"
              disabled={!countryId || countryId === "all"}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="h-3 w-3" /> City
            </label>
            <CitySelect 
              stateId={stateId}
              value={cityId || "all"}
              onChange={(val) => {
                setCityId(val === "all" ? "" : val);
                setPincodeId("");
              }}
              showAllOption
              placeholder="All Cities"
              className="h-11 rounded-xl bg-slate-50 border-none text-xs font-bold"
              disabled={!stateId || stateId === "all"}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Hash className="h-3 w-3" /> Pincode
            </label>
            <PincodeSelect 
              cityId={cityId}
              value={pincodeId || "all"}
              onChange={(val) => setPincodeId(val === "all" ? "" : val)}
              showAllOption
              placeholder="All Pincodes"
              className="h-11 rounded-xl bg-slate-50 border-none text-xs font-bold"
              disabled={!cityId || cityId === "all"}
            />
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="p-6 bg-slate-50/50 border-t border-slate-100">
        <Button 
          onClick={applyFilters}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Update Results
        </Button>
      </div>
    </div>
  );
}
