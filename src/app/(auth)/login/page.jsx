"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthBranding } from "@/Component/Layout/AuthLayout";

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
  const primaryColor = branding.primaryColor || "#1F3A2E";
  const accentColor = branding.accentColor || "#B65C38";
  const textColor = branding.textColor || "#211F1D";
  const storeName = branding.storeName || "FIELDHOUSE";

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:py-14"
      style={{ backgroundColor: branding.surfaceColor || "#F7F3EC", color: textColor }}
    >
      <div className="pointer-events-none absolute -left-32 top-[-8rem] h-80 w-80 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: `${accentColor}20` }} aria-hidden="true" />
      <div className="pointer-events-none absolute -right-36 bottom-[-10rem] h-96 w-96 rounded-full opacity-40 blur-3xl" style={{ backgroundColor: `${primaryColor}18` }} aria-hidden="true" />

      <section className="relative z-10 w-full max-w-md rounded-3xl border bg-white/95 p-6 shadow-[0_24px_70px_-28px_rgba(33,31,29,0.28)] animate-[login-card-in_650ms_cubic-bezier(0.2,0.8,0.2,1)_both] motion-reduce:animate-none sm:p-8" style={{ borderColor: branding.borderColor || "#E4DED2" }}>
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 animate-[login-float_8s_ease-in-out_infinite] items-center justify-center rounded-full border bg-white p-2.5 shadow-sm motion-reduce:animate-none" style={{ borderColor: branding.borderColor || "#E4DED2", backgroundColor: `${branding.surfaceColor || "#F7F3EC"}80` }}>
              {branding.logoUrl ? (
                <img src={branding.logoUrl} alt={`${storeName} logo`} className="h-full w-full object-contain" />
              ) : (
                <span className="text-lg font-semibold" style={{ color: primaryColor }} aria-label={storeName}>
                  {storeName.trim().charAt(0).toUpperCase() || "S"}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-[2rem]">Welcome Back</h1>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#6F685E]">Log in to manage your account and orders.</p>
          </div>

          {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700" role="alert">{error}{unverified && <button type="button" onClick={resend} disabled={resending || !email || resendCooldown > 0} className="ml-1 font-semibold underline underline-offset-2 transition-opacity disabled:opacity-60">{resending ? "Sending..." : resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}</button>}</div>}
          {success && <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-800" role="status">{success}</p>}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium" htmlFor="email">Email
              <input className="mt-2 w-full rounded-xl border bg-[#FCFBF9] px-4 py-3 text-[15px] outline-none transition duration-200 placeholder:text-[#A39B90] focus:bg-white focus:border-[var(--brand-primary)] focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60" style={{ borderColor: branding.borderColor || "#D9D2C7", "--brand-primary": primaryColor, "--tw-ring-color": `${primaryColor}24` }} id="email" name="email" type="email" placeholder="name@example.com" required autoComplete="email" disabled={loading} value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="block text-sm font-medium" htmlFor="password">Password
              <span className="relative mt-2 block">
                <input className="w-full rounded-xl border bg-[#FCFBF9] px-4 py-3 pr-16 text-[15px] outline-none transition duration-200 placeholder:text-[#A39B90] focus:bg-white focus:border-[var(--brand-primary)] focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60" style={{ borderColor: branding.borderColor || "#D9D2C7", "--brand-primary": primaryColor, "--tw-ring-color": `${primaryColor}24` }} id="password" name="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" disabled={loading} value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="absolute inset-y-0 right-0 rounded-r-xl px-4 text-xs font-semibold transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset disabled:opacity-60" style={{ color: primaryColor }} type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#6F685E]"><input className="h-4 w-4 rounded focus-visible:ring-2 focus-visible:ring-offset-2" style={{ accentColor: primaryColor }} type="checkbox" disabled={loading} checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />Remember me for 30 days</label>
            <button className="w-full rounded-xl px-4 py-3.5 font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm" style={{ backgroundColor: primaryColor }} type="submit" disabled={loading}>{loading ? "Logging in..." : "Log in"}</button>
          </form>
          <p className="mt-7 text-center text-sm text-[#6F685E]">Don&#39;t have an account? <Link href="/signup" className="font-semibold underline-offset-4 transition hover:underline" style={{ color: primaryColor }}>Sign up</Link></p>
      </section>

      {loading && <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 px-6 text-center backdrop-blur-sm" style={{ backgroundColor: `${branding.surfaceColor || "#F7F3EC"}F2`, color: textColor, animation: "login-overlay-in 250ms ease-out" }} role="status" aria-live="polite">{branding.logoUrl ? <img src={branding.logoUrl} alt="" className="h-16 max-w-40 object-contain" /> : <span className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: accentColor }}>{storeName}</span>}<span className="h-10 w-10 animate-spin rounded-full border-4 border-current border-r-transparent" style={{ color: primaryColor }} aria-hidden="true" /><p className="text-lg font-medium">Signing you in...</p></div>}
      <style jsx global>{`
        @keyframes login-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
        @keyframes login-card-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes login-overlay-in { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </main>
  );
}
