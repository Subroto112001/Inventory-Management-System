"use client";

import { useEffect } from "react";
import ErrorFallback from "@/Component/ErrorFallback";

export default function FrontendError({ error, unstable_retry }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") console.error("Storefront route error", error);
  }, [error]);
  return <ErrorFallback error={error} retry={unstable_retry} />;
}
