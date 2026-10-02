import mongoose from "mongoose";

const { Schema, Types } = mongoose;
const RETURN_STATUSES = [
  "Requested",
  "Approved",
  "Rejected",
  "Received",
  "Completed",
];

const returnItemSchema = new Schema({
  product: { type: Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const returnSchema = new Schema(
  {
    order: { type: Types.ObjectId, ref: "Order", required: true },
    customer: { type: Types.ObjectId, ref: "User", required: true },
    items: { type: [returnItemSchema], required: true },
    reason: { type: String, required: true, trim: true, maxlength: 500 },
    status: { type: String, enum: RETURN_STATUSES, default: "Requested" },
    requestedAt: { type: Date, default: Date.now },
    processedAt: Date,
    processedBy: { type: Types.ObjectId, ref: "User" },
    restockedAt: Date,
  },
  { timestamps: true },
);

returnSchema.index({ customer: 1, createdAt: -1 });
returnSchema.index({ order: 1 });

export { RETURN_STATUSES };
export default mongoose.models.Return || mongoose.model("Return", returnSchema);
