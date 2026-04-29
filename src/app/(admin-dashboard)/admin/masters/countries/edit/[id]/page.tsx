"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CountryForm } from "@/components/admin/masters/countries/CountryForm";
import { Loader2, Globe, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppRoutes } from "@/lib/routes";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function EditCountryPage() {
  const { id } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCountry();
    }
  }, [id]);

  const fetchCountry = async () => {
    try {
      const data = await api.get<any>(`/api/masters/countries/${id}`);
      setCountry(data);
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl animate-pulse" />
          <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
        </div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
          Loading Record...
        </p>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="flex h-[70vh] w-full flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="relative mb-8">
          <div className="absolute -inset-8 rounded-full bg-destructive/5 blur-3xl" />
          <div className="relative rounded-full bg-destructive/10 p-8 text-destructive border border-destructive/20 shadow-2xl shadow-destructive/10">
            <Globe className="h-16 w-16" />
          </div>
        </div>
        
        <div className="max-w-md space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-foreground">Record Missing</h2>
          <p className="text-muted-foreground font-bold text-base leading-relaxed">
            The country directory could not locate this specific record. It may have been permanently removed or the link is invalid.
          </p>
        </div>

        <Link href={AppRoutes.ADMIN_MASTERS_COUNTRIES} className="mt-10">
          <Button className="h-14 rounded-2xl px-10 font-black shadow-2xl shadow-primary/20 transition-all hover:scale-[1.05] active:scale-95 flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            Back to Directory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <CountryForm initialData={country} isEdit />
    </div>
  );
}
