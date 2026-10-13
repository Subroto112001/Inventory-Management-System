"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MdCheckCircle, MdClose, MdErrorOutline, MdInfoOutline, MdWarning } from "react-icons/md";

const iconByType = {
  success: MdCheckCircle,
  error: MdErrorOutline,
  warning: MdWarning,
  info: MdInfoOutline,
};

export default function ToastNotification({ toast, onClose }) {
  const [mounted, setMounted] = useState(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!toast?.message) return undefined;
    const timeout = toast.type === "error" ? 7000 : 4500;
    const timer = window.setTimeout(() => onCloseRef.current?.(), timeout);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (!mounted || !toast?.message) return null;
  const type = toast.type || "info";
  const Icon = iconByType[type] || MdInfoOutline;
  const styles = {
    success: "border-emerald-200 text-emerald-800",
    error: "border-red-200 text-red-800",
    warning: "border-amber-200 text-amber-800",
    info: "border-blue-200 text-blue-800",
  }[type];

  return createPortal(
    <div className="pointer-events-none fixed inset-x-3 top-3 z-[1100] flex justify-center sm:inset-x-auto sm:right-5 sm:top-5 sm:justify-end">
      <div role={type === "error" ? "alert" : "status"} aria-live={type === "error" ? "assertive" : "polite"} className={`pointer-events-auto flex w-full max-w-md items-start gap-2 rounded-lg border bg-white px-4 py-3 text-sm font-medium shadow-xl ${styles}`}>
        <Icon size={19} className="mt-0.5 shrink-0" />
        <span className="min-w-0 flex-1">{toast.message}</span>
        <button type="button" onClick={onClose} className="shrink-0 text-gray-400 hover:text-gray-700" aria-label="Dismiss notification"><MdClose size={17} /></button>
      </div>
    </div>,
    document.body,
  );
}
