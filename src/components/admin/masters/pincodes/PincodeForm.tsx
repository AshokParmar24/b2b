"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Loader2,
  ArrowLeft,
  Save,
  Hash,
  Info,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CountrySelect } from "@/components/common/CountrySelect";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AppRoutes } from "@/lib/routes";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { toast } from "react-hot-toast";
import { StateSelect } from "@/components/common/StateSelect";
import { CitySelect } from "@/components/common/CitySelect";
import { cn } from "@/lib/utils";

const pincodeFormSchema = yup.object({
  countryId: yup.string().required("Please select a country"),
  stateId: yup.string().required("Please select a state"),
  cityId: yup.string().required("Please select a city"),
  pincode: yup
    .string()
    .required("Pincode is required")
    .min(4, "Pincode must be at least 4 digits")
    .matches(/^\d+$/, "Must contain numbers only"),
  area: yup.string().optional().default(""),
  isActive: yup.boolean().optional().default(true),
}).required();

type PincodeFormData = yup.InferType<typeof pincodeFormSchema>;

interface PincodeFormProps {
  initialData?: {
    _id?: string;
    pincode: string;
    area?: string;
    cityId: string;
    stateId?: string;
    countryId?: string;
    isActive?: boolean;
  };
  isEdit?: boolean;
}

export function PincodeForm({ initialData, isEdit = false }: PincodeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PincodeFormData>({
    resolver: yupResolver(pincodeFormSchema),
    defaultValues: {
      countryId: initialData?.countryId || "",
      stateId: initialData?.stateId || "",
      cityId: initialData?.cityId || "",
      pincode: initialData?.pincode || "",
      area: initialData?.area || "",
      isActive: initialData?.isActive ?? true,
    },
  });

  const selectedCountryId = watch("countryId");
  const selectedStateId = watch("stateId");

  const onSubmit = async (data: PincodeFormData) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading(isEdit ? "Updating pincode record..." : "Registering new pincode...");

    try {
      const url = isEdit
        ? `${API_ENDPOINTS.MASTERS.PINCODES}/${initialData?._id}`
        : API_ENDPOINTS.MASTERS.PINCODES;

      const payload = {
        pincode: data.pincode,
        area: data.area || "",
        cityId: data.cityId,
        isActive: data.isActive,
      };

      if (isEdit) {
        await api.put(url, payload);
      } else {
        await api.post(url, payload);
      }

      toast.success(isEdit ? "Pincode updated" : "Pincode registered successfully", { id: loadingToast });
      router.refresh();
      router.push("/admin/masters/pincodes");
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Pincode operation failed";
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stateSelectContent = (
    <Controller
      name="stateId"
      control={control}
      render={({ field }) => (
        <StateSelect
          label="Parent State"
          countryId={selectedCountryId}
          value={field.value}
          onChange={(val) => {
            field.onChange(val);
            setValue("cityId", "");
          }}
          variant="premium"
          placeholder="Select parent state"
          error={errors.stateId?.message}
        />
      )}
    />
  );

  const citySelectContent = (
    <Controller
      name="cityId"
      control={control}
      render={({ field }) => (
        <CitySelect
          label="Parent City"
          stateId={selectedStateId}
          value={field.value}
          onChange={field.onChange}
          variant="premium"
          placeholder="Select parent city"
          error={errors.cityId?.message}
        />
      )}
    />
  );

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex items-center justify-between">
        <Link href={AppRoutes.ADMIN_MASTERS_PINCODES}>
          <Button variant="ghost" className="rounded-2xl hover:bg-primary/5 group text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            <span className="font-bold tracking-tight text-sm">Pincode Directory</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="rounded-[40px] border border-border/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] overflow-hidden bg-card/50 backdrop-blur-xl">
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-violet-500/50 to-primary/30" />
            <CardHeader className="p-5 sm:p-8 md:p-10 pb-4">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                  {isEdit ? "Edit Pincode" : "Register New Pincode"}
                </CardTitle>
                <CardDescription className="text-xs font-black text-muted-foreground/40 uppercase tracking-[0.2em]">
                  Postal Code Intelligence
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-8 md:p-10 pt-4">
              <form id="pincode-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 gap-8">
                  {/* Country */}
                  <Controller
                    name="countryId"
                    control={control}
                    render={({ field }) => (
                      <CountrySelect
                        label="Parent Country"
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val);
                          setValue("stateId", "");
                          setValue("cityId", "");
                        }}
                        variant="premium"
                        placeholder="Select parent country"
                        error={errors.countryId?.message}
                      />
                    )}
                  />

                  {/* State */}
                  {stateSelectContent}

                  {/* City */}
                  {citySelectContent}

                  {/* Pincode */}
                  <Input
                    label="Postal Code"
                    placeholder="e.g. 400001"
                    {...register("pincode")}
                    error={errors.pincode?.message}
                    maxLength={10}
                    className="h-14 rounded-2xl bg-muted/20 border-border/50 focus:bg-background font-black text-lg tracking-[0.3em]"
                  />

                  {/* Area */}
                  <Input
                    label="Area / Locality Name (Optional)"
                    placeholder="e.g. Fort, Bandra West"
                    {...register("area")}
                    error={errors.area?.message}
                    className="h-14 rounded-2xl bg-muted/20 border-border/50 focus:bg-background font-bold text-base"
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              type="submit"
              form="pincode-form"
              disabled={isSubmitting}
              className="w-full sm:flex-[2] h-16 rounded-[24px] text-xl font-black shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95 bg-primary hover:bg-primary/90 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <div className="flex items-center gap-3">
                  <Save className="h-6 w-6" />
                  {isEdit ? "Update Pincode" : "Register Pincode"}
                </div>
              )}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
              className="w-full sm:flex-1 h-16 rounded-[24px] font-bold text-muted-foreground border-border/60 hover:bg-muted transition-colors cursor-pointer"
            >
              Discard
            </Button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[32px] border-none bg-primary/5 p-6 sm:p-8 relative overflow-hidden group">
            <h3 className="flex items-center gap-2 font-black text-primary mb-6 uppercase tracking-tighter">
              <Info className="h-5 w-5" /> Postal Rules
            </h3>
            <ul className="space-y-6">
              {[
                { title: "City Binding", desc: "Every pincode must be strictly linked to a verified city." },
                { title: "Numeric Only", desc: "Postal codes must contain digits only — no letters or symbols." },
                { title: "Unique Per City", desc: "Same pincode cannot exist twice for the same city." },
              ].map((rule, i) => (
                <li key={i} className="flex gap-4">
                  <div className="h-6 w-6 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-[10px] font-black shadow-lg shadow-primary/20">
                    {i + 1}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-foreground">{rule.title}</p>
                    <p className="text-xs font-bold text-muted-foreground/60 leading-relaxed">{rule.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="rounded-[32px] border border-emerald-500/10 bg-emerald-500/5 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 text-emerald-600 mb-4">
              <ShieldCheck className="h-6 w-6" />
              <span className="font-black tracking-tight text-lg">Zod Guard</span>
            </div>
            <p className="text-xs font-bold text-emerald-600/60 leading-relaxed">
              Server-side Zod validation ensures 100% data integrity for every submission.
            </p>
          </Card>

          <Card className="rounded-[32px] border border-violet-500/10 bg-violet-500/5 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 text-violet-600 mb-4">
              <MapPin className="h-6 w-6" />
              <span className="font-black tracking-tight text-lg">Logistics Layer</span>
            </div>
            <p className="text-xs font-bold text-violet-600/60 leading-relaxed">
              Pincodes power business address resolution and delivery mapping across the platform.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
