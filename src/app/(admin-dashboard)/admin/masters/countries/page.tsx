"use client";

import React from "react";
import { CountryManagement } from "@/components/admin/masters/countries/CountryManagement";

export default function CountriesPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <CountryManagement />
    </div>
  );
}
