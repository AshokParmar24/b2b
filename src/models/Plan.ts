import { Schema, Document, models, model } from "mongoose";
import { Plan } from "@/types";

const PlanSchema = new Schema<Plan & Document>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, default: 0 },
    maxListings: { type: Number, required: true, default: 1 },
    maxImages: { type: Number, required: true, default: 3, max: 10 },
    maxHsnCodes: { type: Number, default: null }, // null = unlimited
    features: [{ type: String, trim: true }],
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Plan || model<Plan & Document>("Plan", PlanSchema);
