import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import User from "@/lib/models/User";
import { hashSecret } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, setupToken, password } = await request.json();
    if (!email || !setupToken || !password) {
      return NextResponse.json(
        { message: "Email, setup token, and password are required." },
        { status: 400 },
      );
    }
    await connectMongoDB();
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+passwordSetupTokenHash +passwordSetupTokenExpiresAt");
    if (
      !user ||
      user.passwordSetupTokenHash !== hashSecret(setupToken) ||
      !user.passwordSetupTokenExpiresAt ||
      user.passwordSetupTokenExpiresAt < new Date()
    ) {
      return NextResponse.json(
        { message: "This password setup session is invalid or expired." },
        { status: 400 },
      );
    }
    user.password = password;
    user.isEmailVerified = true;
    user.passwordSetupTokenHash = undefined;
    user.passwordSetupTokenExpiresAt = undefined;
    await user.save();
    return NextResponse.json(
      {
        success: true,
        message: "Password set successfully. You can now log in.",
      },
      { status: 200 },
    );
  } catch (error) {
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          message: Object.values(error.errors)
            .map((value) => value.message)
            .join(", "),
        },
        { status: 400 },
      );
    }
    console.error("Password setup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
