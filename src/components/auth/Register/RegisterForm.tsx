"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  UserPlus,
  Mail,
  Lock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CountrySelect } from "@/components/common/CountrySelect";
import { PhoneInput } from "@/components/ui/phone-input";
import { Logo } from "@/components/ui/Logo";
import { BrandName } from "@/components/ui/BrandName";
import { AppRoutes } from "@/lib/routes";
import { SITE_TAGLINE } from "@/lib/site-config";
import { COUNTRIES, STATES, CITIES, PINCODES } from "@/lib/location-data";
import { isValidPhoneNumber } from "react-phone-number-input";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import toast from "react-hot-toast";
import { SearchableSelect } from "@/components/ui/searchable-select";

/**
 * 📝 PRODUCTION REGISTRATION SCHEMA
 */
const registerSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  phoneNumber: yup.string()
    .required("Phone number is required")
    .test("phone", "Invalid phone number", (val) => !val || isValidPhoneNumber(val)),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required("Please confirm your password"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  pincode: yup.string().required("Pincode is required"),
}).required();

type RegisterFormValues = yup.InferType<typeof registerSchema>;

/**
 * 🏢 PRODUCTION-GRADE REGISTRATION
 * Full validation feedback for every field.
 */
export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      country: "in",
      state: "",
      city: "",
      pincode: "",
    }
  });

  const selectedCountry = watch("country");
  const selectedState = watch("state");
  const selectedCity = watch("city");

  // Dynamic Options mapping
  const stateOptions = useMemo(() => STATES[selectedCountry] || [], [selectedCountry]);
  const cityOptions = useMemo(() => {
    const rawCities = CITIES[selectedState] || [];
    return rawCities.map(c => ({ id: c, name: c }));
  }, [selectedState]);
  const pincodeOptions = useMemo(() => {
    const rawPincodes = PINCODES[selectedCity] || [];
    return rawPincodes.map(p => ({ id: p, name: p }));
  }, [selectedCity]);

  // Cascading Resets — silent, no validation triggered
  useEffect(() => {
    setValue("state", "", { shouldValidate: false, shouldTouch: false });
    setValue("city", "", { shouldValidate: false, shouldTouch: false });
    setValue("pincode", "", { shouldValidate: false, shouldTouch: false });
  }, [selectedCountry, setValue]);

  useEffect(() => {
    setValue("city", "", { shouldValidate: false, shouldTouch: false });
    setValue("pincode", "", { shouldValidate: false, shouldTouch: false });
  }, [selectedState, setValue]);

  useEffect(() => {
    setValue("pincode", "", { shouldValidate: false, shouldTouch: false });
  }, [selectedCity, setValue]);

  async function onSubmit(data: RegisterFormValues) {
    setLoading(true);
    try {
      await api.post(API_ENDPOINTS.AUTH.REGISTER, {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        country: data.country,
        state: data.state,
        city: data.city,
        pincode: data.pincode,
      });

      toast.success("Account created successfully! Redirecting to login...", {
        duration: 3000,
        icon: '🎉',
        style: {
          borderRadius: '16px',
          background: '#0f172a',
          color: '#fff',
          fontWeight: 'bold',
        },
      });

      // Give user time to see the toast
      setTimeout(() => {
        router.push(AppRoutes.LOGIN);
      }, 2000);
    } catch (err: any) {
      setError("root", {
        type: "manual",
        message: err.message || "An unexpected error occurred. Please try again."
      });
    } finally {
      setLoading(false);
    }
  }



  return (
    <Card className="w-full max-w-[950px] border border-slate-200 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-700 rounded-[40px] overflow-hidden">
      <CardHeader className="space-y-6 px-8 pt-12 pb-6 text-center lg:px-20">
        <div className="flex flex-col items-center gap-4">
          <Link href={AppRoutes.HOME} className="flex items-center justify-center gap-4 group transition-all active:scale-95">
            <Logo width={48} height={48} />
            <BrandName className="text-4xl" />
          </Link>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
            {SITE_TAGLINE}
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-8 pb-12 lg:px-20">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Identity & Contact</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="First Name"
                autoFocus
                icon={<User className="h-4 w-4" />}
                {...register("firstName")}
                placeholder="John"
                error={errors.firstName?.message}
                className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 pl-11 pr-5 font-bold shadow-sm transition-all"
              />
              <Input
                label="Last Name"
                {...register("lastName")}
                placeholder="Doe"
                error={errors.lastName?.message}
                className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 px-5 font-bold shadow-sm transition-all"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="Email Address"
                icon={<Mail className="h-4 w-4" />}
                {...register("email")}
                placeholder="name@company.com"
                error={errors.email?.message}
                className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 pl-11 pr-5 font-bold shadow-sm transition-all"
              />
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    label="Phone Number"
                    placeholder="98765 43210"
                    value={field.value}
                    onChange={field.onChange}
                    onCountryChange={(country) => {
                      if (country) setValue("country", country.toLowerCase());
                    }}
                    error={errors.phoneNumber?.message}
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Location Intelligence</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Controller name="country" control={control} render={({ field }) => (
                <CountrySelect
                  label="Country"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Country"
                  error={errors.country?.message}
                />
              )} />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Controller name="state" control={control} render={({ field }) => (
                <SearchableSelect label="State / Province" options={stateOptions} value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="Select State" disabled={!selectedCountry} error={errors.state?.message} />
              )} />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Controller name="city" control={control} render={({ field }) => (
                <SearchableSelect label="City" options={cityOptions} value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="Select City" disabled={!selectedState} error={errors.city?.message} />
              )} />
              <Controller name="pincode" control={control} render={({ field }) => (
                <SearchableSelect label="Pincode / Zip" options={pincodeOptions} value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="Select Pincode" disabled={!selectedCity} error={errors.pincode?.message} />
              )} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Security</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="Password"
                icon={<Lock className="h-4 w-4" />}
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                error={errors.password?.message}
                className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 pl-11 pr-14 font-bold shadow-sm transition-all focus:border-primary"
                suffix={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-300 hover:text-primary transition-colors cursor-pointer p-1">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
              <Input
                label="Confirm Password"
                icon={<Lock className="h-4 w-4" />}
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 pl-11 pr-14 font-bold shadow-sm transition-all focus:border-primary"
                suffix={
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-slate-300 hover:text-primary transition-colors cursor-pointer p-1">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </div>
          </div>

          {errors.root?.message && (
            <div className="animate-in fade-in slide-in-from-top-1 rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-center mt-6">
              <p className="text-xs font-bold text-rose-600">
                {errors.root.message}
              </p>
            </div>
          )}

          <Button type="submit" disabled={loading} className="h-16 w-full rounded-2xl text-xl font-[1000] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95 group cursor-pointer mt-6">
            {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : <div className="flex items-center gap-3"><UserPlus className="h-6 w-6" />Create Account <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" /></div>}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-6 px-16 pb-12 pt-4">
        <p className="text-center text-sm font-bold text-slate-400">Already have an account? <Link href={AppRoutes.LOGIN} className="text-primary hover:underline underline-offset-4">Sign in here</Link></p>
      </CardFooter>
    </Card>
  );
}
