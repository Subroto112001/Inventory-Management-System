"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RichTextEditor from "@/Component/RichTextEditor";
import {
  MdArrowBack, MdInventory2, MdCloudUpload, MdImage, MdCheckCircle,
  MdErrorOutline, MdEvent, MdLocalOffer, MdSearch, MdEdit, MdArchive, MdClose,
} from "react-icons/md";

const INITIAL_FORM = {
  productName: "", productSKU: "", category: "", subcategory: "", brand: "", unit: "",
  description: "", specifications: "", price: "", wholesalePrice: "", discount: "0",
  quantity: "0", initialStock: "0", lowStockAlert: "0", shippingCharge: "",
  deliveryEstimate: "", freeShipping: false, shippingInstructions: "", paymentOption: "COD_ONLY",
  returnEligible: "", returnWindowDays: "", returnConditions: "", returnInstructions: "",
  launchAt: "", preorderEnabled: false, preorderStart: "", preorderEnd: "", preorderLimit: "",
  expectedShipAt: "", preorderTerms: "", featuredOnLaunch: false,
};

const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[var(--theme-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--theme-primary)]/10 disabled:cursor-not-allowed disabled:opacity-60";
const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

function FormSection({ icon: Icon, title, description, children, className = "" }) {
  return <section className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}>
    <div className="border-b border-gray-100 px-6 py-5"><div className="flex items-center gap-3">
      {Icon && <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]"><Icon size={22} /></div>}
      <div><h2 className="font-semibold text-gray-900">{title}</h2>{description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}</div>
    </div></div><div className="space-y-5 p-6">{children}</div>
  </section>;
}

function Field({ label, name, value, onChange, type = "text", placeholder = "", required = false, min, max, step, disabled = false, children, className = "", rows = 3 }) {
  const id = `upcoming-${name}`;
  return <div className={className}><label htmlFor={id} className={labelClass}>{label}{required && <span className="ml-1 text-red-500">*</span>}</label>
    {children || (type === "textarea" ? <textarea id={id} name={name} rows={rows} value={value ?? ""} onChange={onChange} placeholder={placeholder} required={required} disabled={disabled} className={inputClass} /> : <input id={id} name={name} type={type} value={value ?? ""} onChange={onChange} placeholder={placeholder} required={required} min={min} max={max} step={step} disabled={disabled} className={inputClass} />)}
  </div>;
}

