import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-center justify-center px-5 py-16 text-center text-[var(--theme-text,#111318)]">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--theme-secondary,#F04427)]">404</p>
      <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 text-sm text-[var(--theme-muted,#6B7280)]">This page may have moved or is no longer available.</p>
      <Link href="/" className="mt-6 rounded-xl bg-[var(--theme-primary,#000)] px-5 py-3 text-sm font-semibold text-white">Return home</Link>
    </main>
  );
}
