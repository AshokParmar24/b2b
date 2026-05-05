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
      <Card className="w-full max-w-[480px] border border-slate-200 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-700 rounded-[32px] overflow-hidden text-center">
        <CardHeader className="space-y-8 px-12 pt-16 pb-8">
          <div className="mx-auto h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center ring-8 ring-emerald-50/50">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-black text-foreground tracking-tight">Password Reset!</h1>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed px-4">
              Your password has been changed successfully. You can now log in with your new credentials.
            </p>
          </div>
        </CardHeader>
        <CardContent className="px-12 pb-16">
          <Link href={AppRoutes.LOGIN}>
            <Button className="h-14 w-full rounded-2xl text-base font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 group">
              Proceed to Sign In <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-[480px] border border-slate-200 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-700 rounded-[32px] overflow-hidden">
      <CardHeader className="space-y-8 px-12 pt-12 pb-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <Link href={AppRoutes.HOME} className="flex items-center justify-center gap-4 group transition-all active:scale-95">
            <Logo width={42} height={42} />
            <BrandName className="text-4xl" />
          </Link>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground tracking-tight">Create New Password</h1>
          <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed px-4">
            Please enter your new password below.
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-12 pb-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="password"
            label="New Password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="••••••••"
            error={errors.password?.message}
            className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 pl-5 pr-14 text-base transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 font-bold shadow-sm"
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
            className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 pl-5 pr-14 text-base transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 font-bold shadow-sm"
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
            disabled={loading || !token}
            className="h-16 w-full rounded-2xl text-lg font-[1000] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95 group bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Update Password
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
