"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthBranding } from "@/Component/Layout/AuthLayout";

const inputClass = "mt-1 w-full rounded-md border border-[#D9D2C7] bg-white px-3 py-2.5 text-[#211F1D] outline-none focus:border-[#1F3A2E] focus:ring-2 focus:ring-[#1F3A2E]/15";

export default function LoginPage() {
  const router = useRouter();
  const branding = useAuthBranding() || {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;
    const timer = setTimeout(() => setResendCooldown((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const startedAt = Date.now();
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, rememberMe }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Unable to log in.");
      setSuccess("Login successful! Redirecting...");
      setEmail(""); setPassword("");
      await new Promise((resolve) => setTimeout(resolve, Math.max(0, 2000 - (Date.now() - startedAt))));
      const requested = new URLSearchParams(window.location.search).get("next");
      const safeNext = requested && requested.startsWith("/") && !requested.startsWith("//") && !requested.startsWith("/dash") ? requested : null;
      router.push(data.user?.role === "Customer" ? (safeNext || "/") : "/dash"); router.refresh();
    } catch (submitError) { setError(submitError.message || "Unable to log in. Please try again."); }
    finally { setLoading(false); }
  };

  const resend = async () => {
    setResending(true);
    try { const response = await fetch("/api/auth/resend-verification", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }); const data = await response.json(); if (!response.ok) throw new Error(data.message || "Unable to send the verification code."); setResendCooldown(Number(data.retryAfter) || 60); setSuccess(data.message || "If your account needs verification, a code will be sent."); setError(""); }
    catch (resendError) { setError(resendError.message || "Unable to send the verification code."); }
    finally { setResending(false); }
  };

  const unverified = error.toLowerCase().includes("verify your email");
  return <main className="relative flex min-h-screen items-center justify-center px-4 py-10" style={{ backgroundColor: branding.surfaceColor || "#F7F3EC", color: branding.textColor || "#211F1D" }}><section className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm sm:p-7" style={{ borderColor: branding.borderColor || "#E4DED2" }}>
    <div className="flex items-center gap-3">{branding.logoUrl && <img src={branding.logoUrl} alt="" className="h-10 max-w-24 object-contain" />}<p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: branding.accentColor || "#B65C38" }}>{branding.storeName || "FIELDHOUSE"}</p></div>
    <h1 className="mt-3 text-3xl font-semibold">Welcome back</h1>
    <p className="mt-2 text-sm text-[#6F685E]">Log in to manage your account and orders.</p>
    {error && <div className="mt-5 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}{unverified && <button type="button" onClick={resend} disabled={resending || !email || resendCooldown > 0} className="ml-1 font-semibold underline disabled:opacity-60">{resending ? "Sending..." : resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}</button>}</div>}
    {success && <p className="mt-5 rounded-md bg-[#edf5ef] px-3 py-2 text-sm text-[#1F3A2E]" role="status">{success}</p>}
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium">Email<input className={inputClass} id="email" name="email" type="email" placeholder="name@example.com" required autoComplete="email" disabled={loading} value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label className="block text-sm font-medium">Password<span className="relative mt-1 block"><input className={`${inputClass} pr-14`} id="password" name="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" disabled={loading} value={password} onChange={(e) => setPassword(e.target.value)} /><button className="absolute inset-y-0 right-0 px-3 text-xs font-semibold text-[#1F3A2E]" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button></span></label>
      <label className="flex items-center gap-2 text-sm text-[#6F685E]"><input className="h-4 w-4 accent-[#1F3A2E]" type="checkbox" disabled={loading} checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />Remember me for 30 days</label>
      <button className="w-full rounded-md bg-[#1F3A2E] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#294c3d] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={loading}>{loading ? "Logging in..." : "Log in"}</button>
    </form>
    <p className="mt-6 text-center text-sm text-[#6F685E]">Don’t have an account? <Link href="/signup" className="font-semibold text-[#1F3A2E]">Sign up</Link></p>
  </section>{loading && <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 px-6 text-center backdrop-blur-sm" style={{ backgroundColor: `${branding.surfaceColor || "#F7F3EC"}F2`, color: branding.textColor || "#211F1D", animation: "loginOverlayIn 250ms ease-out" }} role="status" aria-live="polite">{branding.logoUrl ? <img src={branding.logoUrl} alt="" className="h-16 max-w-40 object-contain" /> : <span className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: branding.accentColor || "#B65C38" }}>{branding.storeName || "FIELDHOUSE"}</span>}<span className="h-10 w-10 animate-spin rounded-full border-4 border-current border-r-transparent" style={{ color: branding.primaryColor || "#1F3A2E" }} aria-hidden="true" /><p className="text-lg font-medium">Signing you in…</p></div>}<style jsx global>{`@keyframes loginOverlayIn { from { opacity: 0; } to { opacity: 1; } }`}</style></main>;
}
