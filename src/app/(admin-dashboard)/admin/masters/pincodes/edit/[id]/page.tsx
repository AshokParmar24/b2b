"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PincodeForm } from "@/components/admin/masters/pincodes/PincodeForm";
import { Loader2, Hash, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppRoutes } from "@/lib/routes";
import { api } from "@/lib/api";

export default function EditPincodePage() {
  const { id } = useParams();
  const [pincode, setPincode] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchPincode();
  }, [id]);

  const fetchPincode = async () => {
    try {
      const data = await api.get<any>(`/api/masters/pincodes/${id}`);
      // The API returns cityId populated with { _id, name, stateId }
      // We need to resolve cityId to string, stateId, and countryId
      const cityIdStr = data.cityId?._id || data.cityId;
      // Depending on if stateId is populated inside cityId, we might not have countryId directly
      // But let's assume city API populates stateId or we at least have stateId.
      let stateIdStr = "";
      let countryIdStr = "";

      if (data.cityId && typeof data.cityId === 'object') {
        stateIdStr = data.cityId.stateId?._id || data.cityId.stateId || "";
        countryIdStr = data.cityId.stateId?.countryId || ""; // This might be undefined if not populated deeply
      }

      // If we don't have countryId, we might need to fetch the state to get the countryId
      if (stateIdStr && !countryIdStr) {
        try {
          const stateData = await api.get<any>(`/api/masters/states/${stateIdStr}`);
          countryIdStr = stateData.countryId?._id || stateData.countryId || "";
        } catch (e) {
           // ignore
        }
      }

      setPincode({
        ...data,
        cityId: cityIdStr,
        stateId: stateIdStr,
        countryId: countryIdStr,
      });
    } catch {
      // Handled by interceptor
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
          Loading Pincode Record...
        </p>
      </div>
    );
  }

  if (!pincode) {
    return (
      <div className="flex h-[70vh] w-full flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="relative mb-8">
          <div className="absolute -inset-8 rounded-full bg-destructive/5 blur-3xl" />
          <div className="relative rounded-full bg-destructive/10 p-8 text-destructive border border-destructive/20 shadow-2xl shadow-destructive/10">
            <Hash className="h-16 w-16" />
          </div>
        </div>
        <div className="max-w-md space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-foreground">Pincode Not Found</h2>
          <p className="text-muted-foreground font-bold text-base leading-relaxed">
            The system could not locate this pincode record.
          </p>
        </div>
        <Link href={AppRoutes.ADMIN_MASTERS_PINCODES} className="mt-10">
          <Button className="h-14 rounded-2xl px-10 font-black shadow-2xl shadow-primary/20 transition-all hover:scale-[1.05] active:scale-95 flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            Return to Pincodes
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <PincodeForm initialData={pincode} isEdit />
    </div>
  );
}
