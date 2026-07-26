"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [registeredUser, setRegisteredUser] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const submitData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
    };

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        setRegisteredUser(data?.userName || formData.firstName);
      } else {
        throw new Error(
          data.message || "Something went wrong during registration.",
        );
      }
    } catch (err) {
      setError(err.message || "Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        @keyframes popupReveal {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
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
                Join the Smart Inventory Fleet
              </h2>
              <p className="max-w-md text-sm leading-5 text-[#d98bdc] opacity-90">
                Create your manager account today to monitor stock levels,
                assign warehouse nodes, and streamline supply chains in
                real-time.
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
        <div className="flex w-full items-center justify-center overflow-y-auto bg-white p-6 sm:p-12 lg:w-3/5">
          <div className="w-full max-w-lg">
            {/* Mobile header */}
            <div className="mb-8 block text-center lg:hidden">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#611f69]">
                <span className="msi text-2xl text-white">inventory_2</span>
              </div>
              <h1 className="text-2xl font-bold leading-8 text-[#191c1d]">
                Get Started
              </h1>
              <p className="mt-2 text-sm leading-5 text-[#5d5f5f]">
                Create an account to manage assets
              </p>
            </div>

            {/* Desktop header */}
            <div className="mb-8 hidden lg:block">
              <h2 className="text-[28px] font-bold leading-9 tracking-[-0.02em] text-[#191c1d]">
                Create an account
              </h2>
              <p className="mt-2 text-sm leading-5 text-[#5d5f5f]">
                Fill in the details to establish your system profile.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-lg bg-[#ffdad6] px-4 py-3 text-[13px] font-semibold text-[#93000a]">
                {error}
              </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* First / Last name */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    className="mb-2 block text-xs font-semibold leading-4 tracking-wider text-[#191c1d]"
                    htmlFor="firstName"
                  >
                    First Name
                  </label>
                  <div className="relative rounded-lg transition-shadow focus-within:shadow-[0_0_0_3px_rgba(71,1,81,0.3)]">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="msi text-xl text-[#5d5f5f]">person</span>
                    </div>
                    <input
                      className="block w-full rounded-lg border border-[#e1e3e4] bg-[#f8f9fa] py-3 pl-10 pr-3 font-noto text-sm leading-5 text-[#191c1d] outline-none transition-colors placeholder:text-[#5d5f5f] "
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      required
                      minLength={2}
                      maxLength={50}
                      pattern="^[a-zA-Z\s]+$"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="mb-2 block text-xs font-semibold leading-4 tracking-wider text-[#191c1d]"
                    htmlFor="lastName"
                  >
                    Last Name
                  </label>
                  <div className="relative rounded-lg transition-shadow focus-within:shadow-[0_0_0_3px_rgba(71,1,81,0.3)]">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="msi text-xl text-[#5d5f5f]">badge</span>
                    </div>
                    <input
                      className="block w-full rounded-lg border border-[#e1e3e4] bg-[#f8f9fa] py-3 pl-10 pr-3 font-noto text-sm leading-5 text-[#191c1d] outline-none transition-colors placeholder:text-[#5d5f5f] "
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      maxLength={50}
                      pattern="^[a-zA-Z\s]+$"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

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
                    className="block w-full rounded-lg border border-[#e1e3e4] bg-[#f8f9fa] py-3 pl-10 pr-3 font-noto text-sm leading-5 text-[#191c1d] outline-none transition-colors placeholder:text-[#5d5f5f]"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  className="mb-2 block text-xs font-semibold leading-4 tracking-wider text-[#191c1d]"
                  htmlFor="phoneNumber"
                >
                  Phone Number
                </label>
                <div className="relative rounded-lg transition-shadow focus-within:shadow-[0_0_0_3px_rgba(71,1,81,0.3)]">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="msi text-xl text-[#5d5f5f]">call</span>
                  </div>
                  <input
                    className="block w-full rounded-lg border border-[#e1e3e4] bg-[#f8f9fa] py-3 pl-10 pr-3 font-noto text-sm leading-5 text-[#191c1d] outline-none transition-colors placeholder:text-[#5d5f5f] "
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    pattern="^(?:\+88|88)?(01[3-9]\d{8})$"
                    title="Please provide a valid Bangladeshi phone number"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password / Confirm */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    className="mb-2 block text-xs font-semibold leading-4 tracking-wider text-[#191c1d]"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative rounded-lg transition-shadow">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="msi text-xl text-[#5d5f5f]">lock</span>
                    </div>
                    <input
                      className="block w-full rounded-lg border border-[#e1e3e4] bg-[#f8f9fa] py-3 pl-10 pr-10 font-noto text-sm leading-5 text-[#191c1d] outline-none transition-colors placeholder:text-[#5d5f5f]"
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$"
                      title="Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, and one number"
                      value={formData.password}
                      onChange={handleChange}
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

                <div>
                  <label
                    className="mb-2 block text-xs font-semibold leading-4 tracking-wider text-[#191c1d]"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <div className="relative rounded-lg transition-shadow">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="msi text-xl text-[#5d5f5f]">
                        enhanced_encryption
                      </span>
                    </div>
                    <input
                      className="block w-full rounded-lg border border-[#e1e3e4] bg-[#f8f9fa] py-3 pl-10 pr-3 font-noto text-sm leading-5 text-[#191c1d] outline-none transition-colors placeholder:text-[#5d5f5f]"
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div>
                <button
                  className="mt-2 flex w-full justify-center rounded-lg border border-[#611f69] bg-[#611f69] px-4 py-3 font-noto text-xs font-semibold leading-4 tracking-wider text-white shadow-sm transition-colors hover:bg-transparent hover:text-[#611f69]  active:scale-[0.98]"
                  type="submit"
                  disabled={isLoading}
                  style={{
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {isLoading ? "Signing up..." : "Sign up"}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <hr className="w-full border-t border-[#e1e3e4]" />
              </div>
              <div className="relative flex justify-center text-xs font-semibold leading-4 tracking-wider">
                <span className="bg-white px-2 text-[#5d5f5f]">
                  Or sign up with
                </span>
              </div>
            </div>

            {/* Google */}
            <button
              className="mt-4 flex w-full items-center justify-center rounded-lg border border-[#e1e3e4] bg-white px-4 py-3 font-noto text-xs font-semibold leading-4 tracking-wider text-[#191c1d] shadow-sm transition-colors hover:bg-[#f3f4f5] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#470151]"
              type="button"
            >
              <svg
                aria-hidden="true"
                className="mr-2 h-5 w-5"
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
              Sign up with Google
            </button>

            {/* Link back to login */}
            <p className="mt-6 text-center text-sm leading-5 text-[#5d5f5f]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-xs font-semibold leading-4 tracking-wider text-[#611f69] no-underline transition-colors hover:text-[#64d9c8]"
                aria-label="Go to login"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Success popup */}
      {registeredUser && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#191c1d]/60 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-xl border border-[#d2c2ce] bg-white px-8 py-10 text-center font-noto shadow-2xl"
            style={{
              animation: "popupReveal 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#e6f4ea] text-[#137333]">
              <span className="msi text-4xl">check_circle</span>
            </div>
            <h3 className="mb-3 text-[22px] font-bold text-[#191c1d]">
              Registration Successful!
            </h3>
            <p className="mb-7 text-sm leading-[22px] text-[#5d5f5f]">
              Welcome, <strong>{registeredUser}</strong>! Your system profile
              has been established successfully.
            </p>
            <button
              className="w-full rounded-lg border-none bg-[#611f69] py-3 px-4 text-[13px] font-semibold tracking-wider text-white transition-colors hover:bg-[#6d2b74]"
              onClick={() => router.push("/login")}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </>
  );
}
