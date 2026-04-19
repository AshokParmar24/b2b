import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IPincode extends Document {
  pincode: string;
  cityId: mongoose.Types.ObjectId;
  area: string;
  isActive: boolean;
}

const PincodeSchema = new Schema<IPincode>(
  {
    pincode: { type: String, required: true, trim: true },
    cityId: { type: Schema.Types.ObjectId, ref: "City", required: true },
    area: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PincodeSchema.index({ cityId: 1, pincode: 1 });

export default models.Pincode || model<IPincode>("Pincode", PincodeSchema);
