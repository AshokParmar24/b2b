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
    <Card className="w-full max-w-[480px] border border-slate-200 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-700 rounded-[32px] overflow-hidden">
      <CardHeader className="space-y-8 px-12 pt-12 pb-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <Link href={AppRoutes.HOME} className="flex items-center justify-center gap-4 group transition-all active:scale-95">
            <Logo width={42} height={42} />
            <BrandName className="text-4xl" />
          </Link>
          <div className="flex items-center gap-3 w-full max-w-[340px]">
            <div className="h-[1px] flex-1 bg-slate-100" />
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 whitespace-nowrap">
              Account Recovery
            </p>
            <div className="h-[1px] flex-1 bg-slate-100" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground tracking-tight">Forgot Password?</h1>
          <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed px-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="email"
            label="Email Address"
            autoFocus
            {...register("email")}
            placeholder="name@company.com"
            error={errors.email?.message}
            className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 px-5 text-base transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 font-bold shadow-sm"
          />

          {errors.root?.message && (
            <div className="animate-in fade-in slide-in-from-top-1 rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-center">
              <p className="text-xs font-bold text-rose-600">
                {errors.root.message}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-16 w-full rounded-2xl text-lg font-[1000] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95 group bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Send Reset Link <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </div>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-6 px-12 pb-12 pt-6">
        <Link href={AppRoutes.LOGIN}>
          <Button variant="ghost" className="w-full h-12 rounded-2xl font-bold text-muted-foreground hover:text-primary group">
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Sign In
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
