import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs"; // Used to compare hashed passwords
import jwt from "jsonwebtoken"; // Used to generate access tokens

export async function POST(request) {
  try {
    // 1. Parse the incoming JSON data from the request body
    const body = await request.json();
    const { email, password } = body;

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
    const user = await User.findOne({ email });
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

    // 6. Generate a JWT Token
    const tokenData = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(
      tokenData,
      process.env.JWT_SECRET || "your_jwt_secret_key",
      {
        expiresIn: "1d", // Token valid for 1 day
      },
    );

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
      maxAge: 60 * 60 * 24, // 1 day in seconds
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
