import mongoose, { Schema, Document, models, model } from "mongoose";
import { City } from "@/types";

const CitySchema = new Schema<City & Document>(
  {
    name: { type: String, required: true, trim: true },
    stateId: { type: Schema.Types.ObjectId, ref: "State", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CitySchema.index({ stateId: 1, name: 1 });

export default models.City || model<City & Document>("City", CitySchema);
