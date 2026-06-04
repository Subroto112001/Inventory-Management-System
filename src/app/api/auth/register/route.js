import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import User from "@/lib/models/User";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    // Parse the incoming JSON data from the request body
    const body = await request.json();
    const { firstName, lastName, email, phoneNumber, password } = body;

    // Check necessary fields
    if (!firstName || !email || !password) {
      return NextResponse.json(
        { message: "First name, email, and password are required!" },
        { status: 400 },
      );
    }

    // connect to MongoDB
    await connectMongoDB();

    // check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "A user with this email already exists!" },
        { status: 409 },
      );
    }

    // Assign a default role (you can modify this logic to assign roles based on your requirements)
    const defaultRoleId = new mongoose.Types.ObjectId();

    // Save the new user information to the database
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      role: [defaultRoleId],
    });
    console.log("New user created:", newUser);
    // After successful registration, you might want to return the created user data (excluding sensitive info) or just a success message
    return NextResponse.json(
      {
        message: "User registered successfully!",
        success: true,
        userName: newUser.firstName,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration API Error:", error);

    // Validation error handling
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return NextResponse.json(
        { message: messages.join(", ") },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
