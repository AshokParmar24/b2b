"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Tag, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountrySelect } from "@/components/common/CountrySelect";
import { StateSelect } from "@/components/common/StateSelect";
import { CitySelect } from "@/components/common/CitySelect";
import { PincodeSelect } from "@/components/common/PincodeSelect";
import { HsnSelect } from "@/components/common/HsnSelect";

interface BusinessFilterBarProps {
  initialQ?: string;
  initialHsn?: string;
  initialStatus?: string;
  initialCountry?: string;
  initialState?: string;
  initialCity?: string;
  initialPincode?: string;
}

export function BusinessFilterBar({
  initialQ = "",
  initialHsn = "",
  initialStatus = "all",
  initialCountry = "",
  initialState = "",
  initialCity = "",
  initialPincode = "",
}: BusinessFilterBarProps) {
  const router = useRouter();

  const [q, setQ] = useState(initialQ);
  const [hsn, setHsn] = useState(initialHsn);
  const [status, setStatus] = useState(initialStatus);
  const [countryId, setCountryId] = useState(initialCountry);
  const [stateId, setStateId] = useState(initialState);
  const [cityId, setCityId] = useState(initialCity);
  const [pincodeId, setPincodeId] = useState(initialPincode);

  const hasFilter = !!(q || hsn || countryId || stateId || cityId || pincodeId || status !== "all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (hsn) params.set("hsn", hsn);
    if (status !== "all") params.set("status", status);
    if (countryId && countryId !== "all") params.set("country", countryId);
    if (stateId && stateId !== "all") params.set("state", stateId);
    if (cityId && cityId !== "all") params.set("city", cityId);
    if (pincodeId && pincodeId !== "all") params.set("pincode", pincodeId);

    router.push(`/admin/businesses?${params.toString()}`);
  };

  const handleClear = () => {
    setQ("");
    setHsn("");
    setStatus("all");
    setCountryId("");
    setStateId("");
    setCityId("");
    setPincodeId("");
    router.push("/admin/businesses");
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-4 mb-8 bg-card/40 backdrop-blur-xl p-5 rounded-[28px] border border-border/50 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            value={q} 
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name, GST, Owner..." 
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/30 border-border/50 text-sm font-semibold focus:bg-background transition-colors outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <div className="w-full md:w-48">
          <HsnSelect 
            value={hsn || "all"}
            onChange={(val) => setHsn(val === "all" ? "" : val)}
            showAllOption
            placeholder="HSN Code"
            variant="premium"
            className="w-full"
          />
        </div>

        <select 
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full md:w-48 px-4 py-3 rounded-2xl bg-muted/30 border-border/50 text-sm font-semibold focus:bg-background transition-colors outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <CountrySelect
          value={countryId || "all"}
          onChange={(val) => {
            setCountryId(val === "all" ? "" : val);
            setStateId("");
            setCityId("");
            setPincodeId("");
          }}
          variant="premium"
          placeholder="All Countries"
          showAllOption
          className="w-full flex-1"
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
          placeholder="All States"
          showAllOption
          className="w-full flex-1"
        />

        <CitySelect
          stateId={stateId}
          value={cityId || "all"}
          onChange={(val) => {
            setCityId(val === "all" ? "" : val);
            setPincodeId("");
          }}
          variant="premium"
          placeholder="All Cities"
          showAllOption
          className="w-full flex-1"
        />

        <PincodeSelect
          cityId={cityId}
          value={pincodeId || "all"}
          onChange={(val) => setPincodeId(val === "all" ? "" : val)}
          variant="premium"
          placeholder="All Pincodes"
          showAllOption
          className="w-full flex-1"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {hasFilter && (
          <Button type="button" variant="ghost" onClick={handleClear} className="h-10 px-6 rounded-xl font-bold text-muted-foreground hover:text-destructive">
             <XCircle className="h-4 w-4 mr-2" /> Clear Filters
          </Button>
        )}
        <Button type="submit" className="h-10 px-8 rounded-xl bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
          Apply Filters
        </Button>
      </div>
    </form>
  );
}
