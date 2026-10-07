"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const inputClass =
  "mt-1 w-full rounded-md border border-[#D9D2C7] bg-white px-3 py-2.5 text-[#211F1D] outline-none focus:border-[#1F3A2E] focus:ring-2 focus:ring-[#1F3A2E]/15";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [visible, setVisible] = useState({
    password: false,
    confirmPassword: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordsMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;
  const update = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(form.password)) {
      setError(
        "Use at least 8 characters with uppercase, lowercase and a number.",
      );
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Unable to create account.");
      const verificationParams = new URLSearchParams({
        email: form.email.trim().toLowerCase(),
      });
      if (data.emailSent === false) verificationParams.set("sendFailed", "1");
      else {
        const sentAt = Date.now();
        verificationParams.set("expiresAt", String(sentAt + 10 * 60 * 1000));
        verificationParams.set("resendAt", String(sentAt));
      }
      router.push(`/verify-email?${verificationParams.toString()}`);
      setSuccess(
        data.message ||
          "Your account has been created. Please check your email to verify your account.",
      );
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F3EC] px-4 py-10 text-[#211F1D]">
      <section className="w-full max-w-md rounded-xl border border-[#E4DED2] bg-white p-6 shadow-sm sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B65C38]">
          FIELDHOUSE
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Create your account</h1>
        <p className="mt-2 text-sm text-[#6F685E]">
          Save your details and track every order in one place.
        </p>
        {success ? (
          <div
            className="mt-6 rounded-md bg-[#edf5ef] p-4 text-sm text-[#1F3A2E]"
            role="status"
          >
            <p>{success}</p>
            <p className="mt-3">
              Didn’t receive it? <Resend email={form.email} />
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block font-semibold underline"
            >
              Continue to login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <p
                className="mt-5 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
                role="alert"
              >
                {error}
              </p>
            )}
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  First name
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={update}
                    required
                    minLength={2}
                    maxLength={50}
                    autoComplete="given-name"
                    className={inputClass}
                  />
                </label>
                <label className="text-sm font-medium">
                  Last name
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={update}
                    maxLength={50}
                    autoComplete="family-name"
                    className={inputClass}
                  />
                </label>
              </div>
              <label className="block text-sm font-medium">
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update}
                  required
                  autoComplete="email"
                  className={inputClass}
                />
              </label>
              {[
                { name: "password", label: "Password" },
                { name: "confirmPassword", label: "Confirm password" },
              ].map(({ name, label }) => (
                <label className="block text-sm font-medium" key={name}>
                  {label}
                  <span className="relative mt-1 block">
                    <input
                      name={name}
                      type={visible[name] ? "text" : "password"}
                      value={form[name]}
                      onChange={update}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      aria-invalid={
                        name === "confirmPassword" && passwordsMismatch
                      }
                      className={`${inputClass} pr-14 ${name === "confirmPassword" && passwordsMismatch ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setVisible((state) => ({
                          ...state,
                          [name]: !state[name],
                        }))
                      }
                      aria-label={`${visible[name] ? "Hide" : "Show"} ${label.toLowerCase()}`}
                      className="absolute inset-y-0 right-0 px-3 text-xs font-semibold text-[#1F3A2E]"
                    >
                      {visible[name] ? "Hide" : "Show"}
                    </button>
                  </span>
                  {name === "password" ? (
                    <span className="mt-1 block text-xs font-normal text-[#6F685E]">
                      At least 8 characters with uppercase, lowercase and a
                      number.
                    </span>
                  ) : (
                    passwordsMismatch && (
                      <span
                        className="mt-1 block text-xs font-normal text-red-700"
                        role="alert"
                      >
                        Passwords do not match.
                      </span>
                    )
                  )}
                </label>
              ))}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#1F3A2E] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#294c3d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-[#6F685E]">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#1F3A2E]">
                Log in
              </Link>
            </p>
          </>
        )}
      </section>
    </main>
  );
}

function Resend({ email }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const resend = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setMessage(
        data.message ||
          "If the account needs verification, an email will be sent.",
      );
    } catch {
      setMessage("Unable to send the email right now.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <button
        type="button"
        className="font-semibold underline disabled:opacity-60"
        disabled={loading}
        onClick={resend}
      >
        {loading ? "Sending..." : "Resend verification email"}
      </button>
      {message && (
        <span className="ml-1" role="status">
          {message}
        </span>
      )}
    </>
  );
}
