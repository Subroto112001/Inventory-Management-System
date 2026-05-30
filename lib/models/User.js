require("dotenv").config();
const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    image: {
      public_id: { type: String },
      url: { type: String },
    },

    // --- Inventory Management Specific Fields ---
    role: [
      {
        type: Types.ObjectId,
        ref: "Role", // e.g., SuperAdmin, StoreManager, InventoryClerk, Cashier
      },
    ],
    assignedWarehouse: {
      type: Types.ObjectId,
      ref: "Warehouse", // (or "Store") Ties the user to a specific physical location
    },
    jobTitle: {
      type: String,
      trim: true, // e.g., "Warehouse Supervisor", "Procurement Officer"
    },
    managedCategories: [
      {
        type: Types.ObjectId,
        ref: "Category", // Optional: If a clerk is only responsible for specific product categories (e.g., Electronics)
      },
    ],

    // --- Location & Contact ---
    phoneNumber: { type: String },
    address: { type: String, trim: true },
    district: { type: String, trim: true },
    country: { type: String, default: "Bangladesh" },

    // --- System Status ---
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    lastLogin: { type: Date },
    refreshToken: { type: String },
    createdBy: { type: Types.ObjectId, ref: "User" },

    // Track refresh token family for rotation security
    tokenFamily: { type: String },
    // Session tracking for absolute timeout
    sessionCreatedAt: { type: Date },
  },
  { timestamps: true },
);

// --- Middleware & Methods ---

// Hash password with stronger salt rounds (12)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const SALT_ROUNDS = 12;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

// Compare Password
userSchema.methods.compareHashPassword = async function (humanPass) {
  return await bcrypt.compare(humanPass, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      userid: this._id,
      email: this.email,
      role: this.role,
      warehouseId: this.assignedWarehouse, // Useful to have in the token for quick database queries
    },
    process.env.ACCESTOKEN_SECRET.trim(),
    { expiresIn: process.env.ACCESTOKEN_EXPIRE.trim() },
  );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { userid: this._id },
    process.env.REFRESHTOKEN_SECRET.trim(),
    { expiresIn: process.env.REFRESHTOKEN_EXPIRE.trim() },
  );
};

module.exports = mongoose.model("User", userSchema);
