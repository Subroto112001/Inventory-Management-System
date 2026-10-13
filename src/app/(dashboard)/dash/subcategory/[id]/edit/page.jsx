"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary)]/10";

export default function EditSubcategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ subcategoryName: "", subcategoryCode: "", description: "", category: "" });
  const [currentImage, setCurrentImage] = useState("");
  const [preview, setPreview] = useState("");
  const [image, setImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch(`/api/subcategory/${id}`, { cache: "no-store" }).then(async (response) => { const data = await response.json(); if (!response.ok || !data.success) throw new Error(data.message || "Unable to load subcategory."); return data.subcategory; }),
      fetch("/api/category?list=1&type=category", { cache: "no-store" }).then(async (response) => { const data = await response.json(); if (!response.ok || !data.success) throw new Error(data.message || "Unable to load Categories."); return data.categories || []; }),
    ]).then(([subcategory, availableCategories]) => {
      if (!active) return;
      setCategories(availableCategories);
      setForm({ subcategoryName: subcategory.subcategoryName || "", subcategoryCode: subcategory.subcategoryCode || "", description: subcategory.description || "", category: subcategory.categoryId });
      setCurrentImage(subcategory.image?.url || subcategory.image || "");
    }).catch((loadError) => { if (active) setError(loadError.message || "Unable to load subcategory."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const selectImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) { setError("Choose a JPG, PNG, or WEBP image no larger than 5 MB."); event.target.value = ""; return; }
    if (preview) URL.revokeObjectURL(preview);
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setRemoveImage(false);
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.category) { setError("Select a Category for this subcategory."); return; }
    setSaving(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      body.append("removeImage", String(removeImage));
      if (image) body.append("image", image);
      const response = await fetch(`/api/subcategory/${id}`, { method: "PUT", body });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to save subcategory.");
      router.push("/dash/subcategory");
      router.refresh();
    } catch (saveError) {
      setError(saveError.message || "Unable to save subcategory.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading subcategory…</div>;
  return <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
    <header className="mb-6"><Link href="/dash/subcategory" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-primary)] hover:underline"><MdArrowBack /> Subcategories</Link><h1 className="text-2xl font-bold text-gray-900">Edit Subcategory</h1><p className="mt-1 text-sm text-gray-500">Update its details or move it to another Category.</p></header>
    {error && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <form onSubmit={submit} className="grid gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <div><label htmlFor="category" className="mb-2 block text-sm font-semibold text-gray-700">Category <span className="text-red-600">*</span></label><select id="category" required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} disabled={saving} className={inputClass}><option value="">Select a Category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.categoryName}</option>)}</select></div>
      <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="subcategoryName" className="mb-2 block text-sm font-semibold text-gray-700">Subcategory Name <span className="text-red-600">*</span></label><input id="subcategoryName" required maxLength={100} value={form.subcategoryName} onChange={(event) => setForm({ ...form, subcategoryName: event.target.value })} className={inputClass} /></div><div><label htmlFor="subcategoryCode" className="mb-2 block text-sm font-semibold text-gray-700">Permanent Subcategory Code</label><input id="subcategoryCode" readOnly maxLength={30} value={form.subcategoryCode} className={`${inputClass} bg-gray-100`} /></div></div>
      <div><label htmlFor="description" className="mb-2 block text-sm font-semibold text-gray-700">Description</label><textarea id="description" rows={4} maxLength={500} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className={inputClass} /></div>
      {(preview || (currentImage && !removeImage)) && <img src={preview || currentImage} alt="Subcategory" className="h-28 w-28 rounded-lg object-cover" />}
      <div><label htmlFor="image" className="mb-2 block text-sm font-semibold text-gray-700">Replace image</label><input id="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={selectImage} className="block text-sm text-gray-600" />{currentImage && <label className="mt-3 flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={removeImage} onChange={(event) => setRemoveImage(event.target.checked)} />Remove current image</label>}</div>
      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4"><Link href="/dash/subcategory" className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm">Cancel</Link><button type="submit" disabled={saving || !categories.length} className="rounded-lg bg-[var(--theme-primary)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : "Save Subcategory"}</button></div>
    </form>
  </div>;
}
