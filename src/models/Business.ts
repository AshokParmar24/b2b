import mongoose, { Schema, Document, models, model } from "mongoose";

interface IHsnEntry {
  code: string;
  description: string;
  productName: string;
  unit: string;
}

export interface IBusiness extends Document {
  businessName: string;
  ownerName: string;
  mobiles: string[];
  whatsapp: string;
  email: string;
  website: string;
  address: string;
  countryId: mongoose.Types.ObjectId;
  stateId: mongoose.Types.ObjectId;
  cityId: mongoose.Types.ObjectId;
  pincodeId: mongoose.Types.ObjectId;
  gstNumber: string;
  logoUrl: string;
  cardImages: string[];
  hsnCodes: IHsnEntry[];
  slug: string;
  userId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HsnEntrySchema = new Schema<IHsnEntry>({
  code:        { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: "" },
  productName: { type: String, trim: true, default: "" },
  unit:        { type: String, trim: true, default: "PCS" },
}, { _id: false });

const BusinessSchema = new Schema<IBusiness>({
  businessName: { type: String, required: true, trim: true },
  ownerName:    { type: String, required: true, trim: true },
  mobiles:      [{ type: String, trim: true }],          // Array of mobile numbers
  whatsapp:     { type: String, trim: true, default: "" },
  email:        { type: String, trim: true, default: "" },
  website:      { type: String, trim: true, default: "" },
  address:      { type: String, trim: true, default: "" },

  // Location master references
  countryId:    { type: Schema.Types.ObjectId, ref: "Country", required: true },
  stateId:      { type: Schema.Types.ObjectId, ref: "State",   required: true },
  cityId:       { type: Schema.Types.ObjectId, ref: "City",    required: true },
  pincodeId:    { type: Schema.Types.ObjectId, ref: "Pincode", default: null },

  gstNumber:   { type: String, trim: true, default: "" },
  logoUrl:     { type: String, default: "" },
  cardImages:  [{ type: String }],                        // Array max 10
  hsnCodes:    [HsnEntrySchema],                          // Array of HSN codes

  slug:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  userId:   { type: Schema.Types.ObjectId, ref: "User", required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Full text search index
BusinessSchema.index({ businessName: "text", ownerName: "text", "hsnCodes.code": "text" });
BusinessSchema.index({ cityId: 1, stateId: 1, countryId: 1 });

export default models.Business || model<IBusiness>("Business", BusinessSchema);
