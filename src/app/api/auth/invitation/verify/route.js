import crypto from "crypto";
import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import User from "@/lib/models/User";
import { hashSecret } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, code } = await request.json();
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedCode = code?.toString().trim();
    if (!normalizedEmail || !/^\d{6}$/.test(normalizedCode || "")) {
      return NextResponse.json(
        { message: "Email and a 6 digit code are required." },
        { status: 400 },
      );
    }

    await connectMongoDB();
    const user = await User.findOne({ email: normalizedEmail }).select({
      invitationCodeHash: 1,
      invitationCodeExpiresAt: 1,
      invitationCodeAttempts: 1,
    });
    if (!user || !user.invitationCodeHash) {
      return NextResponse.json(
        { message: "This invitation is invalid or expired." },
        { status: 400 },
      );
    }
    if (user.invitationCodeAttempts >= 5) {
      return NextResponse.json(
        {
          message:
            "Too many incorrect attempts. Ask an administrator to send a new invitation.",
        },
        { status: 429 },
      );
    }
    if (
      !user.invitationCodeExpiresAt ||
      user.invitationCodeExpiresAt < new Date()
    ) {
      return NextResponse.json(
        { message: "This invitation code has expired." },
        { status: 400 },
      );
    }
    if (hashSecret(normalizedCode) !== user.invitationCodeHash) {
      user.invitationCodeAttempts += 1;
      await user.save({ validateBeforeSave: false });
      return NextResponse.json(
        { message: "Incorrect verification code." },
        { status: 400 },
      );
    }

    const setupToken = crypto.randomBytes(32).toString("hex");
    user.passwordSetupTokenHash = hashSecret(setupToken);
    user.passwordSetupTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    user.invitationCodeHash = undefined;
    user.invitationCodeExpiresAt = undefined;
    user.invitationCodeAttempts = 0;
    await user.save({ validateBeforeSave: false });

    return NextResponse.json({ success: true, setupToken }, { status: 200 });
  } catch (error) {
    console.error("Invitation verification error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
