import { NextResponse } from "next/server";
import crypto from "crypto";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import User, {
  SYSTEM_ROLES,
  DEPARTMENTS,
  ACCOUNT_STATUSES,
} from "@/lib/models/User";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

export async function POST(request) {
  try {
    // TODO: অ্যাডমিন-অনলি অ্যাক্সেস চেক
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== "System Admin") {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const body = await request.json();
    const {
      name, // ফ্রন্টএন্ড formData.name পাঠায়, fullName না
      email,
      role,
      department,
      status, // ফ্রন্টএন্ড formData.status পাঠায়, accountStatus না
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

    const tempPassword = generateTempPassword();

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
      password: tempPassword,
      // createdBy: session?.user?.id,
    });

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
        temporaryPassword: tempPassword,
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

function generateTempPassword() {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnpqrstuvwxyz";
  const digits = "23456789";
  const all = upper + lower + digits;

  let password =
    upper[crypto.randomInt(upper.length)] +
    lower[crypto.randomInt(lower.length)] +
    digits[crypto.randomInt(digits.length)];

  for (let i = 0; i < 7; i++) {
    password += all[crypto.randomInt(all.length)];
  }

  return password
    .split("")
    .sort(() => crypto.randomInt(3) - 1)
    .join("");
}

export async function GET() {
  try {
    await connectMongoDB();
    const users = await User.find().sort({ createdAt: -1 }).lean();

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