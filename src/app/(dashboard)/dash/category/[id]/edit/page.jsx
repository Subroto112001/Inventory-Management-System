"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const fieldClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[var(--theme-primary)] focus:bg-white";

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ categoryName: "", categoryCode: "", description: "" });
  const [image, setImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => () => { if (imagePreview) URL.revokeObjectURL(imagePreview); }, [imagePreview]);

  useEffect(() => {
    let active = true;
    fetch(`/api/category/${id}`, { cache: "no-store" }).then(async (response) => {
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to load category.");
      return data.category;
    }).then((category) => {
      if (!active) return;
      if (category.parentCategoryId) { router.replace(`/dash/subcategory/${id}/edit`); return; }
      setForm({ categoryName: category.categoryName, categoryCode: category.categoryCode, description: category.description || "" });
      setCurrentImage(category.image?.url || "");
    }).catch((error) => { if (active) setMessage(error.message || "Unable to load category."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    if (!form.categoryName.trim() || !form.categoryCode.trim()) {
      setMessage("Category name and code are required.");
      return;
    }
    setSaving(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      body.append("removeImage", String(removeImage));
      if (image) body.append("image", image);
      const response = await fetch(`/api/category/${id}`, { method: "PUT", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to update category.");
      setMessage(data.message || "Category updated successfully.");
      router.push("/dash/category");
      router.refresh();
    } catch (error) {
      setMessage(error.message || "Unable to update category.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="p-6 text-sm text-gray-500">Loading category…</main>;

  return (
    <main className="min-h-screen bg-[var(--theme-background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link href="/dash/category" className="text-sm font-medium text-[var(--theme-primary)] hover:underline">← Categories</Link>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">Edit Category</h1>
          <p className="mt-1 text-sm text-gray-500">Update category details. Product assignments remain intact.</p>
        </div>
        {message && <p role="status" className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div><label htmlFor="categoryName" className="mb-2 block text-sm font-semibold text-gray-700">Name</label><input id="categoryName" maxLength={100} className={fieldClass} value={form.categoryName} onChange={(event) => setForm({ ...form, categoryName: event.target.value })} /></div>
          <div><label htmlFor="categoryCode" className="mb-2 block text-sm font-semibold text-gray-700">Category code</label><input id="categoryCode" maxLength={30} className={fieldClass} value={form.categoryCode} onChange={(event) => setForm({ ...form, categoryCode: event.target.value.toUpperCase() })} /></div>
          <div><label htmlFor="description" className="mb-2 block text-sm font-semibold text-gray-700">Description</label><textarea id="description" rows={4} maxLength={500} className={fieldClass} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div>
          {(imagePreview || (currentImage && !removeImage)) && <img src={imagePreview || currentImage} alt={imagePreview ? "New category image preview" : "Current category"} className="h-24 w-24 rounded-lg object-cover" />}
          <div><label htmlFor="image" className="mb-2 block text-sm font-semibold text-gray-700">Replace image</label><input id="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
              setMessage("Choose a JPG, PNG, or WEBP image no larger than 5 MB.");
              event.target.value = "";
              return;
            }
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setRemoveImage(false);
            setMessage("");
          }} /><p className="mt-1 text-xs text-gray-500">JPG, PNG, or WEBP, up to 5 MB.</p></div>
          {currentImage && <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={removeImage} onChange={(event) => setRemoveImage(event.target.checked)} />Remove current image</label>}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4"><Link href="/dash/category" className="rounded-lg border border-gray-200 px-4 py-2 text-sm">Cancel</Link><button disabled={saving} className="rounded-lg bg-[var(--theme-primary)] px-5 py-2 text-sm font-medium text-white disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button></div>
        </form>
      </div>
    </main>
  );
}
