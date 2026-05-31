"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { AppRoutes } from "@/lib/routes";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Logo } from "@/components/ui/Logo";
import { BrandName } from "@/components/ui/BrandName";
import { SITE_TAGLINE } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const loginSchema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
}).required();

type LoginFormValues = yup.InferType<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: { email: "", password: "" }
  });

  async function onSubmit(data: LoginFormValues) {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false
      });

      if (res?.error) {
        setError("root", { type: "manual", message: "Invalid credentials. Please check your email." });
      } else {
        const session = await api.get<any>("/api/auth/session");
        if (session?.user?.role === 1) {
          router.push(AppRoutes.ADMIN_DASHBOARD);
        } else {
          router.push(AppRoutes.DASHBOARD);
        }
      }
    } catch (err) {
      setError("root", { type: "manual", message: "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-[480px] border border-slate-200 bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] rounded-2xl sm:rounded-[32px] overflow-hidden transition-all duration-500">
      
      {/* 🔝 HEADER SECTION */}
      <CardHeader className="space-y-4 px-4 pt-8 pb-4 sm:space-y-6 sm:px-12 sm:pt-12 sm:pb-8 text-center">
        <div className="flex flex-col items-center gap-4 sm:gap-5">
          <Link href={AppRoutes.HOME} className="flex items-center justify-center gap-2.5 sm:gap-4 group transition-all active:scale-95">
            <div className="relative">
              <div className="absolute -inset-2 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all" />
              <Logo width={30} height={30} className="sm:w-[42px] sm:h-[42px] relative" />
            </div>
            <BrandName className="text-2xl sm:text-4xl tracking-tight" />
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-3 w-full max-w-[280px] justify-center">
            <div className="h-[1px] flex-1 bg-slate-100 hidden sm:block" />
            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-slate-400 text-center leading-relaxed max-w-full">
              {SITE_TAGLINE}
            </p>
            <div className="h-[1px] flex-1 bg-slate-100 hidden sm:block" />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-[11px] sm:text-sm font-bold text-slate-400">Enter your credentials to access your portal</p>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="space-y-1.5">
            <Input
              id="email"
              label="Professional Email"
              icon={<Mail className="h-4 w-4" />}
              autoFocus
              {...register("email")}
              placeholder="name@company.com"
              error={errors.email?.message}
              className="h-12 sm:h-16 rounded-xl sm:rounded-[20px] border-slate-200 bg-slate-50/30 pl-11 pr-5 text-xs sm:text-base transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 font-bold shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1 mb-1">
              <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Security Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[9px] sm:text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                className={cn(
                  "h-12 sm:h-16 w-full rounded-xl sm:rounded-[20px] border border-slate-200 bg-slate-50/30 pl-11 pr-12 text-xs sm:text-base font-bold shadow-sm outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5",
                  errors.password && "border-rose-200 ring-4 ring-rose-50"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors focus:outline-none cursor-pointer p-1"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[9px] sm:text-[10px] font-black text-rose-500 uppercase tracking-wider ml-4 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

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
            className="h-12 sm:h-16 w-full rounded-xl sm:rounded-[20px] text-sm sm:text-lg font-black shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98] group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-center gap-2.5 sm:gap-3">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                  Sign In to Account
                  <ArrowRight className="h-4.5 w-4.5 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </div>
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-6 px-4 pb-8 pt-6 sm:px-12 sm:pb-12 sm:pt-8 text-center bg-slate-50/50">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">
            New to Hetnex?
          </p>
          <Link 
            href={AppRoutes.REGISTER} 
            className="group inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black text-primary hover:text-indigo-600 transition-colors"
          >
            Create Professional Account
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
