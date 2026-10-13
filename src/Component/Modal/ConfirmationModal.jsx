"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function ConfirmationModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  loadingLabel = "Working…",
  loading = false,
  onCancel,
  onConfirm,
  children,
  allowBackdropClose = true,
}) {
  const [mounted, setMounted] = useState(false);
  const cancelRef = useRef(null);
  const dialogRef = useRef(null);
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !loading) onCancelRef.current?.();
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll("button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, loading]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-gray-900/50 px-4 py-6 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && allowBackdropClose && !loading) onCancel?.();
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        aria-describedby={description ? "confirmation-modal-description" : undefined}
        className="my-auto w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
      >
        <h2 id="confirmation-modal-title" className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && <p id="confirmation-modal-description" className="mt-2 text-sm leading-6 text-gray-600">{description}</p>}
        {children}
        <div className="mt-6 flex justify-end gap-2">
          <button ref={cancelRef} type="button" onClick={onCancel} disabled={loading} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={loading} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60">
            {loading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
