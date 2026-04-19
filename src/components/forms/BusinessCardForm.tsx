import { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";

// Yup Validation Schema
const schema = yup.object({
  name: yup.string().required("Business name is required").min(3, "Must be at least 3 characters"),
  email: yup.string().email("Invalid email format").required("Company email is required"),
  ownerName: yup.string().required("Owner name is required"),
  mobiles: yup.array().of(
    yup.object({
      value: yup.string()
        .matches(/^[0-9]{10,15}$/, "Enter a valid 10-15 digit mobile number")
        .required("Mobile number is required")
    })
  ).min(1, "At least one mobile number is required").max(5, "Max 5 mobile numbers allowed"),
  countryId: yup.string().required("Country is required"),
  stateId: yup.string().required("State is required"),
  cityId: yup.string().required("City is required"),
  pincodeId: yup.string().required("Pincode is required"),
  address: yup.string().required("Full address is required"),
  gstNumber: yup.string().nullable().matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
    message: "Invalid GST Format", excludeEmptyString: true
  }),
  cardImages: yup.array().of(yup.string().required()).max(10, "Maximum 10 images allowed"),
  hsnCodes: yup.array().of(
    yup.object({
      code: yup.string().required(),
      description: yup.string().required(),
    })
  ).min(1, "At least one HSN code is required"),
});

type FormData = yup.InferType<typeof schema>;

interface BusinessCardFormProps {
  initialData?: Partial<FormData>;
  isEditing?: boolean;
}

