import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { getJwtSecret } from "@/lib/auth";

export function createEmailOtp() {
  const otp = String(randomInt(100000, 1000000));
  return { otp, hash: hashEmailOtp(otp) };
}

export function hashEmailOtp(otp) {
  return createHmac("sha256", getJwtSecret()).update(otp).digest("hex");
}

export function emailOtpMatches(otp, storedHash) {
  if (typeof otp !== "string" || typeof storedHash !== "string") return false;
  const candidate = Buffer.from(hashEmailOtp(otp), "hex");
  const stored = Buffer.from(storedHash, "hex");
  return candidate.length === stored.length && timingSafeEqual(candidate, stored);
}
