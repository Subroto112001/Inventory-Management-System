"use client";

import { useEffect, useMemo, useState } from "react";

export default function ExclusiveProductsPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/homepage/exclusive-products?admin=1");
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Unable to load exclusive products");
      setItems(data.items || []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  // Fetch products (10 items by default or filtered by search)
  useEffect(() => {
    const trimmed = search.trim();

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const queryParam = trimmed
          ? `&search=${encodeURIComponent(trimmed)}`
          : "";
        const response = await fetch(
          `/api/product?public=1${queryParam}&limit=10&page=1`,
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Search failed");
        setResults(data.products || []);
      } catch (searchError) {
        setResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  const assignedIds = useMemo(
    () => new Set(items.map((item) => item.productId)),
    [items],
  );

  const handleAddProduct = async (product) => {
    if (!product?.id) return;
    if (assignedIds.has(product.id)) {
      setError("This product is already assigned as exclusive.");
      return;
    }

    try {
      const response = await fetch("/api/homepage/exclusive-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          displayOrder: items.length,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Unable to add exclusive product");
      setError("");
      await loadAssignments();
    } catch (assignmentError) {
      setError(assignmentError.message);
    }
  };

  const handleToggle = async (id, currentValue) => {
    try {
      const response = await fetch("/api/homepage/exclusive-products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentValue }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Unable to update assignment");
      await loadAssignments();
    } catch (toggleError) {
      setError(toggleError.message);
    }
  };

  const handleReorder = async (id, direction) => {
    const assignment = items.find((item) => item.id === id);
    if (!assignment) return;

    const nextOrder = Number(assignment.displayOrder || 0) + direction;
    try {
      const response = await fetch("/api/homepage/exclusive-products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, displayOrder: nextOrder }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Unable to reorder assignment");
      await loadAssignments();
    } catch (reorderError) {
      setError(reorderError.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this product from the exclusive list?")) return;

    try {
      const response = await fetch(
        `/api/homepage/exclusive-products?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Unable to remove product");
      await loadAssignments();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <section
      className="mx-auto max-w-7xl space-y-6 p-6"
      style={{ fontFamily: "'Noto Serif', serif" }}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A8378]">
          storefront
        </p>
        <h1 className="mt-1 text-3xl font-bold text-[#211F1D]">
          Exclusive products
        </h1>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {/* Main 2-Column Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Current Exclusive Assignments (বড় করা হয়েছে: col-span-7) */}
        <div className="lg:col-span-7">
          <div className="flex flex-col rounded-xl border border-[#E4DED2] bg-white p-5 shadow-sm h-full">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#211F1D]">
                Current assignments
              </h2>
              <span className="text-sm text-[#8A8378]">
                {items.length} active
              </span>
            </div>

            {loading ? (
              <div className="text-sm text-[#8A8378]">
                Loading assignments...
              </div>
            ) : items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed border-[#E4DED2] px-4 py-10 text-center text-sm text-[#8A8378]">
                No exclusive products assigned yet.
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-lg border border-[#E4DED2] p-3 sm:flex-row sm:items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.product?.image || "/placeholder-product.svg"}
                        alt={item.product?.name || "Exclusive product"}
                        className="h-14 w-14 shrink-0 rounded-md object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#211F1D]">
                          {item.product?.name || item.productId}
                        </p>
                        <p className="text-xs text-[#8A8378]">
                          {item.product?.category || "Product"} • $
                          {Number(item.product?.price || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          item.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.isActive ? "Visible" : "Hidden"}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggle(item.id, item.isActive)}
                        className="rounded-md border border-[#E4DED2] px-2 py-1 text-xs font-medium text-[#211F1D] hover:bg-gray-50"
                      >
                        {item.isActive ? "Hide" : "Show"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReorder(item.id, -1)}
                        className="rounded-md border border-[#E4DED2] px-2 py-1 text-xs font-medium text-[#211F1D] hover:bg-gray-50"
                      >
                        ↑
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReorder(item.id, 1)}
                        className="rounded-md border border-[#E4DED2] px-2 py-1 text-xs font-medium text-[#211F1D] hover:bg-gray-50"
                      >
                        ↓
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Product Catalog (ছোট করা হয়েছে: col-span-5) */}
        <div className="lg:col-span-5">
          <div className="flex flex-col rounded-xl border border-[#E4DED2] bg-white p-5 shadow-sm h-full">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-[#211F1D]">
                Product Catalog
              </h2>
              <p className="text-xs text-[#8A8378]">
                Search or select products to add as exclusive
              </p>
            </div>

            {/* Search Input */}
            <div className="mb-4 relative">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search catalog..."
                className="w-full rounded-md border border-[#E4DED2] px-3 py-2.5 text-sm outline-none focus:border-[#1F3A2E]"
              />
              {searchLoading && (
                <div className="mt-1 text-xs text-[#8A8378]">
                  Searching products...
                </div>
              )}
            </div>

            {/* Scrollable Product List */}
            <div className="flex-1 overflow-y-auto max-h-[550px] pr-1 space-y-2.5">
              {results.length === 0 && !searchLoading ? (
                <div className="py-8 text-center text-sm text-[#8A8378]">
                  No products found.
                </div>
              ) : (
                results.map((product) => {
                  const isAssigned = assignedIds.has(product.id);
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-[#E4DED2] bg-[#F7F3EC]/40 p-2.5 transition hover:border-[#1F3A2E]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={product.image || "/placeholder-product.svg"}
                          alt={product.name}
                          className="h-10 w-10 shrink-0 rounded-md object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#211F1D]">
                            {product.name}
                          </p>
                          <p className="text-xs text-[#8A8378]">
                            {product.category || "General"} • $
                            {Number(product.price || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isAssigned}
                        onClick={() => handleAddProduct(product)}
                        className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                          isAssigned
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-[#1F3A2E] text-white hover:bg-[#152820]"
                        }`}
                      >
                        {isAssigned ? "Assigned" : "Add"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
