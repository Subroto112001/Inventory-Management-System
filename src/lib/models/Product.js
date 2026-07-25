import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Product name is required"],
      minlength: [2, "Product name must be at least 2 characters long"],
      maxlength: [150, "Product name cannot exceed 150 characters"],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      // Only lowercase letters, numbers, and hyphens allowed (SEO friendly URL)
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug can only contain lowercase letters, numbers, and hyphens",
      ],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "SKU is required"],
      uppercase: true,
      // SKU format: 3-6 alphanumeric characters, optionally hyphen-separated segments
      match: [
        /^[A-Z0-9]{3,6}(-[A-Z0-9]{2,10})*$/,
        "Please provide a valid SKU format",
      ],
    },
    barcode: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    image: [
      {
        public_id: { type: String },
        url: {
          type: String,
          match: [/^https?:\/\/.+/, "Please provide a valid image URL"],
        },
      },
    ],

    // --- Classification ---
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    brand: {
      type: String,
      trim: true,
      maxlength: [100, "Brand name cannot exceed 100 characters"],
    },
    unit: {
      type: String,
      trim: true,
      enum: {
        values: ["pcs", "kg", "gm", "liter", "ml", "box", "pack", "dozen"],
        message: "{VALUE} is not a supported unit",
      },
      default: "pcs",
    },

    // --- Pricing ---
    costPrice: {
      type: Number,
      required: [true, "Cost price is required"],
      min: [0, "Cost price cannot be negative"],
    },
    sellingPrice: {
      type: Number,
      required: [true, "Selling price is required"],
      min: [0, "Selling price cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    // VAT/tax percentage (Bangladesh standard)
    vat: {
      type: Number,
      default: 0,
      min: [0, "VAT cannot be negative"],
      max: [100, "VAT cannot exceed 100%"],
    },

    // --- Inventory / Stock ---
    warehouse: {
      type: Types.ObjectId,
      ref: "Warehouse",
      required: [true, "Warehouse is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, "Low stock threshold cannot be negative"],
    },
    supplier: {
      type: Types.ObjectId,
      ref: "Supplier",
    },

    // --- System Status ---
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    createdBy: { type: Types.ObjectId, ref: "User" },
    updatedBy: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

// --- Middleware & Methods ---

// Auto-generate slug from product name (only if slug isn't already provided)
productSchema.pre("save", function () {
  if (!this.isModified("name") || this.slug) {
    return;
  }
  this.slug = this.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
});

productSchema.methods.isLowStock = function () {
  return this.quantity <= this.lowStockThreshold;
};

productSchema.methods.getProfitMargin = function () {
  if (!this.costPrice) return 0;
  return ((this.sellingPrice - this.costPrice) / this.costPrice) * 100;
};

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
