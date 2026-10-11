"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { buildProductInfographic } from "@/lib/productAnalysis";

const emptyDraft = (sourceImage = "", summary = "") => ({ sourceImage, summary, annotations: [] });
const plainText = (value = "") => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

function metadataDraft(product) {
  const specs = Array.isArray(product.specifications) ? product.specifications : [];
  return {
    ...emptyDraft(product.images?.[0] || product.image || "", plainText(product.description || "").slice(0, 500)),
    annotations: specs.slice(0, 8).map((item, index) => ({
      label: String(item.name || "Product detail").slice(0, 60),
      description: String(item.value || "").slice(0, 180),
      kind: "feature",
      x: 50,
      y: Math.round(15 + (index * 70) / Math.max(1, Math.min(specs.length, 8))),
      x2: 75,
      y2: 50,
      measurementValue: "",
      measurementUnit: "",
      verified: false,
    })),
  };
}

export default function ProductAnalysisEditorPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [draft, setDraft] = useState(emptyDraft());
  const [activeAnnotation, setActiveAnnotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    Promise.resolve().then(async () => {
      if (!active || !id) return;
      try {
        const [productResponse, analysisResponse] = await Promise.all([
          fetch(`/api/product/${id}`, { cache: "no-store" }),
          fetch(`/api/product/${id}/analysis`, { cache: "no-store" }),
        ]);
        const productData = await productResponse.json();
        const analysisData = await analysisResponse.json();
        if (!productResponse.ok) throw new Error(productData.message || "Unable to load product");
        if (!analysisResponse.ok) throw new Error(analysisData.message || "Unable to load product analysis");
        if (!active) return;
        setProduct(productData.product);
        const loaded = analysisData.analysis;
        if (loaded) {
          setAnalysis(loaded);
          setDraft({ sourceImage: loaded.sourceImage, summary: loaded.summary || "", annotations: loaded.annotations || [] });
        } else {
          setDraft(metadataDraft(productData.product));
        }
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    });
    return () => { active = false; };
  }, [id]);

  const liveSvg = useMemo(() => {
    if (!product || !draft.sourceImage) return "";
    if (draft.annotations.some((item) => !item.label?.trim())) return "";
    try {
      return buildProductInfographic({
        product,
        sourceImage: draft.sourceImage,
        summary: draft.summary,
        annotations: draft.annotations,
      });
    } catch {
      return "";
    }
  }, [product, draft]);

  const updateAnnotation = (index, changes) => {
    setDraft((current) => ({
      ...current,
      annotations: current.annotations.map((annotation, itemIndex) =>
        itemIndex === index ? { ...annotation, ...changes } : annotation,
      ),
    }));
  };

  const saveDraft = async () => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/product/${id}/analysis`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save draft");
      setAnalysis(data.analysis);
      setNotice("Draft saved. Review each claim before publishing.");
      return true;
    } catch (saveError) {
      setError(saveError.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const generateInfographic = async () => {
    if (!(await saveDraft())) return;
    setGenerating(true);
    setError("");
    try {
      const response = await fetch(`/api/product/${id}/analysis`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to generate infographic");
      setAnalysis(data.analysis);
      setNotice("Infographic generated and saved. Check the preview before publishing.");
    } catch (generateError) {
      setError(generateError.message);
    } finally {
      setGenerating(false);
    }
  };

  const togglePublication = async () => {
    setPublishing(true);
    setError("");
    setNotice("");
    try {
      const nextStatus = analysis?.status === "published" ? "draft" : "published";
      const response = await fetch(`/api/product/${id}/analysis`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to update publication");
      setAnalysis(data.analysis);
      setNotice(nextStatus === "published" ? "Analysis published on the storefront." : "Analysis unpublished.");
    } catch (publishError) {
      setError(publishError.message);
    } finally {
      setPublishing(false);
    }
  };

  const removeAnalysis = async () => {
    if (!window.confirm("Remove this product analysis? The product and its gallery images will remain.")) return;
    setError("");
    try {
      const response = await fetch(`/api/product/${id}/analysis`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to remove analysis");
      setAnalysis(null);
      setDraft(metadataDraft(product));
      setNotice("Analysis removed. The product and original images are unchanged.");
    } catch (removeError) {
      setError(removeError.message);
    }
  };

  const addAnnotation = () => {
    if (draft.annotations.length >= 8) return;
    setDraft((current) => ({
      ...current,
      annotations: [...current.annotations, {
        label: "", description: "", kind: "feature", x: 50, y: 50,
        x2: 75, y2: 50, measurementValue: "", measurementUnit: "", verified: false,
      }],
    }));
    setActiveAnnotation(draft.annotations.length);
  };

  const placeAnnotation = (event) => {
    if (activeAnnotation < 0 || !draft.annotations[activeAnnotation]) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, Math.round(((event.clientX - bounds.left) / bounds.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((event.clientY - bounds.top) / bounds.height) * 100)));
    updateAnnotation(activeAnnotation, { x, y });
  };

  if (loading) return <div className="p-8 text-sm text-[var(--theme-muted)]">Loading product analysis…</div>;
  if (error && !product) return <div className="p-8 text-sm text-red-700">{error}</div>;
  if (!product) return null;

  const images = product.images?.length ? product.images : product.image ? [product.image] : [];

  return (
    <main className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href={`/dash/product_details/${id}`} className="text-sm text-[var(--theme-primary)] hover:underline">← Back to product</Link>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]">Product information</p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--theme-text)] sm:text-3xl">Analysis & infographic</h1>
          <p className="mt-1 text-sm text-[var(--theme-muted)]">{product.productName} · {product.categoryName || "Uncategorized"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={saveDraft} disabled={saving || generating} className="rounded-lg border border-[var(--theme-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--theme-text)] transition hover:bg-[var(--theme-background)] disabled:opacity-50">{saving ? "Saving…" : "Save draft"}</button>
          <button type="button" onClick={generateInfographic} disabled={saving || generating} className="rounded-lg bg-[var(--theme-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50">{generating ? "Generating…" : "Generate preview"}</button>
          <button type="button" onClick={togglePublication} disabled={publishing || !analysis} className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50">{publishing ? "Updating…" : analysis?.status === "published" ? "Unpublish" : "Publish"}</button>
        </div>
      </div>

      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      {notice && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="space-y-5 rounded-2xl border border-[var(--theme-border)] bg-white p-4 shadow-sm sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-[var(--theme-text)]">Analysis draft</h2>
            <p className="mt-1 text-sm text-[var(--theme-muted)]">Start with product information, then confirm every customer-facing claim.</p>
          </div>

          <label className="block text-sm font-medium text-[var(--theme-text)]">
            Infographic image
            <select value={draft.sourceImage} onChange={(event) => setDraft((current) => ({ ...current, sourceImage: event.target.value }))} className="mt-1.5 w-full rounded-lg border border-[var(--theme-border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--theme-primary)]">
              {images.map((image, index) => <option key={`${image}-${index}`} value={image}>Product image {index + 1}</option>)}
            </select>
          </label>

          {images.length > 1 && <div className="flex gap-2 overflow-x-auto pb-1">{images.map((image, index) => <button type="button" key={`${image}-thumb-${index}`} onClick={() => setDraft((current) => ({ ...current, sourceImage: image }))} className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-[var(--theme-background)] ${draft.sourceImage === image ? "border-[var(--theme-primary)]" : "border-transparent"}`} aria-label={`Use product image ${index + 1}`}><img src={image} alt="" className="h-full w-full object-contain" /></button>)}</div>}

          {draft.annotations.length === 0 && images.length > 0 && Array.isArray(product.specifications) && product.specifications.length > 0 && (
            <button type="button" onClick={() => setDraft(metadataDraft(product))} className="rounded-lg border border-dashed border-[var(--theme-border)] px-3 py-2 text-sm font-medium text-[var(--theme-primary)] hover:bg-[var(--theme-background)]">Prepare draft from listed specifications</button>
          )}

          <label className="block text-sm font-medium text-[var(--theme-text)]">
            Product summary
            <textarea rows={4} maxLength={500} value={draft.summary} onChange={(event) => setDraft((current) => ({ ...current, summary: event.target.value }))} className="mt-1.5 w-full resize-y rounded-lg border border-[var(--theme-border)] px-3 py-2.5 text-sm leading-6 outline-none focus:border-[var(--theme-primary)]" placeholder="Write a concise summary based on verified product information." />
            <span className="mt-1 block text-right text-xs text-[var(--theme-muted)]">{draft.summary.length}/500</span>
          </label>

          <div className="flex items-center justify-between gap-3">
            <div><h3 className="text-sm font-semibold text-[var(--theme-text)]">Feature annotations</h3><p className="text-xs text-[var(--theme-muted)]">Position markers on the image or adjust their coordinates.</p></div>
            <button type="button" onClick={addAnnotation} disabled={draft.annotations.length >= 8} className="shrink-0 rounded-lg border border-[var(--theme-border)] px-3 py-2 text-sm font-semibold text-[var(--theme-primary)] disabled:opacity-40">Add annotation</button>
          </div>

          <div className="relative mx-auto w-full max-w-lg overflow-hidden rounded-xl border border-[var(--theme-border)] bg-[var(--theme-background)] aspect-square" onClick={placeAnnotation} role="group" aria-label="Annotation positioning canvas">
            {draft.sourceImage ? <img src={draft.sourceImage} alt={`${product.productName} analysis source`} className="h-full w-full cursor-crosshair object-contain" /> : <div className="flex h-full items-center justify-center text-sm text-[var(--theme-muted)]">No product images available</div>}
            {draft.annotations.map((annotation, index) => <button key={`marker-${index}`} type="button" onClick={(event) => { event.stopPropagation(); setActiveAnnotation(index); }} style={{ left: `${annotation.x}%`, top: `${annotation.y}%` }} className={`absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-lg ${activeAnnotation === index ? "bg-[#B65C38] ring-2 ring-[#B65C38]/40" : "bg-[var(--theme-primary)]"}`} aria-label={`Select annotation ${index + 1}: ${annotation.label || "Untitled"}`}>{index + 1}</button>)}
          </div>

          <div className="space-y-4">
            {draft.annotations.map((annotation, index) => (
              <section key={`annotation-${index}`} aria-label={`Annotation ${index + 1}`} className={`space-y-3 rounded-xl border p-4 ${activeAnnotation === index ? "border-[var(--theme-primary)] bg-[var(--theme-background)]/50" : "border-[var(--theme-border)]"}`} onFocus={() => setActiveAnnotation(index)}>
                <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold text-[var(--theme-text)]">Annotation {index + 1}</h3><button type="button" onClick={() => { setDraft((current) => ({ ...current, annotations: current.annotations.filter((_, itemIndex) => itemIndex !== index) })); setActiveAnnotation(Math.max(0, index - 1)); }} className="text-xs font-medium text-red-700 hover:underline">Remove</button></div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-medium text-[var(--theme-muted)]">Type<select value={annotation.kind} onChange={(event) => updateAnnotation(index, { kind: event.target.value })} className="mt-1 block w-full rounded-md border border-[var(--theme-border)] bg-white px-2.5 py-2 text-sm text-[var(--theme-text)]"><option value="feature">Feature</option><option value="measurement">Verified measurement</option></select></label>
                  <label className="text-xs font-medium text-[var(--theme-muted)]">Label<input maxLength={60} value={annotation.label} onChange={(event) => updateAnnotation(index, { label: event.target.value })} className="mt-1 block w-full rounded-md border border-[var(--theme-border)] bg-white px-2.5 py-2 text-sm text-[var(--theme-text)]" /></label>
                </div>
                <label className="block text-xs font-medium text-[var(--theme-muted)]">Supporting detail<textarea maxLength={180} rows={2} value={annotation.description} onChange={(event) => updateAnnotation(index, { description: event.target.value })} className="mt-1 block w-full rounded-md border border-[var(--theme-border)] bg-white px-2.5 py-2 text-sm text-[var(--theme-text)]" /></label>
                {annotation.kind === "measurement" && <div className="grid grid-cols-2 gap-3"><label className="text-xs font-medium text-[var(--theme-muted)]">Verified value<input value={annotation.measurementValue} onChange={(event) => updateAnnotation(index, { measurementValue: event.target.value })} placeholder="e.g. 32" className="mt-1 block w-full rounded-md border border-[var(--theme-border)] bg-white px-2.5 py-2 text-sm text-[var(--theme-text)]" /></label><label className="text-xs font-medium text-[var(--theme-muted)]">Unit<input value={annotation.measurementUnit} onChange={(event) => updateAnnotation(index, { measurementUnit: event.target.value })} placeholder="cm, in, kg…" className="mt-1 block w-full rounded-md border border-[var(--theme-border)] bg-white px-2.5 py-2 text-sm text-[var(--theme-text)]" /></label></div>}
                <div className="grid grid-cols-2 gap-3"><label className="text-xs font-medium text-[var(--theme-muted)]">Image position X<input type="range" min="0" max="100" value={annotation.x} onChange={(event) => updateAnnotation(index, { x: Number(event.target.value) })} className="mt-2 block w-full accent-[var(--theme-primary)]" /><span>{annotation.x}%</span></label><label className="text-xs font-medium text-[var(--theme-muted)]">Image position Y<input type="range" min="0" max="100" value={annotation.y} onChange={(event) => updateAnnotation(index, { y: Number(event.target.value) })} className="mt-2 block w-full accent-[var(--theme-primary)]" /><span>{annotation.y}%</span></label></div>
                {annotation.kind === "measurement" && <div className="grid grid-cols-2 gap-3"><label className="text-xs font-medium text-[var(--theme-muted)]">Measurement end X<input type="range" min="0" max="100" value={annotation.x2} onChange={(event) => updateAnnotation(index, { x2: Number(event.target.value) })} className="mt-2 block w-full accent-[#B65C38]" /><span>{annotation.x2}%</span></label><label className="text-xs font-medium text-[var(--theme-muted)]">Measurement end Y<input type="range" min="0" max="100" value={annotation.y2} onChange={(event) => updateAnnotation(index, { y2: Number(event.target.value) })} className="mt-2 block w-full accent-[#B65C38]" /><span>{annotation.y2}%</span></label></div>}
                <label className="flex items-start gap-2 text-xs leading-5 text-[var(--theme-text)]"><input type="checkbox" checked={annotation.verified} onChange={(event) => updateAnnotation(index, { verified: event.target.checked })} className="mt-1 accent-[var(--theme-primary)]" />I verified this claim against the product information or directly confirmed measurement.</label>
              </section>
            ))}
          </div>

          {analysis && <button type="button" onClick={removeAnalysis} className="text-sm font-medium text-red-700 hover:underline">Remove saved analysis</button>}
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3"><div><h2 className="text-lg font-semibold text-[var(--theme-text)]">Live infographic preview</h2><p className="mt-1 text-sm text-[var(--theme-muted)]">Review the layout before generating and publishing.</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${analysis?.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>{analysis?.status || "new draft"}</span></div>
          {liveSvg ? <div className="overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-white shadow-sm [&>svg]:block [&>svg]:h-auto [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: liveSvg }} /> : <div className="flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-[var(--theme-border)] bg-white p-6 text-center text-sm text-[var(--theme-muted)]">Select a product image and add valid annotation labels to preview the infographic.</div>}
          {analysis?.infographicSvg && <p className="rounded-lg bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">Generated output is saved. Any edits require generating it again before publication.</p>}
          <p className="text-xs leading-5 text-[var(--theme-muted)]">This editor uses product metadata and administrator-entered annotations. It does not perform automated image recognition.</p>
        </section>
      </div>
    </main>
  );
}
