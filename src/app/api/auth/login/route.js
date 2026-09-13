import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs"; // Used to compare hashed passwords
import { signAccessToken } from "@/lib/auth";

export async function POST(request) {
  try {
    // 1. Parse request body
    const body = await request.json();
    const { email, password, rememberMe = false } = body;

    // 2. Validate fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required!",
        },
        { status: 400 },
      );
    }

    // 3. Connect MongoDB
    await connectMongoDB();

    // 4. Find user
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password!",
        },
        { status: 401 },
      );
    }

    // 5. Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password!",
        },
        { status: 401 },
      );
    }

    // 6. Check account status
    if (user.accountStatus !== "Active") {
      return NextResponse.json(
        {
          success: false,
          message: "This account is not active.",
        },
        { status: 403 },
      );
    }

    // 7. Create token
    const token = signAccessToken(user, rememberMe ? "30d" : "1d");

    user.lastLogin = new Date();

    await user.save({
      validateBeforeSave: false,
    });

    // 8. Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful!",
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    );

    // 9. Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    // 🔴 Show actual error in terminal
    console.error("=================================");
    console.error("LOGIN API ERROR");
    console.error("Message:", error?.message);
    console.error("Stack:", error?.stack);
    console.error("=================================");

    // 🔴 Send error to frontend during development
    return NextResponse.json(
      {
        success: false,
        message:
          process.env.NODE_ENV === "development"
            ? error?.message || "Unknown error"
            : "Internal server error",
      },
      { status: 500 },
    );
  }
}