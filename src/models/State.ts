import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IState extends Document {
  name: string;
  countryId: mongoose.Types.ObjectId;
  code: string;
  isActive: boolean;
}

const StateSchema = new Schema<IState>(
  {
    name: { type: String, required: true, trim: true },
    countryId: { type: Schema.Types.ObjectId, ref: "Country", required: true },
    code: { type: String, trim: true, uppercase: true, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

StateSchema.index({ countryId: 1, name: 1 });

export default models.State || model<IState>("State", StateSchema);
