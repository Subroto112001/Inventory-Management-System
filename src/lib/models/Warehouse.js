import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const warehouseSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Warehouse name is required"],
      minlength: [3, "Warehouse name must be at least 3 characters long"],
      maxlength: [100, "Warehouse name cannot exceed 100 characters"],
    },
    warehouseCode: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Warehouse code is required"],
      uppercase: true,
      maxlength: [20, "Warehouse code cannot exceed 20 characters"],
    },

    // --- Location Details ---
    location: {
      address: {
        type: String,
        trim: true,
        required: [true, "Warehouse address is required"],
        maxlength: [250, "Address cannot exceed 250 characters"],
      },
      district: {
        type: String,
        trim: true,
        required: [true, "District is required"],
      },
      country: {
        type: String,
        default: "Bangladesh",
      },
    },

    // --- Contact & Operations ---
    contactNumber: {
      type: String,
      // Using the standard Bangladeshi phone validation from your system
      match: [
        /^(?:\+88|88)?(01[3-9]\d{8})$/,
        "Please provide a valid Bangladeshi phone number",
      ],
    },
    capacity: {
      type: Number,
      min: [0, "Capacity cannot be negative"],
      description: "Total storage capacity in square feet or units",
    },

    // --- Relations & Status ---
    manager: {
      type: Types.ObjectId,
      ref: "User",
      description: "User ID of the Warehouse Manager",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [
        true,
        "Warehouse must be associated with the user who created it",
      ],
    },
  },
  { timestamps: true }, // Automatically adds createdAt and updatedAt
);

// --- Indexes ---
// Index for faster geospatial or location-based querying if needed in the future
warehouseSchema.index({ "location.district": 1 });
warehouseSchema.index({ isActive: 1 });

const Warehouse =
  mongoose.models.Warehouse || mongoose.model("Warehouse", warehouseSchema);

export default Warehouse;
