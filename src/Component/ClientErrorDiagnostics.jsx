"use client";

import { useEffect } from "react";

const isDevelopment = process.env.NODE_ENV === "development";
const redact = (value) => String(value ?? "")
  .replace(/(Bearer\s+)[A-Za-z0-9._~+/=-]+/gi, "$1[REDACTED]")
  .replace(/((?:password|token|secret|api[_-]?key)\s*[:=]\s*)[^\s,;]+/gi, "$1[REDACTED]");

function safePath(input) {
  try {
    const url = new URL(input, window.location.origin);
    return `${url.origin === window.location.origin ? "" : url.origin}${url.pathname}`;
  } catch {
    return "[unavailable]";
  }
}

function safeErrorPayload(payload) {
  if (!payload || typeof payload !== "object") return undefined;
  const details = Array.isArray(payload.details)
    ? payload.details.slice(0, 20).map((item) => ({ field: item?.field, message: item?.message }))
    : undefined;
  return {
    code: payload.error?.code || payload.code,
    message: typeof payload.message === "string" ? redact(payload.message) : undefined,
    requestId: payload.requestId,
    details,
  };
}

export default function ClientErrorDiagnostics() {
  useEffect(() => {
    if (!isDevelopment) return undefined;
    const originalFetch = window.fetch;

    const diagnosticFetch = async function diagnosticFetch(input, init) {
      const method = String(init?.method || input?.method || "GET").toUpperCase();
      const rawUrl = typeof input === "string" || input instanceof URL ? String(input) : input?.url || "";
      const path = safePath(rawUrl);
      try {
        const response = await originalFetch.apply(this, [input, init]);
        if (path.includes("/api/") && !response.ok) {
          const payload = await response.clone().json().catch(() => undefined);
          console.groupCollapsed(`[API ${response.status}] ${method} ${path}`);
          console.error("API request failed", {
            method,
            url: path,
            status: response.status,
            requestId: response.headers.get("x-request-id") || payload?.requestId,
            error: safeErrorPayload(payload),
          });
          console.groupEnd();
        } else if (path.includes("/api/") && response.status !== 204 && response.headers.get("content-type")?.includes("application/json")) {
          try {
            await response.clone().json();
          } catch (error) {
            console.error("Invalid JSON API response", {
              method,
              url: path,
              status: response.status,
              requestId: response.headers.get("x-request-id"),
              message: redact(error?.message),
              stack: redact(error?.stack),
            });
          }
        }
        return response;
      } catch (error) {
        if (path.includes("/api/")) {
          console.error("API network failure", { method, url: path, name: error?.name, message: error?.message, stack: error?.stack });
        }
        throw error;
      }
    };
    window.fetch = diagnosticFetch;

    const onError = (event) => console.error("Unhandled browser error", {
      message: redact(event.message),
      filename: safePath(event.filename || ""),
      line: event.lineno,
      column: event.colno,
      stack: redact(event.error?.stack),
    });
    const onRejection = (event) => console.error("Unhandled promise rejection", {
      message: redact(event.reason?.message || String(event.reason)),
      stack: redact(event.reason?.stack),
    });
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      if (window.fetch === diagnosticFetch) window.fetch = originalFetch;
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
