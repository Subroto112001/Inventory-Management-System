import { NextResponse } from "next/server";
import crypto from "crypto";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import User, {
  SYSTEM_ROLES,
  DEPARTMENTS,
  ACCOUNT_STATUSES,
} from "@/lib/models/User";
import { hashSecret, requireAuth } from "@/lib/auth";
import { sendInvitationCode } from "@/lib/mailer";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

export async function POST(request) {
  try {
    const authenticatedUser = await requireAuth(request);
    if (!authenticatedUser || authenticatedUser.role !== "System Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    
    const {
      name,
      email,
      role,
      department,
      status,
      phoneNumber,
      assignedWarehouse,
      jobTitle,
    } = body;

    if (!name || !email || !role || !department) {
      return NextResponse.json(
        { message: "Full name, email, role, and department are required!" },
        { status: 400 },
      );
    }

    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    if (!SYSTEM_ROLES.includes(role)) {
      return NextResponse.json(
        { message: `Invalid role. Must be one of: ${SYSTEM_ROLES.join(", ")}` },
        { status: 400 },
      );
    }
    if (!DEPARTMENTS.includes(department)) {
      return NextResponse.json(
        {
          message: `Invalid department. Must be one of: ${DEPARTMENTS.join(", ")}`,
        },
        { status: 400 },
      );
    }
    if (status && !ACCOUNT_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          message: `Invalid account status. Must be one of: ${ACCOUNT_STATUSES.join(", ")}`,
        },
        { status: 400 },
      );
    }
    if (phoneNumber && !/^(?:\+88|88)?(01[3-9]\d{8})$/.test(phoneNumber)) {
      return NextResponse.json(
        { message: "Please provide a valid Bangladeshi phone number" },
        { status: 400 },
      );
    }
    if (assignedWarehouse && !mongoose.isValidObjectId(assignedWarehouse)) {
      return NextResponse.json(
        { message: "Invalid warehouse selected" },
        { status: 400 },
      );
    }

    await connectMongoDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: "A user with this email already exists!" },
        { status: 409 },
      );
    }

    const verificationCode = crypto.randomInt(100000, 1000000).toString();

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      role,
      department,
      accountStatus: status || "Active",
      phoneNumber: phoneNumber || undefined,
      assignedWarehouse: assignedWarehouse || undefined,
      jobTitle: jobTitle || undefined,
      password: `Aa1${crypto.randomBytes(32).toString("hex")}`,
      invitationCodeHash: hashSecret(verificationCode),
      invitationCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      invitationCodeAttempts: 0,
      // createdBy: session?.user?.id,
    });

    try {
      await sendInvitationCode({
        email: newUser.email,
        name: `${newUser.firstName} ${newUser.lastName || ""}`.trim(),
        code: verificationCode,
      });
    } catch (mailError) {
      await User.findByIdAndDelete(newUser._id);
      throw mailError;
    }

    console.log("New user created by admin:", newUser.email);

    return NextResponse.json(
      {
        message: "User created successfully!",
        success: true,
        user: {
          id: newUser._id.toString(),
          name: `${newUser.firstName} ${newUser.lastName || ""}`.trim(),
          email: newUser.email,
          role: newUser.role,
          department: newUser.department,
          status: newUser.accountStatus,
          phoneNumber: newUser.phoneNumber || "",
          assignedWarehouse: newUser.assignedWarehouse?.toString() || "",
          jobTitle: newUser.jobTitle || "",
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Add User API Error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return NextResponse.json(
        { message: messages.join(", ") },
        { status: 400 },
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { message: "A user with this email already exists!" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
 
  try {
    const authenticatedUser = await requireAuth(request);

    if (!authenticatedUser || authenticatedUser.role !== "System Admin") {
      return NextResponse.json({ message: "You are unauthorized to access this resource" }, { status: 403 });
    }
    await connectMongoDB();
    const users = await User.find().sort({ createdAt: -1 }).lean();

    console.log("Fetched users:", users);

    const result = users.map((user) => ({
      id: user._id.toString(),
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      email: user.email || "",
      role: typeof user.role === "string" ? user.role : "Inventory Clerk",
      department: user.department || "",
      status: user.accountStatus || "Active",
      phoneNumber: user.phoneNumber || "",
      jobTitle: user.jobTitle || "",
      assignedWarehouse: user.assignedWarehouse
        ? user.assignedWarehouse.toString()
        : "",
      assignedWarehouseName: "",
    }));
    console.log("Fetched users:", result);

    return NextResponse.json({ success: true, users: result }, { status: 200 });
  } catch (error) {
    console.error("Fetch Users API Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}
