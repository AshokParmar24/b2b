import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ICountry extends Document {
  name: string;
  code: string; // e.g. "IN"
  flag: string; // Emoji "🇮🇳"
  phoneCode: string; // e.g. "91"
  countryLogo: string; // Flag image URL
  isActive: boolean;
}

const CountrySchema = new Schema<ICountry>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    flag: { type: String, default: "" },
    phoneCode: { type: String, required: true, trim: true },
    countryLogo: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Country || model<ICountry>("Country", CountrySchema);
