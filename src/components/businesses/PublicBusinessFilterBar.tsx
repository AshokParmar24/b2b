"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Tag, X, MapPin, Hash, Filter } from "lucide-react";
import { CountrySelect } from "@/components/common/CountrySelect";
import { StateSelect } from "@/components/common/StateSelect";
import { CitySelect } from "@/components/common/CitySelect";
import { PincodeSelect } from "@/components/common/PincodeSelect";
import { Button } from "@/components/ui/button";

interface PublicBusinessFilterBarProps {
  initialQ?: string;
  initialHsn?: string;
  initialCountry?: string;
  initialState?: string;
  initialCity?: string;
  initialPincode?: string;
}

export function PublicBusinessFilterBar({
  initialQ = "",
  initialHsn = "",
  initialCountry = "",
  initialState = "",
  initialCity = "",
  initialPincode = "",
}: PublicBusinessFilterBarProps) {
  const router = useRouter();

  const [q, setQ] = useState(initialQ);
  const [hsn, setHsn] = useState(initialHsn);
  const [countryId, setCountryId] = useState(initialCountry);
  const [stateId, setStateId] = useState(initialState);
  const [cityId, setCityId] = useState(initialCity);
  const [pincodeId, setPincodeId] = useState(initialPincode);

  const hasFilter = !!(q || hsn || countryId || stateId || cityId || pincodeId);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (hsn) params.set("hsn", hsn);
    if (countryId && countryId !== "all") params.set("country", countryId);
    if (stateId && stateId !== "all") params.set("state", stateId);
    if (cityId && cityId !== "all") params.set("city", cityId);
    if (pincodeId && pincodeId !== "all") params.set("pincode", pincodeId);

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
    <div className="flex flex-col gap-5 bg-card/60 backdrop-blur-2xl p-6 rounded-[32px] border border-border/50 shadow-xl shadow-primary/5 animate-fadeInUp">
      <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, owner, or service..."
            className="w-full h-14 pl-12 pr-12 rounded-2xl bg-muted/30 border-none text-sm font-bold focus:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60"
          />
          {q && (
            <button 
              type="button"
              onClick={() => setQ("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* HSN Input */}
        <div className="relative w-full lg:w-48 group">
          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            value={hsn}
            onChange={(e) => setHsn(e.target.value)}
            placeholder="HSN Code"
            className="w-full h-14 pl-11 pr-4 rounded-2xl bg-muted/30 border-none text-sm font-bold focus:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60"
          />
        </div>

        <Button 
          type="submit" 
          className="h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          <Search className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </form>

      {/* Cascading Geo Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-border/30">
        <CountrySelect
          value={countryId || "all"}
          onChange={(val) => {
            setCountryId(val === "all" ? "" : val);
            setStateId("");
            setCityId("");
            setPincodeId("");
          }}
          variant="premium"
          placeholder="Select Country"
          showAllOption
          className="h-14 rounded-2xl bg-muted/20 border-border/40 hover:bg-muted/40 transition-all font-bold"
        />

        <StateSelect
          countryId={countryId}
          value={stateId || "all"}
          onChange={(val) => {
            setStateId(val === "all" ? "" : val);
            setCityId("");
            setPincodeId("");
          }}
          variant="premium"
          placeholder="Select State"
          showAllOption
          className="h-14 rounded-2xl bg-muted/20 border-border/40 hover:bg-muted/40 transition-all font-bold"
        />

        <CitySelect
          stateId={stateId}
          value={cityId || "all"}
          onChange={(val) => {
            setCityId(val === "all" ? "" : val);
            setPincodeId("");
          }}
          variant="premium"
          placeholder="Select City"
          showAllOption
          className="h-14 rounded-2xl bg-muted/20 border-border/40 hover:bg-muted/40 transition-all font-bold"
        />

        <PincodeSelect
          cityId={cityId}
          value={pincodeId || "all"}
          onChange={(val) => setPincodeId(val === "all" ? "" : val)}
          variant="premium"
          placeholder="Select Pincode"
          showAllOption
          className="h-14 rounded-2xl bg-muted/20 border-border/40 hover:bg-muted/40 transition-all font-bold"
        />
      </div>

      {hasFilter && (
        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-2">
             {/* Filter count indicator could go here */}
          </div>
          <button 
            type="button"
            onClick={handleClear}
            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive flex items-center gap-2 transition-colors group"
          >
            <div className="h-6 w-6 flex items-center justify-center rounded-lg bg-muted group-hover:bg-destructive/10 transition-colors">
              <X className="h-3 w-3" />
            </div>
            Reset Directory View
          </button>
        </div>
      )}
    </div>
  );
}
