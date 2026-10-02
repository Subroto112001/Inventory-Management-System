import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const invoiceItemSchema = new Schema({
  product: { type: Types.ObjectId, ref: "Product" },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
});

const invoiceSchema = new Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
    },
    order: { type: Types.ObjectId, ref: "Order", unique: true, required: true },
    orderNumber: { type: String, required: true },
    customerUser: { type: Types.ObjectId, ref: "User" },
    customer: {
      name: String,
      phone: String,
      address: String,
    },
    items: { type: [invoiceItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, required: true, min: 0, max: 100 },
    deliveryCharge: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentStatus: String,
    storeName: String,
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.models.Invoice ||
  mongoose.model("Invoice", invoiceSchema);
