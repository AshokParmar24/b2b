import mongoose, { Schema, Document } from "mongoose";

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const FavoriteSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true },
  createdAt: { type: Date, default: Date.now },
});

// Compound index to prevent duplicate favorites
FavoriteSchema.index({ userId: 1, businessId: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model<IFavorite>("Favorite", FavoriteSchema);
