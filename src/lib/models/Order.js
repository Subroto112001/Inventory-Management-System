import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const ORDER_TYPES = ["Take Away", "Home Delivery"];
const PAYMENT_METHODS = ["Cash", "Mobile Banking", "Card"];
const DELIVERY_PAYMENT_TYPES = ["COD", "Pre-paid", "N/A"];
const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const orderItemSchema = new Schema({
  product: {
    type: Types.ObjectId,
    ref: "Product",
    required: [true, "Product reference is required"],
  },
  name: {
    type: String,
    required: [true, "Product name is required for historical record"],
  },
  sku: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: [true, "Price at the time of order is required"],
    min: [0, "Price cannot be negative"],
  },
});

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: [true, "Order number is required"],
      uppercase: true,
      trim: true,
    },

    // --- Customer Information ---
    customer: {
      name: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        match: [
          /^(?:\+88|88)?(01[3-9]\d{8})$/,
          "Please provide a valid Bangladeshi phone number",
        ],
      },
      address: {
        type: String,
        trim: true,
        maxlength: [500, "Address cannot exceed 500 characters"],
      },
    },

    // --- Order Details ---
    items: [orderItemSchema],
    orderType: {
      type: String,
      enum: {
        values: ORDER_TYPES,
        message: "{VALUE} is not a valid order type",
      },
      required: true,
      default: "Take Away",
    },
    status: {
      type: String,
      enum: {
        values: ORDER_STATUSES,
        message: "{VALUE} is not a valid order status",
      },
      default: "Pending",
    },

    // --- Payment & Financials ---
    financials: {
      subtotal: { type: Number, required: true, min: 0 },
      tax: { type: Number, required: true, min: 0 },
      deliveryCharge: { type: Number, default: 0, min: 0 },
      grandTotal: { type: Number, required: true, min: 0 },
    },

    payment: {
      method: {
        type: String,
        enum: {
          values: PAYMENT_METHODS,
          message: "{VALUE} is not a valid payment method",
        },
        required: true,
      },
      deliveryPaymentType: {
        type: String,
        enum: DELIVERY_PAYMENT_TYPES,
        default: "N/A",
      },
      paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Partial", "Failed"],
        default: "Pending",
      },

      // Gateway Specific Details
      cashDetails: {
        amountReceived: { type: Number, min: 0 },
        changeAmount: { type: Number, min: 0 },
      },
      mobileBankingDetails: {
        provider: { type: String, enum: ["bKash", "Nagad", "Rocket", "Upay"] },
        transactionId: { type: String, trim: true },
      },
      cardDetails: {
        cardType: { type: String, enum: ["Visa", "Mastercard", "Amex"] },
        cardLast4: {
          type: String,
          match: [/^\d{4}$/, "Must be exactly 4 digits"],
        },
      },
    },

    // --- Relations ---
    processedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [
        true,
        "Order must be associated with the user who processed it",
      ],
    },
  },
  { timestamps: true },
);

// ✅ FIX: Synchronous hook without 'next' parameter
orderSchema.pre("validate", function () {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
