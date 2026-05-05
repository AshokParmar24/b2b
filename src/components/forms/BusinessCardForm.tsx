"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { CountrySelect } from "@/components/common/CountrySelect";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { toast } from "react-hot-toast";

// Yup Validation Schema
const schema = yup.object({
  name: yup.string().required("Business name is required").min(3, "Must be at least 3 characters"),
  email: yup.string().email("Invalid email format").required("Company email is required"),
  ownerName: yup.string().required("Owner name is required"),
  mobiles: yup
    .array()
    .of(
      yup.object({
        value: yup
          .string()
          .matches(/^[0-9]{10,15}$/, "Enter a valid 10-15 digit mobile number")
          .required("Mobile number is required"),
      })
    )
    .min(1, "At least one mobile number is required")
    .max(5, "Max 5 mobile numbers allowed"),
  countryId: yup.string().required("Country is required"),
  stateId: yup.string().required("State is required"),
  cityId: yup.string().required("City is required"),
  pincodeId: yup.string().required("Pincode is required"),
  address: yup.string().required("Full address is required"),
  gstNumber: yup
    .string()
    .optional()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
      message: "Invalid GST Format",
      excludeEmptyString: true,
    }),
  cardImages: yup.array().of(yup.string().required()).optional().max(10, "Maximum 10 images allowed"),
  hsnCodes: yup
    .array()
    .of(
      yup.object({
        code: yup.string().required(),
        description: yup.string().required(),
      })
    )
    .min(1, "At least one HSN code is required"),
});

type FormData = yup.InferType<typeof schema>;

interface BusinessCardFormProps {
  initialData?: Partial<FormData>;
  isEditing?: boolean;
}

