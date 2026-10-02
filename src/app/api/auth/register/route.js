import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectMongoDB from "@/lib/databse/mongodb";
import User from "@/lib/models/User";

export async function POST(request) {
  try {
    const body = await request.json();
    const firstName = String(body.firstName || "").trim();
    const lastName = String(body.lastName || "").trim();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");

    if (!firstName || !email || !password) {
      return NextResponse.json(
        { message: "First name, email and password are required" },
        { status: 400 },
      );
    }
    if (
      !/^[a-zA-Z\s]{2,50}$/.test(firstName) ||
      (lastName && !/^[a-zA-Z\s]{2,50}$/.test(lastName))
    ) {
      return NextResponse.json(
        { message: "Please provide a valid name" },
        { status: 400 },
      );
    }
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters with upper, lower and number",
        },
        { status: 400 },
      );
    }

    await connectMongoDB();
    if (await User.exists({ email })) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, 12),
      role: "Customer",
      department: "Customer",
      jobTitle: "Customer",
      accountStatus: "Active",
      isEmailVerified: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: { id: user._id, email: user.email },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          message: Object.values(error.errors)
            .map((item) => item.message)
            .join(", "),
        },
        { status: 400 },
      );
    }
    console.error("Customer registration error:", error);
    return NextResponse.json(
      { message: "Unable to create account" },
      { status: 500 },
    );
  }
}
