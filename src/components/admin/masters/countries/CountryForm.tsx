"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { 
  Loader2, 
  ArrowLeft, 
  Save, 
  Globe, 
  Info,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AppRoutes } from "@/lib/routes";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { toast } from "react-hot-toast";

const countrySchema = yup.object({
  name: yup.string().required("Country name is required").min(2, "Name must be at least 2 characters"),
  code: yup.string().required("ISO code is required").length(2, "Must be exactly 2 characters").uppercase(),
  phoneCode: yup.string().required("Phone code is required").matches(/^\d+$/, "Dialing code must be numbers only"),
  currencyCode: yup.string().required("Currency code is required").length(3, "Must be 3 characters").uppercase(),
  currencySymbol: yup.string().required("Currency symbol is required"),
  flag: yup.string().optional()
}).required();

type CountryFormData = yup.InferType<typeof countrySchema>;

interface CountryFormProps {
  initialData?: {
    _id?: string;
    name: string;
    code: string;
    phoneCode: string;
    currencyCode?: string;
    currencySymbol?: string;
    flag?: string;
  };
  isEdit?: boolean;
}

export function CountryForm({ initialData, isEdit = false }: CountryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CountryFormData>({
    resolver: yupResolver(countrySchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      code: initialData?.code || "",
      phoneCode: initialData?.phoneCode || "",
      currencyCode: initialData?.currencyCode || "USD",
      currencySymbol: initialData?.currencySymbol || "$",
      flag: initialData?.flag || ""
    }
  });

  const onSubmit = async (data: CountryFormData) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading(isEdit ? "Refining country record..." : "Authorizing new country...");
    
    try {
      const url = isEdit 
        ? `${API_ENDPOINTS.MASTERS.COUNTRIES}/${initialData?._id}` 
        : API_ENDPOINTS.MASTERS.COUNTRIES;
      
      const response = isEdit 
        ? await api.put(url, data)
        : await api.post(url, data);

      toast.success(isEdit ? "Country record refined" : "Country authorized successfully", { id: loadingToast });
      router.push("/admin/masters/countries");
      router.refresh();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "System synchronization failed";
      toast.error(errorMessage, { id: loadingToast });
      
      // If it's a validation error from server (Zod)
      if (error.response?.status === 400 && error.response.data.details) {
        toast.error("Please check the form for errors");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* 🔙 BACK HEADER */}
      <div className="flex items-center justify-between">
        <Link href={AppRoutes.ADMIN_MASTERS_COUNTRIES}>
          <Button 
            variant="ghost" 
            className="rounded-2xl hover:bg-primary/5 group text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            <span className="font-bold tracking-tight">Return to Directory</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 📝 MAIN FORM */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="rounded-[32px] border border-border/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] overflow-hidden bg-card/50 backdrop-blur-xl">
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/50 to-emerald-400" />
            <CardHeader className="p-5 sm:p-8 md:p-10 pb-4">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                  {isEdit ? "Refine Country" : "New Country"}
                </CardTitle>
                <CardDescription className="text-xs font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">
                  Location Master Intelligence
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-8 md:p-10 pt-4">
              <form id="country-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <Input 
                    label="Official Name"
                    placeholder="e.g. United Kingdom"
                    {...register("name")}
                    error={errors.name?.message}
                    className="h-12 md:h-14 rounded-2xl bg-muted/20 border-border/50 focus:bg-background transition-all font-medium text-base md:text-lg"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      label="ISO Alpha-2"
                      placeholder="GB"
                      {...register("code")}
                      error={errors.code?.message}
                      maxLength={2}
                      className="h-12 md:h-14 rounded-2xl bg-muted/20 border-border/50 focus:bg-background text-center font-bold uppercase text-base md:text-lg tracking-tight"
                    />
                    <Input 
                      label="Dialing Code"
                      placeholder="44"
                      {...register("phoneCode")}
                      error={errors.phoneCode?.message}
                      className="h-12 md:h-14 rounded-2xl bg-muted/20 border-border/50 focus:bg-background font-medium text-base md:text-lg"
                      prefix="+"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      label="Currency Code"
                      placeholder="USD"
                      {...register("currencyCode")}
                      error={errors.currencyCode?.message}
                      className="h-12 md:h-14 rounded-2xl bg-muted/20 border-border/50 focus:bg-background font-bold uppercase text-base md:text-lg"
                    />
                    <Input 
                      label="Currency Symbol"
                      placeholder="$"
                      {...register("currencySymbol")}
                      error={errors.currencySymbol?.message}
                      className="h-12 md:h-14 rounded-2xl bg-muted/20 border-border/50 focus:bg-background font-bold text-base md:text-lg"
                    />
                  </div>

                  <Input 
                    label="Flag Symbol"
                    placeholder="🇬🇧"
                    {...register("flag")}
                    error={errors.flag?.message}
                    className="h-12 md:h-14 rounded-2xl bg-muted/20 border-border/50 focus:bg-background font-medium text-base md:text-lg"
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Button 
              type="submit" 
              form="country-form"
              disabled={isSubmitting}
              className="w-full sm:flex-[2] h-14 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  {isEdit ? "Update Directory" : "Authorize Country"}
                </div>
              )}
            </Button>
            <Button 
              variant="outline" 
              type="button"
              onClick={() => router.back()}
              className="w-full sm:flex-1 h-14 rounded-2xl font-bold text-muted-foreground border-border/60 hover:bg-muted transition-colors"
            >
              Discard Changes
            </Button>
          </div>
        </div>

        {/* ℹ️ INFO PANEL */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[32px] border-none bg-primary/5 p-6 sm:p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-24 w-24 bg-primary/10 rounded-full -mr-12 -mt-12 blur-2xl transition-transform group-hover:scale-150 duration-700" />
            <h3 className="flex items-center gap-2 font-black text-primary mb-6">
              <Info className="h-5 w-5" /> Data Integrity
            </h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="h-6 w-6 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-xs font-black shadow-lg shadow-primary/20">1</div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-foreground">ISO Standards</p>
                  <p className="text-xs font-bold text-muted-foreground/70 leading-relaxed">Must adhere to international 3166-1 formatting.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="h-6 w-6 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-xs font-black shadow-lg shadow-primary/20">2</div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-foreground">Indexing</p>
                  <p className="text-xs font-bold text-muted-foreground/70 leading-relaxed">Phone prefixes are indexed for global caller identification.</p>
                </div>
              </li>
            </ul>
          </Card>

          <Card className="rounded-[32px] border border-emerald-500/10 bg-emerald-500/5 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 text-emerald-600 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="font-black tracking-tight text-lg">System Guard</span>
            </div>
            <p className="text-xs font-bold text-emerald-600/70 leading-relaxed">
              Automated validation checks every entry against our global master database to prevent duplication and ensure high-fidelity records.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
