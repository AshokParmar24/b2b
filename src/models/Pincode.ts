import mongoose, { Schema, Document, models, model } from "mongoose";
import { Pincode } from "@/types";

const PincodeSchema = new Schema<Pincode & Document>(
  {
    pincode: { type: String, required: true, trim: true },
    cityId: { type: Schema.Types.ObjectId, ref: "City", required: true },
    area: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PincodeSchema.index({ cityId: 1, pincode: 1 });

export default models.Pincode || model<Pincode & Document>("Pincode", PincodeSchema);
