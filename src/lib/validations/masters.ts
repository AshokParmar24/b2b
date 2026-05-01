import { z } from "zod";

/**
 * 🌍 COUNTRY VALIDATION SCHEMA
 */
export const countrySchema = z.object({
  name: z.string().min(2, "Country name must be at least 2 characters").max(100),
  code: z.string().length(2, "ISO Code must be exactly 2 characters").toUpperCase(),
  phoneCode: z.string().min(1, "Phone code is required").regex(/^\d+$/, "Must be numbers only"),
  currencyCode: z.string().length(3, "Currency code must be 3 characters").toUpperCase(),
  currencySymbol: z.string().min(1, "Currency symbol is required"),
  flag: z.string().optional().or(z.literal("")),
  isActive: z.boolean().optional().default(true),
});

/**
 * 🏘️ STATE VALIDATION SCHEMA
 */
export const stateSchema = z.object({
  name: z.string().min(2, "State name must be at least 2 characters"),
  code: z.string().min(2, "State code is required").toUpperCase(),
  countryId: z.string().min(1, "Country reference is required"),
  isActive: z.boolean().optional().default(true),
});

export const citySchema = z.object({
  name: z.string().min(2, "City name must be at least 2 characters"),
  stateId: z.string().min(1, "State reference is required"),
  isActive: z.boolean().optional().default(true),
});

export const pincodeSchema = z.object({
  pincode: z.string().min(4, "Pincode must be at least 4 characters").regex(/^\d+$/, "Must be numbers only"),
  area: z.string().optional().default(""),
  cityId: z.string().min(1, "City reference is required"),
  isActive: z.boolean().optional().default(true),
});

export const hsnSchema = z.object({
  code: z.string().min(4, "HSN Code must be at least 4 digits").max(8).regex(/^\d+$/, "Must be numbers only"),
  description: z.string().min(5, "Description is required"),
  gstRate: z.number().min(0).max(100),
  isActive: z.boolean().optional().default(true),
});

export type CountryInput = z.infer<typeof countrySchema>;
export type StateInput = z.infer<typeof stateSchema>;
export type CityInput = z.infer<typeof citySchema>;
export type PincodeInput = z.infer<typeof pincodeSchema>;
export type HsnInput = z.infer<typeof hsnSchema>;
