import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import User from "@/lib/models/User";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    // ১. ফ্রন্টএন্ড থেকে আসা ডাটা রিসিভ করা
    const body = await request.json();
    const { firstName, lastName, email, phoneNumber, password } = body;

    // ২. প্রয়োজনীয় ফিল্ডগুলো চেক করা
    if (!firstName || !email || !password) {
      return NextResponse.json(
        { message: "First name, email, and password are required!" },
        { status: 400 },
      );
    }

    // ৩. ডাটাবেসের সাথে কানেক্ট করা
    await connectMongoDB();

    // ৪. ইমেইলটি আগে থেকে আছে কি না চেক করা
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "A user with this email already exists!" },
        { status: 409 },
      );
    }

    // ৫. Role ফিল্ডের বাধ্যবাধকতা মেটানোর জন্য একটি ডামি/ডিফল্ট ObjectId তৈরি করা
    // (পরবর্তীতে আপনি ডাটাবেস থেকে 'Manager' বা 'User' রোলের আসল আইডি এখানে দিবেন)
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

    // মঙ্গুজ ভ্যালিডেশন এররগুলো ফ্রন্টএন্ডে পাঠানোর জন্য
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
