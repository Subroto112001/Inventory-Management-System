import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import User from "@/lib/models/User";
import { emailOtpMatches } from "@/lib/emailOtp";

const MAX_ATTEMPTS = 5;
const OTP_FIELDS = "+emailVerificationOtpHash +emailVerificationOtpExpiresAt +emailVerificationOtpAttempts +verificationExpiresAt";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const otp = String(body.otp || "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{6}$/.test(otp)) {
      return NextResponse.json({ status: "invalid", message: "Enter a valid email and 6-digit code." }, { status: 400 });
    }

    await connectMongoDB();
    const user = await User.findOne({ email, role: "Customer" }).select(OTP_FIELDS);
    if (!user) return NextResponse.json({ status: "account-expired" }, { status: 410 });
    if (user.isEmailVerified) {
      await User.updateOne(
        { _id: user._id, isEmailVerified: true },
        { $unset: { verificationExpiresAt: 1 } },
      );
      return NextResponse.json({ status: "already-verified" });
    }

    const now = new Date();
    if (user.verificationExpiresAt && user.verificationExpiresAt <= now) {
      const deletion = await User.deleteOne({
        _id: user._id,
        isEmailVerified: false,
        verificationExpiresAt: { $lte: now },
      });
      if (deletion.deletedCount) return NextResponse.json({ status: "account-expired" }, { status: 410 });
      const latest = await User.findById(user._id);
      if (latest?.isEmailVerified) return NextResponse.json({ status: "already-verified" });
      return NextResponse.json({ status: "account-expired" }, { status: 410 });
    }
    if (!user.emailVerificationOtpHash) {
      return NextResponse.json({ status: user.emailVerificationOtpAttempts >= MAX_ATTEMPTS ? "too-many-attempts" : "missing" }, { status: 400 });
    }

    if (!user.emailVerificationOtpExpiresAt || user.emailVerificationOtpExpiresAt <= now) {
      await User.updateOne(
        { _id: user._id, emailVerificationOtpHash: user.emailVerificationOtpHash },
        { $unset: { emailVerificationOtpHash: 1, emailVerificationOtpExpiresAt: 1 }, $set: { emailVerificationOtpAttempts: 0 } },
      );
      return NextResponse.json({ status: "expired" }, { status: 410 });
    }
    if ((user.emailVerificationOtpAttempts || 0) >= MAX_ATTEMPTS) {
      await User.updateOne({ _id: user._id }, { $unset: { emailVerificationOtpHash: 1, emailVerificationOtpExpiresAt: 1 } });
      return NextResponse.json({ status: "too-many-attempts" }, { status: 429 });
    }

    const filter = {
      _id: user._id,
      emailVerificationOtpHash: user.emailVerificationOtpHash,
      emailVerificationOtpExpiresAt: { $gt: now },
      emailVerificationOtpAttempts: { $lt: MAX_ATTEMPTS },
      isEmailVerified: false,
      $or: [
        { verificationExpiresAt: { $exists: false } },
        { verificationExpiresAt: { $gt: new Date() } },
      ],
    };
    if (emailOtpMatches(otp, user.emailVerificationOtpHash)) {
      const verified = await User.findOneAndUpdate(
        filter,
        {
          $set: { isEmailVerified: true, emailVerificationOtpAttempts: 0 },
          $unset: { emailVerificationOtpHash: 1, emailVerificationOtpExpiresAt: 1, emailVerificationOtpLastSentAt: 1, verificationExpiresAt: 1 },
        },
        { new: true },
      );
      if (verified) return NextResponse.json({ status: "verified" });
      const latest = await User.findById(user._id).select(OTP_FIELDS);
      if (!latest) return NextResponse.json({ status: "account-expired" }, { status: 410 });
      if (latest?.isEmailVerified) return NextResponse.json({ status: "already-verified" });
      if (latest.verificationExpiresAt && latest.verificationExpiresAt <= new Date()) {
        await User.deleteOne({ _id: latest._id, isEmailVerified: false, verificationExpiresAt: { $lte: new Date() } });
        return NextResponse.json({ status: "account-expired" }, { status: 410 });
      }
      if (!latest?.emailVerificationOtpHash) return NextResponse.json({ status: "too-many-attempts" }, { status: 429 });
      return NextResponse.json({ status: "expired" }, { status: 410 });
    }

    const updated = await User.findOneAndUpdate(
      filter,
      { $inc: { emailVerificationOtpAttempts: 1 } },
      { new: true },
    ).select("+emailVerificationOtpAttempts");
    if (!updated) {
      const latest = await User.findById(user._id).select(OTP_FIELDS);
      if (!latest) return NextResponse.json({ status: "account-expired" }, { status: 410 });
      if (latest?.isEmailVerified) return NextResponse.json({ status: "already-verified" });
      if (latest.verificationExpiresAt && latest.verificationExpiresAt <= new Date()) {
        await User.deleteOne({ _id: latest._id, isEmailVerified: false, verificationExpiresAt: { $lte: new Date() } });
        return NextResponse.json({ status: "account-expired" }, { status: 410 });
      }
      if (!latest?.emailVerificationOtpHash || (latest?.emailVerificationOtpAttempts || 0) >= MAX_ATTEMPTS) {
        await User.updateOne({ _id: user._id }, { $unset: { emailVerificationOtpHash: 1, emailVerificationOtpExpiresAt: 1 } });
        return NextResponse.json({ status: "too-many-attempts" }, { status: 429 });
      }
      return NextResponse.json({ status: "expired" }, { status: 410 });
    }
    if (updated.emailVerificationOtpAttempts >= MAX_ATTEMPTS) {
      await User.updateOne(
        { _id: updated._id, emailVerificationOtpHash: updated.emailVerificationOtpHash },
        { $unset: { emailVerificationOtpHash: 1, emailVerificationOtpExpiresAt: 1 } },
      );
      return NextResponse.json({ status: "too-many-attempts" }, { status: 429 });
    }
    return NextResponse.json({ status: "invalid", attemptsRemaining: MAX_ATTEMPTS - updated.emailVerificationOtpAttempts }, { status: 400 });
  } catch (error) {
    console.error("Email OTP verification error:", error?.message);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
