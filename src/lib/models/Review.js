import mongoose from "mongoose";
const { Schema, Types } = mongoose;
const reviewSchema = new Schema(
  {
    product: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    customer: { type: Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, maxlength: 120, default: "" },
    body: { type: String, trim: true, required: true, maxlength: 2000 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);
reviewSchema.index({ product: 1, customer: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
