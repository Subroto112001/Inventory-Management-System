"use client";
import React, { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="bg-background min-h-screen font-body text-body text-on-surface antialiased selection:bg-primary-container selection:text-on-primary flex">
      {/* Left Column: Branding (40%) */}
      <section
        className="hidden lg:flex lg:w-2/5 bg-primary-container flex-col justify-between p-12 relative overflow-hidden"
        aria-labelledby="branding-heading"
      >
        {/* Background Decoration */}
        <div
          className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"
          aria-hidden="true"
        ></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <span
              className="material-symbols-outlined text-4xl text-on-primary"
              aria-hidden="true"
            >
              inventory_2
            </span>
            <h1
              id="branding-heading"
              className="font-h2 text-h2 text-on-primary"
            >
              Inventory
            </h1>
          </div>
          <p className="font-h1 text-h1 text-on-primary mb-6 max-w-md font-bold">
            The Smart Inventory Solution
          </p>
          <p className="font-body text-body text-on-primary-container max-w-md opacity-90">
            Streamline your warehouse operations, track stock levels in
            real-time, and make data-driven decisions with unparalleled
            precision.
          </p>
        </div>

        {/* Illustration */}
        <div className="relative z-10 w-full max-w-sm mx-auto mt-12 flex-grow flex items-center justify-center">
          <img
            alt="A modern, abstract digital illustration representing logistics, supply chain, and inventory management. The scene features clean, geometric representations of warehouse shelves, moving boxes, and data nodes connected by glowing lines."
            className="w-full h-auto object-contain drop-shadow-2xl opacity-80 mix-blend-screen"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs_PPzTvzBRs7dcjx0L4GYS8h7n6Z6q3Yy0qb03ZnnreXXuD7C3Pddw_bMWy-tnzhy2svjmwlUjAa_66iz75ag3e41FiyP6QYutQ63qJK8qADO4dTplysX1V4yISPDmvAf0oNRIXhD6K4KFwQc_rE5DEWL2P9hpaX_AR7twqEXJHvyMszaS4jvBU3DrVmuPN9qbz04btZc7mQuH8y7mQRY24pi-6xUkGbda7J0kXEMuwzjMqTe_zXx8iCQ_1h1e0ZmgiBtH1WhWg"
          />
        </div>

        <footer className="relative z-10 mt-auto pt-8 border-t border-on-primary/20 flex justify-between items-center">
          <span className="font-label-sm text-label-sm text-on-primary/70">
            © {new Date().getFullYear()} Inventory Systems
          </span>
          <nav className="flex gap-4" aria-label="Footer Legal Links">
            <a
              className="font-label-sm text-label-sm text-on-primary/70 hover:text-on-primary transition-colors"
              href="#"
            >
              Privacy
            </a>
            <a
              className="font-label-sm text-label-sm text-on-primary/70 hover:text-on-primary transition-colors"
              href="#"
            >
              Terms
            </a>
          </nav>
        </footer>
      </section>

      {/* Right Column: Form (60%) */}
      <section className="w-full lg:w-3/5 bg-surface-container-lowest flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-container mb-4">
              <span
                className="material-symbols-outlined text-2xl text-on-primary"
                aria-hidden="true"
              >
                inventory_2
              </span>
            </div>
            <h2 className="font-h1-mobile text-h1-mobile text-on-surface">
              Welcome Back
            </h2>
            <p className="font-body text-body text-secondary mt-2">
              Log in to manage your inventory
            </p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-10">
            <h2 className="font-h1 text-h1 text-on-surface">Log in</h2>
            <p className="font-body text-body text-secondary mt-2">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form action="#" className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                className="block font-label-sm text-label-sm text-on-surface mb-2"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative focus-within:ring-2 focus-within:ring-primary/30 focus-within:ring-offset-1 rounded-lg transition-shadow duration-200">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span
                    className="material-symbols-outlined text-secondary text-xl"
                    aria-hidden="true"
                  >
                    mail
                  </span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-3 border border-surface-variant rounded-lg bg-surface focus:ring-0 focus:border-primary focus:bg-surface-container-lowest transition-colors font-body text-body text-on-surface placeholder-secondary"
                  id="email"
                  name="email"
                  placeholder="name@company.com"
                  required
                  type="email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  className="block font-label-sm text-label-sm text-on-surface"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  className="font-label-sm text-label-sm text-tertiary-container hover:text-tertiary-fixed-dim transition-colors"
                  href="#"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative focus-within:ring-2 focus-within:ring-primary/30 focus-within:ring-offset-1 rounded-lg transition-shadow duration-200">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span
                    className="material-symbols-outlined text-secondary text-xl"
                    aria-hidden="true"
                  >
                    lock
                  </span>
                </div>
                <input
                  className="block w-full pl-10 pr-10 py-3 border border-surface-variant rounded-lg bg-surface focus:ring-0 focus:border-primary focus:bg-surface-container-lowest transition-colors font-body text-body text-on-surface placeholder-secondary"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary hover:text-on-surface focus:outline-none"
                  type="button"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    aria-hidden="true"
                  >
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                className="h-4 w-4 rounded border-surface-variant text-primary focus:ring-primary focus:ring-offset-surface-container-lowest bg-surface"
                id="remember-me"
                name="remember-me"
                type="checkbox"
              />
              <label
                className="ml-2 block font-body text-body text-secondary"
                htmlFor="remember-me"
              >
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-label-sm text-label-sm text-on-primary bg-primary-container hover:bg-on-primary-fixed-variant focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 active:scale-[0.98]"
                type="submit"
              >
                Log in
              </button>
            </div>
          </form>

          {/* OAuth Separator */}
          <div className="mt-8">
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-surface-variant"></div>
              </div>
              <div className="relative flex justify-center font-label-sm text-label-sm">
                <span className="px-2 bg-surface-container-lowest text-secondary">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Login Button */}
            <div className="mt-6">
              <button
                className="w-full flex justify-center items-center py-3 px-4 border border-surface-variant rounded-lg shadow-sm bg-surface-container-lowest font-label-sm text-label-sm text-on-surface hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 mr-2"
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
            </div>
          </div>

          <p className="mt-8 text-center font-body text-body text-secondary">
            Don't have an account?{" "}
            <a
              className="font-label-sm text-label-sm text-tertiary-container hover:text-tertiary-fixed-dim transition-colors"
              href="#"
            >
              Create an account
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
