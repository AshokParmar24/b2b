"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  ArrowLeft,
  Save,
  Crown,
  Plus,
  X,
  Zap,
  CheckCircle2,
  Info,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AppRoutes } from "@/lib/routes";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { planSchema, PlanInput } from "@/lib/validations/plans";

interface PlanFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function PlanForm({ initialData, isEdit = false }: PlanFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PlanInput>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      maxListings: initialData?.maxListings || 1,
      maxImages: initialData?.maxImages || 3,
      maxHsnCodes: initialData?.maxHsnCodes || null,
      features: initialData?.features || ["Standard Support"],
      isActive: initialData?.isActive ?? true,
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-expect-error - React Hook Form types primitive arrays poorly in some versions
    name: "features"
  });

  const onSubmit = async (data: PlanInput) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading(isEdit ? "Refining plan architecture..." : "Deploying new plan tier...");

    try {
      const url = isEdit
        ? `/api/plans/${initialData?._id}`
        : "/api/plans";

      const response = isEdit
        ? await api.put(url, data)
        : await api.post(url, data);

      toast.success(isEdit ? "Plan architecture refined" : "New plan tier deployed", { id: loadingToast });
      router.push(AppRoutes.ADMIN_PLANS);
      router.refresh();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "System synchronization failed";
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6 md:px-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 🧭 NAVIGATION HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href={AppRoutes.ADMIN_PLANS}>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
              {isEdit ? "Refine Plan Tier" : "Configure New Plan"}
              <Crown className="h-5 w-5 text-primary" />
            </h1>
            <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">
              Tier Architecture & Feature Entitlements
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            form="plan-form"
            disabled={isSubmitting}
            className="h-11 rounded-2xl px-6 bg-primary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all font-bold"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isEdit ? "Refine Architecture" : "Deploy Tier"}
          </Button>
        </div>
      </div>

      <form id="plan-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 📋 MAIN CONFIGURATION */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="rounded-[32px] border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/5">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black tracking-tight">Core Metadata</CardTitle>
                  <CardDescription className="text-xs font-medium">Define the identity and pricing of this tier</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Plan Name</label>
                  <Input
                    {...register("name")}
                    placeholder="e.g. Professional Elite"
                    className={cn(
                      "h-12 rounded-2xl bg-muted/30 border-border/40 focus:ring-primary/20 transition-all font-medium",
                      errors.name && "border-destructive/50 focus:ring-destructive/20"
                    )}
                  />
                  {errors.name && <p className="text-[10px] font-bold text-destructive px-1">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Monthly Price (₹)</label>
                  <Input
                    {...register("price", { valueAsNumber: true })}
                    type="number"
                    placeholder="999"
                    className={cn(
                      "h-12 rounded-2xl bg-muted/30 border-border/40 focus:ring-primary/20 transition-all font-medium",
                      errors.price && "border-destructive/50 focus:ring-destructive/20"
                    )}
                  />
                  {errors.price && <p className="text-[10px] font-bold text-destructive px-1">{errors.price.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Detailed Description</label>
                <textarea
                  {...register("description")}
                  placeholder="Explain the value proposition of this tier..."
                  className={cn(
                    "w-full min-h-[120px] rounded-[24px] bg-muted/30 border-border/40 p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm",
                    errors.description && "border-destructive/50 focus:ring-destructive/20"
                  )}
                />
                {errors.description && <p className="text-[10px] font-bold text-destructive px-1">{errors.description.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* 🎯 FEATURE ENTITLEMENTS */}
          <Card className="rounded-[32px] border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/5">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black tracking-tight">Feature Entitlements</CardTitle>
                  <CardDescription className="text-xs font-medium">Configure specific platform limits and capabilities</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Max Listings</label>
                  <Input
                    {...register("maxListings", { valueAsNumber: true })}
                    type="number"
                    className="h-12 rounded-2xl bg-muted/30 border-border/40 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Max Images / Card</label>
                  <Input
                    {...register("maxImages", { valueAsNumber: true })}
                    type="number"
                    className="h-12 rounded-2xl bg-muted/30 border-border/40 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">HSN Codes (Null=∞)</label>
                  <Input
                    {...register("maxHsnCodes", {
                      setValueAs: v => v === "" ? null : parseInt(v, 10)
                    })}
                    placeholder="Unlimited"
                    className="h-12 rounded-2xl bg-muted/30 border-border/40 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Additional Feature Highlights</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append("")}
                    className="h-8 rounded-xl border-primary/20 text-primary hover:bg-primary/10 font-bold px-3"
                  >
                    <Plus className="h-3 w-3 mr-1.5" /> Add Highlight
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="group relative">
                      <Input
                        {...register(`features.${index}` as const)}
                        placeholder="e.g. Priority 24/7 Support"
                        className="h-11 rounded-xl bg-muted/20 border-border/30 pr-10 font-medium text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 🛡️ SIDEBAR CONTROLS */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="rounded-[32px] border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/5">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black tracking-tight">Status</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/40">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-foreground">Tier Availability</p>
                  <p className="text-[10px] font-medium text-muted-foreground">Toggle visibility for users</p>
                </div>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-muted-foreground/20">
                  <input
                    type="checkbox"
                    {...register("isActive")}
                    className="sr-only peer"
                  />
                  <div className="peer-checked:bg-primary absolute inset-0 rounded-full transition-colors duration-200" />
                  <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all duration-200 peer-checked:translate-x-5" />
                </div>
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                <h4 className="text-sm font-black text-primary mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Deployment Check
                </h4>
                <ul className="space-y-2">
                  {["Name is unique", "Pricing is valid", "Entitlements set"].map((check, i) => (
                    <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/80">
                      <div className="h-1 w-1 rounded-full bg-primary" />
                      {check}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
