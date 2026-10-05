import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const exclusiveProductSchema = new Schema(
  {
    productId: {
      type: Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

exclusiveProductSchema.index({ productId: 1 }, { unique: true });
exclusiveProductSchema.index({ isActive: 1, displayOrder: 1, createdAt: -1 });

export default mongoose.models.ExclusiveProduct ||
  mongoose.model("ExclusiveProduct", exclusiveProductSchema);
