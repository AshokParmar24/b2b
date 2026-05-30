import mongoose, { Schema, Document } from "mongoose";

export interface IFollowedEntity extends Document {
  userId: mongoose.Types.ObjectId;
  entityType: "Company" | "HsnCode";
  entityId: mongoose.Types.ObjectId; // References either Company or HsnCode
  createdAt: Date;
  updatedAt: Date;
}

const followedEntitySchema = new Schema<IFollowedEntity>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    entityType: { type: String, enum: ["Company", "HsnCode"], required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

// Prevent duplicate follows
followedEntitySchema.index({ userId: 1, entityType: 1, entityId: 1 }, { unique: true });

const FollowedEntity = mongoose.models.FollowedEntity || mongoose.model<IFollowedEntity>("FollowedEntity", followedEntitySchema);

export default FollowedEntity;
