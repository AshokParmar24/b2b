import mongoose, { Schema, Document, models, model } from "mongoose";
import { Country } from "@/types";

const CountrySchema = new Schema<Country & Document>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    flag: { type: String, default: "" },
    phoneCode: { type: String, required: true, trim: true },
    currencyCode: { type: String, required: true, trim: true, uppercase: true, default: "USD" },
    currencySymbol: { type: String, required: true, trim: true, default: "$" },
    countryLogo: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Country || model<Country & Document>("Country", CountrySchema);
