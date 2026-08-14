import mongoose from "mongoose";

const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true, // allows multiple documents without email
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        "Please provide a valid email address",
      ],
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      match: [
        /^(?:\+88|88)?(01[3-9]\d{8})$/,
        "Please provide a valid Bangladeshi phone number",
      ],
    },

    address: {
      type: String,
      trim: true,
      maxlength: 250,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Customer || mongoose.model("Customer", customerSchema);
