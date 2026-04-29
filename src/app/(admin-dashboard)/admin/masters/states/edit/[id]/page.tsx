"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { StateForm } from "@/components/admin/masters/states/StateForm";
import { Loader2, Map, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppRoutes } from "@/lib/routes";
import { api } from "@/lib/api";

export default function EditStatePage() {
  const { id } = useParams();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchState();
    }
  }, [id]);

  const fetchState = async () => {
    try {
      const data = await api.get<any>(`/api/masters/states/${id}`);
      setState(data);
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
          Synchronizing Registry...
        </p>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="flex h-[70vh] w-full flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="relative mb-8">
          <div className="absolute -inset-8 rounded-full bg-destructive/5 blur-3xl" />
          <div className="relative rounded-full bg-destructive/10 p-8 text-destructive border border-destructive/20 shadow-2xl shadow-destructive/10">
            <Map className="h-16 w-16" />
          </div>
        </div>
        
        <div className="max-w-md space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-foreground">Registry Void</h2>
          <p className="text-muted-foreground font-bold text-base leading-relaxed">
            The territory intelligence system cannot locate this specific record.
          </p>
        </div>

        <Link href={AppRoutes.ADMIN_MASTERS_STATES} className="mt-10">
          <Button className="h-14 rounded-2xl px-10 font-black shadow-2xl shadow-primary/20 transition-all hover:scale-[1.05] active:scale-95 flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            Return to Registry
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <StateForm initialData={state} isEdit />
    </div>
  );
}
