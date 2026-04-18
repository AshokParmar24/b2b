import { Schema, Document, models, model } from "mongoose";

export interface IPlan extends Document {
  name: string;
  description: string;
  price: number;
  maxListings: number;
  maxImages: number;
  maxHsnCodes: number | null;
  features: string[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

const PlanSchema = new Schema<IPlan>({
  name:         { type: String, required: true, unique: true, trim: true },
  description:  { type: String, required: true, trim: true },
  price:        { type: Number, required: true, default: 0 },
  maxListings:  { type: Number, required: true, default: 1 },
  maxImages:    { type: Number, required: true, default: 3, max: 10 },
  maxHsnCodes:  { type: Number, default: null }, // null = unlimited
  features:     [{ type: String, trim: true }],
  startDate:    { type: Date, default: Date.now },
  endDate:      { type: Date, required: true },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

export default models.Plan || model<IPlan>("Plan", PlanSchema);
