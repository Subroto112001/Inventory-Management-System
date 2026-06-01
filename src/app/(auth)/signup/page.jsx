"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // পাসওয়ার্ড ম্যাচিং ভ্যালিডেশন
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // ব্যাকএন্ডে পাঠানোর জন্য ডাটা অবজেক্ট (মডেল অনুযায়ী)
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Something went wrong during registration.",
        );
      }

      // Success: Redirect to login page
      router.push("/login");
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

        :root {
          --color-on-secondary-fixed-variant: #454747;
          --color-inverse-on-surface: #f0f1f2;
          --color-outline-variant: #d2c2ce;
          --color-primary: #470151;
          --color-secondary-fixed: #e2e2e2;
          --color-error-container: #ffdad6;
          --color-inverse-primary: #fbabfe;
          --color-secondary-container: #dfe0e0;
          --color-secondary: #5d5f5f;
          --color-on-surface: #191c1d;
          --color-tertiary-container: #00453e;
          --color-primary-fixed: #ffd6fc;
          --color-surface-container-lowest: #ffffff;
          --color-background: #f8f9fa;
          --color-on-primary-container: #d98bdc;
          --color-on-secondary-container: #616363;
          --color-on-background: #191c1d;
          --color-surface-dim: #d9dadb;
          --color-outline: #81737e;
          --color-surface-variant: #e1e3e4;
          --color-on-surface-variant: #4f434e;
          --color-on-primary: #ffffff;
          --color-primary-container: #611f69;
          --color-on-primary-fixed: #36003e;
          --color-tertiary-fixed-dim: #64d9c8;
          --color-surface-container-low: #f3f4f5;
          --color-secondary-fixed-dim: #c6c6c7;
          --color-on-tertiary: #ffffff;
          --color-on-error: #ffffff;
          --color-inverse-surface: #2e3132;
          --color-surface: #f8f9fa;
          --color-error: #ba1a1a;
          --color-primary-fixed-dim: #fbabfe;
          --color-on-secondary-fixed: #1a1c1c;
          --color-on-error-container: #93000a;
          --color-on-primary-fixed-variant: #6d2b74;
          --color-on-tertiary-fixed: #00201c;
          --color-on-secondary: #ffffff;
          --color-surface-container-high: #e7e8e9;
          --color-surface-tint: #88438e;
          --color-surface-container-highest: #e1e3e4;
          --color-tertiary: #002d28;
          --color-tertiary-fixed: #82f6e4;
          --color-surface-container: #edeeef;
          --color-surface-bright: #f8f9fa;
          --color-on-tertiary-fixed-variant: #005048;
          --color-on-tertiary-container: #3eb9a9;
        }

        .login-root, .login-root * {
          box-sizing: border-box;
        }

        .login-root {
          font-family: 'Noto Serif', serif;
          background-color: var(--color-background);
          color: var(--color-on-surface);
          width: 100%;
          min-height: 100%;
          -webkit-font-smoothing: antialiased;
        }

        .login-root {
          display: flex;
          min-height: 100vh;
        }

        /* ── Left column ── */
        .left-col {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem;
          background-color: var(--color-primary-container);
          position: relative;
          overflow: hidden;
          width: 40%;
        }
        @media (min-width: 1024px) { .left-col { display: flex; } }

        .left-bg-glow {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0.2;
          background: radial-gradient(circle at top right, white, transparent, transparent);
        }

        .left-logo {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 4rem;
        }
        .left-logo .icon {
          font-family: 'Material Symbols Outlined';
          font-size: 2.25rem;
          color: var(--color-on-primary);
        }
        .left-logo h1 {
          font-size: 22px;
          line-height: 30px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--color-on-primary);
        }

        .left-headline {
          position: relative;
          z-index: 10;
        }
        .left-headline h2 {
          font-size: 28px;
          line-height: 36px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--color-on-primary);
          margin-bottom: 1.5rem;
          max-width: 28rem;
        }
        .left-headline p {
          font-size: 14px;
          line-height: 20px;
          color: var(--color-on-primary-container);
          max-width: 28rem;
          opacity: 0.9;
        }

        .left-illustration {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 24rem;
          margin: 3rem auto 0;
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }
        .left-illustration img {
          width: 100%;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 25px 25px rgba(0,0,0,0.15));
          opacity: 0.8;
          mix-blend-mode: screen;
        }

        .left-footer {
          position: relative;
          z-index: 10;
          margin-top: auto;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .left-footer span,
        .left-footer a {
          font-size: 12px;
          line-height: 16px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: color 0.2s;
        }
        .left-footer a:hover { color: var(--color-on-primary); }
        .left-footer-links { display: flex; gap: 1rem; }

        /* ── Right column ── */
        .right-col {
          width: 100%;
          background-color: var(--color-surface-container-lowest);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          overflow-y: auto;
        }
        @media (min-width: 640px) { .right-col { padding: 3rem; } }
        @media (min-width: 1024px) { .right-col { width: 60%; } }

        .form-card {
          width: 100%;
          max-width: 32rem;
        }

        /* Headers */
        .mobile-header {
          display: block;
          text-align: center;
          margin-bottom: 2rem;
        }
        @media (min-width: 1024px) { .mobile-header { display: none; } }

        .mobile-logo-box {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          height: 3rem;
          border-radius: 0.5rem;
          background-color: var(--color-primary-container);
          margin-bottom: 1rem;
        }
        .mobile-logo-box .icon {
          font-family: 'Material Symbols Outlined';
          font-size: 1.5rem;
          color: var(--color-on-primary);
        }
        .mobile-header h1 {
          font-size: 24px;
          line-height: 32px;
          font-weight: 700;
          color: var(--color-on-surface);
        }
        .mobile-header p {
          font-size: 14px;
          line-height: 20px;
          color: var(--color-secondary);
          margin-top: 0.5rem;
        }

        .desktop-header {
          display: none;
          margin-bottom: 2rem;
        }
        @media (min-width: 1024px) { .desktop-header { display: block; } }
        .desktop-header h2 {
          font-size: 28px;
          line-height: 36px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--color-on-surface);
        }
        .desktop-header p {
          font-size: 14px;
          line-height: 20px;
          color: var(--color-secondary);
          margin-top: 0.5rem;
        }

        /* Form Layout */
        .form { display: flex; flex-direction: column; gap: 1.25rem; }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 640px) {
          .form-grid { grid-template-columns: 1fr 1fr; }
        }

        .field-label {
          display: block;
          font-size: 12px;
          line-height: 16px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--color-on-surface);
          margin-bottom: 0.5rem;
        }

        .input-wrapper {
          position: relative;
          border-radius: 0.5rem;
          transition: box-shadow 0.2s;
        }
        .input-wrapper:focus-within {
          box-shadow: 0 0 0 3px rgba(71, 1, 81, 0.3);
        }
        .input-icon {
          position: absolute;
          inset-block: 0;
          left: 0;
          padding-left: 0.75rem;
          display: flex;
          align-items: center;
          pointer-events: none;
        }
        .input-icon .icon {
          font-family: 'Material Symbols Outlined';
          font-size: 1.25rem;
          color: var(--color-secondary);
        }
        .text-input {
          display: block;
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border: 1px solid var(--color-surface-variant);
          border-radius: 0.5rem;
          background-color: var(--color-surface);
          font-family: 'Noto Serif', serif;
          font-size: 14px;
          line-height: 20px;
          color: var(--color-on-surface);
          outline: none;
          transition: border-color 0.2s, background-color 0.2s;
        }
        .text-input::placeholder { color: var(--color-secondary); }
        .text-input:focus {
          border-color: var(--color-primary);
          background-color: var(--color-surface-container-lowest);
        }
        .text-input.has-right-icon { padding-right: 2.5rem; }

        .pw-toggle {
          position: absolute;
          inset-block: 0;
          right: 0;
          padding-right: 0.75rem;
          display: flex;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-secondary);
          transition: color 0.2s;
        }
        .pw-toggle:hover { color: var(--color-on-surface); }
        .pw-toggle .icon {
          font-family: 'Material Symbols Outlined';
          font-size: 1.25rem;
        }

        /* Error Alert */
        .error-alert {
          padding: 0.75rem 1rem;
          background-color: var(--color-error-container);
          color: var(--color-on-error-container);
          border-radius: 0.5rem;
          font-size: 13px;
          font-weight: 600;
        }

        /* Submit button */
        .submit-btn {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 0.5rem;
          font-family: 'Noto Serif', serif;
          font-size: 12px;
          line-height: 16px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--color-on-primary);
          background-color: var(--color-primary-container);
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          transition: background-color 0.2s, transform 0.1s;
          margin-top: 0.5rem;
        }
        .submit-btn:hover { background-color: var(--color-on-primary-fixed-variant); }
        .submit-btn:focus {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }
        .submit-btn:active { transform: scale(0.98); }

        /* Divider */
        .divider {
          position: relative;
          margin-top: 1.5rem;
        }
        .divider-line {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
        }
        .divider-line hr {
          width: 100%;
          border: none;
          border-top: 1px solid var(--color-surface-variant);
        }
        .divider-label {
          position: relative;
          display: flex;
          justify-content: center;
          font-size: 12px;
          line-height: 16px;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        .divider-label span {
          padding: 0 0.5rem;
          background-color: var(--color-surface-container-lowest);
          color: var(--color-secondary);
        }

        /* Google button */
        .google-btn {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0.75rem 1rem;
          border: 1px solid var(--color-surface-variant);
          border-radius: 0.5rem;
          background-color: var(--color-surface-container-lowest);
          font-family: 'Noto Serif', serif;
          font-size: 12px;
          line-height: 16px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--color-on-surface);
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          transition: background-color 0.2s;
          margin-top: 1rem;
        }
        .google-btn:hover { background-color: var(--color-surface-container-low); }
        .google-btn:focus {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }
        .google-btn svg { margin-right: 0.5rem; }

        /* Sign up text */
        .signup-text {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 14px;
          line-height: 20px;
          color: var(--color-secondary);
        }
        .signup-link {
          font-size: 12px;
          line-height: 16px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--color-tertiary-container);
          text-decoration: none;
          transition: color 0.2s;
        }
        .signup-link:hover { color: var(--color-tertiary-fixed-dim); }
      `}</style>

      <div className="login-root">
        {/* ── Left Column: Branding ── */}
        <div className="left-col">
          <div className="left-bg-glow" />

          <div style={{ position: "relative", zIndex: 10 }}>
            <div className="left-logo">
              <span className="icon">inventory_2</span>
              <h1>Inventory</h1>
            </div>
            <div className="left-headline">
              <h2>Join the Smart Inventory Fleet</h2>
              <p>
                Create your manager account today to monitor stock levels,
                assign warehouse nodes, and streamline supply chains in
                real-time.
              </p>
            </div>
          </div>

          <div className="left-illustration">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs_PPzTvzBRs7dcjx0L4GYS8h7n6Z6q3Yy0qb03ZnnreXXuD7C3Pddw_bMWy-tnzhy2svjmwlUjAa_66iz75ag3e41FiyP6QYutQ63qJK8qADO4dTplysX1V4yISPDmvAf0oNRIXhD6K4KFwQc_rE5DEWL2P9hpaX_AR7twqEXJHvyMszaS4jvBU3DrVmuPN9qbz04btZc7mQuH8y7mQRY24pi-6xUkGbda7J0kXEMuwzjMqTe_zXx8iCQ_1h1e0ZmgiBtH1WhWg"
              alt="Abstract logistics illustration"
            />
          </div>

          <div className="left-footer">
            <span>© 2024 Inventory Systems</span>
            <div className="left-footer-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>

        {/* ── Right Column: Signup Form ── */}
        <div className="right-col">
          <div className="form-card">
            {/* Mobile Header */}
            <div className="mobile-header">
              <div className="mobile-logo-box">
                <span className="icon">inventory_2</span>
              </div>
              <h1>Get Started</h1>
              <p>Create an account to manage assets</p>
            </div>

            {/* Desktop Header */}
            <div className="desktop-header">
              <h2>Create an account</h2>
              <p>Fill in the details to establish your system profile.</p>
            </div>

            {error && <div className="error-alert">{error}</div>}

            <form className="form" onSubmit={handleSubmit}>
              {/* Row 1: First Name & Last Name */}
              <div className="form-grid">
                <div>
                  <label className="field-label" htmlFor="firstName">
                    First Name
                  </label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <span className="icon">person</span>
                    </div>
                    <input
                      className="text-input"
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
                  <label className="field-label" htmlFor="lastName">
                    Last Name
                  </label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <span className="icon">badge</span>
                    </div>
                    <input
                      className="text-input"
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

              {/* Row 2: Email */}
              <div>
                <label className="field-label" htmlFor="email">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <span className="icon">mail</span>
                  </div>
                  <input
                    className="text-input"
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

              {/* Row 3: Phone Number */}
              <div>
                <label className="field-label" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <span className="icon">call</span>
                  </div>
                  <input
                    className="text-input"
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

              {/* Row 4: Password & Confirm Password */}
              <div className="form-grid">
                <div>
                  <label className="field-label" htmlFor="password">
                    Password
                  </label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <span className="icon">lock</span>
                    </div>
                    <input
                      className="text-input has-right-icon"
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
                      className="pw-toggle"
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <span className="icon">
                        {showPassword ? "visibility" : "visibility_off"}
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="field-label" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <span className="icon">enhanced_encryption</span>
                    </div>
                    <input
                      className="text-input"
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

              {/* Submit Button */}
              <div>
                <button
                  className="submit-btn"
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
            <div className="divider">
              <div className="divider-line">
                <hr />
              </div>
              <div className="divider-label">
                <span>Or sign up with</span>
              </div>
            </div>

            {/* Google Signup */}
            <button className="google-btn" type="button">
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
              Sign up with Google
            </button>

            {/* Link back to login */}
            <p className="signup-text">
              Already have an account?{" "}
              <a className="signup-link" href="#">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
