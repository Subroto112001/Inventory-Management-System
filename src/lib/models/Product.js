import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const productSchema = new Schema(
  {
    productName: {
      type: String,
      trim: true,
      required: [true, "Product name is required"],
      maxlength: [150, "Product name cannot exceed 150 characters"],
    },
    productSKU: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Product SKU is required"],
      uppercase: true,
    },
    brandName: {
      type: String,
      trim: true,
      maxlength: [100, "Brand name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    unit: {
      type: String,
      trim: true, // e.g. "pcs", "kg", "box"
    },

    // --- Pricing ---
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    wholesalePrice: {
      type: Number,
      min: [0, "Wholesale price cannot be negative"],
    },
    discount: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
      default: 0,
    },

    // --- Stock / Inventory ---
    quantity: {
      type: Number,
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    initialStock: {
      type: Number,
      min: [0, "Initial stock cannot be negative"],
      default: 0,
    },
    currentStock: {
      type: Number,
      min: [0, "Current stock cannot be negative"],
      default: 0,
    },
    lowStockAlert: {
      type: Number,
      min: [0, "Low stock alert cannot be negative"],
      default: 0,
    },

    // --- Media ---
    image: {
      public_id: { type: String },
      url: {
        type: String,
        match: [/^https?:\/\/.+/, "Please provide a valid image URL"],
      },
    },

    // --- Relations & Status ---
    createdBy: { type: Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
