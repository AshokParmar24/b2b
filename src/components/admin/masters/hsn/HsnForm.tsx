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
  Hash, 
  Info,
  ShieldCheck,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AppRoutes } from "@/lib/routes";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { toast } from "react-hot-toast";

const hsnSchema = yup.object({
  code: yup.string().required("HSN Code is required").min(4, "Must be at least 4 digits").max(8, "Must be at most 8 digits").matches(/^\d+$/, "Must be numbers only"),
  description: yup.string().required("Description is required").min(5, "Description must be at least 5 characters"),
  unit: yup.string().optional().default("PCS"),
  isActive: yup.boolean().optional().default(true),
}).required();

type HsnFormData = yup.InferType<typeof hsnSchema>;

interface HsnFormProps {
  initialData?: {
    _id?: string;
    code: string;
    description: string;
    unit: string;
    isActive?: boolean;
  };
  isEdit?: boolean;
}

export function HsnForm({ initialData, isEdit = false }: HsnFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HsnFormData>({
    resolver: yupResolver(hsnSchema) as any,
    defaultValues: {
      code: initialData?.code || "",
      description: initialData?.description || "",
      unit: initialData?.unit || "PCS",
      isActive: initialData?.isActive ?? true
    }
  });

  const onSubmit = async (data: HsnFormData) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading(isEdit ? "Updating HSN record..." : "Creating new HSN code...");
    
    try {
      const url = isEdit 
        ? `${API_ENDPOINTS.MASTERS.HSN}/${initialData?._id}` 
        : API_ENDPOINTS.MASTERS.HSN;
      
      const response = isEdit 
        ? await api.put(url, data)
        : await api.post(url, data);

      toast.success(isEdit ? "HSN record updated" : "HSN code created successfully", { id: loadingToast });
      router.push("/admin/masters/hsn");
      router.refresh();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to save HSN code";
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex items-center justify-between">
        <Link href="/admin/masters/hsn">
          <Button 
            variant="ghost" 
            className="rounded-2xl hover:bg-primary/5 group text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            <span className="font-bold tracking-tight">Back to HSN Master</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="rounded-[32px] border border-border/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] overflow-hidden bg-card/50 backdrop-blur-xl">
            <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-purple-500 to-primary" />
            <CardHeader className="p-5 sm:p-8 md:p-10 pb-4">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                  {isEdit ? "Edit HSN Code" : "New HSN Code"}
                </CardTitle>
                <CardDescription className="text-xs font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">
                  Harmonized System Nomenclature
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-8 md:p-10 pt-4">
              <form id="hsn-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      label="HSN Code"
                      placeholder="e.g. 6907"
                      {...register("code")}
                      error={errors.code?.message}
                      className="h-12 md:h-14 rounded-2xl bg-muted/20 border-border/50 focus:bg-background font-bold text-base md:text-lg tracking-widest"
                    />
                    <Input 
                      label="Default Unit"
                      placeholder="PCS, SQM, KGS"
                      {...register("unit")}
                      error={errors.unit?.message}
                      className="h-12 md:h-14 rounded-2xl bg-muted/20 border-border/50 focus:bg-background font-bold text-base md:text-lg uppercase"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-foreground/70 ml-1 uppercase tracking-wider">
                      Product Description
                    </label>
                    <Textarea 
                      placeholder="Detailed description of the product category..."
                      {...register("description")}
                      className="min-h-[150px] rounded-2xl bg-muted/20 border-border/50 focus:bg-background transition-all font-medium text-base p-4"
                    />
                    {errors.description && (
                      <p className="text-xs font-bold text-destructive ml-1">{errors.description.message}</p>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Button 
              type="submit" 
              form="hsn-form"
              disabled={isSubmitting}
              className="w-full sm:flex-[2] h-14 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  {isEdit ? "Update HSN Code" : "Create HSN Code"}
                </div>
              )}
            </Button>
            <Button 
              variant="outline" 
              type="button"
              onClick={() => router.back()}
              className="w-full sm:flex-1 h-14 rounded-2xl font-bold text-muted-foreground border-border/60 hover:bg-muted transition-colors"
            >
              Cancel
            </Button>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[32px] border-none bg-violet-500/5 p-6 sm:p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-24 w-24 bg-violet-500/10 rounded-full -mr-12 -mt-12 blur-2xl transition-transform group-hover:scale-150 duration-700" />
            <h3 className="flex items-center gap-2 font-black text-violet-600 mb-6">
              <Info className="h-5 w-5" /> Classification
            </h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="h-6 w-6 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 text-xs font-black">1</div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-foreground">Code Structure</p>
                  <p className="text-xs font-bold text-muted-foreground/70 leading-relaxed">Typically 4, 6, or 8 digits defining product hierarchy.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="h-6 w-6 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 text-xs font-black">2</div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-foreground">Global Standard</p>
                  <p className="text-xs font-bold text-muted-foreground/70 leading-relaxed">Used for international trade and GST classification.</p>
                </div>
              </li>
            </ul>
          </Card>

          <Card className="rounded-[32px] border border-primary/10 bg-primary/5 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 text-primary mb-4">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Tag className="h-6 w-6" />
              </div>
              <span className="font-black tracking-tight text-lg">Inventory Tracking</span>
            </div>
            <p className="text-xs font-bold text-muted-foreground/70 leading-relaxed">
              HSN codes allow the system to categorize businesses and products accurately, enabling powerful search and filtering across the platform.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
