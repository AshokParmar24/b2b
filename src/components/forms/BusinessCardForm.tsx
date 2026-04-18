"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";

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
});

type FormData = yup.InferType<typeof schema>;

export default function BusinessCardForm() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      mobiles: [{ value: "" }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "mobiles",
  });

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
      <h2 className="text-2xl font-bold text-white mb-6">Add Business Listing</h2>

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

      {/* Cascading Location */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Country *</label>
          <select {...register("countryId")} className="w-full rounded-lg px-4 py-2 text-white outline-none" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)" }}>
            <option value="">Select...</option>
            <option value="in">India</option>
          </select>
          {errors.countryId && <p className="text-red-500 text-xs mt-1">{errors.countryId.message}</p>}
        </div>
        <div>
           <label className="block text-sm text-gray-400 mb-1">State *</label>
           <select {...register("stateId")} className="w-full rounded-lg px-4 py-2 text-white outline-none" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)" }}>
            <option value="">Select...</option>
            <option value="mh">Maharashtra</option>
          </select>
          {errors.stateId && <p className="text-red-500 text-xs mt-1">{errors.stateId.message}</p>}
        </div>
        <div>
           <label className="block text-sm text-gray-400 mb-1">City *</label>
           <select {...register("cityId")} className="w-full rounded-lg px-4 py-2 text-white outline-none" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)" }}>
            <option value="">Select...</option>
            <option value="bom">Mumbai</option>
          </select>
          {errors.cityId && <p className="text-red-500 text-xs mt-1">{errors.cityId.message}</p>}
        </div>
        <div>
           <label className="block text-sm text-gray-400 mb-1">Pincode *</label>
           <select {...register("pincodeId")} className="w-full rounded-lg px-4 py-2 text-white outline-none" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)" }}>
            <option value="">Select...</option>
            <option value="400001">400001</option>
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

      <div className="pt-4">
        <Button disabled={isSubmitting} type="submit" className="w-full md:w-auto px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 rounded-lg">
          {isSubmitting ? "Submitting..." : "Save Business Listing"}
        </Button>
      </div>
    </form>
  );
}
