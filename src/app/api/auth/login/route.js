import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs"; // Used to compare hashed passwords
import { signAccessToken } from "@/lib/auth";

export async function POST(request) {
  try {
    // 1. Parse the incoming JSON data from the request body
    const body = await request.json();
    const { email, password, rememberMe = false } = body;

    // 2. Check necessary fields
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required!" },
        { status: 400 },
      );
    }

    // 3. Connect to MongoDB
    await connectMongoDB();

    // 4. Check if the user exists
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password!" }, // Vague message for security reasons
        { status: 401 },
      );
    }

    // 5. Verify the password
    // NOTE: This assumes you are hashing passwords using bcrypt in your User model middleware (pre-save)
    // If you are storing plain text passwords (not recommended), use: const isPasswordValid = password === user.password;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password!" },
        { status: 401 },
      );
    }

    if (user.accountStatus !== "Active") {
      return NextResponse.json(
        { message: "This account is not active." },
        { status: 403 },
      );
    }

    const token = signAccessToken(user, rememberMe ? "30d" : "1d");
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // 7. Create response and set JWT as an HTTP-only cookie
    const response = NextResponse.json(
      {
        message: "Login successful!",
        success: true,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    );

    // Set the cookie securely
    response.cookies.set("token", token, {
      httpOnly: true, // Prevents client-side scripts from accessing the cookie (XSS protection)
      secure: process.env.NODE_ENV === "production", // Ensures cookie is sent over HTTPS only in production
      sameSite: "strict", // Protects against CSRF attacks
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