export default function BusinessCardForm({ initialData, isEditing = false }: BusinessCardFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      mobiles: [{ value: "" }],
      cardImages: [],
      hsnCodes: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "mobiles",
  });

  const { fields: hsnFields, append: appendHsn, remove: removeHsn } = useFieldArray({
    control,
    name: "hsnCodes",
  });

  // Cascading Location Logic
  const watchCountry = watch("countryId");
  const watchState = watch("stateId");
  const watchCity = watch("cityId");

  const [availableStates, setAvailableStates] = useState<{id: string, name: string}[]>([]);
  const [availableCities, setAvailableCities] = useState<{id: string, name: string}[]>([]);
  const [availablePincodes, setAvailablePincodes] = useState<{id: string, name: string}[]>([]);

  // Reset trailing location fields when a parent field changes
  useEffect(() => {
    if (watchCountry === "in") setAvailableStates([{ id: "gj", name: "Gujarat" }, { id: "mh", name: "Maharashtra" }]);
    else setAvailableStates([]);
    // register("stateId").onChange({ target: { value: "", name: "stateId" } }); // Removed to allow typing out
  }, [watchCountry]);

  useEffect(() => {
    if (watchState === "gj") setAvailableCities([{ id: "morbi", name: "Morbi" }, { id: "ahmedabad", name: "Ahmedabad" }]);
    else if (watchState === "mh") setAvailableCities([{ id: "bom", name: "Mumbai" }]);
    else setAvailableCities([]);
  }, [watchState]);

  useEffect(() => {
    if (watchCity === "morbi") setAvailablePincodes([{ id: "363641", name: "363641" }, { id: "363642", name: "363642" }]);
    else if (watchCity === "bom") setAvailablePincodes([{ id: "400001", name: "400001" }]);
    else setAvailablePincodes([]);
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

    const newUrls = newFiles.map(file => URL.createObjectURL(file));
    
    // In production, this is where you'd upload `files` to Cloudinary 
    // and grab the secure_url returned by them instead of local URLs!
    const updatedImages = [...currentImages, ...newUrls];
    
    // Manually register field update
    handleSubmit((_data) => {})( ); // Triggers form revalidation safely
    register("cardImages").onChange({ target: { value: updatedImages, name: "cardImages" } });
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        mobiles: data.mobiles?.map(m => m.value) || [],
      };
      console.log("Submitting:", payload);
      alert("Business submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
      <h2 className="text-2xl font-bold text-white mb-6">{isEditing ? "Edit Business Listing" : "Add Business Listing"}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Business Name *</label>
          <input
            {...register("name")}
            className="w-full rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)" }}
            placeholder="e.g. Acme Corp"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Owner Name *</label>
          <input
            {...register("ownerName")}
            className="w-full rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)" }}
            placeholder="e.g. John Doe"
          />
          {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Company Email *</label>
          <input
            {...register("email")}
            type="email"
            className="w-full rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)" }}
            placeholder="contact@acme.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">GST Number (Optional)</label>
          <input
            {...register("gstNumber")}
            className="w-full rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 uppercase"
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)" }}
            placeholder="22AAAAA0000A1Z5"
          />
          {errors.gstNumber && <p className="text-red-500 text-xs mt-1">{errors.gstNumber.message}</p>}
        </div>
      </div>

      {/* Dynamic Mobiles Array */}
      <div className="p-4 rounded-lg" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-color)" }}>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-300">Mobile Numbers</label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => { if (fields.length < 5) append({ value: "" }) }}
            disabled={fields.length >= 5}
            className="h-8"
            style={{ borderColor: "var(--border-color)", color: "#d1d5db" }}
          >
            + Add Number
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <div className="flex-1">
                <input
                  {...register(`mobiles.${index}.value`)}
                  placeholder="e.g. 9876543210"
                  className="w-full rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                  style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)" }}
                />
                {errors.mobiles?.[index]?.value && (
                  <p className="text-red-500 text-xs mt-1">{errors.mobiles[index]?.value?.message}</p>
                )}
              </div>
              {fields.length > 1 && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => remove(index)}
                  className="shrink-0 h-10 w-10 bg-red-900/50 hover:bg-red-800 text-red-500"
                >
                  X
                </Button>
              )}
            </div>
          ))}
        </div>
        {errors.mobiles && <p className="text-red-500 text-xs mt-2">{errors.mobiles.message}</p>}
      </div>

      {/* HSN Code Multi-Select UI */}
      <div className="p-4 rounded-lg" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-color)" }}>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-300">HSN Codes *</label>
        </div>

        {/* Selected HSN Codes Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {hsnFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 bg-purple-900/40 text-purple-200 px-3 py-1.5 rounded-full text-xs font-semibold border border-purple-500/30">
              <span>{field.code} - {field.description.substring(0, 20)}...</span>
              <button type="button" onClick={() => removeHsn(index)} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Search / Add HSN Input */}
        <div className="flex gap-2">
           <input
             type="text"
             placeholder="Type HSN code or product name to search..."
             className="flex-1 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
             style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)" }}
             onKeyDown={(e) => {
               if (e.key === "Enter") {
                 e.preventDefault();
                 const val = e.currentTarget.value;
                 if (val) {
                   appendHsn({ code: val, description: "Custom Product" });
                   e.currentTarget.value = "";
                 }
               }
             }}
           />
           <Button type="button" variant="outline" className="h-10" style={{ borderColor: "var(--border-color)", color: "#d1d5db" }}
             onClick={() => {
                const input = document.activeElement as HTMLInputElement;
                if (input && input.value) {
                   appendHsn({ code: input.value, description: "Custom Product" });
                   input.value = "";
                }
             }}>
             Add Quick HSN
           </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Press enter to quick-add an HSN if the dropdown fails.</p>
        
        {errors.hsnCodes && <p className="text-red-500 text-xs mt-2 font-bold">{errors.hsnCodes.message}</p>}
      </div>

      {/* Cascading Location */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Country *</label>
          <select {...register("countryId")} className="w-full rounded-lg px-4 py-2 text-white outline-none" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)" }}>
            <option value="">Select Country</option>
            <option value="in">India 🇮🇳</option>
            <option value="us">United States 🇺🇸</option>
          </select>
          {errors.countryId && <p className="text-red-500 text-xs mt-1">{errors.countryId.message}</p>}
        </div>
        <div>
           <label className="block text-sm text-gray-400 mb-1">State *</label>
           <select {...register("stateId")} disabled={!watchCountry} className="w-full rounded-lg px-4 py-2 text-white outline-none disabled:opacity-50" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)" }}>
            <option value="">Select State</option>
            {availableStates.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
          </select>
          {errors.stateId && <p className="text-red-500 text-xs mt-1">{errors.stateId.message}</p>}
        </div>
        <div>
           <label className="block text-sm text-gray-400 mb-1">City *</label>
           <select {...register("cityId")} disabled={!watchState} className="w-full rounded-lg px-4 py-2 text-white outline-none disabled:opacity-50" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)" }}>
            <option value="">Select City</option>
            {availableCities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
          </select>
          {errors.cityId && <p className="text-red-500 text-xs mt-1">{errors.cityId.message}</p>}
        </div>
        <div>
           <label className="block text-sm text-gray-400 mb-1">Pincode *</label>
           <select {...register("pincodeId")} disabled={!watchCity} className="w-full rounded-lg px-4 py-2 text-white outline-none disabled:opacity-50" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)" }}>
            <option value="">Select Pincode</option>
            {availablePincodes.map(pin => <option key={pin.id} value={pin.id}>{pin.name}</option>)}
          </select>
          {errors.pincodeId && <p className="text-red-500 text-xs mt-1">{errors.pincodeId.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Full Address *</label>
        <textarea
          {...register("address")}
          rows={3}
          className="w-full rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
          style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)" }}
          placeholder="Shop No, Building..."
        />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
      </div>

      {/* Cloudinary Image Upload UI */}
      <div className="p-5 rounded-lg border border-dashed" style={{ background: "rgba(0,0,0,0.2)", borderColor: "var(--border-color)" }}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Product / Catalog Images</label>
            <p className="text-xs text-gray-500 mt-1">Upload exactly up to 10 high-quality images of your products.</p>
          </div>
          <p className="text-xs font-black text-purple-400">{currentImages.length} / 10</p>
        </div>

        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          ref={imageInputRef} 
          onChange={handleImageUpload} 
        />
        
        {currentImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            {currentImages.map((src, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-800 group">
                {/* Image Mockup */}
                <div className="w-full h-full bg-black/40 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-600" />
                </div>
                <button 
                  type="button" 
                  onClick={() => {
                     const newImgs = currentImages.filter((_, i) => i !== index);
                     register("cardImages").onChange({ target: { value: newImgs, name: "cardImages" } });
                  }}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {currentImages.length < 10 && (
               <button type="button" onClick={() => imageInputRef.current?.click()} className="aspect-square rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-700 hover:border-purple-500 hover:bg-white/5 transition-all">
                 <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
                 <span className="text-xs text-gray-500 font-medium">Add More</span>
               </button>
            )}
          </div>
        ) : (
          <div 
            onClick={() => imageInputRef.current?.click()} 
            className="w-full py-12 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all border-2 border-dashed border-gray-800 hover:border-purple-500"
          >
             <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
             <p className="text-sm text-gray-300 font-medium tracking-wide">Click to browse your device</p>
             <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB each</p>
          </div>
        )}
        
        {errors.cardImages && <p className="text-red-500 text-xs mt-2 font-bold">{errors.cardImages.message}</p>}
      </div>

      <div className="pt-4">
        <Button disabled={isSubmitting} type="submit" className="w-full md:w-auto px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 rounded-lg">
          {isSubmitting ? "Submitting..." : "Save Business Listing"}
        </Button>
      </div>
    </form>
  );
}
