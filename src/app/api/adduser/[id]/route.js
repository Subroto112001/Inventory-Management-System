import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import User, {
  SYSTEM_ROLES,
  DEPARTMENTS,
  ACCOUNT_STATUSES,
} from "@/lib/models/User";

export async function PUT(request, { params }) {
  try {
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
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
          message: `Invalid status. Must be one of: ${ACCOUNT_STATUSES.join(", ")}`,
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

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ইমেইল পরিবর্তন হলে, অন্য কোনো ইউজারের সাথে duplicate কিনা চেক
    const normalizedEmail = email.toLowerCase();
    if (normalizedEmail !== existingUser.email) {
      const emailTaken = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
      });
      if (emailTaken) {
        return NextResponse.json(
          { message: "A user with this email already exists!" },
          { status: 409 },
        );
      }
    }

    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    existingUser.firstName = firstName;
    existingUser.lastName = lastName;
    existingUser.email = normalizedEmail;
    existingUser.role = role;
    existingUser.department = department;
    existingUser.accountStatus = status || existingUser.accountStatus;
    existingUser.phoneNumber = phoneNumber || undefined;
    existingUser.jobTitle = jobTitle || undefined;
    existingUser.assignedWarehouse = assignedWarehouse || undefined;

    await existingUser.save();

    return NextResponse.json(
      {
        message: "User updated successfully!",
        success: true,
        user: {
          id: existingUser._id.toString(),
          name: `${existingUser.firstName} ${existingUser.lastName || ""}`.trim(),
          email: existingUser.email,
          role: existingUser.role,
          department: existingUser.department,
          status: existingUser.accountStatus,
          phoneNumber: existingUser.phoneNumber || "",
          jobTitle: existingUser.jobTitle || "",
          assignedWarehouse: existingUser.assignedWarehouse?.toString() || "",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update User API Error:", error);
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

export async function DELETE(request, { params }) {
  try {
    const { id } = await params; 

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
    }

    await connectMongoDB();

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully!", success: true },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete User API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
