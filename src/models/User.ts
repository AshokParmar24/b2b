import mongoose, { Schema, Document, models, model } from "mongoose";
import { UserRole, User } from "@/types/models";

const UserSchema = new Schema<User & Document>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: Number, enum: [1, 2], default: 2 },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", default: null },
    planStartDate: { type: Date, default: null },
    planEndDate: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.User || model<User & Document>("User", UserSchema);
