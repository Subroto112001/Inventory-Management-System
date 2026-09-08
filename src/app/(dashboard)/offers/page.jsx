"use client";

import { IconProvider } from "@/Provider/IconProvider";
import Link from "next/link";
import React, { useState, useMemo, useEffect } from "react";
import {
  MdLocalOffer,
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdSearch,
  MdCalendarToday,
  MdPercent,
  MdAttachMoney,
  MdCheckCircle,
  MdSchedule,
  MdCancel,
  MdToggleOn,
  MdToggleOff,
  MdInventory2,
} from "react-icons/md";

// ==========================================
// Status helpers
// ==========================================
const getOfferStatus = (offer) => {
  if (!offer.isActive) return "Disabled";
  const now = new Date();
  const start = new Date(offer.startDate);
  const end = new Date(offer.endDate);
  if (now < start) return "Scheduled";
  if (now > end) return "Expired";
  return "Active";
};

const statusStyles = {
  Active: {
    badge: "bg-green-50 text-green-700 border-green-200",
    icon: MdCheckCircle,
  },
  Scheduled: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: MdSchedule,
  },
  Expired: {
    badge: "bg-gray-100 text-gray-500 border-gray-200",
    icon: MdCancel,
  },
  Disabled: {
    badge: "bg-red-50 text-red-600 border-red-200",
    icon: MdCancel,
  },
};

