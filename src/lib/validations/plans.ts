import * as z from "zod";

export const planSchema = z.object({
  name: z.string().min(2, "Plan name must be at least 2 characters").max(50),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price cannot be negative"),
  maxListings: z.number().int().min(1, "Must allow at least 1 listing"),
  maxImages: z.number().int().min(1, "Must allow at least 1 image").max(50, "Max 50 images"),
  maxHsnCodes: z.number().int().nullable().optional(), // null means unlimited
  features: z.array(z.string().min(1, "Feature cannot be empty")),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(), // Making this optional for the form, but required by mongoose model, so we can default it in the API.
  isActive: z.boolean(),
});

export type PlanInput = z.infer<typeof planSchema>;
