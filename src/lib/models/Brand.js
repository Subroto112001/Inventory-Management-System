
import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const BRAND_STATUSES = ["Active", "Inactive"];

const brandSchema = new Schema(
  {
    // --- Basic Information ---
    brandName: {
      type: String,
      trim: true,
      required: [true, "Brand name is required"],
      minlength: [2, "Brand name must be at least 2 characters long"],
      maxlength: [100, "Brand name cannot exceed 100 characters"],
    },

    brandCode: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true,
      maxlength: [30, "Brand code cannot exceed 30 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Brand description cannot exceed 1000 characters"],
    },

    // --- Brand Logo ---
    logo: {
      public_id: {
        type: String,
        trim: true,
      },
      url: {
        type: String,
        trim: true,
        match: [/^https?:\/\/.+/, "Please provide a valid logo URL"],
      },
    },

    // --- Contact Information ---
    contactPerson: {
      type: String,
      trim: true,
      maxlength: [100, "Contact person cannot exceed 100 characters"],
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    phoneNumber: {
      type: String,
      trim: true,
      match: [
        /^(?:\+88|88)?(01[3-9]\d{8})$/,
        "Please provide a valid Bangladeshi phone number",
      ],
    },

    website: {
      type: String,
      trim: true,
      match: [
        /^https?:\/\/.+/,
        "Please provide a valid website URL",
      ],
    },

    // --- Address ---
    address: {
      type: String,
      trim: true,
      maxlength: [250, "Address cannot exceed 250 characters"],
    },

    district: {
      type: String,
      trim: true,
      maxlength: [100, "District cannot exceed 100 characters"],
    },

    country: {
      type: String,
      trim: true,
      default: "Bangladesh",
      maxlength: [100, "Country cannot exceed 100 characters"],
    },

    // --- Brand Status ---
    status: {
      type: String,
      enum: {
        values: BRAND_STATUSES,
        message: "{VALUE} is not a valid brand status",
      },
      default: "Active",
    },

    // --- Relations ---
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Brand must be associated with the user who created it"],
    },

    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// --- Indexes ---
brandSchema.index({ brandName: 1 });
brandSchema.index({ status: 1 });
brandSchema.index({ createdBy: 1 });

// --- Virtual: Product Count ---
// Product model should contain:
// brand: { type: Types.ObjectId, ref: "Brand" }
brandSchema.virtual("productCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "brand",
  count: true,
});

brandSchema.set("toJSON", {
  virtuals: true,
});

brandSchema.set("toObject", {
  virtuals: true,
});

// Export enum so API/controllers/frontend validation can reuse it
export { BRAND_STATUSES };

const Brand =
  mongoose.models.Brand ||
  mongoose.model("Brand", brandSchema);

export default Brand;

