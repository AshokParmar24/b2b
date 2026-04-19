import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ICity extends Document {
  name: string;
  stateId: mongoose.Types.ObjectId;
  isActive: boolean;
}

const CitySchema = new Schema<ICity>(
  {
    name: { type: String, required: true, trim: true },
    stateId: { type: Schema.Types.ObjectId, ref: "State", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CitySchema.index({ stateId: 1, name: 1 });

export default models.City || model<ICity>("City", CitySchema);
