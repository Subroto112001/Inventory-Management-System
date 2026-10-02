"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Unable to create account");
      router.push(
        `/login?registered=1&email=${encodeURIComponent(form.email)}`,
      );
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F3EC] px-4 py-10 text-[#211F1D]">
      <section className="w-full max-w-md rounded-xl border border-[#E4DED2] bg-white p-7 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B65C38]">
          FIELDHOUSE
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Create your account</h1>
        <p className="mt-2 text-sm text-[#6F685E]">
          Save your details and track every order in one place.
        </p>

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
                className="mt-1 w-full rounded-md border border-[#D9D2C7] px-3 py-2.5"
              />
            </label>
            <label className="text-sm font-medium">
              Last name
              <input
                name="lastName"
                value={form.lastName}
                onChange={update}
                className="mt-1 w-full rounded-md border border-[#D9D2C7] px-3 py-2.5"
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
              className="mt-1 w-full rounded-md border border-[#D9D2C7] px-3 py-2.5"
            />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={update}
              required
              minLength={8}
              className="mt-1 w-full rounded-md border border-[#D9D2C7] px-3 py-2.5"
            />
            <span className="mt-1 block text-xs text-[#6F685E]">
              Use at least 8 characters with uppercase, lowercase and a number.
            </span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#1F3A2E] px-4 py-3 font-semibold text-white disabled:opacity-60"
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
      </section>
    </main>
  );
}
