import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const supplierSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    companyName: { type: String, trim: true, maxlength: 150 },
    email: { type: String, trim: true, lowercase: true, maxlength: 150 },
    phone: { type: String, trim: true, required: true, maxlength: 30 },
    address: { type: String, trim: true, maxlength: 250 },
    city: { type: String, trim: true, maxlength: 80 },
    country: { type: String, trim: true, default: "Bangladesh", maxlength: 80 },
    contactPerson: { type: String, trim: true, maxlength: 100 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    notes: { type: String, trim: true, maxlength: 500 },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

supplierSchema.index({ name: 1 });
supplierSchema.index({ status: 1 });

export default mongoose.models.Supplier ||
  mongoose.model("Supplier", supplierSchema);
