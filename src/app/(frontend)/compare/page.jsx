"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

/* =========================================================
   MOCK PRODUCTS (replace with real data / cart compare state)
========================================================= */

const ALL_PRODUCTS = [
  {
    id: 1,
    name: "Alder Oak Dining Chair",
    category: "Furniture",
    price: 189,
    oldPrice: 229,
    rating: 4.8,
    reviews: 62,
    badge: "Exclusive",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=85",
    material: "Solid oak, natural oil finish",
    dimensions: '18" W × 20" D × 33" H',
    weight: "12 lb",
    warranty: "2 years",
    inStock: true,
  },
  {
    id: 3,
    name: "Brushed Brass Pendant Light",
    category: "Lighting",
    price: 145,
    rating: 4.7,
    reviews: 38,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=400&q=85",
    material: "Brushed brass, linen shade",
    dimensions: '12" Ø × 10" H',
    weight: "3.2 lb",
    warranty: "1 year",
    inStock: true,
  },
  {
    id: 10,
    name: "Bouclé Reading Armchair",
    category: "Furniture",
    price: 540,
    oldPrice: 620,
    rating: 4.9,
    reviews: 54,
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=400&q=85",
    material: "Bouclé fabric, solid wood frame",
    dimensions: '32" W × 34" D × 36" H',
    weight: "48 lb",
    warranty: "3 years",
    inStock: true,
  },
  {
    id: 13,
    name: "Linen Shade Table Lamp",
    category: "Lighting",
    price: 74,
    rating: 4.6,
    reviews: 46,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=85",
    material: "Ceramic base, linen shade",
    dimensions: '10" Ø × 22" H',
    weight: "4.5 lb",
    warranty: "1 year",
    inStock: true,
  },
  {
    id: 17,
    name: "Washed Linen Duvet Set",
    category: "Textiles & Bedding",
    price: 128,
    rating: 4.8,
    reviews: 95,
    image:
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=85",
    material: "100% washed linen",
    dimensions: 'Queen (90" × 90")',
    weight: "3.1 lb",
    warranty: "—",
    inStock: true,
  },
  {
    id: 12,
    name: "Woven Rattan Ottoman",
    category: "Furniture",
    price: 165,
    oldPrice: 190,
    rating: 4.7,
    reviews: 33,
    image:
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=400&q=85",
    material: "Natural rattan, cotton cushion",
    dimensions: '20" W × 20" D × 16" H',
    weight: "9 lb",
    warranty: "1 year",
    inStock: false,
  },
];

const INITIAL_COMPARE_IDS = [1, 3, 10, 13]; // start with 4 items

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
  void ALL_PRODUCTS;
  void INITIAL_COMPARE_IDS;
  const [catalog, setCatalog] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      const response = await fetch("/api/product?limit=100", {
        cache: "no-store",
      });
      const data = await response.json();
      if (response.ok) {
        setCatalog(
          (data.products || []).map((product) => ({
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
      }
    };
    const timer = setTimeout(loadProducts, 0);
    return () => clearTimeout(timer);
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
    setCompareIds((ids) => ids.filter((x) => x !== id));
    showToast("Removed from comparison");
  };

  const clearAll = () => {
    setCompareIds([]);
    showToast("Comparison cleared");
  };

  const addProduct = (id) => {
    if (compareIds.length >= 4) {
      showToast("You can compare up to 4 products");
      return;
    }
    setCompareIds((ids) => [...ids, id]);
    showToast("Added to comparison");
  };

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
        {products.length === 0 ? (
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
