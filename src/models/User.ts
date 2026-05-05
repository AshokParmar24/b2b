import mongoose, { Schema, Document, models, model } from "mongoose";
import { UserRole, User } from "@/types/models";

const UserSchema = new Schema<User & Document>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    mobile: { type: String, trim: true, default: "" },
    mobileCode: { type: String, trim: true, default: "" },
    mobileIso: { type: String, trim: true, default: "" },
    countryId: { type: Schema.Types.ObjectId, ref: "Country", default: null },
    stateId: { type: Schema.Types.ObjectId, ref: "State", default: null },
    cityId: { type: Schema.Types.ObjectId, ref: "City", default: null },
    pincodeId: { type: Schema.Types.ObjectId, ref: "Pincode", default: null },
    role: { type: Number, enum: [1, 2], default: 2 },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", default: null },
    planStartDate: { type: Date, default: null },
    planEndDate: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

export default models.User || model<User & Document>("User", UserSchema);
