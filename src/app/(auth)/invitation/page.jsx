"use client";

import { useEffect, useState } from "react";

export default function InvitationPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [setupToken, setSetupToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailFromUrl = new URLSearchParams(window.location.search).get(
      "email",
    );
    if (emailFromUrl) {
      queueMicrotask(() => setEmail(emailFromUrl));
    }
  }, []);

  const verifyCode = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/invitation/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setSetupToken(data.setupToken);
      setMessage("Code verified. Choose a password for your account.");
    } catch (verificationError) {
      setError(verificationError.message || "Unable to verify the code.");
    } finally {
      setLoading(false);
    }
  };

  const setUserPassword = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/invitation/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, setupToken, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setMessage(
        "Password set successfully. You can now close this page and log in.",
      );
    } catch (passwordError) {
      setError(passwordError.message || "Unable to set the password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fa] p-6 text-[#191c1d]">
      <section className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold">Activate your account</h1>
        <p className="mt-2 text-sm text-[#5d5f5f]">
          Enter the six digit code from your administrator invitation.
        </p>
        {error && (
          <p className="mt-4 rounded-lg bg-[#ffdad6] p-3 text-sm text-[#93000a]">
            {error}
          </p>
        )}
        {message && (
          <p className="mt-4 rounded-lg bg-[#e6f4ea] p-3 text-sm text-[#137333]">
            {message}
          </p>
        )}
        {!setupToken ? (
          <form className="mt-6 space-y-4" onSubmit={verifyCode}>
            <input
              className="w-full rounded-lg border p-3"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <input
              className="w-full rounded-lg border p-3 tracking-[0.4em]"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
            />
            <button
              className="w-full rounded-lg bg-[#611f69] p-3 font-semibold text-white disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              {loading ? "Verifying..." : "Verify code"}
            </button>
          </form>
        ) : !message.includes("successfully") ? (
          <form className="mt-6 space-y-4" onSubmit={setUserPassword}>
            <input
              className="w-full rounded-lg border p-3"
              type="password"
              placeholder="New password"
              minLength={8}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <input
              className="w-full rounded-lg border p-3"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
            <button
              className="w-full rounded-lg bg-[#611f69] p-3 font-semibold text-white disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              {loading ? "Saving..." : "Set password"}
            </button>
          </form>
        ) : null}
      </section>
    </main>
  );
}
