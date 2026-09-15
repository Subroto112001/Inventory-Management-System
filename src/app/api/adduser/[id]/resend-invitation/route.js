import crypto from "crypto";
import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import User from "@/lib/models/User";
import { hashSecret, requireAuth } from "@/lib/auth";
import { sendInvitationCode } from "@/lib/mailer";

export async function POST(request, { params }) {
  try {
    const authenticatedUser = await requireAuth(request);
    if (!authenticatedUser || authenticatedUser.role !== "System Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    await connectMongoDB();
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "This user has already activated their account." },
        { status: 409 },
      );
    }

    const code = crypto.randomInt(100000, 1000000).toString();
    user.invitationCodeHash = hashSecret(code);
    user.invitationCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    user.invitationCodeAttempts = 0;
    await user.save({ validateBeforeSave: false });

    try {
      await sendInvitationCode({
        email: user.email,
        name: `${user.firstName} ${user.lastName || ""}`.trim(),
        code,
      });
    } catch (mailError) {
      user.invitationCodeHash = undefined;
      user.invitationCodeExpiresAt = undefined;
      await user.save({ validateBeforeSave: false });
      throw mailError;
    }

    return NextResponse.json(
      { success: true, message: "A new invitation code was sent." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Resend invitation API Error:", error);
    return NextResponse.json(
      { message: "Unable to send invitation" },
      { status: 500 },
    );
  }
}