export default function BusinessCardForm({
  initialData,
  isEditing = false,
}: BusinessCardFormProps) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: initialData || {
      mobiles: [{ value: "" }],
      cardImages: [],
      hsnCodes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "mobiles",
  });

  const {
    fields: hsnFields,
    append: appendHsn,
    remove: removeHsn,
  } = useFieldArray({
    control,
    name: "hsnCodes",
  });

  // Cascading Location Logic — fetched from real API
  const watchCountry = watch("countryId");
  const watchState = watch("stateId");
  const watchCity = watch("cityId");

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingPincodes, setLoadingPincodes] = useState(false);
  const [availableStates, setAvailableStates] = useState<{ id: string; name: string }[]>([]);
  const [availableCities, setAvailableCities] = useState<{ id: string; name: string }[]>([]);
  const [availablePincodes, setAvailablePincodes] = useState<{ id: string; name: string }[]>([]);

  // Fetch states when country changes
  useEffect(() => {
    setAvailableStates([]);
    setAvailableCities([]);
    setAvailablePincodes([]);
    setValue("stateId", "");
    setValue("cityId", "");
    setValue("pincodeId", "");
    if (!watchCountry) return;
    setLoadingStates(true);
    api
      .get<any>(`${API_ENDPOINTS.MASTERS.STATES}?countryId=${watchCountry}&status=active&limit=500`)
      .then((res) => {
        const items = Array.isArray(res) ? res : res?.data || [];
        setAvailableStates(items.map((s: any) => ({ id: s._id, name: s.name })));
      })
      .catch(() => toast.error("Failed to load states"))
      .finally(() => setLoadingStates(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    setAvailableCities([]);
    setAvailablePincodes([]);
    setValue("cityId", "");
    setValue("pincodeId", "");
    if (!watchState) return;
    setLoadingCities(true);
    api
      .get<any>(`${API_ENDPOINTS.MASTERS.CITIES}?stateId=${watchState}&status=active&limit=500`)
      .then((res) => {
        const items = Array.isArray(res) ? res : res?.data || [];
        setAvailableCities(items.map((c: any) => ({ id: c._id, name: c.name })));
      })
      .catch(() => toast.error("Failed to load cities"))
      .finally(() => setLoadingCities(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchState]);

  // Fetch pincodes when city changes
  useEffect(() => {
    setAvailablePincodes([]);
    setValue("pincodeId", "");
    if (!watchCity) return;
    setLoadingPincodes(true);
    api
      .get<any>(`${API_ENDPOINTS.MASTERS.PINCODES}?cityId=${watchCity}&status=active&limit=500`)
      .then((res) => {
        const items = Array.isArray(res) ? res : res?.data || [];
        setAvailablePincodes(items.map((p: any) => ({ id: p._id, name: p.pincode + (p.area ? " — " + p.area : "") })));
      })
      .catch(() => toast.error("Failed to load pincodes"))
      .finally(() => setLoadingPincodes(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchCity]);

  // Image Upload Logic
  const imageInputRef = useRef<HTMLInputElement>(null);
  const currentImages = watch("cardImages") || [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert FileList to local preview URLs for the mocked Cloudinary upload
    const newFiles = Array.from(files);
    if (newFiles.length + currentImages.length > 10) {
      alert("You can only upload up to 10 images!");
      return;
    }

    const newUrls = newFiles.map((file) => URL.createObjectURL(file));

    // In production, this is where you'd upload `files` to Cloudinary
    // and grab the secure_url returned by them instead of local URLs!
    const updatedImages = [...currentImages, ...newUrls];

    // Manually register field update
    handleSubmit((_data) => {})(); // Triggers form revalidation safely
    register("cardImages").onChange({ target: { value: updatedImages, name: "cardImages" } });
  };

  const onSubmit = async (data: FormData) => {
    const loadingToast = toast.loading(isEditing ? "Saving changes..." : "Creating listing...");
    try {
      const payload = {
        businessName: data.name,
        ownerName: data.ownerName,
        email: data.email,
        mobiles: data.mobiles?.map((m) => m.value) || [],
        countryId: data.countryId,
        stateId: data.stateId,
        cityId: data.cityId,
        pincodeId: data.pincodeId,
        address: data.address,
        gstNumber: data.gstNumber || undefined,
        cardImages: data.cardImages || [],
        hsnCodes: data.hsnCodes || [],
        isActive: true,
      };
      await api.post(API_ENDPOINTS.BUSINESSES, payload);
      toast.success(isEditing ? "Listing updated!" : "Business listed successfully!", { id: loadingToast });
      router.push("/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Failed to submit listing";
      toast.error(msg, { id: loadingToast });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="premium-card p-8 sm:p-10 space-y-8"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-[1000] text-foreground tracking-tight">
            {isEditing ? "Update Business" : "List New Business"}
          </h2>
          <p className="text-xs font-medium text-muted-foreground mt-0.5">
            Fill in the details to {isEditing ? "edit your" : "create a"} professional business card.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Business Name *</label>
          <input
            {...register("name")}
            className="w-full h-12 rounded-xl bg-muted/30 border border-border/40 px-4 text-sm font-semibold outline-none focus:bg-background focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
            placeholder="e.g. Acme Corp"
          />
          {errors.name && <p className="mt-1 text-xs font-bold text-red-500 ml-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Owner Name *</label>
          <input
            {...register("ownerName")}
            className="w-full h-12 rounded-xl bg-muted/30 border border-border/40 px-4 text-sm font-semibold outline-none focus:bg-background focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
            placeholder="e.g. John Doe"
          />
          {errors.ownerName && (
            <p className="mt-1 text-xs font-bold text-red-500 ml-1">{errors.ownerName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Company Email *</label>
          <input
            {...register("email")}
            type="email"
            className="w-full h-12 rounded-xl bg-muted/30 border border-border/40 px-4 text-sm font-semibold outline-none focus:bg-background focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
            placeholder="contact@acme.com"
          />
          {errors.email && <p className="mt-1 text-xs font-bold text-red-500 ml-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">GST Number (Optional)</label>
          <input
            {...register("gstNumber")}
            className="w-full h-12 rounded-xl bg-muted/30 border border-border/40 px-4 text-sm font-semibold uppercase outline-none focus:bg-background focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
            placeholder="22AAAAA0000A1Z5"
          />
          {errors.gstNumber && (
            <p className="mt-1 text-xs font-bold text-red-500 ml-1">{errors.gstNumber.message}</p>
          )}
        </div>
      </div>

      {/* Dynamic Mobiles Array */}
      <div className="rounded-2xl p-6 bg-muted/20 border border-border/40">
        <div className="mb-4 flex items-center justify-between">
          <label className="text-[10px] font-[1000] uppercase tracking-widest text-primary">Mobile Numbers</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (fields.length < 5) append({ value: "" });
            }}
            disabled={fields.length >= 5}
            className="h-8 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-primary hover:text-primary-foreground border-border/40"
          >
            + Add Number
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <div className="flex-1">
                <input
                  {...register(`mobiles.${index}.value`)}
                  placeholder="e.g. 9876543210"
                  className="w-full h-11 rounded-xl bg-background border border-border/40 px-4 text-sm font-semibold outline-none focus:border-primary transition-all"
                />
                {errors.mobiles?.[index]?.value && (
                  <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">
                    {errors.mobiles[index]?.value?.message}
                  </p>
                )}
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                  className="h-11 w-11 shrink-0 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all rounded-xl"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        {errors.mobiles && <p className="mt-2 text-xs text-red-500">{errors.mobiles.message}</p>}
      </div>

      {/* HSN Code Multi-Select UI */}
      <div className="rounded-2xl p-6 bg-muted/20 border border-border/40">
        <div className="mb-4 flex items-center justify-between">
          <label className="text-[10px] font-[1000] uppercase tracking-widest text-primary">HSN Codes *</label>
        </div>

        {/* Selected HSN Codes Badges */}
        <div className="mb-4 flex flex-wrap gap-2">
          {hsnFields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary shadow-sm"
            >
              <span className="truncate max-w-[150px]">
                {field.code} - {field.description}
              </span>
              <button type="button" onClick={() => removeHsn(index)} className="hover:text-red-500 transition-colors">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Search / Add HSN Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type HSN code or product name..."
            className="flex-1 h-11 rounded-xl bg-background border border-border/40 px-4 text-sm font-semibold outline-none focus:border-primary transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const val = e.currentTarget.value;
                if (val) {
                  appendHsn({ code: val, description: "Product Category" });
                  e.currentTarget.value = "";
                }
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl font-bold text-xs border-border/40 hover:bg-primary hover:text-primary-foreground"
            onClick={() => {
              const input = document.activeElement as HTMLInputElement;
              if (input && input.value) {
                appendHsn({ code: input.value, description: "Product Category" });
                input.value = "";
              }
            }}
          >
            Add HSN
          </Button>
        </div>
        <p className="mt-2 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider ml-1">
          Add the HSN codes relevant to your business listing.
        </p>

        {errors.hsnCodes && (
          <p className="mt-2 text-xs font-bold text-red-500">{errors.hsnCodes.message}</p>
        )}
      </div>

      {/* Cascading Location */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 pt-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Country *</label>
          <Controller
            name="countryId"
            control={control}
            render={({ field }) => (
              <CountrySelect
                value={field.value}
                onChange={field.onChange}
                placeholder="Select Country"
                error={errors.countryId?.message}
              />
            )}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">State *</label>
          <select
            {...register("stateId")}
            disabled={!watchCountry || loadingStates}
            className="w-full h-11 rounded-xl bg-muted/30 border border-border/40 px-3 text-sm font-semibold outline-none focus:bg-background focus:border-primary disabled:opacity-40 transition-all"
          >
            <option value="">{loadingStates ? "Loading..." : "Select State"}</option>
            {availableStates.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name}
              </option>
            ))}
          </select>
          {errors.stateId && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{errors.stateId.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">City *</label>
          <select
            {...register("cityId")}
            disabled={!watchState || loadingCities}
            className="w-full h-11 rounded-xl bg-muted/30 border border-border/40 px-3 text-sm font-semibold outline-none focus:bg-background focus:border-primary disabled:opacity-40 transition-all"
          >
            <option value="">{loadingCities ? "Loading..." : "Select City"}</option>
            {availableCities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.cityId && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{errors.cityId.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Pincode *</label>
          <select
            {...register("pincodeId")}
            disabled={!watchCity || loadingPincodes}
            className="w-full h-11 rounded-xl bg-muted/30 border border-border/40 px-3 text-sm font-semibold outline-none focus:bg-background focus:border-primary disabled:opacity-40 transition-all"
          >
            <option value="">{loadingPincodes ? "Loading..." : "Select Pincode"}</option>
            {availablePincodes.map((pin) => (
              <option key={pin.id} value={pin.id}>
                {pin.name}
              </option>
            ))}
          </select>
          {errors.pincodeId && (
            <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{errors.pincodeId.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Full Address *</label>
        <textarea
          {...register("address")}
          rows={3}
          className="w-full rounded-xl bg-muted/30 border border-border/40 px-4 py-3 text-sm font-semibold outline-none focus:bg-background focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
          placeholder="Shop No, Building, Street Name..."
        />
        {errors.address && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{errors.address.message}</p>}
      </div>

      <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-8 flex flex-col items-center text-center group/upload hover:bg-muted/30 transition-all duration-300">
        <div className="mb-6">
          <div className="h-20 w-20 rounded-[28px] bg-primary/10 text-primary flex items-center justify-center mb-4 mx-auto group-hover/upload:scale-110 transition-transform duration-500 shadow-xl shadow-primary/5">
            <UploadCloud className="h-10 w-10" />
          </div>
          <h4 className="text-sm font-black text-foreground">Product & Catalog Images</h4>
          <p className="text-xs font-medium text-muted-foreground mt-1 max-w-xs">
            Upload up to 10 high-quality images to showcase your business.
          </p>
        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={imageInputRef}
          onChange={handleImageUpload}
        />

        {currentImages.length > 0 && (
          <div className="w-full mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
            {currentImages.map((src, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-border/40 shadow-sm"
              >
                <div className="flex h-full w-full items-center justify-center bg-muted/40 backdrop-blur-sm">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newImgs = currentImages.filter((_, i) => i !== index);
                    register("cardImages").onChange({
                      target: { value: newImgs, name: "cardImages" },
                    });
                  }}
                  className="absolute top-2 right-2 h-8 w-8 rounded-xl bg-destructive text-white flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 shadow-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {currentImages.length < 10 && (
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 hover:bg-primary/5 hover:border-primary/40 transition-all group"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Plus className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Add More</span>
              </button>
            )}
          </div>
        )}

        {currentImages.length === 0 && (
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="px-8 py-3 rounded-xl bg-foreground text-background font-black text-xs hover:bg-primary hover:text-primary-foreground transition-all shadow-xl shadow-black/5"
          >
            Browse Files
          </button>
        )}

        {errors.cardImages && (
          <p className="mt-4 text-xs font-bold text-red-500">{errors.cardImages.message}</p>
        )}
      </div>

      <div className="pt-8 flex flex-col sm:flex-row gap-4">
        <button
          disabled={isSubmitting}
          type="submit"
          className="h-14 flex-1 rounded-2xl bg-primary text-primary-foreground font-[1000] text-sm shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShieldCheck className="h-5 w-5" />
              {isEditing ? "Update Business Listing" : "Create Business Card"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="h-14 px-8 rounded-2xl border border-border/50 text-muted-foreground font-black text-sm hover:bg-muted/50 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
