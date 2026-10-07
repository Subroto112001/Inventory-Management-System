import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import User from "@/lib/models/User";
import { sendCustomerVerificationOtp } from "@/lib/mailer";
import { createEmailOtp } from "@/lib/emailOtp";
import { checkRateLimit, recordRateLimitFailure } from "@/lib/rateLimit";

const COOLDOWN_MS = 60 * 1000;
const GENERIC_RESPONSE = {
  success: true,
  message: "If your account needs verification, a new code will be sent when available.",
  retryAfter: 60,
};

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rateKey = `resend-verification:${ip}`;
  const limit = checkRateLimit(rateKey, { limit: 5, windowMs: 15 * 60 * 1000 });
  if (!limit.allowed) return NextResponse.json(GENERIC_RESPONSE, { headers: { "Retry-After": String(limit.retryAfter) } });
  recordRateLimitFailure(rateKey, { windowMs: 15 * 60 * 1000 });

  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json(GENERIC_RESPONSE);
    await connectMongoDB();

    const user = await User.findOne({ email, role: "Customer", isEmailVerified: false }).select("firstName email");
    if (!user) return NextResponse.json(GENERIC_RESPONSE);

    const now = new Date();
    const cutoff = new Date(now.getTime() - COOLDOWN_MS);
    const { otp, hash } = createEmailOtp();
    const updated = await User.findOneAndUpdate(
      {
        _id: user._id,
        isEmailVerified: false,
        $or: [
          { emailVerificationOtpLastSentAt: { $exists: false } },
          { emailVerificationOtpLastSentAt: { $lte: cutoff } },
        ],
      },
      {
        $set: {
          emailVerificationOtpHash: hash,
          emailVerificationOtpExpiresAt: new Date(now.getTime() + 10 * 60 * 1000),
          emailVerificationOtpAttempts: 0,
          emailVerificationOtpLastSentAt: now,
        },
      },
      { new: true },
    ).select("firstName email");

    if (!updated) return NextResponse.json(GENERIC_RESPONSE);
    try {
      await sendCustomerVerificationOtp({ email: updated.email, name: updated.firstName, otp });
    } catch (error) {
      await User.updateOne(
        { _id: updated._id, emailVerificationOtpHash: hash },
        {
          $unset: {
            emailVerificationOtpHash: 1,
            emailVerificationOtpExpiresAt: 1,
            emailVerificationOtpLastSentAt: 1,
          },
          $set: { emailVerificationOtpAttempts: 0 },
        },
      );
      console.error("Verification OTP email could not be sent:", error?.message);
      return NextResponse.json({ success: false, message: "Unable to send the verification code. Please try again." }, { status: 503 });
    }
    return NextResponse.json(GENERIC_RESPONSE);
  } catch (error) {
    console.error("Resend verification OTP error:", error?.message);
    return NextResponse.json({ success: false, message: "Unable to send the verification code. Please try again." }, { status: 500 });
  }
}
