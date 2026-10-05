"use client";

import { useEffect, useRef, useState } from "react";

const emptyForm = {
  id: "",
  title: "",
  subtitle: "",
  badge: "",
  buttonText: "Shop now",
  buttonUrl: "/product",
  sortOrder: 0,
  isActive: true,
};

export default function HomepageSlidersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [mobileImageFile, setMobileImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);
  const mobileFileInputRef = useRef(null);

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/homepage/sliders?admin=1");
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Unable to load sliders");
      setItems(data.slides || []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setMobileImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (mobileFileInputRef.current) mobileFileInputRef.current.value = "";
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = new FormData();
      if (form.id) payload.append("id", form.id);
      payload.append("title", form.title);
      payload.append("subtitle", form.subtitle || "");
      payload.append("badge", form.badge || "");
      payload.append("buttonText", form.buttonText || "Shop now");
      payload.append("buttonUrl", form.buttonUrl || "/product");
      payload.append("sortOrder", String(form.sortOrder ?? 0));
      payload.append("isActive", String(form.isActive));
      if (imageFile) payload.append("image", imageFile);
      if (mobileImageFile) payload.append("mobileImage", mobileImageFile);

      const method = form.id ? "PUT" : "POST";
      const response = await fetch("/api/homepage/sliders", {
        method,
        body: payload,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save slider");
      }

      await loadItems();
      resetForm();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (slider) => {
    setForm({
      id: slider.id,
      title: slider.title,
      subtitle: slider.subtitle || "",
      badge: slider.badge || "",
      buttonText: slider.buttonText || "Shop now",
      buttonUrl: slider.buttonUrl || "/product",
      sortOrder: slider.sortOrder ?? 0,
      isActive: Boolean(slider.isActive),
    });
    setEditingId(slider.id);
    setImageFile(null);
    setMobileImageFile(null);
  };

  const handleDelete = async (sliderId) => {
    if (!window.confirm("Remove this homepage slider?")) return;

    try {
      const response = await fetch(
        `/api/homepage/sliders?id=${encodeURIComponent(sliderId)}`,
        {
          method: "DELETE",
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Unable to delete slider");
      if (editingId === sliderId) resetForm();
      await loadItems();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const handleToggle = async (sliderId, currentValue) => {
    try {
      const response = await fetch("/api/homepage/sliders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sliderId, isActive: !currentValue }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Unable to update slider");
      await loadItems();
    } catch (toggleError) {
      setError(toggleError.message);
    }
  };

  const handleReorder = async (sliderId, direction) => {
    const slide = items.find((item) => item.id === sliderId);
    if (!slide) return;

    const nextOrder = (slide.sortOrder ?? 0) + direction;
    try {
      const response = await fetch("/api/homepage/sliders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sliderId, sortOrder: nextOrder }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Unable to reorder slider");
      await loadItems();
    } catch (reorderError) {
      setError(reorderError.message);
    }
  };

  return (
    <section className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A8378]">
            storefront
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#211F1D]">
            Homepage sliders
          </h1>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="rounded-md bg-[#1F3A2E] px-4 py-2 text-sm font-medium text-white"
        >
          New slider
        </button>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-[#E4DED2] bg-white p-5 shadow-sm"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#211F1D]">
              {editingId ? "Edit slider" : "Add slider"}
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#211F1D]">
                Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-md border border-[#E4DED2] px-3 py-2 outline-none focus:border-[#1F3A2E]"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#211F1D]">
                Subtitle
              </label>
              <textarea
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-[#E4DED2] px-3 py-2 outline-none focus:border-[#1F3A2E]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#211F1D]">
                  Badge
                </label>
                <input
                  name="badge"
                  value={form.badge}
                  onChange={handleChange}
                  className="w-full rounded-md border border-[#E4DED2] px-3 py-2 outline-none focus:border-[#1F3A2E]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#211F1D]">
                  Order
                </label>
                <input
                  name="sortOrder"
                  type="number"
                  value={form.sortOrder}
                  onChange={handleChange}
                  className="w-full rounded-md border border-[#E4DED2] px-3 py-2 outline-none focus:border-[#1F3A2E]"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#211F1D]">
                  Button text
                </label>
                <input
                  name="buttonText"
                  value={form.buttonText}
                  onChange={handleChange}
                  className="w-full rounded-md border border-[#E4DED2] px-3 py-2 outline-none focus:border-[#1F3A2E]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#211F1D]">
                  Button URL
                </label>
                <input
                  name="buttonUrl"
                  value={form.buttonUrl}
                  onChange={handleChange}
                  className="w-full rounded-md border border-[#E4DED2] px-3 py-2 outline-none focus:border-[#1F3A2E]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#211F1D]">
                Main image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setImageFile(event.target.files?.[0] || null)
                }
                className="w-full rounded-md border border-dashed border-[#E4DED2] bg-[#F7F3EC] px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#211F1D]">
                Mobile image (optional)
              </label>
              <input
                ref={mobileFileInputRef}
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setMobileImageFile(event.target.files?.[0] || null)
                }
                className="w-full rounded-md border border-dashed border-[#E4DED2] bg-[#F7F3EC] px-3 py-2"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-[#211F1D]">
              <input
                type="checkbox"
                name="isActive"
                checked={Boolean(form.isActive)}
                onChange={handleChange}
              />
              Active
            </label>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-[#1F3A2E] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update slider"
                  : "Create slider"}
            </button>

            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm text-[#1F3A2E]"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div className="rounded-xl border border-[#E4DED2] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#211F1D]">
              Current slides
            </h2>
            <span className="text-sm text-[#8A8378]">{items.length} total</span>
          </div>

          {loading ? (
            <div className="text-sm text-[#8A8378]">Loading slides...</div>
          ) : items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#E4DED2] px-4 py-10 text-center text-sm text-[#8A8378]">
              No homepage sliders yet.
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-lg border border-[#E4DED2] p-3"
                >
                  <img
                    src={item.image || "/placeholder-product.svg"}
                    alt={item.title}
                    className="h-20 w-28 rounded-md object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#211F1D]">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-[#8A8378]">
                          {item.badge || "Standard"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                          item.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.isActive ? "Active" : "Disabled"}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-xs text-[#5B564C]">
                      {item.subtitle || "No subtitle"}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#8A8378]">
                      <span>Order: {item.sortOrder ?? 0}</span>
                      <span>•</span>
                      <span>{item.buttonText || "Shop now"}</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEditing(item)}
                        className="rounded-md border border-[#E4DED2] px-3 py-1.5 text-xs font-medium text-[#211F1D]"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggle(item.id, item.isActive)}
                        className="rounded-md border border-[#E4DED2] px-3 py-1.5 text-xs font-medium text-[#211F1D]"
                      >
                        {item.isActive ? "Disable" : "Enable"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReorder(item.id, -1)}
                        className="rounded-md border border-[#E4DED2] px-2 py-1.5 text-xs font-medium text-[#211F1D]"
                      >
                        ↑
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReorder(item.id, 1)}
                        className="rounded-md border border-[#E4DED2] px-2 py-1.5 text-xs font-medium text-[#211F1D]"
                      >
                        ↓
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