export default function UpcomingProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([""]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingLists, setLoadingLists] = useState(true);
  const [preorderLimitError, setPreorderLimitError] = useState("");

  const loadProducts = useCallback(async () => {
    const response = await fetch("/api/upcoming-products", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Unable to load upcoming products.");
    setProducts(data.products || []);
  }, []);

  useEffect(() => {
    fetch("/api/upcoming-products", { cache: "no-store" }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load upcoming products.");
      return data;
    }).then((data) => setProducts(data.products || [])).catch((loadError) => setError(loadError.message));
    let ignore = false;
    Promise.all([
      fetch("/api/category?list=1&includeSubcategories=1").then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.message || "Unable to load categories."); return d.categories || []; }),
      (async () => { const all = []; let page = 1; let totalPages = 1; do { const r = await fetch(`/api/brand?page=${page}&limit=100`); const d = await r.json(); if (!r.ok) throw new Error(d.message || "Unable to load brands."); all.push(...(d.brands || [])); totalPages = d.pagination?.totalPages || 1; page += 1; } while (page <= totalPages); return all; })(),
    ]).then(([categoryRows, brandRows]) => { if (!ignore) { setCategories(categoryRows); setBrands(brandRows); } }).catch((loadError) => { if (!ignore) setError(loadError.message); }).finally(() => { if (!ignore) setLoadingLists(false); });
    return () => { ignore = true; };
  }, []);

  const parentCategories = categories.filter((item) => !item.parentCategoryId);
  const subcategories = categories.filter((item) => item.parentCategoryId === form.category);
  const filteredProducts = useMemo(() => products.filter((item) => `${item.name} ${item.sku}`.toLowerCase().includes(search.trim().toLowerCase())), [products, search]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value, ...(name === "category" ? { subcategory: "" } : {}) }));
    setMessage({ type: "", text: "" });
  };

  async function createProduct(event) {
    event.preventDefault(); setError(""); setMessage({ type: "", text: "" }); setPreorderLimitError("");
    if (!form.productName.trim() || !form.productSKU.trim() || !form.category || !form.brand || form.price === "") {
      setMessage({ type: "error", text: "Complete the product name, SKU, category, brand, and price before scheduling." }); return;
    }
    const launch = new Date(form.launchAt);
    if (!Number.isFinite(launch.getTime()) || launch <= new Date()) { setMessage({ type: "error", text: "Choose a future launch date and time." }); return; }
    if (form.preorderLimit && (!Number.isInteger(Number(form.preorderLimit)) || Number(form.preorderLimit) < 1)) { setPreorderLimitError("Enter a positive whole-number quantity limit."); return; }
    if (form.preorderEnabled && form.preorderStart && new Date(form.preorderStart) >= launch) { setMessage({ type: "error", text: "Pre-order availability must start before launch." }); return; }
    if (form.preorderEnabled && form.preorderEnd && (new Date(form.preorderEnd) < new Date(form.preorderStart || Date.now()) || new Date(form.preorderEnd) > launch)) { setMessage({ type: "error", text: "The pre-order end date must follow its start and be no later than launch." }); return; }

    setLoading(true);
    try {
      const imageRecords = images.filter((url) => url.trim()).map((url) => ({ url: url.trim() }));
      const payload = {
        productName: form.productName.trim(), productSKU: form.productSKU.trim().toUpperCase(), category: form.category,
        subcategory: form.subcategory || null, brand: form.brand, unit: form.unit.trim(), description: form.description,
        specifications: form.specifications, price: Number(form.price), wholesalePrice: form.wholesalePrice === "" ? undefined : Number(form.wholesalePrice),
        discount: Number(form.discount || 0), quantity: Number(form.quantity || 0), initialStock: Number(form.initialStock || 0), lowStockAlert: Number(form.lowStockAlert || 0),
        images: imageRecords, shipping: { charge: form.freeShipping ? 0 : (form.shippingCharge === "" ? undefined : Number(form.shippingCharge)), freeShipping: form.freeShipping, deliveryEstimate: form.deliveryEstimate, instructions: form.shippingInstructions },
        paymentOption: form.paymentOption, returnPolicy: { eligible: form.returnEligible === "" ? undefined : form.returnEligible === "true", windowDays: form.returnWindowDays === "" ? undefined : Number(form.returnWindowDays), conditions: form.returnConditions, instructions: form.returnInstructions },
        launchAt: launch.toISOString(), featuredOnLaunch: form.featuredOnLaunch,
        preorder: { enabled: form.preorderEnabled, startsAt: form.preorderStart ? new Date(form.preorderStart).toISOString() : null, endsAt: form.preorderEnd ? new Date(form.preorderEnd).toISOString() : null, limit: form.preorderLimit || null, expectedShipAt: form.expectedShipAt ? new Date(form.expectedShipAt).toISOString() : null, terms: form.preorderTerms },
      };
      const response = await fetch("/api/upcoming-products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to schedule the product.");
      setMessage({ type: "success", text: "Upcoming product scheduled successfully." });
      setForm(INITIAL_FORM); setImages([""]); await loadProducts();
    } catch (submitError) { setMessage({ type: "error", text: submitError.message || "Unable to schedule the product." }); }
    finally { setLoading(false); }
  }

  async function updateProduct(product, changes) {
    setError("");
    try {
      const response = await fetch(`/api/upcoming-products/${product.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(changes) });
      const data = await response.json(); if (!response.ok) throw new Error(data.message || "Unable to update product."); await loadProducts();
    } catch (updateError) { setError(updateError.message); }
  }

  async function editLaunch(product) {
    const value = window.prompt("New launch date and time", new Date(product.launchAt).toISOString().slice(0, 16));
    if (value) await updateProduct(product, { launchAt: new Date(value).toISOString() });
  }

  async function archiveProduct(product) {
    if (!window.confirm(`Archive ${product.name}?`)) return;
    const response = await fetch(`/api/upcoming-products/${product.id}`, { method: "DELETE" });
    const data = await response.json(); if (!response.ok) setError(data.message || "Unable to archive product."); else await loadProducts();
  }

  return <main className="min-h-screen bg-[var(--theme-background)] px-4 py-6 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dash/products" aria-label="Back to products" className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-white"><MdArrowBack size={21} /></Link>
        <div><h1 className="text-2xl font-bold tracking-tight text-gray-900">Upcoming Products</h1><p className="mt-1 text-sm text-gray-500">Prepare product information and schedule its storefront launch.</p></div>
      </div>

      {(error || message.text) && <div role={message.type === "error" || error ? "alert" : "status"} className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 ${error || message.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}>
        {error || message.type === "error" ? <MdErrorOutline className="mt-0.5 shrink-0" size={20} /> : <MdCheckCircle className="mt-0.5 shrink-0" size={20} />}<p className="text-sm font-medium">{error || message.text}</p>
      </div>}

      <form onSubmit={createProduct}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <FormSection icon={MdInventory2} title="Product Information" description="Name, SKU, category, brand and product details.">
              <Field label="Product Name" name="productName" value={form.productName} onChange={handleChange} placeholder="e.g. Wireless Mouse" required disabled={loading} />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="SKU" name="productSKU" value={form.productSKU} onChange={handleChange} placeholder="Enter a unique SKU" required disabled={loading} />
                <Field label="Category" name="category" value={form.category} onChange={handleChange} required disabled={loading || loadingLists}>
                  <select id="upcoming-category" name="category" value={form.category} onChange={handleChange} disabled={loading || loadingLists} className={inputClass}><option value="">{loadingLists ? "Loading categories..." : "Select a category"}</option>{parentCategories.map((category) => <option key={category.id} value={category.id}>{category.categoryName} ({category.categoryCode})</option>)}</select>
                </Field>
                <Field label="Subcategory" name="subcategory" value={form.subcategory} onChange={handleChange} disabled={loading || !form.category || !subcategories.length}>
                  <select id="upcoming-subcategory" name="subcategory" value={form.subcategory} onChange={handleChange} disabled={loading || !form.category || !subcategories.length} className={inputClass}><option value="">No subcategory</option>{subcategories.map((item) => <option key={item.id} value={item.id}>{item.categoryName}</option>)}</select>
                </Field>
                <Field label="Brand" name="brand" value={form.brand} onChange={handleChange} required disabled={loading || loadingLists}>
                  <select id="upcoming-brand" name="brand" value={form.brand} onChange={handleChange} disabled={loading || loadingLists} className={inputClass}><option value="">{loadingLists ? "Loading brands..." : "Select a brand"}</option>{brands.map((brand) => <option key={brand._id} value={brand._id}>{brand.brandName}</option>)}</select>
                </Field>
                <Field label="Unit" name="unit" value={form.unit} onChange={handleChange} placeholder="e.g. pcs, kg, box" disabled={loading} />
              </div>
              <div><label className={labelClass}>Description</label><RichTextEditor value={form.description} onChange={(value) => setForm((current) => ({ ...current, description: value }))} placeholder="Write a short description about this product..." disabled={loading} ariaLabel="Product description" /></div>
            </FormSection>

            <FormSection title="Product Specifications" description="Add product specifications such as model, connectivity, and dimensions.">
              <RichTextEditor value={form.specifications} onChange={(value) => setForm((current) => ({ ...current, specifications: value }))} placeholder="Add product specifications..." disabled={loading} ariaLabel="Product specifications" />
            </FormSection>

            <FormSection icon={MdLocalOffer} title="Pricing" description="Selling price, wholesale price and discount.">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3"><Field label="Price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="0.00" required disabled={loading} /><Field label="Wholesale Price" name="wholesalePrice" type="number" min="0" step="0.01" value={form.wholesalePrice} onChange={handleChange} placeholder="0.00" disabled={loading} /><Field label="Discount (%)" name="discount" type="number" min="0" max="100" step="0.01" value={form.discount} onChange={handleChange} placeholder="0" disabled={loading} /></div>
            </FormSection>

            <FormSection title="Shipping & Returns" description="Optional product-specific delivery and return information.">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2"><Field label="Shipping Charge" name="shippingCharge" type="number" min="0" step="0.01" value={form.shippingCharge} onChange={handleChange} placeholder="Use standard checkout rate" disabled={loading || form.freeShipping} /><Field label="Estimated Delivery" name="deliveryEstimate" value={form.deliveryEstimate} onChange={handleChange} placeholder="e.g. 3–5 business days" disabled={loading} />
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 sm:col-span-2"><input type="checkbox" name="freeShipping" checked={form.freeShipping} onChange={handleChange} disabled={loading} className="h-4 w-4 accent-[var(--theme-primary)]" />Free shipping for this product</label>
                <Field className="sm:col-span-2" label="Shipping Instructions" name="shippingInstructions" type="textarea" value={form.shippingInstructions} onChange={handleChange} disabled={loading} />
                <Field label="Return Eligibility" name="returnEligible" value={form.returnEligible} onChange={handleChange} disabled={loading}><select id="upcoming-returnEligible" name="returnEligible" value={form.returnEligible} onChange={handleChange} className={inputClass} disabled={loading}><option value="">Not specified</option><option value="true">Eligible</option><option value="false">Not eligible</option></select></Field>
                <Field label="Return Window (days)" name="returnWindowDays" type="number" min="0" max="365" step="1" value={form.returnWindowDays} onChange={handleChange} disabled={loading} />
                <Field className="sm:col-span-2" label="Return Conditions" name="returnConditions" type="textarea" value={form.returnConditions} onChange={handleChange} disabled={loading} />
                <Field className="sm:col-span-2" label="Return Instructions" name="returnInstructions" type="textarea" value={form.returnInstructions} onChange={handleChange} disabled={loading} />
              </div>
              <div className="border-t border-gray-100 pt-5"><Field label="Allowed Payment Method" name="paymentOption" value={form.paymentOption} onChange={handleChange} disabled={loading}><select id="upcoming-paymentOption" name="paymentOption" value={form.paymentOption} onChange={handleChange} disabled={loading} className={inputClass}><option value="COD_ONLY">Cash on Delivery only</option><option value="ONLINE_ONLY">Online Payment only (unavailable)</option><option value="BOTH">Cash on Delivery and Online Payment</option></select></Field><p className="mt-2 text-xs text-gray-500">Online payments are not enabled yet. Customer payments remain pending until fulfillment.</p></div>
            </FormSection>

            <FormSection title="Inventory" description="Opening stock and low stock warning level.">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3"><Field label="Quantity" name="quantity" type="number" min="0" step="1" value={form.quantity} onChange={handleChange} disabled={loading} /><Field label="Initial Stock" name="initialStock" type="number" min="0" step="1" value={form.initialStock} onChange={handleChange} disabled={loading} /><Field label="Low Stock Alert" name="lowStockAlert" type="number" min="0" step="1" value={form.lowStockAlert} onChange={handleChange} disabled={loading} /></div>
            </FormSection>

            <FormSection icon={MdEvent} title="Launch Schedule" description="The product stays out of regular listings until the scheduled launch time.">
              <Field label="Launch Date & Time" name="launchAt" type="datetime-local" value={form.launchAt} onChange={handleChange} required disabled={loading} />
              <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700"><input type="checkbox" name="featuredOnLaunch" checked={form.featuredOnLaunch} onChange={handleChange} disabled={loading} className="mt-0.5 h-4 w-4 accent-[var(--theme-primary)]" /><span><strong className="block">Feature this product on launch</strong><span className="mt-1 block text-xs text-gray-500">The existing featured product assignment is activated when the product goes live.</span></span></label>
            </FormSection>

            <FormSection title="Pre-order Settings" description="Pre-order availability is managed separately from the product launch status.">
              <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm font-semibold text-gray-700"><input type="checkbox" name="preorderEnabled" checked={form.preorderEnabled} onChange={handleChange} disabled={loading} className="h-4 w-4 accent-[var(--theme-primary)]" />Accept pre-orders for this product</label>
              {form.preorderEnabled ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2"><Field label="Pre-order Starts" name="preorderStart" type="datetime-local" value={form.preorderStart} onChange={handleChange} disabled={loading} /><Field label="Pre-order Ends (optional)" name="preorderEnd" type="datetime-local" value={form.preorderEnd} onChange={handleChange} disabled={loading} /><Field label="Maximum Quantity (optional)" name="preorderLimit" type="number" min="1" step="1" value={form.preorderLimit} onChange={(event) => { handleChange(event); setPreorderLimitError(""); }} placeholder="No limit" disabled={loading} />{preorderLimitError && <p className="text-xs text-red-600 sm:col-span-2">{preorderLimitError}</p>}<Field label="Expected Ship Date" name="expectedShipAt" type="date" value={form.expectedShipAt} onChange={handleChange} disabled={loading} /><Field className="sm:col-span-2" label="Pre-order Terms / Instructions" name="preorderTerms" type="textarea" value={form.preorderTerms} onChange={handleChange} disabled={loading} /></div> : <p className="text-xs text-gray-500">Customers can view this product before launch, but cannot purchase it.</p>}
            </FormSection>
          </div>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5"><h2 className="font-semibold text-gray-900">Product Images</h2><p className="mt-1 text-xs text-gray-500">Add up to four image URLs. The first image is the primary image.</p></div>
            <div className="space-y-4 p-6">{images.map((url, index) => <Field key={index} label={index === 0 ? "Primary Image URL" : `Image ${index + 1} URL`} name={`image-${index}`} type="url" value={url} onChange={(event) => setImages((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} placeholder="https://..." disabled={loading} />)}
              {images.length < 4 && <button type="button" onClick={() => setImages((current) => [...current, ""])} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-[var(--theme-primary)]/50 hover:bg-[var(--theme-primary)]/5"><MdCloudUpload size={20} />Add another image URL</button>}
              {images.some(Boolean) && <div className="grid grid-cols-2 gap-3">{images.map((url, index) => url && <div key={`preview-${index}`} className="relative overflow-hidden rounded-xl border border-gray-200"><img src={url} alt={`Product image ${index + 1} preview`} className="aspect-square w-full object-cover" /><span className="absolute bottom-2 left-2 rounded bg-white/95 px-2 py-1 text-xs font-semibold text-gray-800">{index === 0 ? "Primary image" : `Image ${index + 1}`}</span><button type="button" onClick={() => setImages((current) => current.filter((_, imageIndex) => imageIndex !== index))} aria-label={`Remove image ${index + 1}`} className="absolute right-2 top-2 rounded-lg bg-white p-1.5 text-gray-600 shadow hover:text-red-600"><MdClose size={16} /></button></div>)}</div>}
              <p className="text-xs leading-5 text-gray-400">Use public image URLs. Images are stored with the product and shown in the storefront preview.</p>
            </div>
          </aside>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link href="/dash/products" className={`flex h-12 items-center justify-center rounded-xl border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 ${loading ? "pointer-events-none opacity-50" : ""}`}>Cancel</Link>
          <button type="submit" disabled={loading || loadingLists || !brands.length} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--theme-primary)] px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--theme-primary-hover)] focus:outline-none focus:ring-4 focus:ring-[var(--theme-primary)]/20 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Scheduling...</> : <><MdCheckCircle size={20} />Schedule Upcoming Product</>}
          </button>
        </div>
      </form>

      <section className="mt-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-gray-900">Scheduled Launches</h2><p className="mt-1 text-xs text-gray-500">{filteredProducts.length} upcoming {filteredProducts.length === 1 ? "product" : "products"}</p></div><label className="relative block w-full sm:max-w-xs"><MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input aria-label="Search upcoming products" placeholder="Search product or SKU" value={search} onChange={(event) => setSearch(event.target.value)} className={`${inputClass} pl-10`} /></label></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-6 py-3">Product</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Launch</th><th className="px-4 py-3">Lifecycle</th><th className="px-4 py-3">Pre-order</th><th className="px-4 py-3">Featured</th><th className="px-6 py-3 text-right">Actions</th></tr></thead><tbody>{filteredProducts.map((product) => <tr key={product.id} className="border-t border-gray-100 transition hover:bg-[var(--theme-primary)]/[0.03]"><td className="px-6 py-4"><div className="flex items-center gap-3">{product.image ? <img src={product.image} alt="" className="h-12 w-12 rounded-xl border border-gray-100 object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400"><MdImage size={20} /></div>}<div><p className="font-semibold text-gray-900">{product.name}</p><p className="mt-0.5 text-xs text-gray-500">{product.sku || "No SKU"}</p></div></div></td><td className="px-4 py-4 font-medium text-gray-800">৳{Number(product.price).toFixed(2)}</td><td className="px-4 py-4 text-gray-600">{new Date(product.launchAt).toLocaleString()}</td><td className="px-4 py-4"><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">Scheduled</span></td><td className="px-4 py-4 text-gray-600">{product.preorder?.enabled ? `Enabled${product.preorder.limit ? ` · ${product.preorder.reserved}/${product.preorder.limit}` : ""}` : "Disabled"}</td><td className="px-4 py-4"><button type="button" onClick={() => updateProduct(product, { featuredOnLaunch: !product.featuredOnLaunch })} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${product.featuredOnLaunch ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>{product.featuredOnLaunch ? "Featured" : "Not featured"}</button></td><td className="px-6 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => editLaunch(product)} title="Edit launch date" aria-label={`Edit launch date for ${product.name}`} className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-semibold text-gray-700 transition hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)]"><MdEdit size={16} /><span className="hidden xl:inline">Edit launch</span></button><button type="button" onClick={() => archiveProduct(product)} title="Archive product" aria-label={`Archive ${product.name}`} className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-semibold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"><MdArchive size={16} /><span className="hidden xl:inline">Archive</span></button></div></td></tr>)}</tbody></table>{filteredProducts.length === 0 && <div className="px-6 py-12 text-center"><p className="font-semibold text-gray-700">No scheduled products found</p><p className="mt-1 text-sm text-gray-500">New products you schedule will appear here.</p></div>}</div>
      </section>
    </div>
  </main>;
}
