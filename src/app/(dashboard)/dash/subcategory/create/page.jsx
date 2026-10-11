"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack, MdCategory, MdCloudUpload } from "react-icons/md";

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary)]/10";

export default function CreateSubcategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [form, setForm] = useState({ categoryName: "", categoryCode: "", description: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/category?list=1&type=category", { cache: "no-store" })
      .then(async (response) => { const data = await response.json(); if (!response.ok || !data.success) throw new Error(data.message || "Unable to load Categories."); return data.categories || []; })
      .then((items) => { if (active) setCategories(items); })
      .catch((loadError) => { if (active) setError(loadError.message || "Unable to load Categories."); })
      .finally(() => { if (active) setLoadingCategories(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const selectImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError("Choose a JPG, PNG, or WEBP image no larger than 5 MB.");
      event.target.value = "";
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!categoryId) { setError("Select a Category for this subcategory."); return; }
    if (!form.categoryName.trim() || !form.categoryCode.trim()) { setError("Subcategory name and code are required."); return; }
    setSaving(true);
    try {
      const body = new FormData();
      body.append("subcategoryName", form.categoryName.trim());
      body.append("subcategoryCode", form.categoryCode.trim().toUpperCase());
      body.append("description", form.description.trim());
      body.append("category", categoryId);
      if (image) body.append("image", image);
      const response = await fetch("/api/subcategory", { method: "POST", body });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to create subcategory.");
      router.push("/dash/subcategory");
      router.refresh();
    } catch (saveError) {
      setError(saveError.message || "Unable to create subcategory.");
    } finally {
      setSaving(false);
    }
  };

  return <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
    <header className="mb-6"><Link href="/dash/subcategory" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-primary)] hover:underline"><MdArrowBack /> Subcategories</Link><h1 className="text-2xl font-bold text-gray-900">Create Subcategory</h1><p className="mt-1 text-sm text-gray-500">Every subcategory belongs to one existing Category.</p></header>
    {error && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {!loadingCategories && categories.length === 0 ? <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"><p className="font-semibold">Create a Category first</p><p className="mt-1">A subcategory must be linked to an existing Category.</p><Link href="/dash/category/create" className="mt-3 inline-flex font-semibold underline">Open Category Management</Link></div> : <form onSubmit={submit} className="grid gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <div><label htmlFor="category" className="mb-2 block text-sm font-semibold text-gray-700">Category <span className="text-red-600">*</span></label><select id="category" required value={categoryId} onChange={(event) => setCategoryId(event.target.value)} disabled={loadingCategories || saving} className={inputClass}><option value="">{loadingCategories ? "Loading Categories…" : "Select a Category"}</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.categoryName}</option>)}</select></div>
      <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="categoryName" className="mb-2 block text-sm font-semibold text-gray-700">Subcategory Name <span className="text-red-600">*</span></label><input id="categoryName" required maxLength={100} value={form.categoryName} onChange={(event) => setForm({ ...form, categoryName: event.target.value })} className={inputClass} /></div><div><label htmlFor="categoryCode" className="mb-2 block text-sm font-semibold text-gray-700">Subcategory Code <span className="text-red-600">*</span></label><input id="categoryCode" required maxLength={30} value={form.categoryCode} onChange={(event) => setForm({ ...form, categoryCode: event.target.value.toUpperCase().replace(/\s/g, "") })} className={inputClass} /></div></div>
      <div><label htmlFor="description" className="mb-2 block text-sm font-semibold text-gray-700">Description</label><textarea id="description" rows={4} maxLength={500} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className={inputClass} /></div>
      <div><label htmlFor="image" className="mb-2 block text-sm font-semibold text-gray-700">Subcategory Image</label><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 p-4 hover:border-[var(--theme-primary)]"><MdCloudUpload size={22} className="text-[var(--theme-primary)]" /><span className="text-sm text-gray-600">Choose a JPG, PNG, or WEBP image (up to 5 MB)</span><input id="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={selectImage} className="sr-only" /></label>{preview && <img src={preview} alt="Subcategory preview" className="mt-3 h-28 w-28 rounded-lg object-cover" />}</div>
      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4"><Link href="/dash/subcategory" className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm">Cancel</Link><button type="submit" disabled={saving || loadingCategories || categories.length === 0} className="inline-flex items-center gap-2 rounded-lg bg-[var(--theme-primary)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><MdCategory />{saving ? "Creating…" : "Create Subcategory"}</button></div>
    </form>}
  </div>;
}
