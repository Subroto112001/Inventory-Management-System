"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MdArrowBack,
  MdInventory2,
  MdCloudUpload,
  MdClose,
  MdImage,
  MdCheckCircle,
  MdErrorOutline,
} from "react-icons/md";

// Change these if your routes are different
const PRODUCT_API = "/api/product";
const CATEGORY_LIST_API = "/api/category?list=1";
const PRODUCT_LIST_PAGE = "/dash/products";

const INITIAL_FORM = {
  productName: "",
  productSKU: "",
  category: "",
  brandName: "",
  unit: "",
  description: "",
  specifications: "[]",
  price: "",
  wholesalePrice: "",
  discount: "",
  quantity: "",
  initialStock: "",
  lowStockAlert: "",
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[var(--theme-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--theme-primary)]/10 disabled:cursor-not-allowed disabled:opacity-60";

const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

export default function AddProductPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(INITIAL_FORM);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // =====================================================
  // LOAD CATEGORIES
  // =====================================================

  useEffect(() => {
    let ignore = false;

    const loadCategories = async () => {
      try {
        const res = await fetch(CATEGORY_LIST_API);
        const data = await res.json();

        if (!ignore && res.ok) {
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Load categories error:", error);
      } finally {
        if (!ignore) setCategoriesLoading(false);
      }
    };

    loadCategories();

    return () => {
      ignore = true;
    };
  }, []);

  // =====================================================
  // CLEANUP IMAGE PREVIEW
  // =====================================================

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const clearMessage = () => {
    if (message.text) setMessage({ type: "", text: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearMessage();
  };

  const handleSKUChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/\s/g, "");
    setFormData((prev) => ({ ...prev, productSKU: value }));
    clearMessage();
  };

  // =====================================================
  // IMAGE
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select a valid image file." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size must be less than 5MB." });
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    clearMessage();
  };

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setImage(null);
    setImagePreview("");

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    handleRemoveImage();
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validate = () => {
    if (!formData.productName.trim()) return "Product name is required.";
    if (formData.productName.trim().length > 150)
      return "Product name cannot exceed 150 characters.";
    if (!formData.productSKU.trim()) return "Product SKU is required.";
    if (!formData.category) return "Please select a category.";

    if (formData.price === "" || Number(formData.price) < 0)
      return "Enter a valid price.";

    if (
      formData.wholesalePrice !== "" &&
      Number(formData.wholesalePrice) < 0
    )
      return "Wholesale price cannot be negative.";

    if (
      formData.discount !== "" &&
      (Number(formData.discount) < 0 || Number(formData.discount) > 100)
    )
      return "Discount must be between 0 and 100%.";

    if (formData.quantity !== "" && Number(formData.quantity) < 0)
      return "Quantity cannot be negative.";

    for (const key of ["initialStock", "lowStockAlert"]) {
      if (
        formData[key] !== "" &&
        (!Number.isInteger(Number(formData[key])) || Number(formData[key]) < 0)
      ) {
        return "Stock values must be non-negative whole numbers.";
      }
    }

    if (formData.description.trim().length > 2000)
      return "Description cannot exceed 2000 characters.";

    return "";
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const error = validate();
    if (error) {
      setMessage({ type: "error", text: error });
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("productName", formData.productName.trim());
      data.append("productSKU", formData.productSKU.trim().toUpperCase());
      data.append("category", formData.category);
      data.append("brandName", formData.brandName.trim());
      data.append("unit", formData.unit.trim());
      data.append("description", formData.description.trim());
      data.append("specifications", formData.specifications);
      data.append("price", formData.price);
      data.append("wholesalePrice", formData.wholesalePrice);
      data.append("discount", formData.discount || "0");
      data.append("quantity", formData.quantity || "0");
      data.append("initialStock", formData.initialStock || "0");
      data.append("lowStockAlert", formData.lowStockAlert || "0");

      if (image) data.append("image", image);

      const response = await fetch(PRODUCT_API, {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to add product.");
      }

      setMessage({
        type: "success",
        text: result?.message || "Product published successfully!",
      });

      resetForm();

      setTimeout(() => {
        router.push(PRODUCT_LIST_PAGE);
      }, 1000);
    } catch (err) {
      console.error("Add Product Error:", err);
      setMessage({
        type: "error",
        text: err?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  
  // UI

  return (
    <main className="min-h-screen bg-[var(--theme-background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href={PRODUCT_LIST_PAGE}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-white"
          >
            <MdArrowBack size={21} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Add Product
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Add a new product and choose its category.
            </p>
          </div>
        </div>

        {/* MESSAGE */}
        {message.text && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 ${
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <MdCheckCircle className="mt-0.5 shrink-0" size={20} />
            ) : (
              <MdErrorOutline className="mt-0.5 shrink-0" size={20} />
            )}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* PRODUCT INFORMATION */}
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]">
                      <MdInventory2 size={22} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        Product Information
                      </h2>
                      <p className="text-xs text-gray-500">
                        Name, SKU, category and description.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 p-6">
                  {/* NAME */}
                  <div>
                    <label htmlFor="productName" className={labelClass}>
                      Product Name
                      <span className="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      id="productName"
                      name="productName"
                      type="text"
                      value={formData.productName}
                      onChange={handleChange}
                      placeholder="e.g. Wireless Mouse"
                      maxLength={150}
                      disabled={loading}
                      className={inputClass}
                    />
                    <div className="mt-1.5 flex justify-end">
                      <span className="text-xs text-gray-400">
                        {formData.productName.length}/150
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* SKU */}
                    <div>
                      <label htmlFor="productSKU" className={labelClass}>
                        SKU
                        <span className="ml-1 text-red-500">*</span>
                      </label>
                      <input
                        id="productSKU"
                        name="productSKU"
                        type="text"
                        value={formData.productSKU}
                        onChange={handleSKUChange}
                        placeholder="e.g. WM-001"
                        disabled={loading}
                        className={`${inputClass} font-medium uppercase tracking-wide placeholder:normal-case placeholder:tracking-normal`}
                      />
                    </div>

                    {/* CATEGORY */}
                    <div>
                      <label htmlFor="category" className={labelClass}>
                        Category
                        <span className="ml-1 text-red-500">*</span>
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        disabled={loading || categoriesLoading}
                        className={inputClass}
                      >
                        <option value="">
                          {categoriesLoading
                            ? "Loading categories..."
                            : "Select a category"}
                        </option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.categoryName} ({c.categoryCode})
                          </option>
                        ))}
                      </select>

                      {!categoriesLoading && categories.length === 0 && (
                        <p className="mt-1.5 text-xs text-red-500">
                          No categories found.{" "}
                          <Link
                            href="/dash/category/create"
                            className="font-semibold underline"
                          >
                            Create a category first
                          </Link>
                          .
                        </p>
                      )}
                    </div>

                    {/* BRAND */}
                    <div>
                      <label htmlFor="brandName" className={labelClass}>
                        Brand
                      </label>
                      <input
                        id="brandName"
                        name="brandName"
                        type="text"
                        value={formData.brandName}
                        onChange={handleChange}
                        placeholder="e.g. Logitech"
                        disabled={loading}
                        className={inputClass}
                      />
                    </div>

                    {/* UNIT */}
                    <div>
                      <label htmlFor="unit" className={labelClass}>
                        Unit
                      </label>
                      <input
                        id="unit"
                        name="unit"
                        type="text"
                        value={formData.unit}
                        onChange={handleChange}
                        placeholder="e.g. pcs, kg, box"
                        disabled={loading}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="description"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        Description
                      </label>
                      <span className="text-xs text-gray-400">
                        {formData.description.length}/2000
                      </span>
                    </div>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Write a short description about this product..."
                      maxLength={2000}
                      rows={5}
                      disabled={loading}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6"><label htmlFor="specifications" className={labelClass}>Product specifications (JSON name/value pairs)</label><textarea id="specifications" name="specifications" value={formData.specifications} onChange={handleChange} rows={5} disabled={loading} className={inputClass} /></div>

              {/* PRICING */}
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-5">
                  <h2 className="font-semibold text-gray-900">Pricing</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Selling price, wholesale price and discount.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-3">
                  <div>
                    <label htmlFor="price" className={labelClass}>
                      Price
                      <span className="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="wholesalePrice" className={labelClass}>
                      Wholesale Price
                    </label>
                    <input
                      id="wholesalePrice"
                      name="wholesalePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.wholesalePrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="discount" className={labelClass}>
                      Discount (%)
                    </label>
                    <input
                      id="discount"
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.discount}
                      onChange={handleChange}
                      placeholder="0"
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* INVENTORY */}
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-5">
                  <h2 className="font-semibold text-gray-900">Inventory</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Opening stock and low stock warning level.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-3">
                  <div>
                    <label htmlFor="quantity" className={labelClass}>
                      Quantity
                    </label>
                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="0"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="0"
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="initialStock" className={labelClass}>
                      Initial Stock
                    </label>
                    <input
                      id="initialStock"
                      name="initialStock"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.initialStock}
                      onChange={handleChange}
                      placeholder="0"
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="lowStockAlert" className={labelClass}>
                      Low Stock Alert
                    </label>
                    <input
                      id="lowStockAlert"
                      name="lowStockAlert"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.lowStockAlert}
                      onChange={handleChange}
                      placeholder="0"
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: IMAGE */}
            <div className="h-fit rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="font-semibold text-gray-900">Product Image</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Upload an image for this product.
                </p>
              </div>

              <div className="p-6">
                {imagePreview ? (
                  <div>
                    <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={loading}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-md transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed"
                      >
                        <MdClose size={20} />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <MdImage size={20} className="shrink-0 text-[var(--theme-primary)]" />
                      <span className="truncate text-sm font-medium text-gray-700">
                        {image?.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={loading}
                      className="mt-3 text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="flex aspect-square w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 text-center transition hover:border-[var(--theme-primary)]/50 hover:bg-[var(--theme-primary)]/5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]">
                      <MdCloudUpload size={30} />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">
                      Upload product image
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Click to select an image
                    </p>
                    <p className="mt-3 text-xs text-gray-400">
                      JPG, JPEG, PNG or WEBP
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Maximum size: 5MB
                    </p>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href={PRODUCT_LIST_PAGE}
              className={`flex h-12 items-center justify-center rounded-xl border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 ${
                loading ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading || categoriesLoading}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--theme-primary)] px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--theme-primary-hover)] focus:outline-none focus:ring-4 focus:ring-[var(--theme-primary)]/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Adding...
                </>
              ) : (
                <>
                  <MdCheckCircle size={20} />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}