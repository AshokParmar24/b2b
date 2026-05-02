import * as z from "zod";
import { UserRole } from "@/types/models";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email format"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits").max(15, "Mobile number is too long"),
  mobileCode: z.string().optional(),
  mobileIso: z.string().optional(),
  password: z.string().optional().or(z.literal("")),
  role: z.nativeEnum(UserRole),
  planId: z.string().nullable().optional(),
  countryId: z.string().min(1, "Country is required"),
  stateId: z.string().min(1, "State is required"),
  cityId: z.string().min(1, "City is required"),
  pincodeId: z.string().min(1, "Pincode is required"),
  isActive: z.boolean(),
});

export type UserInput = z.input<typeof userSchema>;
