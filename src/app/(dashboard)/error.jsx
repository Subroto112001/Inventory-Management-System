"use client";

import { useEffect } from "react";
import ErrorFallback from "@/Component/ErrorFallback";

export default function DashboardError({ error, unstable_retry }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") console.error("Dashboard route error", error);
  }, [error]);
  return <ErrorFallback error={error} retry={unstable_retry} />;
}
