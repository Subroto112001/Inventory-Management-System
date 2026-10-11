import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const subcategorySchema = new Schema(
  {
    subcategoryName: {
      type: String,
      trim: true,
      required: [true, "Subcategory name is required"],
      maxlength: [100, "Subcategory name cannot exceed 100 characters"],
    },
    subcategoryCode: {
      type: String,
      trim: true,
      uppercase: true,
      required: [true, "Subcategory code is required"],
      maxlength: [30, "Subcategory code cannot exceed 30 characters"],
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "A subcategory must belong to a Category"],
      index: true,
    },
    description: { type: String, trim: true, maxlength: [500, "Description cannot exceed 500 characters"] },
    image: {
      public_id: { type: String, default: null },
      url: { type: String, default: null },
    },
    products: [{ type: Types.ObjectId, ref: "Product" }],
    createdBy: { type: Types.ObjectId, ref: "User", default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

subcategorySchema.index({ category: 1, subcategoryName: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });
subcategorySchema.index({ subcategoryCode: 1 }, { unique: true });

const Subcategory = mongoose.models.Subcategory || mongoose.model("Subcategory", subcategorySchema);

export default Subcategory;
