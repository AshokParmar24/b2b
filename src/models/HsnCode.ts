import { Schema, Document, models, model } from "mongoose";
import { HsnCode } from "@/types";

const HsnCodeSchema = new Schema<HsnCode & Document>(
  {
    code: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    unit: { type: String, default: "PCS", trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

HsnCodeSchema.index({ code: "text", description: "text" });

export default models.HsnCode || model<HsnCode & Document>("HsnCode", HsnCodeSchema);
