import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import User from "@/lib/models/User";
import { sendCustomerVerificationOtp } from "@/lib/mailer";
import { createEmailOtp } from "@/lib/emailOtp";

export async function POST(request) {
  try {
    const body = await request.json();
    const firstName = String(body.firstName || "").trim();
    const lastName = String(body.lastName || "").trim();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");
    const confirmPassword = String(body.confirmPassword || "");

    if (!firstName || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "First name, email and password are required" },
        { status: 400 },
      );
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Please provide a valid email address" }, { status: 400 });
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

    const { otp, hash } = createEmailOtp();
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: "Customer",
      department: "Customer",
      jobTitle: "Customer",
      accountStatus: "Active",
      isEmailVerified: false,
      emailVerificationOtpHash: hash,
      emailVerificationOtpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      emailVerificationOtpAttempts: 0,
    });
    try {
      await sendCustomerVerificationOtp({ email, name: firstName, otp });
      user.emailVerificationOtpLastSentAt = new Date();
      await user.save({ validateBeforeSave: false });
    } catch (mailError) {
      user.emailVerificationOtpHash = undefined;
      user.emailVerificationOtpExpiresAt = undefined;
      user.emailVerificationOtpAttempts = 0;
      await user.save({ validateBeforeSave: false });
      console.error("Customer verification email could not be sent:", mailError?.message);
      return NextResponse.json({ success: true, emailSent: false, message: "Your account was created, but we could not send the verification code. You can request a new code on the verification page." }, { status: 201 });
    }
    return NextResponse.json({ success: true, emailSent: true, message: "Your account has been created. Enter the verification code sent to your email." }, { status: 201 });
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
    if (error.code === 11000) {
      return NextResponse.json({ success: true, message: "If this address can be registered, a verification email will be sent." }, { status: 202 });
    }
    return NextResponse.json(
      { message: "Unable to create account" },
      { status: 500 },
    );
  }
}
