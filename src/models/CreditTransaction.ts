import mongoose, { Schema, Document } from "mongoose";

export interface ICreditTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number; // positive for addition, negative for deduction
  description: string; // e.g., "Unlocked Company X Contact"
  createdAt: Date;
  updatedAt: Date;
}

const creditTransactionSchema = new Schema<ICreditTransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const CreditTransaction = mongoose.models.CreditTransaction || mongoose.model<ICreditTransaction>("CreditTransaction", creditTransactionSchema);

export default CreditTransaction;
