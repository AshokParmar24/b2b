"use client";

import { useState, useEffect } from "react";
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
  ShieldCheck,
  ChevronRight,
  MapPin,
  Contact,
  Fingerprint
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
import { cn } from "@/lib/utils";

import { isValidPhoneNumber } from "react-phone-number-input";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import toast from "react-hot-toast";
import { SearchableSelect } from "@/components/ui/searchable-select";

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
      firstName: "", lastName: "", email: "", phoneNumber: "",
      password: "", confirmPassword: "", country: "", state: "", city: "", pincode: "",
    }
  });

  const selectedCountry = watch("country");
  const selectedState = watch("state");
  const selectedCity = watch("city");

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingPincodes, setLoadingPincodes] = useState(false);
  const [stateOptions, setStateOptions] = useState<{ id: string; name: string }[]>([]);
  const [cityOptions, setCityOptions] = useState<{ id: string; name: string }[]>([]);
  const [pincodeOptions, setPincodeOptions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    setStateOptions([]); setCityOptions([]); setPincodeOptions([]);
    setValue("state", ""); setValue("city", ""); setValue("pincode", "");
    if (!selectedCountry) return;
    setLoadingStates(true);
    api.get<any>(`${API_ENDPOINTS.MASTERS.STATES}?countryId=${selectedCountry}&status=active&limit=500`)
      .then((res) => {
        const items = Array.isArray(res) ? res : res?.data || [];
        setStateOptions(items.map((s: any) => ({ id: s._id, name: s.name })));
      })
      .finally(() => setLoadingStates(false));
  }, [selectedCountry, setValue]);

  useEffect(() => {
    setCityOptions([]); setPincodeOptions([]);
    setValue("city", ""); setValue("pincode", "");
    if (!selectedState) return;
    setLoadingCities(true);
    api.get<any>(`${API_ENDPOINTS.MASTERS.CITIES}?stateId=${selectedState}&status=active&limit=500`)
      .then((res) => {
        const items = Array.isArray(res) ? res : res?.data || [];
        setCityOptions(items.map((c: any) => ({ id: c._id, name: c.name })));
      })
      .finally(() => setLoadingCities(false));
  }, [selectedState, setValue]);

  useEffect(() => {
    setPincodeOptions([]);
    setValue("pincode", "");
    if (!selectedCity) return;
    setLoadingPincodes(true);
    api.get<any>(`${API_ENDPOINTS.MASTERS.PINCODES}?cityId=${selectedCity}&status=active&limit=500`)
      .then((res) => {
        const items = Array.isArray(res) ? res : res?.data || [];
        setPincodeOptions(items.map((p: any) => ({ id: p._id, name: p.pincode + (p.area ? " — " + p.area : "") })));
      })
      .finally(() => setLoadingPincodes(false));
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

      toast.success("Account created successfully!", { icon: '🎉', style: { borderRadius: '16px', background: '#0f172a', color: '#fff' } });
      setTimeout(() => router.push(AppRoutes.LOGIN), 2000);
    } catch (err: any) {
      setError("root", { type: "manual", message: err.message || "Registration failed." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-[980px] border border-slate-200 bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] rounded-2xl sm:rounded-[48px] overflow-hidden transition-all duration-500">
      <CardHeader className="space-y-4 px-4 pt-8 pb-4 sm:space-y-6 sm:px-12 sm:pt-16 lg:px-20 text-center">
        <div className="flex flex-col items-center gap-4 sm:gap-5">
          <Link href={AppRoutes.HOME} className="flex items-center justify-center gap-2.5 sm:gap-4 group transition-all active:scale-95">
            <div className="relative">
              <div className="absolute -inset-2 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all" />
              <Logo width={32} height={32} className="sm:w-[52px] sm:h-[52px] relative" />
            </div>
            <BrandName className="text-2xl sm:text-5xl tracking-tight" />
          </Link>
          <p className="text-[9px] sm:text-xs font-black uppercase tracking-[0.3em] text-slate-300">
            {SITE_TAGLINE}
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-8 sm:px-12 lg:px-20">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 sm:space-y-12">
          
          {/* 👤 Section 1: Personal Info */}
          <FormSection title="Identity & Contact" icon={Contact}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Input
                label="First Name"
                autoFocus
                icon={<User className="h-4 w-4" />}
                {...register("firstName")}
                placeholder="John"
                error={errors.firstName?.message}
                className="h-12 sm:h-16 rounded-xl sm:rounded-2xl border-slate-200 bg-slate-50/30 pl-11 pr-5 font-bold shadow-sm transition-all focus:bg-white text-xs sm:text-base"
              />
              <Input
                label="Last Name"
                {...register("lastName")}
                placeholder="Doe"
                error={errors.lastName?.message}
                className="h-12 sm:h-16 rounded-xl sm:rounded-2xl border-slate-200 bg-slate-50/30 px-5 font-bold shadow-sm transition-all focus:bg-white text-xs sm:text-base"
              />
              <Input
                label="Professional Email"
                icon={<Mail className="h-4 w-4" />}
                {...register("email")}
                placeholder="name@company.com"
                error={errors.email?.message}
                className="h-12 sm:h-16 rounded-xl sm:rounded-2xl border-slate-200 bg-slate-50/30 pl-11 pr-5 font-bold shadow-sm transition-all focus:bg-white text-xs sm:text-base"
              />
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    label="Mobile Number"
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
          </FormSection>

          {/* 📍 Section 2: Location */}
          <FormSection title="Business Location" icon={MapPin}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Controller name="country" control={control} render={({ field }) => (
                <CountrySelect label="Country" value={field.value} onChange={field.onChange} placeholder="Select Country" error={errors.country?.message} />
              )} />
              <Controller name="state" control={control} render={({ field }) => (
                <SearchableSelect label="State / Province" options={stateOptions} value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder={loadingStates ? "Loading..." : "Select State"} disabled={!selectedCountry || loadingStates} error={errors.state?.message} />
              )} />
              <Controller name="city" control={control} render={({ field }) => (
                <SearchableSelect label="City" options={cityOptions} value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder={loadingCities ? "Loading..." : "Select City"} disabled={!selectedState || loadingCities} error={errors.city?.message} />
              )} />
              <Controller name="pincode" control={control} render={({ field }) => (
                <SearchableSelect label="Pincode / Zip" options={pincodeOptions} value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder={loadingPincodes ? "Loading..." : "Select Pincode"} disabled={!selectedCity || loadingPincodes} error={errors.pincode?.message} />
              )} />
            </div>
          </FormSection>

          {/* 🔐 Section 3: Security */}
          <FormSection title="Account Security" icon={Fingerprint}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Input
                label="Create Password"
                icon={<Lock className="h-4 w-4" />}
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                error={errors.password?.message}
                className="h-12 sm:h-16 rounded-xl sm:rounded-2xl border-slate-200 bg-slate-50/30 pl-11 pr-12 font-bold shadow-sm transition-all text-xs sm:text-base"
                suffix={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-300 hover:text-primary transition-colors cursor-pointer p-1">
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                }
              />
              <Input
                label="Confirm Security Code"
                icon={<Lock className="h-4 w-4" />}
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                className="h-12 sm:h-16 rounded-xl sm:rounded-2xl border-slate-200 bg-slate-50/30 pl-11 pr-12 font-bold shadow-sm transition-all text-xs sm:text-base"
                suffix={
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-slate-300 hover:text-primary transition-colors cursor-pointer p-1">
                    {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                }
              />
            </div>
          </FormSection>

          {errors.root?.message && (
            <div className="animate-in fade-in slide-in-from-top-1 rounded-xl sm:rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-center">
              <p className="text-xs font-black text-rose-600 uppercase tracking-widest">
                {errors.root.message}
              </p>
            </div>
          )}

          <Button type="submit" disabled={loading} className="h-14 sm:h-20 w-full rounded-xl sm:rounded-[24px] text-sm sm:text-xl font-black shadow-[0_20px_50px_-10px_rgba(var(--primary-rgb),0.3)] transition-all hover:scale-[1.01] active:scale-[0.98] group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-center gap-2.5 sm:gap-3">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <UserPlus className="h-5 w-5 sm:h-6 sm:w-6" />
                  Initialize Profile
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </div>
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-6 px-4 pb-8 pt-6 sm:px-12 sm:pb-16 sm:pt-8 text-center bg-slate-50/50">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">
            Already registered?
          </p>
          <Link 
            href={AppRoutes.LOGIN} 
            className="group inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black text-primary hover:text-indigo-600 transition-colors"
          >
            Sign in to Existing Account
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

function FormSection({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
          <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
        </div>
        <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-400">{title}</h3>
        <div className="h-px flex-1 bg-slate-100" />
      </div>
      {children}
    </div>
  );
}
