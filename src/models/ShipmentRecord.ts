import mongoose, { Schema, Document } from "mongoose";

export interface IShipmentRecord extends Document {
  exporterId: mongoose.Types.ObjectId; // The Supplier
  importerId: mongoose.Types.ObjectId; // The Buyer
  hsnCodeId: mongoose.Types.ObjectId;
  originPortId?: mongoose.Types.ObjectId; // E.g., City or custom Port model
  destinationPortId?: mongoose.Types.ObjectId;
  date: Date;
  quantity: number;
  unitType: string; // kg, tons, units, etc.
  valueUSD: number;
  productDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

const shipmentRecordSchema = new Schema<IShipmentRecord>(
  {
    exporterId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    importerId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    hsnCodeId: { type: Schema.Types.ObjectId, ref: "HsnCode", required: true, index: true },
    originPortId: { type: Schema.Types.ObjectId, ref: "City" }, // Alternatively create a Port model
    destinationPortId: { type: Schema.Types.ObjectId, ref: "City" },
    date: { type: Date, required: true, index: true },
    quantity: { type: Number, required: true },
    unitType: { type: String, required: true },
    valueUSD: { type: Number, required: true },
    productDescription: { type: String, required: true },
  },
  { timestamps: true }
);

// Compound index for frequent search queries
shipmentRecordSchema.index({ hsnCodeId: 1, date: -1 });
shipmentRecordSchema.index({ exporterId: 1, date: -1 });
shipmentRecordSchema.index({ importerId: 1, date: -1 });

const ShipmentRecord = mongoose.models.ShipmentRecord || mongoose.model<IShipmentRecord>("ShipmentRecord", shipmentRecordSchema);

export default ShipmentRecord;
