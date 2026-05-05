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
  Building2,
  Info,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CountrySelect } from "@/components/common/CountrySelect";
import { StateSelect } from "@/components/common/StateSelect";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AppRoutes } from "@/lib/routes";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

const citySchema = yup.object({
  countryId: yup.string().required("Please select a country"),
  stateId: yup.string().required("Please select a state"),
  name: yup.string().required("City name is required").min(2, "Name must be at least 2 characters"),
  isActive: yup.boolean().optional().default(true),
}).required();

type CityFormData = yup.InferType<typeof citySchema>;

interface CityFormProps {
  initialData?: {
    _id?: string;
    name: string;
    stateId: string;
    countryId?: string;
    isActive?: boolean;
  };
  isEdit?: boolean;
}

export function CityForm({ initialData, isEdit = false }: CityFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CityFormData>({
    resolver: yupResolver(citySchema),
    defaultValues: {
      countryId: initialData?.countryId || "",
      stateId: initialData?.stateId || "",
      name: initialData?.name || "",
      isActive: initialData?.isActive ?? true,
    },
  });

  const selectedCountryId = watch("countryId");

  const onSubmit = async (data: CityFormData) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading(isEdit ? "Updating city record..." : "Registering new city...");

    try {
      const url = isEdit
        ? `${API_ENDPOINTS.MASTERS.CITIES}/${initialData?._id}`
        : API_ENDPOINTS.MASTERS.CITIES;

      const payload = { name: data.name, stateId: data.stateId, isActive: data.isActive };

      if (isEdit) {
        await api.put(url, payload);
      } else {
        await api.post(url, payload);
      }

      toast.success(isEdit ? "City updated" : "City registered successfully", { id: loadingToast });
      router.refresh();
      router.push("/admin/masters/cities");
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "City operation failed";
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex items-center justify-between">
        <Link href={AppRoutes.ADMIN_MASTERS_CITIES}>
          <Button variant="ghost" className="rounded-2xl hover:bg-primary/5 group text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            <span className="font-bold tracking-tight text-sm">City Directory</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="rounded-[40px] border border-border/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] overflow-hidden bg-card/50 backdrop-blur-xl">
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/50 to-blue-400" />
            <CardHeader className="p-5 sm:p-8 md:p-10 pb-4">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                  {isEdit ? "Edit City" : "Register New City"}
                </CardTitle>
                <CardDescription className="text-xs font-black text-muted-foreground/40 uppercase tracking-[0.2em]">
                  Urban Center Management
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-8 md:p-10 pt-4">
              <form id="city-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 gap-8">
                  {/* Country Selector */}
                  <Controller
                    name="countryId"
                    control={control}
                    render={({ field }) => (
                      <CountrySelect
                        label="Parent Country"
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val);
                          setValue("stateId", ""); // reset state on country change
                        }}
                        variant="premium"
                        placeholder="Select parent country"
                        error={errors.countryId?.message}
                      />
                    )}
                  />

                  {/* State Selector */}
                  <Controller
                    name="stateId"
                    control={control}
                    render={({ field }) => (
                      <StateSelect
                        label="Parent State"
                        countryId={selectedCountryId}
                        value={field.value}
                        onChange={field.onChange}
                        variant="premium"
                        placeholder="Select parent state"
                        error={errors.stateId?.message}
                      />
                    )}
                  />

                  {/* City Name */}
                  <Input
                    label="City / Municipality Name"
                    placeholder="e.g. Mumbai"
                    {...register("name")}
                    error={errors.name?.message}
                    className="h-14 rounded-2xl bg-muted/20 border-border/50 focus:bg-background transition-all font-bold text-lg"
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              type="submit"
              form="city-form"
              disabled={isSubmitting}
              className="w-full sm:flex-[2] h-16 rounded-[24px] text-xl font-black shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95 bg-primary hover:bg-primary/90 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <div className="flex items-center gap-3">
                  <Save className="h-6 w-6" />
                  {isEdit ? "Update City" : "Register City"}
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
              <Info className="h-5 w-5" /> Registration Rules
            </h3>
            <ul className="space-y-6">
              {[
                { title: "State Binding", desc: "Every city must be linked to a verified state/province." },
                { title: "Unique Names", desc: "City names must be unique within the same state." },
                { title: "Cascaded Hierarchy", desc: "Country → State → City hierarchy must be respected." },
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
              All submissions are validated server-side against Zod schemas to ensure 100% data integrity.
            </p>
          </Card>

          <Card className="rounded-[32px] border border-blue-500/10 bg-blue-500/5 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 text-blue-600 mb-4">
              <Building2 className="h-6 w-6" />
              <span className="font-black tracking-tight text-lg">Urban Center</span>
            </div>
            <p className="text-xs font-bold text-blue-600/60 leading-relaxed">
              Cities are the foundational units for pincode and business address mapping.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
