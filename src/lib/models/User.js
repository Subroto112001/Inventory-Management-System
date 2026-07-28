import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { Schema, Types } = mongoose;

const SYSTEM_ROLES = [
  "System Admin",
  "Warehouse Manager",
  "Inventory Clerk",
  "Auditor",
  "Forklift Operator",
];

const DEPARTMENTS = ["IT", "Logistics", "Operations", "Finance", "HR"];

const ACCOUNT_STATUSES = ["Active", "Offline", "Suspended"];

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "First name is required"],
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [50, "First name cannot exceed 50 characters"],
      match: [
        /^[a-zA-Z\s]+$/,
        "First name can only contain letters and spaces",
      ],
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
      match: [/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      // পাসওয়ার্ড কমপক্ষে ৮ ক্যারেক্টার, ১টি বড় হাতের অক্ষর, ১টি ছোট হাতের অক্ষর এবং ১টি সংখ্যা হতে হবে
      match: [
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, and one number",
      ],
    },
    image: {
      public_id: { type: String },
      url: {
        type: String,
        match: [/^https?:\/\/.+/, "Please provide a valid image URL"],
      },
    },

    // --- Inventory Management Specific Fields ---
    // UI-এর "System Role" dropdown এর সাথে মিল রেখে single enum করা হলো
    role: {
      type: String,
      enum: {
        values: SYSTEM_ROLES,
        message: "{VALUE} is not a valid system role",
      },
      required: [true, "System role is required"],
      default: "Inventory Clerk",
    },

    // নতুন ফিল্ড — UI-এর "Department" dropdown
    department: {
      type: String,
      enum: {
        values: DEPARTMENTS,
        message: "{VALUE} is not a valid department",
      },
      required: [true, "Department is required"],
    },

    assignedWarehouse: {
      type: Types.ObjectId,
      ref: "Warehouse",
    },
    jobTitle: {
      type: String,
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"],
    },
    managedCategories: [
      {
        type: Types.ObjectId,
        ref: "Category",
      },
    ],

    // --- Location & Contact ---
    phoneNumber: {
      type: String,
      // বাংলাদেশের ফোন নাম্বার ফরম্যাট ভ্যালিডেশন (+880 বা 01 দিয়ে শুরু)
      match: [
        /^(?:\+88|88)?(01[3-9]\d{8})$/,
        "Please provide a valid Bangladeshi phone number",
      ],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [250, "Address cannot exceed 250 characters"],
    },
    district: { type: String, trim: true },
    country: { type: String, default: "Bangladesh" },

    // --- System Status ---
    // UI-এর "Account Status" dropdown এর সাথে মিল রেখে isActive/isBlocked
    // এর বদলে single enum ব্যবহার করা হলো
    accountStatus: {
      type: String,
      enum: {
        values: ACCOUNT_STATUSES,
        message: "{VALUE} is not a valid account status",
      },
      default: "Active",
    },
    isEmailVerified: { type: Boolean, default: false },
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

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const SALT_ROUNDS = 12;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

userSchema.methods.compareHashPassword = async function (humanPass) {
  return await bcrypt.compare(humanPass, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      userid: this._id,
      email: this.email,
      role: this.role,
      department: this.department,
      warehouseId: this.assignedWarehouse,
    },
    process.env.ACCESTOKEN_SECRET.trim(),
    { expiresIn: process.env.ACCESTOKEN_EXPIRE.trim() },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { userid: this._id },
    process.env.REFRESHTOKEN_SECRET.trim(),
    { expiresIn: process.env.REFRESHTOKEN_EXPIRE.trim() },
  );
};

// Export enums so controllers/frontend validation can reuse the same source of truth
export { SYSTEM_ROLES, DEPARTMENTS, ACCOUNT_STATUSES };

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