// ==========================================
// Create / Edit Offer Modal
// ==========================================
const OfferModal = ({ isOpen, onClose, onSave, products, initialOffer }) => {
  const emptyOffer = {
    offerName: "",
    discountType: "Percentage", // "Percentage" | "Flat"
    discountValue: "",
    applyTo: "All Products", // "All Products" | "Specific Products"
    productIds: [],
    minPurchase: "",
    usageLimit: "",
    startDate: "",
    endDate: "",
    isActive: true,
  };

  const [form, setForm] = useState(emptyOffer);
  const [productSearch, setProductSearch] = useState("");

  useEffect(() => {
    if (isOpen) {
      setForm(initialOffer || emptyOffer);
      setProductSearch("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialOffer]);

  const filteredProducts = useMemo(() => {
    if (!productSearch) return products;
    const q = productSearch.toLowerCase();
    return products.filter(
      (p) =>
        p?.productName?.toLowerCase().includes(q) ||
        p?.productSKU?.toLowerCase().includes(q),
    );
  }, [productSearch, products]);

  const toggleProduct = (productId) => {
    setForm((prev) => {
      const exists = prev.productIds.includes(productId);
      return {
        ...prev,
        productIds: exists
          ? prev.productIds.filter((id) => id !== productId)
          : [...prev.productIds, productId],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.offerName.trim()) {
      alert("Please enter an offer name.");
      return;
    }
    if (!form.discountValue || parseFloat(form.discountValue) <= 0) {
      alert("Please enter a valid discount value.");
      return;
    }
    if (
      form.discountType === "Percentage" &&
      parseFloat(form.discountValue) > 100
    ) {
      alert("Percentage discount cannot exceed 100%.");
      return;
    }
    if (!form.startDate || !form.endDate) {
      alert("Please select both a start and end date.");
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      alert("End date cannot be before the start date.");
      return;
    }
    if (form.applyTo === "Specific Products" && form.productIds.length === 0) {
      alert("Please select at least one product for this offer.");
      return;
    }

    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="offer-modal-title"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2
            id="offer-modal-title"
            className="text-lg font-bold text-gray-900 flex items-center gap-2"
          >
            <MdLocalOffer
              className="text-[#611F69] text-xl"
              aria-hidden="true"
            />
            {initialOffer ? "Edit Offer" : "Create New Offer"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Close"
          >
            <MdClose className="text-2xl" aria-hidden="true" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 overflow-y-auto custom-scrollbar flex flex-col gap-5"
        >
          {/* Offer Name */}
          <div>
            <label
              htmlFor="offerName"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Offer Name
            </label>
            <input
              id="offerName"
              type="text"
              value={form.offerName}
              onChange={(e) =>
                setForm((f) => ({ ...f, offerName: e.target.value }))
              }
              placeholder="e.g. Eid Special 20% Off"
              className="w-full p-2.5 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#611F69] focus:border-transparent text-sm"
            />
          </div>

          {/* Discount Type & Value */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Discount Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, discountType: "Percentage" }))
                  }
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg border-2 transition-all text-sm font-semibold ${
                    form.discountType === "Percentage"
                      ? "border-[#611F69] bg-[#611F69]/5 text-[#611F69]"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <MdPercent size={16} /> Percent
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, discountType: "Flat" }))
                  }
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg border-2 transition-all text-sm font-semibold ${
                    form.discountType === "Flat"
                      ? "border-[#611F69] bg-[#611F69]/5 text-[#611F69]"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <MdAttachMoney size={16} /> Flat ৳
                </button>
              </div>
            </div>

            <div className="flex-1">
              <label
                htmlFor="discountValue"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Discount Value
              </label>
              <div className="flex items-center gap-2 p-2.5 border border-gray-300 bg-gray-50 rounded-lg focus-within:ring-2 focus-within:ring-[#611F69] focus-within:border-transparent transition-all">
                <input
                  id="discountValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.discountValue}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, discountValue: e.target.value }))
                  }
                  placeholder={
                    form.discountType === "Percentage" ? "e.g. 20" : "e.g. 100"
                  }
                  className="bg-transparent border-none focus:outline-none w-full text-gray-900 placeholder-gray-500 text-sm"
                />
                <span className="text-gray-500 text-sm font-semibold pr-1">
                  {form.discountType === "Percentage" ? "%" : "৳"}
                </span>
              </div>
            </div>
          </div>

          {/* Min Purchase & Usage Limit */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="minPurchase"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Minimum Purchase (Optional)
              </label>
              <input
                id="minPurchase"
                type="number"
                min="0"
                value={form.minPurchase}
                onChange={(e) =>
                  setForm((f) => ({ ...f, minPurchase: e.target.value }))
                }
                placeholder="e.g. 500"
                className="w-full p-2.5 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#611F69] focus:border-transparent text-sm"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="usageLimit"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Usage Limit (Optional)
              </label>
              <input
                id="usageLimit"
                type="number"
                min="0"
                value={form.usageLimit}
                onChange={(e) =>
                  setForm((f) => ({ ...f, usageLimit: e.target.value }))
                }
                placeholder="e.g. 100 redemptions"
                className="w-full p-2.5 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#611F69] focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="startDate"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Start Date
              </label>
              <div className="flex items-center gap-2 p-2.5 border border-gray-300 bg-gray-50 rounded-lg focus-within:ring-2 focus-within:ring-[#611F69] focus-within:border-transparent transition-all">
                <MdCalendarToday className="text-gray-500" aria-hidden="true" />
                <input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                  className="bg-transparent border-none focus:outline-none w-full text-gray-900 text-sm"
                />
              </div>
            </div>
            <div className="flex-1">
              <label
                htmlFor="endDate"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                End Date
              </label>
              <div className="flex items-center gap-2 p-2.5 border border-gray-300 bg-gray-50 rounded-lg focus-within:ring-2 focus-within:ring-[#611F69] focus-within:border-transparent transition-all">
                <MdCalendarToday className="text-gray-500" aria-hidden="true" />
                <input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                  className="bg-transparent border-none focus:outline-none w-full text-gray-900 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Applies To */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Applies To
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({ ...f, applyTo: "All Products" }))
                }
                className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg border-2 transition-all text-sm font-semibold ${
                  form.applyTo === "All Products"
                    ? "border-[#611F69] bg-[#611F69]/5 text-[#611F69]"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <MdInventory2 size={16} /> All Products
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({ ...f, applyTo: "Specific Products" }))
                }
                className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg border-2 transition-all text-sm font-semibold ${
                  form.applyTo === "Specific Products"
                    ? "border-[#611F69] bg-[#611F69]/5 text-[#611F69]"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <MdLocalOffer size={16} /> Specific Products
              </button>
            </div>

            {form.applyTo === "Specific Products" && (
              <div className="border border-gray-100 rounded-lg bg-gray-50 p-2">
                <div className="flex items-center gap-2 p-2 mb-2 border border-gray-300 bg-white rounded-lg focus-within:ring-2 focus-within:ring-[#611F69] transition-all">
                  <MdSearch className="text-gray-500" aria-hidden="true" />
                  <input
                    type="search"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search product by name or SKU..."
                    className="bg-transparent border-none focus:outline-none w-full text-gray-900 placeholder-gray-500 text-sm"
                  />
                </div>
                <ul className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                  {filteredProducts.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 text-sm">
                      No products found.
                    </p>
                  ) : (
                    filteredProducts.map((product) => {
                      const checked = form.productIds.includes(product.id);
                      return (
                        <li key={product.id}>
                          <label
                            className={`flex items-center justify-between gap-3 p-2.5 rounded-md border cursor-pointer transition-colors ${
                              checked
                                ? "border-[#611F69]/40 bg-[#611F69]/5"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <span className="flex flex-col">
                              <span className="text-sm font-semibold text-gray-900">
                                {product.productName}
                              </span>
                              <span className="text-xs text-gray-500">
                                SKU: {product.productSKU}
                              </span>
                            </span>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleProduct(product.id)}
                              className="w-4 h-4 accent-[#611F69]"
                              aria-label={`Include ${product.productName}`}
                            />
                          </label>
                        </li>
                      );
                    })
                  )}
                </ul>
                {form.productIds.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2 px-1">
                    {form.productIds.length} product
                    {form.productIds.length > 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
            <span className="text-sm font-semibold text-gray-700">
              Offer Active
            </span>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
              aria-pressed={form.isActive}
              aria-label="Toggle offer active state"
              className="text-3xl text-[#611F69]"
            >
              {form.isActive ? (
                <MdToggleOn />
              ) : (
                <MdToggleOff className="text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#611F69] text-white font-bold rounded-lg shadow-lg hover:bg-[#4a1752] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#611F69]/50 transition-all"
            >
              {initialOffer ? "Save Changes" : "Create Offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// Main Offers Page
// ==========================================
export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  const fetchOffers = async () => {
    setLoadingOffers(true);
    try {
      const res = await fetch("/api/offers", { cache: "no-store" });
      const data = await res?.json();
      if (res.ok) {
        setOffers(data?.offers || []);
      } else {
        console.error("Failed to load offers:", data?.message);
      }
    } catch (err) {
      console.error("Failed to load offers:", err);
    } finally {
      setLoadingOffers(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res?.json();
      if (res.ok) {
        setProducts(data?.products || []);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchProducts();
  }, []);

  const filteredOffers = useMemo(() => {
    return offers
      .filter((offer) => {
        if (!searchQuery) return true;
        return offer.offerName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
      })
      .filter((offer) => {
        if (statusFilter === "All") return true;
        return getOfferStatus(offer) === statusFilter;
      });
  }, [offers, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const counts = { Active: 0, Scheduled: 0, Expired: 0, Disabled: 0 };
    offers.forEach((offer) => {
      const status = getOfferStatus(offer);
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [offers]);

  const openCreateModal = () => {
    setEditingOffer(null);
    setIsModalOpen(true);
  };

  const openEditModal = (offer) => {
    setEditingOffer(offer);
    setIsModalOpen(true);
  };

  const handleSaveOffer = async (formData) => {
    const isEdit = Boolean(editingOffer?.id);
    try {
      const res = await fetch(
        isEdit ? `/api/offers/${editingOffer.id}` : "/api/offers",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const data = await res.json();

      if (res.ok && data.success) {
        setIsModalOpen(false);
        setEditingOffer(null);
        fetchOffers();
      } else {
        alert(`Failed to save offer: ${data.message}`);
      }
    } catch (err) {
      console.error("Error saving offer:", err);
      alert("A network or server error occurred while saving the offer.");
    }
  };

  const handleToggleOffer = async (offer) => {
    try {
      const res = await fetch(`/api/offers/${offer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...offer, isActive: !offer.isActive }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchOffers();
      } else {
        alert(`Failed to update offer: ${data.message}`);
      }
    } catch (err) {
      console.error("Error updating offer:", err);
    }
  };

  const handleDeleteOffer = async (offer) => {
    const confirmDelete = window.confirm(
      `Delete offer "${offer.offerName}"? This cannot be undone.`,
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/offers/${offer.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchOffers();
      } else {
        alert(`Failed to delete offer: ${data.message}`);
      }
    } catch (err) {
      console.error("Error deleting offer:", err);
    }
  };

  const statusFilters = ["All", "Active", "Scheduled", "Expired", "Disabled"];

  return (
    <main className="p-5 mx-auto min-h-screen bg-gray-50">
      <OfferModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOffer(null);
        }}
        onSave={handleSaveOffer}
        products={products}
        initialOffer={editingOffer}
      />

      <header className="mb-6">
        <Link
          href="/products"
          className="inline-flex gap-2 items-center text-gray-800 hover:text-[#611F69] focus:outline-none focus:ring-2 focus:ring-[#611F69] rounded-md transition-colors"
          aria-label="Go back to products page"
        >
          <span className="text-2xl text-[#611F69]" aria-hidden="true">
            {IconProvider?.leftIcon || "←"}
          </span>
          <span className="text-[16px] font-semibold">Back To Products</span>
        </Link>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-300 pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Offers &amp; Discounts
          </h1>
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#611F69] text-white font-bold rounded-lg shadow-lg hover:bg-[#4a1752] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#611F69]/50 transition-all"
          >
            <MdAdd className="text-xl" aria-hidden="true" />
            Create Offer
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {["Active", "Scheduled", "Expired", "Disabled"].map((key) => {
          const StatusIcon = statusStyles[key].icon;
          return (
            <div
              key={key}
              className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center gap-3"
            >
              <span
                className={`w-10 h-10 rounded-full flex items-center justify-center border ${statusStyles[key].badge}`}
              >
                <StatusIcon className="text-lg" aria-hidden="true" />
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-gray-900">
                  {stats[key] || 0}
                </span>
                <span className="text-xs text-gray-500 font-medium">{key}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Offers List Section */}
      <section className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 p-2.5 border border-gray-300 bg-gray-50 rounded-lg focus-within:ring-2 focus-within:ring-[#611F69] focus-within:border-transparent transition-all">
            <MdSearch
              className="text-gray-500 text-xl ml-1"
              aria-hidden="true"
            />
            <label htmlFor="offerSearch" className="sr-only">
              Search offers
            </label>
            <input
              id="offerSearch"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search offers by name..."
              className="bg-transparent border-none focus:outline-none w-full text-gray-900 placeholder-gray-500 text-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                  statusFilter === status
                    ? "border-[#611F69] bg-[#611F69]/10 text-[#611F69]"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loadingOffers ? (
          <p className="text-gray-500 text-center py-12 text-sm">
            Loading offers...
          </p>
        ) : filteredOffers.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 py-16 border-2 border-dashed border-gray-200 rounded-lg">
            <MdLocalOffer size={48} className="mb-3 opacity-50" />
            <p className="font-medium">No offers found</p>
            <p className="text-sm mt-1">
              Create your first offer to start giving discounts.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {filteredOffers.map((offer) => {
              const status = getOfferStatus(offer);
              const StatusIcon = statusStyles[status].icon;
              return (
                <li
                  key={offer.id}
                  className="p-4 border border-gray-200 rounded-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-[#611F69]/50 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold text-gray-900">
                        {offer.offerName}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${statusStyles[status].badge}`}
                      >
                        <StatusIcon className="text-sm" aria-hidden="true" />
                        {status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {offer.applyTo === "All Products"
                        ? "Applies to all products"
                        : `Applies to ${offer.productIds?.length || 0} product(s)`}
                      {" · "}
                      {new Date(offer.startDate).toLocaleDateString()} –{" "}
                      {new Date(offer.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 justify-between lg:justify-end">
                    <span className="text-lg font-extrabold text-[#611F69]">
                      {offer.discountType === "Percentage"
                        ? `${offer.discountValue}% OFF`
                        : `৳${offer.discountValue} OFF`}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleOffer(offer)}
                        className="p-2 text-2xl text-[#611F69] hover:bg-[#611F69]/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#611F69]"
                        aria-label={
                          offer.isActive ? "Disable offer" : "Enable offer"
                        }
                        title={
                          offer.isActive ? "Disable offer" : "Enable offer"
                        }
                      >
                        {offer.isActive ? (
                          <MdToggleOn />
                        ) : (
                          <MdToggleOff className="text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => openEditModal(offer)}
                        className="p-2 text-gray-500 hover:text-[#611F69] hover:bg-[#611F69]/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#611F69]"
                        aria-label={`Edit ${offer.offerName}`}
                        title="Edit offer"
                      >
                        <MdEdit className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Delete ${offer.offerName}`}
                        title="Delete offer"
                      >
                        <MdDelete className="text-xl" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
