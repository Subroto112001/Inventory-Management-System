"use client";

import { useEffect, useRef, useState } from "react";
import { SpecialOfferBannerView } from "@/Component/website/Homepage/SpecialOfferBanner";

const DEFAULTS = {
  isEnabled: false,
  heading: "Get Special Offers",
  offerType: "percentage",
  discountValue: 10,
  customOfferText: "",
  description: "Join our list for thoughtful updates and special savings.",
  leftImage: null,
  rightImage: null,
  backgroundColor: "#F1F3F5",
  textColor: "#111318",
  accentColor: "#000000",
  buttonText: "",
  buttonUrl: "",
  terms: "",
  startDate: "",
  endDate: "",
  visibilityMode: "hide",
  showSubscription: true,
  removeLeftImage: false,
  removeRightImage: false,
};

function toLocalDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function toISOString(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : "";
}

function offerText(form) {
  if (form.offerType === "custom") return form.customOfferText;
  if (form.offerType === "fixed") return `$${Number(form.discountValue || 0).toFixed(2)} Off`;
  return `${Number(form.discountValue || 0)}% Off`;
}

export default function SpecialOfferBannerPage() {
  const [form, setForm] = useState(DEFAULTS);
  const [selectedFiles, setSelectedFiles] = useState({ leftImageFile: null, rightImageFile: null });
  const [previews, setPreviews] = useState({ leftImage: "", rightImage: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const previewUrls = useRef([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/homepage/special-offer")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load the banner settings");
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        const banner = data.banner || DEFAULTS;
        setForm({
          ...DEFAULTS,
          ...banner,
          startDate: toLocalDateTime(banner.startDate),
          endDate: toLocalDateTime(banner.endDate),
          removeLeftImage: false,
          removeRightImage: false,
        });
      })
      .catch((loadError) => { if (!cancelled) setError(loadError.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => {
      cancelled = true;
      previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const setField = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const pickImage = (side, file) => {
    if (!file) return;
    setError("");
    if (!file.type?.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setError("Choose an image file no larger than 5 MB.");
      return;
    }
    const url = URL.createObjectURL(file);
    previewUrls.current.push(url);
    const fileKey = `${side}File`;
    setSelectedFiles((current) => ({ ...current, [fileKey]: file }));
    setPreviews((current) => ({ ...current, [side]: url }));
    setForm((current) => ({ ...current, [`remove${side[0].toUpperCase()}${side.slice(1)}`]: false }));
  };

  const removeImage = (side) => {
    setPreviews((current) => ({ ...current, [side]: "" }));
    setSelectedFiles((current) => ({ ...current, [`${side}File`]: null }));
    setForm((current) => ({ ...current, [`remove${side[0].toUpperCase()}${side.slice(1)}`]: true }));
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = new FormData();
      for (const [key, value] of Object.entries(form)) {
        if (["leftImage", "rightImage", "startDate", "endDate"].includes(key)) continue;
        payload.append(key, String(value ?? ""));
      }
      payload.append("startDate", toISOString(form.startDate));
      payload.append("endDate", toISOString(form.endDate));
      if (selectedFiles.leftImageFile) payload.append("leftImageFile", selectedFiles.leftImageFile);
      if (selectedFiles.rightImageFile) payload.append("rightImageFile", selectedFiles.rightImageFile);

      const response = await fetch("/api/homepage/special-offer", { method: "PUT", body: payload });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save the banner");

      setForm({
        ...DEFAULTS,
        ...data.banner,
        startDate: toLocalDateTime(data.banner.startDate),
        endDate: toLocalDateTime(data.banner.endDate),
        removeLeftImage: false,
        removeRightImage: false,
      });
      setSelectedFiles({ leftImageFile: null, rightImageFile: null });
      setPreviews({ leftImage: "", rightImage: "" });
      setMessage("Special offer banner saved.");
    } catch (saveError) {
      setError(saveError.message || "Unable to save the banner");
    } finally {
      setSaving(false);
    }
  };

  const previewBanner = {
    ...form,
    leftImage: previews.leftImage || (form.removeLeftImage ? "" : form.leftImage?.url || ""),
    rightImage: previews.rightImage || (form.removeRightImage ? "" : form.rightImage?.url || ""),
    offerText: offerText(form),
    scheduleStatus: "active",
  };

  if (loading) return <section className="mx-auto max-w-6xl p-6 text-sm text-[var(--theme-muted)]" role="status">Loading special offer settings…</section>;

  return (
    <section className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--theme-muted)]">Storefront</p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--theme-text)]">Special offer banner</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--theme-muted)]">Manage the homepage promotion, images, schedule, and optional email subscriptions.</p>
      </header>

      {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p> : null}
      {message ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{message}</p> : null}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,1.1fr)]">
        <form onSubmit={save} className="space-y-5 rounded-2xl border border-[var(--theme-border)] bg-white p-4 shadow-sm sm:p-6">
          <label className="flex items-center gap-3 rounded-xl bg-[var(--theme-surface-alt)] p-3 text-sm font-semibold text-[var(--theme-text)]">
            <input type="checkbox" name="isEnabled" checked={Boolean(form.isEnabled)} onChange={setField} className="h-4 w-4 accent-black" />
            Enable the special offer banner
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-[var(--theme-text)] sm:col-span-2">Heading
              <input name="heading" value={form.heading} onChange={setField} maxLength={100} required={form.isEnabled} className="mt-1.5 w-full rounded-lg border border-[var(--theme-border)] bg-white px-3 py-2.5 outline-none focus:border-[var(--theme-primary)]" />
            </label>
            <label className="text-sm font-medium text-[var(--theme-text)]">Offer type
              <select name="offerType" value={form.offerType} onChange={setField} className="mt-1.5 w-full rounded-lg border border-[var(--theme-border)] bg-white px-3 py-2.5 outline-none focus:border-[var(--theme-primary)]">
                <option value="percentage">Percentage discount</option><option value="fixed">Fixed discount</option><option value="custom">Custom promotional text</option>
              </select>
            </label>
            {form.offerType === "custom" ? (
              <label className="text-sm font-medium text-[var(--theme-text)]">Offer text
                <input name="customOfferText" value={form.customOfferText} onChange={setField} maxLength={100} required className="mt-1.5 w-full rounded-lg border border-[var(--theme-border)] bg-white px-3 py-2.5 outline-none focus:border-[var(--theme-primary)]" placeholder="Free delivery this week" />
              </label>
            ) : (
              <label className="text-sm font-medium text-[var(--theme-text)]">Discount value
                <input name="discountValue" type="number" min={form.offerType === "fixed" ? "0.01" : "0"} max={form.offerType === "percentage" ? "100" : "1000000"} step="0.01" value={form.discountValue} onChange={setField} required className="mt-1.5 w-full rounded-lg border border-[var(--theme-border)] bg-white px-3 py-2.5 outline-none focus:border-[var(--theme-primary)]" />
              </label>
            )}
            <label className="text-sm font-medium text-[var(--theme-text)] sm:col-span-2">Description
              <textarea name="description" value={form.description} onChange={setField} rows={3} maxLength={400} className="mt-1.5 w-full rounded-lg border border-[var(--theme-border)] bg-white px-3 py-2.5 outline-none focus:border-[var(--theme-primary)]" />
            </label>
          </div>

          <fieldset className="space-y-3 rounded-xl border border-[var(--theme-border)] p-4">
            <legend className="px-1 text-sm font-semibold text-[var(--theme-text)]">Promotional images</legend>
            {[["leftImage", "Left image"], ["rightImage", "Right image"]].map(([side, label]) => {
              const image = form[side];
              const removeKey = `remove${side[0].toUpperCase()}${side.slice(1)}`;
              return <div key={side} className="flex flex-wrap items-center gap-3 rounded-lg bg-[var(--theme-surface-alt)] p-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
                  {(previews[side] || (!form[removeKey] && image?.url)) ? <img src={previews[side] || image.url} alt={`${label} preview`} className="h-full w-full object-cover" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <label className="block text-sm font-medium text-[var(--theme-text)]">{label}
                    <input type="file" accept="image/*" onChange={(event) => pickImage(side, event.target.files?.[0])} className="mt-1 block w-full text-xs text-[var(--theme-muted)] file:mr-3 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-2 file:text-xs file:font-semibold" />
                  </label>
                  <p className="mt-1 text-xs text-[var(--theme-muted)]">Image files up to 5 MB.</p>
                </div>
                {(image?.url || previews[side]) && !form[removeKey] ? <button type="button" onClick={() => removeImage(side)} className="rounded-md border border-[var(--theme-border)] px-3 py-2 text-xs font-semibold text-[var(--theme-text)] hover:bg-white">Remove</button> : null}
              </div>;
            })}
          </fieldset>

          <fieldset className="grid gap-4 rounded-xl border border-[var(--theme-border)] p-4 sm:grid-cols-3">
            <legend className="px-1 text-sm font-semibold text-[var(--theme-text)]">Banner colors</legend>
            {[["backgroundColor", "Background"], ["textColor", "Text"], ["accentColor", "Accent"]].map(([name, label]) => <label key={name} className="flex items-center gap-2 text-xs font-medium text-[var(--theme-muted)]">{label}<input type="color" name={name} value={form[name]} onChange={setField} className="h-9 min-w-0 flex-1 cursor-pointer rounded border border-[var(--theme-border)] bg-white p-1" /></label>)}
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-[var(--theme-text)]">Button text (optional)
              <input name="buttonText" value={form.buttonText} onChange={setField} maxLength={40} className="mt-1.5 w-full rounded-lg border border-[var(--theme-border)] px-3 py-2.5 outline-none focus:border-[var(--theme-primary)]" />
            </label>
            <label className="text-sm font-medium text-[var(--theme-text)]">Destination URL
              <input name="buttonUrl" value={form.buttonUrl} onChange={setField} maxLength={300} placeholder="/product or https://…" className="mt-1.5 w-full rounded-lg border border-[var(--theme-border)] px-3 py-2.5 outline-none focus:border-[var(--theme-primary)]" />
            </label>
            <label className="text-sm font-medium text-[var(--theme-text)]">Starts at (optional)
              <input type="datetime-local" name="startDate" value={form.startDate} onChange={setField} className="mt-1.5 w-full rounded-lg border border-[var(--theme-border)] px-3 py-2.5 outline-none focus:border-[var(--theme-primary)]" />
            </label>
            <label className="text-sm font-medium text-[var(--theme-text)]">Ends at (optional)
              <input type="datetime-local" name="endDate" value={form.endDate} onChange={setField} className="mt-1.5 w-full rounded-lg border border-[var(--theme-border)] px-3 py-2.5 outline-none focus:border-[var(--theme-primary)]" />
            </label>
          </div>

          <label className="block text-sm font-medium text-[var(--theme-text)]">Outside schedule
            <select name="visibilityMode" value={form.visibilityMode} onChange={setField} className="mt-1.5 w-full rounded-lg border border-[var(--theme-border)] bg-white px-3 py-2.5 outline-none focus:border-[var(--theme-primary)]">
              <option value="hide">Hide the banner</option><option value="show-status">Show a coming soon or ended message</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-[var(--theme-text)]">Terms and conditions (optional)
            <textarea name="terms" value={form.terms} onChange={setField} maxLength={2000} rows={2} className="mt-1.5 w-full rounded-lg border border-[var(--theme-border)] px-3 py-2.5 outline-none focus:border-[var(--theme-primary)]" />
          </label>

          <label className="flex items-center gap-3 text-sm font-medium text-[var(--theme-text)]">
            <input type="checkbox" name="showSubscription" checked={Boolean(form.showSubscription)} onChange={setField} className="h-4 w-4 accent-black" />
            Show the newsletter subscription form
          </label>

          <button type="submit" disabled={saving} className="w-full rounded-xl bg-[var(--theme-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--theme-primary-hover)] disabled:cursor-wait disabled:opacity-60 sm:w-auto">
            {saving ? "Saving…" : "Save special offer banner"}
          </button>
        </form>

        <aside className="min-w-0 rounded-2xl border border-[var(--theme-border)] bg-white p-3 shadow-sm sm:p-5 xl:sticky xl:top-5">
          <div className="mb-2 px-2 pt-1">
            <h2 className="text-lg font-semibold text-[var(--theme-text)]">Live preview</h2>
            <p className="mt-1 text-xs text-[var(--theme-muted)]">Preview updates as you edit. It is not published until saved.</p>
          </div>
          <SpecialOfferBannerView banner={previewBanner} preview />
        </aside>
      </div>
    </section>
  );
}
