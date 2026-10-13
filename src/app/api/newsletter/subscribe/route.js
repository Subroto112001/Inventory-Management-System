import { logger } from "@/lib/serverLogger";
import { withApiErrorHandling } from "@/lib/apiErrors";
import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/databse/mongodb";
import NewsletterSubscriber from "@/lib/models/NewsletterSubscriber";
import { checkRateLimit, recordRateLimitFailure } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function POSTHandler(request) {
  const forwardedIp = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipKey = `newsletter:ip:${forwardedIp}`;
  const ipRate = checkRateLimit(ipKey, { limit: 8, windowMs: 60 * 60 * 1000 });
  if (!ipRate.allowed) return NextResponse.json({ success: false, message: "Too many attempts. Please try again later." }, { status: 429, headers: { "Retry-After": String(ipRate.retryAfter) } });
  recordRateLimitFailure(ipKey, { windowMs: 60 * 60 * 1000 });

  try {
    const payload = await request.json();
    const email = String(payload.email || "").trim().toLowerCase();
    if (email.length > 254 || !emailPattern.test(email)) return NextResponse.json({ success: false, message: "Enter a valid email address." }, { status: 400 });
    if (payload.consent !== true) return NextResponse.json({ success: false, message: "Please confirm that you agree to receive email updates." }, { status: 400 });

    const emailKey = `newsletter:email:${email}`;
    const emailRate = checkRateLimit(emailKey, { limit: 5, windowMs: 60 * 60 * 1000 });
    if (!emailRate.allowed) return NextResponse.json({ success: false, message: "Too many attempts for this email. Please try again later." }, { status: 429, headers: { "Retry-After": String(emailRate.retryAfter) } });
    recordRateLimitFailure(emailKey, { windowMs: 60 * 60 * 1000 });

    await connectMongoDB();
    const existing = await NewsletterSubscriber.findOne({ email }).select("_id status").lean();
    if (existing?.status === "subscribed") return NextResponse.json({ success: true, alreadySubscribed: true, message: "This email is already subscribed." });
    if (existing) {
      existing.status = "subscribed";
      existing.subscribedAt = new Date();
      existing.unsubscribedAt = null;
      await NewsletterSubscriber.updateOne({ _id: existing._id }, { $set: { status: "subscribed", subscribedAt: existing.subscribedAt, unsubscribedAt: null } });
      return NextResponse.json({ success: true, alreadySubscribed: false, message: "You are subscribed to special offer updates." });
    }

    try {
      await NewsletterSubscriber.create({ email, source: "homepage-special-offer" });
    } catch (error) {
      if (error.code !== 11000) throw error;
      return NextResponse.json({ success: true, alreadySubscribed: true, message: "This email is already subscribed." });
    }
    return NextResponse.json({ success: true, alreadySubscribed: false, message: "You are subscribed to special offer updates." }, { status: 201 });
  } catch (error) {
    logger.error("Newsletter subscription error:", error);
    return NextResponse.json({ success: false, message: "Unable to subscribe right now. Please try again later." }, { status: 500 });
  }
}

export const POST = withApiErrorHandling(POSTHandler, "POST /api/newsletter/subscribe");
