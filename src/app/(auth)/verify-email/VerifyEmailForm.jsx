"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const fieldClass = "h-12 w-full min-w-0 rounded-md border border-[#D9D2C7] bg-white px-1 text-center text-xl font-semibold text-[#211F1D] outline-none focus:border-[#1F3A2E] focus:ring-2 focus:ring-[#1F3A2E]/15 sm:h-14 sm:text-2xl";

export default function VerifyEmailForm({ initialEmail = "", sendFailed = false, hasOtpExpiry: initialHasOtpExpiry = false, otpExpiresAt = 0, resendAt = 0 }) {
  const [email, setEmail] = useState(initialEmail);
  const [editingEmail, setEditingEmail] = useState(!initialEmail);
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [status, setStatus] = useState("ready");
  const [hasOtpExpiry, setHasOtpExpiry] = useState(initialHasOtpExpiry);
  const [message, setMessage] = useState(sendFailed ? "Your account was created, but we could not send the verification code. Please try again." : "");
  const [resendMessage, setResendMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [otpSeconds, setOtpSeconds] = useState(0);
  const otpInputs = useRef([]);
  const otp = digits.join("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const now = Date.now();
      setOtpSeconds(otpExpiresAt ? Math.max(0, Math.ceil((otpExpiresAt - now) / 1000)) : 0);
      setCooldown(resendAt ? Math.max(0, Math.ceil((resendAt + 60_000 - now) / 1000)) : 0);
    }, 0);
    return () => clearTimeout(timer);
  }, [otpExpiresAt, resendAt]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (otpSeconds <= 0) return undefined;
    const timer = setTimeout(() => setOtpSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [otpSeconds]);

  const updateOtp = (index, value) => {
    const entered = value.replace(/\D/g, "").slice(0, 6);
    if (!entered) {
      setDigits((current) => current.map((digit, position) => position === index ? "" : digit));
      return;
    }
    if (entered.length > 1) {
      const next = Array(6).fill("");
      entered.split("").forEach((digit, position) => { next[position] = digit; });
      setDigits(next);
      otpInputs.current[Math.min(entered.length - 1, 5)]?.focus();
      return;
    }
    setDigits((current) => current.map((digit, position) => position === index ? entered : digit));
    if (index < 5) otpInputs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      if (!digits[index] && index > 0) {
        event.preventDefault();
        setDigits((current) => current.map((digit, position) => position === index - 1 ? "" : digit));
        otpInputs.current[index - 1]?.focus();
      }
    } else if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault(); otpInputs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < 5) {
      event.preventDefault(); otpInputs.current[index + 1]?.focus();
    }
  };

  const pasteOtp = (event) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    event.preventDefault();
    const next = Array(6).fill("");
    pasted.split("").forEach((digit, index) => { next[index] = digit; });
    setDigits(next);
    otpInputs.current[Math.min(pasted.length - 1, 5)]?.focus();
  };

  const updateEmail = (value) => {
    const nextEmail = value.trim();
    setEmail(nextEmail);
    const params = new URLSearchParams(window.location.search);
    params.set("email", nextEmail);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  };

  const verify = async (event) => {
    event.preventDefault();
    if (loading) return;
    setMessage("");
    if (!/^\d{6}$/.test(otp)) { setMessage("Enter the 6-digit verification code."); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (!response.ok && !data.status) {
        setMessage("Something went wrong. Please try again.");
        return;
      }
      if (data.status === "account-expired") {
        setStatus("account-expired");
        setMessage("Your verification period has expired. Please create a new account.");
      } else if (data.status === "verified" || data.status === "already-verified") {
        setStatus(data.status);
        setMessage(data.status === "already-verified" ? "Your email is already verified." : "Email Verified Successfully! Your email has been verified. You can now log in.");
      } else if (data.status === "expired") {
        setStatus("expired"); setMessage("Your verification code has expired. Please request a new code.");
      } else if (data.status === "too-many-attempts") {
        setStatus("too-many-attempts"); setMessage("Too many incorrect attempts. Please request a new verification code.");
      } else if (data.status === "missing") {
        setStatus("missing"); setMessage("No active verification code was found. Please request a new code.");
      } else if (data.status === "invalid") {
        setMessage("Invalid verification code. Please check the code and try again.");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  const resend = async () => {
    if (resending || cooldown > 0 || !email) return;
    setResending(true); setResendMessage("");
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error("Unable to send the verification code. Please try again.");
      const sentAt = Date.now();
      setCooldown(Number(data.retryAfter) || 60);
      setOtpSeconds(10 * 60);
      setHasOtpExpiry(true);
      setDigits(Array(6).fill(""));
      setStatus("ready");
      setMessage("");
      setResendMessage("If your account still needs verification, a new code will be sent.");
      const params = new URLSearchParams(window.location.search);
      params.set("expiresAt", String(sentAt + 10 * 60 * 1000));
      params.set("resendAt", String(sentAt));
      params.delete("sendFailed");
      window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
    } catch (error) {
      setResendMessage(error.message || "Unable to send the verification code. Please try again.");
    } finally { setResending(false); }
  };

  const verified = status === "verified" || status === "already-verified";
  const accountExpired = status === "account-expired";
  const otpExpired = hasOtpExpiry && otpSeconds === 0;
  return <main className="flex min-h-screen items-center justify-center bg-[#F7F3EC] px-4 py-10 text-[#211F1D]"><section className="w-full max-w-md rounded-xl border border-[#E4DED2] bg-white p-6 shadow-sm sm:p-7">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B65C38]">FIELDHOUSE</p>
    <h1 className="mt-3 text-3xl font-semibold">{verified ? "Email Verified Successfully!" : accountExpired ? "Verification period expired" : "Verify Your Email"}</h1>
    <p className="mt-2 text-sm text-[#6F685E]">{verified ? "Your email has been verified. You can now log in to your account." : sendFailed ? "We couldn’t send your code yet. Try requesting a new OTP below." : email ? <>We’ve sent a 6-digit verification code to <span className="font-medium text-[#211F1D]">{maskEmail(email)}</span>.</> : "Enter your email address to verify your account."}</p>
    {accountExpired && <p className="mt-5 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{message}</p>}
    {!verified && !accountExpired && <>
      <form onSubmit={verify} className="mt-6 space-y-4">
        {editingEmail ? <label className="block text-sm font-medium" htmlFor="verification-email">Email address<input id="verification-email" className="mt-1 w-full rounded-md border border-[#D9D2C7] px-3 py-2.5 outline-none focus:border-[#1F3A2E]" type="email" value={email} onChange={(event) => updateEmail(event.target.value)} autoComplete="email" required /></label> : <p className="text-center text-xs text-[#6F685E]"><button type="button" onClick={() => setEditingEmail(true)} className="underline">Change email address</button></p>}
        <fieldset className="border-0 p-0">
          <legend className="mb-2 block w-full text-center text-sm font-medium">Enter your 6-digit code</legend>
          <div className="grid grid-cols-6 gap-2 sm:gap-3" role="group" aria-label="6-digit verification code">
            {Array.from({ length: 6 }, (_, index) => <input key={index} ref={(element) => { otpInputs.current[index] = element; }} className={fieldClass} type="text" inputMode="numeric" pattern="[0-9]*" maxLength={index === 0 ? 6 : 1} autoComplete={index === 0 ? "one-time-code" : "off"} value={digits[index]} onChange={(event) => updateOtp(index, event.target.value)} onKeyDown={(event) => handleOtpKeyDown(index, event)} onPaste={pasteOtp} aria-label={`Verification code digit ${index + 1} of 6`} required />)}
          </div>
        </fieldset>
        {otpSeconds > 0 && <p className="text-center text-xs text-[#6F685E]">Code expires in {String(Math.floor(otpSeconds / 60)).padStart(2, "0")}:{String(otpSeconds % 60).padStart(2, "0")}</p>}
        {otpExpired && <p className="text-center text-sm text-red-700" role="status">Your verification code may have expired. Please request a new code.</p>}
        {message && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{message}</p>}
        <button type="submit" disabled={loading || otp.length !== 6 || !email} className="w-full rounded-md bg-[#1F3A2E] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#294c3d] disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Verifying..." : "Verify Email"}</button>
      </form>
      <div className="mt-5 text-center">
        <button type="button" onClick={resend} disabled={!email || resending || cooldown > 0} className="text-sm font-semibold text-[#1F3A2E] underline disabled:cursor-not-allowed disabled:opacity-50">{resending ? "Sending..." : cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}</button>
        {resendMessage && <p className="mt-2 text-sm text-[#6F685E]" role="status">{resendMessage}</p>}
      </div>
    </>}
    {verified && <p className="mt-5 rounded-md bg-[#edf5ef] px-3 py-2 text-sm text-[#1F3A2E]" role="status">{message}<Link href="/login" className="mt-4 block font-semibold underline">Continue to Login</Link></p>}
    {accountExpired && <Link href="/signup" className="mt-5 block rounded-md bg-[#1F3A2E] px-4 py-3 text-center font-semibold text-white">Create New Account</Link>}
    {!verified && !accountExpired && <Link href="/login" className="mt-5 block text-center text-sm font-semibold text-[#1F3A2E]">Back to login</Link>}
  </section></main>;
}

function maskEmail(value) {
  const [name, domain] = value.split("@");
  if (!name || !domain) return value;
  return `${name.slice(0, 1)}***@${domain}`;
}
