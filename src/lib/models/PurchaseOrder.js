import mongoose from "mongoose";

const { Schema, Types } = mongoose;
export const PURCHASE_ORDER_STATUSES = [
  "Draft",
  "Submitted",
  "Approved",
  "Partially Received",
  "Received",
  "Cancelled",
];

const purchaseItemSchema = new Schema({
  product: { type: Types.ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true, trim: true },
  sku: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  unitCost: { type: Number, required: true, min: 0 },
  receivedQuantity: { type: Number, default: 0, min: 0 },
});

const purchaseOrderSchema = new Schema(
  {
    purchaseOrderNumber: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
    },
    supplier: { type: Types.ObjectId, ref: "Supplier", required: true },
    items: {
      type: [purchaseItemSchema],
      validate: (items) => items.length > 0,
    },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, required: true, min: 0, max: 100 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: PURCHASE_ORDER_STATUSES, default: "Draft" },
    expectedDate: Date,
    notes: { type: String, trim: true, maxlength: 1000 },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    approvedBy: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

purchaseOrderSchema.pre("validate", function () {
  if (!this.purchaseOrderNumber) {
    this.purchaseOrderNumber = `PO-${Date.now().toString().slice(-8)}-${Math.floor(
      Math.random() * 100,
    )
      .toString()
      .padStart(2, "0")}`;
  }
});
purchaseOrderSchema.index({ supplier: 1, createdAt: -1 });
purchaseOrderSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.PurchaseOrder ||
  mongoose.model("PurchaseOrder", purchaseOrderSchema);
