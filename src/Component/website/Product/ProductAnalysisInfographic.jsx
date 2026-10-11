export default function ProductAnalysisInfographic({ svg }) {
  if (!svg) return null;

  return (
    <section className="mx-auto mt-16 max-w-[1280px] px-4 sm:px-6" aria-label="Product analysis infographic">
      <div className="mb-6">
        <p className="mb-1 text-sm text-[#B65C38]">A closer look</p>
        <h2 className="font-serif text-3xl text-[#211F1D]">Product features</h2>
      </div>
      <div className="overflow-hidden rounded-2xl border border-[#E4DED2] bg-white shadow-sm [&>svg]:block [&>svg]:h-auto [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
    </section>
  );
}
