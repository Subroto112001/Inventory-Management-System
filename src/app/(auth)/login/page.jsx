"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      setSuccess("Login successful! Redirecting...");

      // Optional: Clear form inputs on success
      setEmail("");
      setPassword("");

      // Redirect user to the dashboard after a brief delay
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .font-noto { font-family: 'Noto Serif', serif; }
        .msi { font-family: 'Material Symbols Outlined'; }
      `}</style>

      <div className="font-noto flex min-h-screen w-full bg-[#f8f9fa] text-[#191c1d] antialiased">
        {/* Left column */}
        <div className="relative hidden w-2/5 flex-col justify-between overflow-hidden bg-[#611f69] p-12 lg:flex">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,white,transparent,transparent)] opacity-20" />

          <div className="relative z-10">
            <div className="mb-16 flex items-center gap-3">
              <span className="msi text-4xl text-white">inventory_2</span>
              <h1 className="text-[22px] font-semibold leading-[30px] tracking-[-0.01em] text-white">
                Inventory
              </h1>
            </div>
            <div>
              <h2 className="mb-6 max-w-md text-[28px] font-bold leading-9 tracking-[-0.02em] text-white">
                The Smart Inventory Solution
              </h2>
              <p className="max-w-md text-sm leading-5 text-[#d98bdc] opacity-90">
                Streamline your warehouse operations, track stock levels in
                real-time, and make data-driven decisions with unparalleled
                precision.
              </p>
            </div>
          </div>

          <div className="relative z-10 mx-auto mt-12 flex min-h-[200px] w-full max-w-sm flex-grow items-center justify-center">
            <img
              className="h-auto w-full object-contain opacity-80 mix-blend-screen drop-shadow-2xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs_PPzTvzBRs7dcjx0L4GYS8h7n6Z6q3Yy0qb03ZnnreXXuD7C3Pddw_bMWy-tnzhy2svjmwlUjAa_66iz75ag3e41FiyP6QYutQ63qJK8qADO4dTplysX1V4yISPDmvAf0oNRIXhD6K4KFwQc_rE5DEWL2P9hpaX_AR7twqEXJHvyMszaS4jvBU3DrVmuPN9qbz04btZc7mQuH8y7mQRY24pi-6xUkGbda7J0kXEMuwzjMqTe_zXx8iCQ_1h1e0ZmgiBtH1WhWg"
              alt="Abstract logistics illustration"
            />
          </div>

          <div className="relative z-10 mt-auto flex items-center justify-between border-t border-white/20 pt-8">
            <span className="text-xs font-semibold leading-4 tracking-wider text-white/70">
              © 2024 Inventory Systems
            </span>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-xs font-semibold leading-4 tracking-wider text-white/70 no-underline transition-colors hover:text-white"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-xs font-semibold leading-4 tracking-wider text-white/70 no-underline transition-colors hover:text-white"
              >
                Terms
              </a>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex w-full items-center justify-center bg-white p-6 sm:p-12 lg:w-3/5">
          <div className="w-full max-w-md">
            {/* Mobile header */}
            <div className="mb-8 block text-center lg:hidden">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#611f69]">
                <span className="msi text-2xl text-white">inventory_2</span>
              </div>
              <h1 className="text-2xl font-bold leading-8 text-[#191c1d]">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm leading-5 text-[#5d5f5f]">
                Log in to manage your inventory
              </p>
            </div>

            {/* Desktop header */}
            <div className="mb-10 hidden lg:block">
              <h2 className="text-[28px] font-bold leading-9 tracking-[-0.02em] text-[#191c1d]">
                Log in
              </h2>
              <p className="mt-2 text-sm leading-5 text-[#5d5f5f]">
                Enter your credentials to access your dashboard.
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-5 rounded-lg border border-[rgba(186,26,26,0.2)] bg-[#ffdad6] px-4 py-3 text-sm font-medium leading-5 text-[#93000a]">
                {error}
              </div>
            )}

            {/* Success banner */}
            {success && (
              <div className="mb-5 rounded-lg border border-[rgba(19,115,51,0.2)] bg-[#e6f4ea] px-4 py-3 text-sm font-medium leading-5 text-[#137333]">
                {success}
              </div>
            )}

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label
                  className="mb-2 block text-xs font-semibold leading-4 tracking-wider text-[#191c1d]"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative rounded-lg transition-shadow focus-within:shadow-[0_0_0_3px_rgba(71,1,81,0.3)]">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="msi text-xl text-[#5d5f5f]">mail</span>
                  </div>
                  <input
                    className="block w-full rounded-lg border border-[#e1e3e4] bg-[#f8f9fa] py-3 pl-10 pr-3 font-noto text-sm leading-5 text-[#191c1d] outline-none transition-colors placeholder:text-[#5d5f5f] focus:border-[#470151] focus:bg-white"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    required
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    className="block text-xs font-semibold leading-4 tracking-wider text-[#191c1d]"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <a
                    className="text-xs font-semibold leading-4 tracking-wider text-[#00453e] no-underline transition-colors hover:text-[#64d9c8]"
                    href="#"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative rounded-lg transition-shadow focus-within:shadow-[0_0_0_3px_rgba(71,1,81,0.3)]">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="msi text-xl text-[#5d5f5f]">lock</span>
                  </div>
                  <input
                    className="block w-full rounded-lg border border-[#e1e3e4] bg-[#f8f9fa] py-3 pl-10 pr-10 font-noto text-sm leading-5 text-[#191c1d] outline-none transition-colors placeholder:text-[#5d5f5f] focus:border-[#470151] focus:bg-white"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="absolute inset-y-0 right-0 flex items-center border-none bg-transparent pr-3 text-[#5d5f5f] transition-colors hover:text-[#191c1d]"
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <span className="msi text-xl">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center">
                <input
                  className="h-4 w-4 cursor-pointer rounded border border-[#e1e3e4] bg-[#f8f9fa] accent-[#470151]"
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  disabled={loading}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label
                  className="ml-2 cursor-pointer text-sm leading-5 text-[#5d5f5f]"
                  htmlFor="remember-me"
                >
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit */}
              <div>
                <button
                  className="flex w-full justify-center rounded-md border border-[#611F69] bg-[#611F69] px-4 py-2 text-white transition-all duration-200 hover:bg-white hover:text-[#611F69] disabled:cursor-not-allowed disabled:opacity-60"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log in"}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <hr className="w-full border-t border-[#e1e3e4]" />
              </div>
              <div className="relative flex justify-center text-xs font-semibold leading-4 tracking-wider">
                <span className="bg-white px-2 text-[#5d5f5f]">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google */}
            <button
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 py-2 transition-all duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              disabled={loading}
            >
              <svg
                aria-hidden="true"
                style={{ width: "1.25rem", height: "1.25rem" }}
                viewBox="0 0 24 24"
              >
                <path
                  d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.25027 6.60998L5.32028 9.77C6.27528 6.61001 9.19528 4.75 12.0003 4.75Z"
                  fill="#EA4335"
                />
                <path
                  d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L20.18 21.29C22.57 19.09 24 15.96 24 12.275H23.49Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.65486C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3449L5.26498 14.2949Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L15.8304 17.905C14.7504 18.625 13.4804 19.05 12.0004 19.05C9.09038 19.05 6.13541 17.065 5.17041 13.935L1.1004 17.085C3.1204 21.035 7.18538 24.0001 12.0004 24.0001Z"
                  fill="#34A853"
                />
              </svg>
              Log in with Google
            </button>

            {/* Sign up link */}
            <p className="mt-8 text-center text-sm leading-5 text-[#5d5f5f]">
              Don't have an account?{" "}
              <Link
                className="text-xs font-semibold leading-4 tracking-wider text-[#00453e] no-underline transition-colors hover:text-[#64d9c8]"
                href="/signup"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}