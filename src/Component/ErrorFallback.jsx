"use client";

import { useState } from "react";

const isDevelopment = process.env.NODE_ENV === "development";
const redact = (value) => String(value ?? "")
  .replace(/(Bearer\s+)[A-Za-z0-9._~+/=-]+/gi, "$1[REDACTED]")
  .replace(/((?:password|token|secret|api[_-]?key)\s*[:=]\s*)[^\s,;]+/gi, "$1[REDACTED]");

export default function ErrorFallback({ error, retry, title = "Something went wrong" }) {
  const [showDetails, setShowDetails] = useState(false);
  const requestId = error?.requestId || error?.digest;

  return (
    <main className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-center justify-center px-5 py-16 text-center text-[var(--theme-text,#111318)]">
      <section className="w-full rounded-2xl border border-[var(--theme-border,#E3E6EA)] bg-[var(--theme-surface,#fff)] p-7 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--theme-secondary,#F04427)]">We hit a problem</p>
        <h1 className="mt-3 text-2xl font-semibold">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--theme-muted,#6B7280)]">
          Your data is safe. Please try again, or return to the page later.
        </p>
        {requestId && <p className="mt-3 text-xs text-[var(--theme-muted,#6B7280)]">Reference: <code>{requestId}</code></p>}
        <button type="button" onClick={retry} className="mt-6 rounded-xl bg-[var(--theme-primary,#000)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary,#000)] focus-visible:ring-offset-2">
          Try again
        </button>
        {isDevelopment && (
          <div className="mt-6 border-t border-[var(--theme-border,#E3E6EA)] pt-4 text-left">
            <button type="button" aria-expanded={showDetails} onClick={() => setShowDetails((value) => !value)} className="text-sm font-medium underline underline-offset-4">
              {showDetails ? "Hide development details" : "Show development details"}
            </button>
            {showDetails && <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-black/[0.04] p-3 text-left text-xs">
              {[error?.name, redact(error?.message), error?.code && `Code: ${error.code}`, requestId && `Request ID: ${requestId}`, redact(error?.stack)].filter(Boolean).join("\n\n")}
            </pre>}
          </div>
        )}
      </section>
    </main>
  );
}
