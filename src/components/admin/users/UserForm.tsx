"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Loader2, 
  ArrowLeft, 
  Save, 
  User as UserIcon,
  ShieldCheck,
  Mail,
  Lock,
  Info,
  MapPin,
  Phone
} from "lucide-react";
import { CountrySelect } from "@/components/common/CountrySelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AppRoutes } from "@/lib/routes";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { userSchema, UserInput } from "@/lib/validations/users";
import { UserRole, ROLE_LABELS } from "@/types/models";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function UserForm({ initialData, isEdit = false }: UserFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);

  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [pincodes, setPincodes] = useState<any[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingPincodes, setLoadingPincodes] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await api.get<any>("/api/plans");
        setPlans(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Failed to load plans");
      }
    };
    fetchPlans();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      mobile: initialData?.mobile || "",
      mobileCode: initialData?.mobileCode || "+91",
      mobileIso: initialData?.mobileIso || "IN",
      password: "", // Always start empty
      role: initialData?.role || UserRole.USER,
      planId: initialData?.planId?._id || initialData?.planId || null,
      countryId: initialData?.countryId?._id || initialData?.countryId || "",
      stateId: initialData?.stateId?._id || initialData?.stateId || "",
      cityId: initialData?.cityId?._id || initialData?.cityId || "",
      pincodeId: initialData?.pincodeId?._id || initialData?.pincodeId || "",
      isActive: initialData?.isActive ?? true,
    }
  });

  const selectedCountryId = watch("countryId");
  const selectedStateId = watch("stateId");
  const selectedCityId = watch("cityId");

  useEffect(() => {
    if (!selectedCountryId) { setStates([]); return; }
    setLoadingStates(true);
    api.get<any>(`/api/masters/states?countryId=${selectedCountryId}&status=active&limit=200`)
      .then((res) => setStates(Array.isArray(res) ? res : res.data || []))
      .catch(() => setStates([]))
      .finally(() => setLoadingStates(false));
  }, [selectedCountryId]);

  useEffect(() => {
    if (!selectedStateId) { setCities([]); return; }
    setLoadingCities(true);
    api.get<any>(`/api/masters/cities?stateId=${selectedStateId}&status=active&limit=200`)
      .then((res) => setCities(Array.isArray(res) ? res : res.data || []))
      .catch(() => setCities([]))
      .finally(() => setLoadingCities(false));
  }, [selectedStateId]);

  useEffect(() => {
    if (!selectedCityId) { setPincodes([]); return; }
    setLoadingPincodes(true);
    api.get<any>(`/api/masters/pincodes?cityId=${selectedCityId}&status=active&limit=200`)
      .then((res) => setPincodes(Array.isArray(res) ? res : res.data || []))
      .catch(() => setPincodes([]))
      .finally(() => setLoadingPincodes(false));
  }, [selectedCityId]);

  const onSubmit = async (data: UserInput) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading(isEdit ? "Updating user profile..." : "Creating new user...");
    
    try {
      const url = isEdit 
        ? `/api/users/${initialData?._id}` 
        : "/api/users";
      
      if (isEdit) {
        await api.put(url, data);
      } else {
        await api.post(url, data);
      }

      toast.success(isEdit ? "User profile updated" : "User created successfully", { id: loadingToast });
      router.push(AppRoutes.ADMIN_USERS);
      router.refresh();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to save user";
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6 md:px-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href={AppRoutes.ADMIN_USERS}>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
              {isEdit ? "Edit User Account" : "Register New User"}
              <UserIcon className="h-5 w-5 text-primary" />
            </h1>
            <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">
              Identity & Access Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            form="user-form"
            disabled={isSubmitting}
            className="h-11 rounded-2xl px-6 bg-primary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all font-bold"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isEdit ? "Update User" : "Create User"}
          </Button>
        </div>
      </div>

      <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Card className="rounded-[32px] border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/5">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black tracking-tight">Core Identity</CardTitle>
                  <CardDescription className="text-xs font-medium">Personal details and authentication</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Full Name</label>
                  <Input 
                    {...register("name")}
                    placeholder="e.g. John Doe" 
                    className={cn(
                      "h-12 rounded-2xl bg-muted/30 border-border/40 focus:ring-primary/20 transition-all font-medium",
                      errors.name && "border-destructive/50 focus:ring-destructive/20"
                    )}
                  />
                  {errors.name && <p className="text-[10px] font-bold text-destructive px-1">{errors.name.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      {...register("email")}
                      placeholder="john@example.com" 
                      className={cn(
                        "h-12 pl-11 rounded-2xl bg-muted/30 border-border/40 focus:ring-primary/20 transition-all font-medium",
                        errors.email && "border-destructive/50 focus:ring-destructive/20"
                      )}
                    />
                  </div>
                  {errors.email && <p className="text-[10px] font-bold text-destructive px-1">{errors.email.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Mobile Number</label>
                  <div className="flex gap-2">
                    <div className="w-[110px]">
                      <Controller
                        name="mobileCode"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={(val) => {
                            field.onChange(val);
                            if (val === "+91") setValue("mobileIso", "IN");
                            if (val === "+1") setValue("mobileIso", "US");
                            if (val === "+44") setValue("mobileIso", "GB");
                            if (val === "+61") setValue("mobileIso", "AU");
                            if (val === "+971") setValue("mobileIso", "AE");
                          }}>
                            <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-border/40 font-bold focus:ring-primary/20">
                              <SelectValue placeholder="Code" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl">
                              <SelectItem value="+91" className="rounded-xl font-medium">🇮🇳 +91</SelectItem>
                              <SelectItem value="+1" className="rounded-xl font-medium">🇺🇸 +1</SelectItem>
                              <SelectItem value="+44" className="rounded-xl font-medium">🇬🇧 +44</SelectItem>
                              <SelectItem value="+61" className="rounded-xl font-medium">🇦🇺 +61</SelectItem>
                              <SelectItem value="+971" className="rounded-xl font-medium">🇦🇪 +971</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        {...register("mobile")}
                        placeholder="e.g. 9876543210" 
                        className={cn(
                          "h-12 pl-11 rounded-2xl bg-muted/30 border-border/40 focus:ring-primary/20 transition-all font-medium",
                          errors.mobile && "border-destructive/50 focus:ring-destructive/20"
                        )}
                      />
                    </div>
                  </div>
                  {(errors.mobile || errors.mobileCode) && (
                    <p className="text-[10px] font-bold text-destructive px-1">
                      {errors.mobile?.message as string || errors.mobileCode?.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                  {isEdit ? "Reset Password (Optional)" : "Password"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    {...register("password")}
                    type="password"
                    placeholder={isEdit ? "Leave blank to keep current password" : "Secure password"} 
                    className={cn(
                      "h-12 pl-11 rounded-2xl bg-muted/30 border-border/40 focus:ring-primary/20 transition-all font-medium",
                      errors.password && "border-destructive/50 focus:ring-destructive/20"
                    )}
                  />
                </div>
                {errors.password && <p className="text-[10px] font-bold text-destructive px-1">{errors.password.message as string}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/5">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-500">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black tracking-tight">Location Details</CardTitle>
                  <CardDescription className="text-xs font-medium">Specify user's geographical location</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Controller
                    name="countryId"
                    control={control}
                    render={({ field }) => (
                      <CountrySelect
                        label="Country"
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val as string);
                          setValue("stateId", "");
                          setValue("cityId", "");
                          setValue("pincodeId", "");
                        }}
                        placeholder="Select country"
                        error={errors.countryId?.message as string}
                        variant="premium"
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-1 block">State</label>
                  <Select
                    value={watch("stateId")}
                    onValueChange={(val) => { setValue("stateId", val as string); setValue("cityId", ""); setValue("pincodeId", ""); }}
                    disabled={!selectedCountryId || loadingStates}
                  >
                    <SelectTrigger className={cn(
                      "h-14 rounded-2xl bg-muted/20 border-border/50 font-bold transition-all",
                      (!selectedCountryId) && "opacity-50",
                      errors.stateId && "border-destructive/60"
                    )}>
                      <SelectValue placeholder={loadingStates ? "Loading states..." : "Select state"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {states.map((s) => (
                        <SelectItem key={s._id} value={s._id} className="rounded-xl font-medium">{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.stateId && <p className="text-xs font-bold text-destructive">{errors.stateId.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-1 block">City</label>
                  <Select
                    value={watch("cityId")}
                    onValueChange={(val) => { setValue("cityId", val as string); setValue("pincodeId", ""); }}
                    disabled={!selectedStateId || loadingCities}
                  >
                    <SelectTrigger className={cn(
                      "h-14 rounded-2xl bg-muted/20 border-border/50 font-bold transition-all",
                      (!selectedStateId) && "opacity-50",
                      errors.cityId && "border-destructive/60"
                    )}>
                      <SelectValue placeholder={loadingCities ? "Loading cities..." : "Select city"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {cities.map((c) => (
                        <SelectItem key={c._id} value={c._id} className="rounded-xl font-medium">{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.cityId && <p className="text-xs font-bold text-destructive">{errors.cityId.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-1 block">Pincode</label>
                  <Select
                    value={watch("pincodeId")}
                    onValueChange={(val) => setValue("pincodeId", val as string)}
                    disabled={!selectedCityId || loadingPincodes}
                  >
                    <SelectTrigger className={cn(
                      "h-14 rounded-2xl bg-muted/20 border-border/50 font-bold transition-all",
                      (!selectedCityId) && "opacity-50",
                      errors.pincodeId && "border-destructive/60"
                    )}>
                      <SelectValue placeholder={loadingPincodes ? "Loading pincodes..." : "Select pincode"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {pincodes.map((p) => (
                        <SelectItem key={p._id} value={p._id} className="rounded-xl font-medium">{p.pincode}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.pincodeId && <p className="text-xs font-bold text-destructive">{errors.pincodeId.message as string}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/5">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black tracking-tight">Access & Subscription</CardTitle>
                  <CardDescription className="text-xs font-medium">Configure roles and business limits</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">System Role</label>
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <Select value={field.value.toString()} onValueChange={(val) => field.onChange(parseInt(val as string))}>
                        <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-border/40 font-medium">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          {Object.values(UserRole).filter(v => typeof v === 'number').map((role) => (
                            <SelectItem key={role} value={role.toString()} className="rounded-xl font-medium">
                              {ROLE_LABELS[role as UserRole]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Subscription Plan</label>
                  <Controller
                    control={control}
                    name="planId"
                    render={({ field }) => (
                      <Select value={field.value || "none"} onValueChange={(val) => field.onChange(val === "none" ? null : val)}>
                        <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-border/40 font-medium">
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="none" className="rounded-xl font-medium">No Plan</SelectItem>
                          {plans.map((plan) => (
                            <SelectItem key={plan._id} value={plan._id} className="rounded-xl font-medium">
                              {plan.name} (₹{plan.price})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                  <p className="text-xs font-black uppercase tracking-widest text-foreground">Account Active</p>
                  <p className="text-[10px] font-medium text-muted-foreground">Toggle login ability</p>
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
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
