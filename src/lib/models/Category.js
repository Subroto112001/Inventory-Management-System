import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const categorySchema = new Schema(
  {
    // --- Basic Information ---
    categoryName: {
      type: String,
      trim: true,
      required: [true, "Category name is required"],
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },

    categoryCode: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      required: [true, "Category code is required"],
      maxlength: [30, "Category code cannot exceed 30 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    // --- Category Image ---
    image: {
      public_id: {
        type: String,
        default: null,
      },
      url: {
        type: String,
        default: null,
      },
    },

    // --- Products inside this Category ---
    products: [
      {
        type: Types.ObjectId,
        ref: "Product",
      },
    ],

    // --- Created By ---
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
    },

    // --- Status ---
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
