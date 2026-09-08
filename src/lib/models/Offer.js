import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const DISCOUNT_TYPES = ["Percentage", "Flat"];
const APPLY_TO_TYPES = ["All Products", "Specific Products"];

const offerSchema = new Schema(
  {
    offerName: {
      type: String,
      trim: true,
      required: [true, "Offer name is required"],
      minlength: [3, "Offer name must be at least 3 characters long"],
      maxlength: [150, "Offer name cannot exceed 150 characters"],
    },
    offerCode: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true, // allows multiple offers without a code
      maxlength: [30, "Offer code cannot exceed 30 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    // --- Discount Rules ---
    discountType: {
      type: String,
      enum: {
        values: DISCOUNT_TYPES,
        message: "{VALUE} is not a valid discount type",
      },
      required: [true, "Discount type is required"],
      default: "Percentage",
    },
    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [0, "Discount value cannot be negative"],
      validate: {
        validator: function (value) {
          // Percentage discounts cannot exceed 100%
          if (this.discountType === "Percentage") {
            return value <= 100;
          }
          return true;
        },
        message: "Percentage discount cannot exceed 100%",
      },
    },
    maxDiscountAmount: {
      type: Number,
      min: [0, "Max discount amount cannot be negative"],
      // Caps the discount when discountType is "Percentage" (e.g. 20% off, capped at ৳500)
    },

    // --- Applicability ---
    applyTo: {
      type: String,
      enum: {
        values: APPLY_TO_TYPES,
        message: "{VALUE} is not a valid apply-to option",
      },
      required: [true, "Apply-to option is required"],
      default: "All Products",
    },
    products: [
      {
        type: Types.ObjectId,
        ref: "Product",
      },
    ],
    minPurchase: {
      type: Number,
      min: [0, "Minimum purchase cannot be negative"],
      default: 0,
    },

    // --- Usage Limits & Tracking ---
    usageLimit: {
      type: Number,
      min: [1, "Usage limit must be at least 1"],
      // leave unset/null for unlimited usage
    },
    usageCount: {
      type: Number,
      min: [0, "Usage count cannot be negative"],
      default: 0,
    },
    perCustomerLimit: {
      type: Number,
      min: [1, "Per-customer limit must be at least 1"],
      default: 1,
    },

    // --- Schedule & Status ---
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (value) {
          return !this.startDate || value >= this.startDate;
        },
        message: "End date cannot be before the start date",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // --- Relations ---
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Offer must be associated with the user who created it"],
    },
  },
  { timestamps: true },
);

// --- Indexes ---
offerSchema.index({ startDate: 1, endDate: 1 });
offerSchema.index({ isActive: 1 });

// --- Validation ---
offerSchema.pre("validate", function () {
  // Specific-product offers must reference at least one product
  if (this.applyTo === "Specific Products" && this.products.length === 0) {
    this.invalidate(
      "products",
      "At least one product must be selected for a Specific Products offer",
    );
  }
});

// --- Virtuals ---
// Computed lifecycle status, mirrors the frontend's getOfferStatus() logic
offerSchema.virtual("status").get(function () {
  if (!this.isActive) return "Disabled";

  const now = new Date();
  if (now < this.startDate) return "Scheduled";
  if (now > this.endDate) return "Expired";
  if (this.usageLimit && this.usageCount >= this.usageLimit) return "Exhausted";

  return "Active";
});

offerSchema.set("toJSON", { virtuals: true });
offerSchema.set("toObject", { virtuals: true });

// --- Methods ---
offerSchema.methods.isRedeemable = function () {
  return this.status === "Active";
};

offerSchema.methods.calculateDiscount = function (amount) {
  if (this.discountType === "Percentage") {
    const raw = (amount * this.discountValue) / 100;
    return this.maxDiscountAmount ? Math.min(raw, this.maxDiscountAmount) : raw;
  }
  return Math.min(this.discountValue, amount);
};

// Export enums so controllers/frontend validation can reuse the same source of truth
export { DISCOUNT_TYPES, APPLY_TO_TYPES };

const Offer = mongoose.models.Offer || mongoose.model("Offer", offerSchema);

export default Offer;
