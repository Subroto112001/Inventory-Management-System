import mongoose from "mongoose";

const { Schema, Types } = mongoose;

export const STOCK_MOVEMENT_TYPES = [
  "INITIAL_STOCK",
  "PURCHASE",
  "SALE",
  "ADJUSTMENT",
  "RETURN",
  "TRANSFER_IN",
  "TRANSFER_OUT",
  "DAMAGE",
  "RESTOCK",
];

const stockMovementSchema = new Schema(
  {
    product: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    movementType: {
      type: String,
      enum: STOCK_MOVEMENT_TYPES,
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "Movement quantity must be a whole number",
      },
      min: 1,
    },
    direction: {
      type: String,
      enum: ["IN", "OUT"],
      required: true,
    },
    quantityBefore: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "Quantity before movement must be a whole number",
      },
      min: 0,
    },
    quantityAfter: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "Quantity after movement must be a whole number",
      },
      min: 0,
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    referenceType: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    referenceId: {
      type: Types.ObjectId,
      index: true,
    },
    warehouse: {
      type: Types.ObjectId,
      ref: "Warehouse",
      index: true,
    },
    performedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

stockMovementSchema.index({ product: 1, createdAt: -1 });
stockMovementSchema.index({ movementType: 1, createdAt: -1 });
stockMovementSchema.index({ performedBy: 1, createdAt: -1 });
stockMovementSchema.index({ referenceType: 1, referenceId: 1 });
stockMovementSchema.index({ createdAt: -1 });

const StockMovement =
  mongoose.models.StockMovement ||
  mongoose.model("StockMovement", stockMovementSchema);

export default StockMovement;
