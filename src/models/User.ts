import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "subscriber";
  planId: mongoose.Types.ObjectId | null;
  planStartDate: Date | null;
  planEndDate: Date | null;
  isActive: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "subscriber"], default: "subscriber" },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", default: null },
    planStartDate: { type: Date, default: null },
    planEndDate: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);
