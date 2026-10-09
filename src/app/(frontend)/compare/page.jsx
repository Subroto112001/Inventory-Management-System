"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCompare } from "@/Component/website/Cart/CompareContext";
import { useCart } from "@/Component/website/Cart/CartContext";
import {
  LuSearch,
  LuUser,
  LuGitCompare,
  LuShoppingCart,
  LuHeart,
  LuChevronLeft,
  LuChevronRight,
  LuStar,
  LuMenu,
  LuX,
  LuTrash2,
  LuPlus,
  LuCheck,
  LuScale,
} from "react-icons/lu";

const COMPARE_ROWS = [
  { key: "price", label: "Price" },
  { key: "rating", label: "Rating" },
  { key: "category", label: "Category" },
  { key: "material", label: "Material" },
  { key: "dimensions", label: "Dimensions" },
  { key: "weight", label: "Weight" },
  { key: "warranty", label: "Warranty" },
  { key: "stock", label: "Availability" },
];

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5 justify-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <LuStar
          key={i}
          size={13}
          className={
            i < Math.round(rating)
              ? "fill-[#C9A659] text-[#C9A659]"
              : "fill-[#E4DED2] text-[#E4DED2]"
          }
        />
      ))}
    </div>
  );
}

function EmptyCompare({ onBrowse }) {
  return (
    <div className="bg-white border border-[#E4DED2] rounded-md py-20 px-6 text-center">
      <LuScale size={36} className="mx-auto text-[#8A8378] mb-4" />
      <p className="font-serif text-2xl mb-2">No products to compare</p>
      <p className="text-sm text-[#8A8378] mb-6 max-w-sm mx-auto">
        Add products from the shop using the compare icon, then return here to
        see them side by side.
      </p>
      <button
        type="button"
        onClick={onBrowse}
        className="bg-[#1F3A2E] text-[#F7F3EC] text-sm px-5 py-2.5 rounded-sm hover:bg-[#16281F] transition-colors"
      >
        Browse products
      </button>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ComparePage() {
  const [catalog, setCatalog] = useState([]);
  const [toast, setToast] = useState("");
  const { ids: compareIds, loaded: compareLoaded, add, remove, clear } = useCompare();
  const { addItem: addToCart } = useCart();
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const loadProducts = async () => {
      try {
        const firstResponse = await fetch("/api/product?public=1&limit=48&page=1", { cache: "no-store", signal: controller.signal });
        const firstData = await firstResponse.json();
        if (!firstResponse.ok) throw new Error(firstData.message || "Unable to load products for comparison");
        const allProducts = [...(firstData.products || [])];
        const totalPages = firstData.pagination?.totalPages || 1;
        for (let page = 2; page <= totalPages; page += 1) {
          const response = await fetch(`/api/product?public=1&limit=48&page=${page}`, { cache: "no-store", signal: controller.signal });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || "Unable to load products for comparison");
          allProducts.push(...(data.products || []));
        }
        setCatalog(
          allProducts.map((product) => ({
            id: product.id,
            name: product.productName,
            category: product.category || "",
            price: product.price,
            oldPrice: null,
            rating: 0,
            reviews: 0,
            badge: product.inStock ? "In stock" : "Out of stock",
            image: product.image || "",
            material: product.description || "—",
            dimensions: "—",
            weight: product.unit || "—",
            warranty: "—",
            inStock: product.inStock,
          })),
        );
      } catch (error) {
        if (error.name !== "AbortError") setCatalogError(error.message || "Unable to load products for comparison");
      } finally { setCatalogLoading(false); }
    };
    const timer = setTimeout(loadProducts, 0);
    return () => { clearTimeout(timer); controller.abort(); };
  }, []);

  const products = useMemo(
    () => catalog.filter((p) => compareIds.includes(p.id)),
    [catalog, compareIds],
  );

  const availableToAdd = useMemo(
    () => catalog.filter((p) => !compareIds.includes(p.id)),
    [catalog, compareIds],
  );

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const removeProduct = (id) => {
    remove(id);
    showToast("Removed from comparison");
  };

  const clearAll = () => {
    clear();
    showToast("Comparison cleared");
  };

  const addProduct = (id) => {
    const result = add(id);
    showToast(result === "added" ? "Added to comparison" : result === "exists" ? "Already in comparison" : "You can compare up to 4 products");
  };

  useEffect(() => {
    if (compareLoaded && !catalogLoading) compareIds.filter((id) => !catalog.some((product) => product.id === id)).forEach(remove);
  }, [compareLoaded, catalogLoading, catalog, compareIds, remove]);

  const colCount = products.length;

  return (
    <div className="min-h-screen bg-[#F7F3EC] font-sans text-[#211F1D]">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap"
      />

      <style>{`
        .font-serif {
          font-family: 'Fraunces', ui-serif, Georgia, serif;
        }
        .font-sans {
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
        }
      `}</style>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-[#211F1D] text-[#F7F3EC] text-sm px-5 py-3 rounded-md shadow-lg flex items-center gap-2"
        >
          <LuCheck size={16} className="text-[#C9A659]" />
          {toast}
        </div>
      )}

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-16">
        {/* Breadcrumb */}
        <div className="py-6 text-sm text-[#8A8378] flex items-center gap-2">
          <a href="#" className="hover:text-[#B65C38] transition-colors">
            Home
          </a>
          <LuChevronRight size={13} />
          <a href="#" className="hover:text-[#B65C38] transition-colors">
            Shop
          </a>
          <LuChevronRight size={13} />
          <span className="text-[#211F1D]">Compare</span>
        </div>

        {/* Title */}
        <section className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-sm text-[#B65C38] mb-1">Side by side</p>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#211F1D]">
              Product comparison
            </h1>
            <p className="text-sm text-[#8A8378] mt-2 max-w-lg">
              Compare up to 4 products at a glance — price, materials, size and
              more.
            </p>
          </div>

          {products.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-sm text-[#B65C38] border-b border-[#B65C38] pb-0.5 hover:text-[#9E4D2E] hover:border-[#9E4D2E] transition-colors self-start sm:self-auto"
            >
              Clear all
            </button>
          )}
        </section>

        {/* Empty state */}
        {catalogLoading || !compareLoaded ? <p className="py-16 text-center text-sm text-[#8A8378]" role="status">Loading comparison...</p> : catalogError ? <p className="py-16 text-center text-sm text-red-700" role="alert">{catalogError}</p> : products.length === 0 ? (
          <EmptyCompare onBrowse={() => {}} />
        ) : (
          <>
            {/* ── COMPARISON TABLE ── */}
            <div className="bg-white border border-[#E4DED2] rounded-md overflow-hidden">
              {/* Horizontal scroll on mobile */}
              <div className="overflow-x-auto">
                <div
                  className="min-w-[640px]"
                  style={{
                    display: "grid",
                    gridTemplateColumns: `180px repeat(${colCount}, minmax(180px, 1fr))`,
                  }}
                >
                  {/* ── Header row: product cards ── */}
                  <div className="border-b border-[#E4DED2] bg-[#F7F3EC] p-4 sticky left-0 z-10">
                    <p className="text-xs text-[#8A8378] mt-16">
                      Comparing {products.length} product
                      {products.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="border-b border-l border-[#E4DED2] p-4 text-center relative group"
                    >
                      <button
                        type="button"
                        onClick={() => removeProduct(p.id)}
                        aria-label={`Remove ${p.name}`}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border border-[#E4DED2] flex items-center justify-center text-[#8A8378] hover:text-[#B65C38] hover:border-[#B65C38] transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <LuX size={15} />
                      </button>

                      <div className="aspect-square max-w-[140px] mx-auto rounded-sm overflow-hidden bg-[#F7F3EC] mb-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {p.badge && (
                        <span className="inline-block text-[10px] px-2 py-0.5 rounded-sm bg-[#1F3A2E] text-[#F7F3EC] mb-2">
                          {p.badge}
                        </span>
                      )}

                      <h3 className="text-sm text-[#211F1D] leading-snug line-clamp-2 min-h-[40px]">
                        {p.name}
                      </h3>
                    </div>
                  ))}

                  {/* ── Attribute rows ── */}
                  {COMPARE_ROWS.map((row) => (
                    <div key={row.key} className="contents">
                      {/* Label */}
                      <div className="border-b border-[#E4DED2] px-4 py-3.5 text-sm text-[#5B564C] bg-[#F7F3EC] sticky left-0 z-10 flex items-center">
                        {row.label}
                      </div>

                      {/* Values */}
                      {products.map((p) => {
                        let content = null;

                        if (row.key === "price") {
                          content = (
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="text-[#1F3A2E] font-medium text-base">
                                ${p.price}
                              </span>
                              {p.oldPrice && (
                                <span className="text-xs text-[#8A8378] line-through">
                                  ${p.oldPrice}
                                </span>
                              )}
                            </div>
                          );
                        } else if (row.key === "rating") {
                          content = (
                            <div className="flex flex-col items-center gap-1">
                              <Stars rating={p.rating} />
                              <span className="text-xs text-[#8A8378]">
                                {p.rating} ({p.reviews})
                              </span>
                            </div>
                          );
                        } else if (row.key === "stock") {
                          content = p.inStock ? (
                            <span className="text-sm text-[#1F3A2E]">
                              In stock
                            </span>
                          ) : (
                            <span className="text-sm text-[#B65C38]">
                              Out of stock
                            </span>
                          );
                        } else {
                          content = (
                            <span className="text-sm text-[#211F1D]">
                              {p[row.key]}
                            </span>
                          );
                        }

                        return (
                          <div
                            key={`${p.id}-${row.key}`}
                            className="border-b border-l border-[#E4DED2] px-4 py-3.5 text-center flex items-center justify-center"
                          >
                            {content}
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {/* ── Action row ── */}
                  <div className="px-4 py-4 bg-[#F7F3EC] sticky left-0 z-10" />

                  {products.map((p) => (
                    <div
                      key={`action-${p.id}`}
                      className="border-l border-[#E4DED2] p-4 flex flex-col gap-2"
                    >
                      <button
                        type="button"
                        disabled={!p.inStock}
                        onClick={() => addToCart(p)}
                        className="w-full flex items-center justify-center gap-2 bg-[#211F1D] text-[#F7F3EC] text-sm py-2.5 rounded-sm hover:bg-[#1F3A2E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <LuShoppingCart size={14} />
                        Add to cart
                      </button>
                      <button
                        type="button"
                        onClick={() => removeProduct(p.id)}
                        className="w-full flex items-center justify-center gap-2 text-sm py-2 rounded-sm border border-[#E4DED2] text-[#5B564C] hover:border-[#B65C38] hover:text-[#B65C38] transition-colors"
                      >
                        <LuTrash2 size={14} />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Add more products ── */}
            {availableToAdd.length > 0 && compareIds.length < 4 && (
              <section className="mt-10">
                <div className="flex items-end justify-between gap-4 mb-5">
                  <div>
                    <p className="text-sm text-[#B65C38] mb-1">
                      Still deciding?
                    </p>
                    <h2 className="font-serif text-2xl text-[#211F1D]">
                      Add another product
                    </h2>
                  </div>
                  <p className="text-xs text-[#8A8378]">
                    {4 - compareIds.length} slot
                    {4 - compareIds.length > 1 ? "s" : ""} left
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {availableToAdd.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="bg-white border border-[#E4DED2] rounded-md overflow-hidden hover:border-[#C9A659] transition-colors group"
                    >
                      <div className="aspect-square bg-[#F7F3EC] overflow-hidden">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-[#8A8378] mb-0.5">
                          {p.category}
                        </p>
                        <h3 className="text-sm text-[#211F1D] leading-snug line-clamp-2 min-h-[40px]">
                          {p.name}
                        </h3>
                        <p className="text-sm text-[#1F3A2E] mt-1 mb-3">
                          ${p.price}
                        </p>
                        <button
                          type="button"
                          onClick={() => addProduct(p.id)}
                          className="w-full flex items-center justify-center gap-1.5 text-sm py-2 rounded-sm border border-[#E4DED2] text-[#211F1D] hover:border-[#1F3A2E] hover:bg-[#1F3A2E] hover:text-[#F7F3EC] transition-colors"
                        >
                          <LuPlus size={14} />
                          Compare
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
