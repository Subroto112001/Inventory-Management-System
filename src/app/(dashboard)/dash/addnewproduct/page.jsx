"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/Component/RichTextEditor";
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
  brand: "",
  unit: "",
  description: "",
  specifications: "",
  price: "",
  wholesalePrice: "",
  discount: "",
  quantity: "",
  initialStock: "",
  lowStockAlert: "",
  shippingCharge: "",
  deliveryEstimate: "",
  freeShipping: false,
  shippingInstructions: "",
  paymentOption: "COD_ONLY",
  returnEligible: "",
  returnWindowDays: "",
  returnConditions: "",
  returnInstructions: "",
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
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [brandsError, setBrandsError] = useState("");

  const [images, setImages] = useState([]);
  const imagesRef = useRef([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [summaryErrors, setSummaryErrors] = useState([]);

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

  useEffect(() => {
    let ignore = false;
    const loadBrands = async () => {
      try {
        const allBrands = [];
        let page = 1;
        let totalPages = 1;
        do {
          const res = await fetch(`/api/brand?page=${page}&limit=100`);
          const data = await res.json();
          if (!res.ok) throw new Error(data?.message || "Failed to load brands.");
          allBrands.push(...(data.brands || []));
          totalPages = data.pagination?.totalPages || 1;
          page += 1;
        } while (page <= totalPages);
        if (!ignore) setBrands(allBrands);
      } catch (error) {
        if (!ignore) setBrandsError(error?.message || "Failed to load brands.");
      } finally {
        if (!ignore) setBrandsLoading(false);
      }
    };
    loadBrands();
    return () => { ignore = true; };
  }, []);

  // =====================================================
  // CLEANUP IMAGE PREVIEW
  // =====================================================

  useEffect(() => () => imagesRef.current.forEach(({ preview }) => URL.revokeObjectURL(preview)), []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const clearMessage = () => {
    if (message.text) setMessage({ type: "", text: "" });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    clearMessage();
  };

  const handleRichTextChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      for (const field of Object.keys(next)) {
        if (field === name || field.startsWith(`${name}.`)) delete next[field];
      }
      return next;
    });
    setSummaryErrors((prev) => prev.filter((error) => error.field !== name && !error.field.startsWith(`${name}.`)));
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
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    if (images.length + selected.length > 4) {
      setMessage({ type: "error", text: "A product can have at most four images." });
      e.target.value = "";
      return;
    }
    const invalid = selected.find((file) => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024);
    if (invalid) {
      setMessage({ type: "error", text: invalid.size > 5 * 1024 * 1024 ? `${invalid.name} is larger than 5 MB.` : `${invalid.name} is not a valid image.` });
      e.target.value = "";
      return;
    }
    const next = [...images, ...selected.map((file) => ({ file, preview: URL.createObjectURL(file) }))];
    imagesRef.current = next;
    setImages(next);
    e.target.value = "";
    clearMessage();
  };

  const handleRemoveImage = (index) => {
    const removed = images[index];
    if (removed) URL.revokeObjectURL(removed.preview);
    const next = images.filter((_, imageIndex) => imageIndex !== index);
    imagesRef.current = next;
    setImages(next);
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    images.forEach(({ preview }) => URL.revokeObjectURL(preview));
    imagesRef.current = [];
    setImages([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    if (!formData.brand || !brands.some((brand) => brand._id === formData.brand))
      return "Please select a valid brand.";

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

    return "";
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setSummaryErrors([]);
    setFieldErrors({});

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
      data.append("brand", formData.brand);
      data.append("unit", formData.unit.trim());
      data.append("description", formData.description.trim());
      data.append("specifications", formData.specifications);
      data.append("price", formData.price);
      data.append("wholesalePrice", formData.wholesalePrice);
      data.append("discount", formData.discount || "0");
      data.append("quantity", formData.quantity || "0");
      data.append("initialStock", formData.initialStock || "0");
      data.append("lowStockAlert", formData.lowStockAlert || "0");

      images.forEach(({ file }) => data.append("images", file));
      for (const key of ["shippingCharge", "deliveryEstimate", "shippingInstructions", "returnWindowDays", "returnConditions", "returnInstructions"]) data.append(key, formData[key] || "");
      data.append("freeShipping", String(formData.freeShipping));
      data.append("paymentOption", formData.paymentOption);
      data.append("returnEligible", formData.returnEligible);

      const response = await fetch(PRODUCT_API, {
        method: "POST",
        body: data,
      });

      let result;
      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok) {
        if (Array.isArray(result?.errors) && result.errors.length) {
          const errors = result.errors
            .filter((item) => typeof item?.field === "string" && typeof item?.message === "string")
            .map((item) => ({ field: item.field, message: item.message }));
          if (errors.length) {
            setFieldErrors(Object.fromEntries(errors.map((item) => [item.field, item.message])));
            setSummaryErrors(errors);
            return;
          }
        }
        setMessage({ type: "error", text: result?.message || "Unable to add product. Please review the form and try again." });
        return;
      }

      setMessage({
        type: "success",
        text: result?.message || "Product published successfully!",
      });

      resetForm();
      setFieldErrors({});
      setSummaryErrors([]);

      setTimeout(() => {
        router.push(PRODUCT_LIST_PAGE);
      }, 1000);
    } catch (err) {
      console.error("Add Product request failed:", err);
      setMessage({
        type: "error",
        text: err instanceof TypeError
          ? "Unable to reach the server. Check your connection and try again."
          : "Something went wrong while adding the product. Please try again.",
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
        {summaryErrors.length > 0 && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-red-700" role="alert" aria-live="polite">
            <h2 className="text-sm font-semibold">Unable to add product</h2>
            <p className="mt-1 text-sm">Please correct the following issues:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {summaryErrors.map((error, index) => {
                const row = error.field.match(/^specifications\.(\d+)/)?.[1];
                const label = row !== undefined
                  ? `Specification ${Number(row) + 1}: `
                  : error.field === "specifications"
                    ? "Specifications: "
                    : `${error.field}: `;
                return (
                  <li key={`${error.field}-${index}`}>
                    <button type="button" className="text-left underline decoration-red-300 underline-offset-2 hover:decoration-red-700" onClick={() => { const target = document.getElementById(error.field); target?.scrollIntoView({ behavior: "smooth", block: "center" }); target?.querySelector('[contenteditable="true"]')?.focus(); target?.focus(); }}>
                      {label}{error.message}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
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
                      <label htmlFor="brand" className={labelClass}>
                        Brand<span className="ml-1 text-red-500">*</span>
                      </label>
                      <select
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        disabled={loading || brandsLoading || brands.length === 0 || Boolean(brandsError)}
                        className={inputClass}
                      >
                        <option value="">{brandsLoading ? "Loading brands..." : brandsError ? "Brands unavailable" : "Select a brand"}</option>
                        {brands.map((brand) => <option key={brand._id} value={brand._id}>{brand.brandName}</option>)}
                      </select>
                      {brandsError && <p className="mt-1.5 text-xs text-red-500">{brandsError}</p>}
                      {!brandsLoading && !brandsError && brands.length === 0 && <p className="mt-1.5 text-xs text-red-500">No brands found. Create a brand before adding a product.</p>}
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
                  <div id="description">
                    <label className="mb-2 block text-sm font-semibold text-gray-700" htmlFor="description-editor">Description</label>
                    <RichTextEditor id="description-editor" value={formData.description} onChange={(value) => handleRichTextChange("description", value)} placeholder="Write a short description about this product..." disabled={loading} ariaLabel="Product description" />
                    {fieldErrors.description && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.description}</p>}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                <label className={labelClass} htmlFor="specifications-editor">Product Specifications</label>
                <div id="specifications">
                  <RichTextEditor id="specifications-editor" value={formData.specifications} onChange={(value) => handleRichTextChange("specifications", value)} placeholder="Add product specifications such as model, connectivity, and battery life..." disabled={loading} ariaLabel="Product specifications" />
                </div>
                {Object.entries(fieldErrors).filter(([field]) => field === "specifications" || field.startsWith("specifications.")).map(([field, error]) => <p key={field} className="mt-1.5 text-xs text-red-600">{error}</p>)}
              </div>

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

              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-5"><h2 className="font-semibold text-gray-900">Shipping & Returns</h2><p className="mt-1 text-xs text-gray-500">Optional product-specific delivery and return information.</p></div>
                <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-gray-700">Shipping charge<input name="shippingCharge" type="number" min="0" step="0.01" value={formData.shippingCharge} onChange={handleChange} className={`${inputClass} mt-2`} placeholder="Use standard checkout rate" disabled={loading || formData.freeShipping}/></label>
                  <label className="text-sm font-semibold text-gray-700">Estimated delivery<input name="deliveryEstimate" maxLength={100} value={formData.deliveryEstimate} onChange={handleChange} className={`${inputClass} mt-2`} placeholder="e.g. 3–5 business days" disabled={loading}/></label>
                  <label className="flex items-center gap-2 text-sm text-gray-700"><input name="freeShipping" type="checkbox" checked={formData.freeShipping} onChange={(event) => { handleChange(event); if (event.target.checked) setFormData((current) => ({ ...current, shippingCharge: "" })); }} disabled={loading}/>Free shipping for this product</label>
                  <label className="text-sm font-semibold text-gray-700">Shipping instructions<textarea name="shippingInstructions" maxLength={500} value={formData.shippingInstructions} onChange={handleChange} className={`${inputClass} mt-2`} rows={2} disabled={loading}/></label>
                  <label className="text-sm font-semibold text-gray-700">Return eligibility<select name="returnEligible" value={formData.returnEligible} onChange={handleChange} className={`${inputClass} mt-2`} disabled={loading}><option value="">Not specified</option><option value="true">Eligible</option><option value="false">Not eligible</option></select></label>
                  <label className="text-sm font-semibold text-gray-700">Return window (days)<input name="returnWindowDays" type="number" min="0" max="365" step="1" value={formData.returnWindowDays} onChange={handleChange} className={`${inputClass} mt-2`} disabled={loading}/></label>
                  <label className="text-sm font-semibold text-gray-700">Return conditions<textarea name="returnConditions" maxLength={500} value={formData.returnConditions} onChange={handleChange} className={`${inputClass} mt-2`} rows={2} disabled={loading}/></label>
                  <label className="text-sm font-semibold text-gray-700">Return instructions<textarea name="returnInstructions" maxLength={1000} value={formData.returnInstructions} onChange={handleChange} className={`${inputClass} mt-2`} rows={2} disabled={loading}/></label>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-5"><h2 className="font-semibold text-gray-900">Payment Methods</h2><p className="mt-1 text-xs text-gray-500">Online payments are not enabled yet. Customers can only place COD orders where COD is allowed.</p></div>
                <div className="p-6"><label className="text-sm font-semibold text-gray-700">Allowed payment method<select name="paymentOption" value={formData.paymentOption} onChange={handleChange} disabled={loading} className={`${inputClass} mt-2`}><option value="COD_ONLY">Cash on Delivery only</option><option value="ONLINE_ONLY">Online Payment only (unavailable)</option><option value="BOTH">Cash on Delivery and Online Payment</option></select></label></div>
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
                <h2 className="font-semibold text-gray-900">Product Images</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Add up to four images. The first image is the primary image.
                </p>
              </div>

              <div className="p-6">
                {images.length ? <div className="grid grid-cols-2 gap-3 mb-4">{images.map((item, index) => <div key={`${item.file.name}-${index}`} className="relative overflow-hidden rounded-xl border border-gray-200"><img src={item.preview} alt={`Product image ${index + 1} preview`} className="aspect-square w-full object-cover"/><span className="absolute bottom-2 left-2 rounded bg-white/95 px-2 py-1 text-xs font-semibold text-gray-800">{index === 0 ? "Primary image" : `Image ${index + 1}`}</span><button type="button" onClick={() => handleRemoveImage(index)} disabled={loading} aria-label={`Remove image ${index + 1}`} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 shadow"><MdClose size={18}/></button></div>)}</div> : null}
                {images.length < 4 && (
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
                      {images.length ? "Add more images" : "Upload product images"}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Select one or more images ({images.length}/4)
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
                  multiple
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
              disabled={loading || categoriesLoading || brandsLoading || brands.length === 0 || Boolean(brandsError)}
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
