"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  ArrowRight
} from "lucide-react";
import { AppRoutes } from "@/lib/routes";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Logo } from "@/components/ui/Logo";
import { BrandName } from "@/components/ui/BrandName";
import { toast } from "react-hot-toast";

const resetSchema = yup.object({
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
}).required();

type ResetFormValues = yup.InferType<typeof resetSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: yupResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" }
  });

  useEffect(() => {
    if (!token) {
      setError("root", { type: "manual", message: "Invalid or missing password reset token." });
    }
  }, [token, setError]);

  async function onSubmit(data: ResetFormValues) {
    if (!token) return;
    
    setLoading(true);
    try {
      const res = await api.post<any>("/api/auth/reset-password", { 
        token, 
        password: data.password 
      });
      toast.success(res.message || "Password updated successfully!");
      setSuccess(true);
    } catch (err: any) {
      setError("root", { type: "manual", message: err.response?.data?.error || "Failed to reset password." });
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-[480px] border border-slate-200 bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] animate-in fade-in zoom-in-95 duration-700 rounded-2xl sm:rounded-[32px] overflow-hidden text-center">
        <CardHeader className="space-y-4 px-4 pt-8 pb-4 sm:space-y-6 sm:px-12 sm:pt-12 sm:pb-8">
          <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-emerald-50 flex items-center justify-center ring-4 sm:ring-8 ring-emerald-50/50">
            <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-500" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">Password Reset!</h1>
            <p className="text-[11px] sm:text-sm font-bold text-slate-400 leading-relaxed px-2 sm:px-4">
              Your password has been changed successfully. You can now log in with your new credentials.
            </p>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-8 sm:px-12 sm:pb-12">
          <Link href={AppRoutes.LOGIN}>
            <Button className="h-12 sm:h-16 w-full rounded-xl sm:rounded-[20px] text-sm sm:text-lg font-black shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98] group bg-primary hover:bg-primary/90 text-white">
              Proceed to Sign In <ArrowRight className="ml-2 h-4.5 w-4.5 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
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
        </div>
        <div className="space-y-1">
          <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">Create New Password</h1>
          <p className="text-[11px] sm:text-sm font-bold text-slate-400 leading-relaxed px-2 sm:px-4">
            Please enter your new password below.
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-8 sm:px-12 sm:pb-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <Input
            id="password"
            label="New Password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="••••••••"
            error={errors.password?.message}
            className="h-12 sm:h-16 rounded-xl sm:rounded-[20px] border-slate-200 bg-slate-50/30 pl-5 pr-14 text-xs sm:text-base transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 font-bold shadow-sm"
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-300 hover:text-primary transition-colors focus:outline-none cursor-pointer p-1"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            }
          />

          <Input
            id="confirmPassword"
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            {...register("confirmPassword")}
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
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
            disabled={loading || !token}
            className="h-12 sm:h-16 w-full rounded-xl sm:rounded-[20px] text-sm sm:text-lg font-black shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98] group relative overflow-hidden bg-primary hover:bg-primary/90 text-white"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                <Lock className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                Update Password
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
