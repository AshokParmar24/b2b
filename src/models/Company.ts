import mongoose, { Schema, Document } from "mongoose";

export interface ICompany extends Document {
  name: string;
  taxId?: string; // IEC, EIN, VAT, etc.
  countryId: mongoose.Types.ObjectId;
  website?: string;
  isBlurred: boolean;
  contactEmails: string[];
  contactPhones: string[];
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, index: true },
    taxId: { type: String },
    countryId: { type: Schema.Types.ObjectId, ref: "Country", required: true },
    website: { type: String },
    isBlurred: { type: Boolean, default: true },
    contactEmails: [{ type: String }],
    contactPhones: [{ type: String }],
  },
  { timestamps: true }
);

const Company = mongoose.models.Company || mongoose.model<ICompany>("Company", companySchema);

export default Company;
