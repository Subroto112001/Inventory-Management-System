"use client";

import { useEffect } from "react";
import "./globals.css";
import ErrorFallback from "@/Component/ErrorFallback";

export default function GlobalError({ error, unstable_retry }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") console.error("Root layout error", error);
  }, [error]);
  return <html lang="en"><body><ErrorFallback error={error} retry={unstable_retry} title="The application could not load" /></body></html>;
}
