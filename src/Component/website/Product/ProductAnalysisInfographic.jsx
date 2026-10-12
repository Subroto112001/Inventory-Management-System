export default function ProductAnalysisInfographic({ svg }) {
  if (!svg) return null;

  return (
    <section className="mx-auto mt-16 max-w-[1280px] px-4 sm:px-6" aria-label="Product analysis infographic">
      <div className="mb-6">
        <p className="mb-1 text-sm text-[var(--theme-secondary)]">A closer look</p>
        <h2 className="font-serif text-3xl text-[var(--theme-text)]">Product features</h2>
      </div>
      <div className="overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-white shadow-sm [&>svg]:block [&>svg]:h-auto [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
    </section>
  );
}
