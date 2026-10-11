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
      required: [true, "Product SKU is required"],
      uppercase: true,
    },
    brand: {
      type: Types.ObjectId,
      ref: "Brand",
      default: null,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [20000, "Description cannot exceed 20000 characters"],
    },
    specifications: {
      // New products store sanitized rich text here; legacy products may still
      // contain the original array of { name, value } records.
      type: Schema.Types.Mixed,
      default: [],
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

    discountOffer: { type: Types.ObjectId, ref: "Offer", default: null },

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
    category: {
      type: Types.ObjectId,
      ref: "Category",
      default: null,
    },
    subcategory: {
      type: Types.ObjectId,
      ref: "Subcategory",
      default: null,
    },
    // --- Media ---
    image: {
      public_id: { type: String },
      url: String,
    },
    images: {
      type: [{ public_id: String, url: { type: String, trim: true } }],
      default: [],
      validate: [(items) => items.length <= 4, "A product can have at most four images"],
    },
    shipping: {
      charge: { type: Number, min: 0 },
      deliveryEstimate: { type: String, trim: true, maxlength: 100 },
      freeShipping: { type: Boolean, default: false },
      instructions: { type: String, trim: true, maxlength: 500 },
    },
    paymentOption: {
      type: String,
      enum: ["COD_ONLY", "ONLINE_ONLY", "BOTH"],
      default: "COD_ONLY",
    },
    returnPolicy: {
      eligible: { type: Boolean },
      windowDays: { type: Number, min: 0, max: 365 },
      conditions: { type: String, trim: true, maxlength: 500 },
      instructions: { type: String, trim: true, maxlength: 1000 },
    },

    // --- Relations & Status ---
    createdBy: { type: Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Ignore legacy records where the field is absent while enforcing uniqueness
// for every actual SKU string.
productSchema.index(
  { productSKU: 1 },
  {
    name: "productSKU_unique_string",
    unique: true,
    partialFilterExpression: { productSKU: { $type: "string" } },
  },
);
productSchema.index({ category: 1, subcategory: 1, isActive: 1 });

// During development Mongoose keeps models across Next.js module reloads. If
// Product was first compiled before subcategory was added, the module source
// can be current while the cached model still rejects populate("subcategory").
// Recompile only that stale model; normal startup and current models are reused.
const cachedProductModel = mongoose.models.Product;
if (cachedProductModel && cachedProductModel.schema.path("subcategory")?.options?.ref !== "Subcategory") {
  mongoose.deleteModel("Product");
}

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
