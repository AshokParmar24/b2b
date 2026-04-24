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
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Logo } from "@/components/ui/Logo";
import { BrandName } from "@/components/ui/BrandName";
import { SITE_TAGLINE } from "@/lib/site-config";
import { AppRoutes } from "@/lib/routes";

/**
 * 🔒 LOGIN VALIDATION SCHEMA
 */
const loginSchema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
}).required();

type LoginFormValues = yup.InferType<typeof loginSchema>;

/**
 *  ELITE LOGIN FORM (RHF + YUP EDITION)
 * Encapsulates all authentication logic and UI with production-grade validation.
 */
export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: ""
    }
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
        router.push(AppRoutes.DASHBOARD);
      }
    } catch (err) {
      setError("root", { type: "manual", message: "An unexpected error occurred. Please try again." });

    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-[480px] border border-slate-200 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-700 rounded-[32px] overflow-hidden">
      <CardHeader className="space-y-8 px-12 pt-12 pb-8 text-center">
        {/* Branding Section */}
        <div className="flex flex-col items-center gap-4">
          <Link href={AppRoutes.HOME} className="flex items-center justify-center gap-4 group transition-all active:scale-95">
            <Logo width={42} height={42} />
            <BrandName className="text-4xl" />
          </Link>
          <div className="flex items-center gap-3 w-full max-w-[340px]">
            <div className="h-[1px] flex-1 bg-slate-100" />
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 whitespace-nowrap">
              {SITE_TAGLINE}
            </p>
            <div className="h-[1px] flex-1 bg-slate-100" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <Input
            id="email"
            label="Email Address"
            autoFocus
            {...register("email")}
            placeholder="name@company.com"
            error={errors.email?.message}
            className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 px-5 text-base transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 font-bold shadow-sm"
          />

          {/* Password Field */}
          <Input
            id="password"
            label="Password"
            labelAction={
              <Link
                href="/forgot-password"
                className="text-xs font-black text-primary hover:underline underline-offset-4"
              >
                Forgot?
              </Link>
            }
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

          {/* Global Error Message */}
          {errors.root?.message && (
            <div className="animate-in fade-in slide-in-from-top-1 rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-center">
              <p className="text-xs font-bold text-rose-600">
                {errors.root.message}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="h-16 w-full rounded-2xl text-lg font-[1000] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95 group"
          >
            {loading ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Sign In <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </div>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-6 px-12 pb-12 pt-6">
        <p className="text-center text-sm font-bold text-slate-400">
          No account?{" "}
          <Link href={AppRoutes.REGISTER} className="text-primary hover:underline underline-offset-4">
            Register free
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
