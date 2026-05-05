import mongoose, { Schema, Document } from "mongoose";

export interface IInquiry extends Document {
  businessId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId; // User who sent it (if logged in)
  name: string;
  email: string;
  mobile: string;
  message: string;
  status: "pending" | "responded" | "closed";
  createdAt: Date;
}

const InquirySchema: Schema = new Schema({
  businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["pending", "responded", "closed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);
