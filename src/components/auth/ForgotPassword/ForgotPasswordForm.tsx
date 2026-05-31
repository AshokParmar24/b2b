"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  Mail,
  KeyRound
} from "lucide-react";
import { AppRoutes } from "@/lib/routes";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Logo } from "@/components/ui/Logo";
import { BrandName } from "@/components/ui/BrandName";
import { toast } from "react-hot-toast";

const forgotSchema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
}).required();

type ForgotFormValues = yup.InferType<typeof forgotSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: yupResolver(forgotSchema),
    defaultValues: { email: "" }
  });

  async function onSubmit(data: ForgotFormValues) {
    setLoading(true);
    try {
      const res = await api.post<any>("/api/auth/forgot-password", data);
      toast.success(res.message || "Reset link sent!");
      
      // Auto-redirect in dev environment if devToken is returned
      if (res.devToken) {
        setTimeout(() => {
          toast("Auto-redirecting (Dev Mode)...", { icon: "🔧" });
          router.push(`${AppRoutes.RESET_PASSWORD}?token=${res.devToken}`);
        }, 1500);
      }
    } catch (err: any) {
      setError("root", { type: "manual", message: err.response?.data?.error || "Failed to process request." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-[480px] border border-slate-200 bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] animate-in fade-in zoom-in-95 duration-700 rounded-2xl sm:rounded-[32px] overflow-hidden">
      <CardHeader className="space-y-4 px-4 pt-8 pb-4 sm:space-y-6 sm:px-12 sm:pt-12 sm:pb-8 text-center">
        <div className="flex flex-col items-center gap-4 sm:gap-5">
          <Link href={AppRoutes.HOME} className="flex items-center justify-center gap-2.5 sm:gap-4 group transition-all active:scale-95">
            <div className="relative">
              <div className="absolute -inset-2 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all" />
              <Logo width={30} height={30} className="sm:w-[42px] sm:h-[42px] relative" />
            </div>
            <BrandName className="text-2xl sm:text-4xl tracking-tight" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 w-full max-w-[340px] justify-center">
            <div className="h-[1px] flex-1 bg-slate-100 hidden sm:block" />
            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] text-slate-400 text-center leading-relaxed max-w-full">
              Account Recovery
            </p>
            <div className="h-[1px] flex-1 bg-slate-100 hidden sm:block" />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">Forgot Password?</h1>
          <p className="text-[11px] sm:text-sm font-bold text-slate-400 leading-relaxed px-2 sm:px-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <Input
            id="email"
            label="Email Address"
            autoFocus
            {...register("email")}
            placeholder="name@company.com"
            error={errors.email?.message}
            className="h-12 sm:h-16 rounded-xl sm:rounded-[20px] border-slate-200 bg-slate-50/30 px-5 text-xs sm:text-base transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 font-bold shadow-sm"
          />

          {errors.root?.message && (
            <div className="animate-in fade-in slide-in-from-top-1 rounded-xl sm:rounded-2xl border border-rose-100 bg-rose-50/50 p-3 sm:p-4 text-center">
              <p className="text-[10px] sm:text-[11px] font-black text-rose-600 uppercase tracking-wide">
                {errors.root.message}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-12 sm:h-16 w-full rounded-xl sm:rounded-[20px] text-sm sm:text-lg font-black shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98] group relative overflow-hidden bg-primary hover:bg-primary/90 text-white"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                <KeyRound className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                Send Reset Link <ArrowRight className="h-4.5 w-4.5 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </div>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-6 px-4 pb-8 pt-6 sm:px-12 sm:pb-12 sm:pt-8 text-center bg-slate-50/50">
        <Link href={AppRoutes.LOGIN} className="w-full">
          <Button variant="ghost" className="w-full h-12 rounded-xl sm:rounded-[20px] font-bold text-muted-foreground hover:text-primary group">
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Sign In
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
