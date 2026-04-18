import { Schema, Document, models, model } from "mongoose";

export interface IHsnCode extends Document {
  code: string;
  description: string;
  unit: string;
  isActive: boolean;
}

const HsnCodeSchema = new Schema<IHsnCode>({
  code:        { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true, trim: true },
  unit:        { type: String, default: "PCS", trim: true },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

HsnCodeSchema.index({ code: "text", description: "text" });

export default models.HsnCode || model<IHsnCode>("HsnCode", HsnCodeSchema);
