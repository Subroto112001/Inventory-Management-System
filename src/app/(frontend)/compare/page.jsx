"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LuSearch,
  LuUser,
  LuGitCompare,
  LuShoppingCart,
  LuHeart,
  LuChevronRight,
  LuMenu,
  LuX,
  LuPlus,
  LuStar,
  LuCheck,
  LuImageOff,
  LuMail,
  LuPhone,
  LuMapPin,
} from "react-icons/lu";

const NAV_LINKS = [
  "Home",
  "Shop All",
  "Lighting",
  "Kitchen & Dining",
  "Furniture",
  "Textiles & Bedding",
  "Outdoor & Garden",
  "Decor & Accents",
  "Brands",
  "Sale",
];

const MAX_COMPARE = 4;

/* =========================================================
   PRODUCTS — edit / replace with your own data or API response.
   Every product uses the same spec keys so rows line up.
   ========================================================= */

const PRODUCTS = [
  {
    id: 1,
    name: "Alder Oak Lounge Chair",
    category: "Lounge chairs",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=85",
    price: 189,
    oldPrice: 229,
    rating: 4.7,
    reviews: 128,
    specs: {
      availability: "In stock",
      material: "Solid oak, wool-blend seat",
      dimensions: "72 × 78 × 84 cm",
      weight: "9.5 kg",
      colours: "Natural, Charcoal",
      madeIn: "Portugal",
      assembly: "Attach legs (10 min)",
      delivery: "3–5 days",
      warranty: "5 years",
      care: "Wipe with a dry cloth",
    },
  },
  {
    id: 2,
    name: "Birch Accent Chair",
    category: "Lounge chairs",
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=85",
    price: 149,
    rating: 4.4,
    reviews: 86,
    specs: {
      availability: "In stock",
      material: "Birch plywood, cotton canvas",
      dimensions: "64 × 70 × 80 cm",
      weight: "6.8 kg",
      colours: "Sand, Sage",
      madeIn: "Poland",
      assembly: "Ready assembled",
      delivery: "3–5 days",
      warranty: "2 years",
      care: "Spot clean with mild soap",
    },
  },
  {
    id: 3,
    name: "Linen Club Chair",
    category: "Lounge chairs",
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=85",
    price: 329,
    oldPrice: 389,
    rating: 4.8,
    reviews: 214,
    specs: {
      availability: "Only 3 left",
      material: "Ash frame, washed linen",
      dimensions: "80 × 84 × 78 cm",
      weight: "14 kg",
      colours: "Oat, Olive, Clay",
      madeIn: "Portugal",
      assembly: "Ready assembled",
      delivery: "5–7 days",
      warranty: "5 years",
      care: "Removable, washable cover",
    },
  },
  {
    id: 4,
    name: "Rattan Lounge Chair",
    category: "Lounge chairs",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=85",
    price: 219,
    rating: 4.5,
    reviews: 62,
    specs: {
      availability: "In stock",
      material: "Natural rattan, teak legs",
      dimensions: "70 × 75 × 88 cm",
      weight: "8.2 kg",
      colours: "Natural",
      madeIn: "Indonesia",
      assembly: "Attach legs (15 min)",
      delivery: "7–10 days",
      warranty: "3 years",
      care: "Dust regularly, avoid damp",
    },
  },
  {
    id: 5,
    name: "Walnut Rocking Chair",
    category: "Lounge chairs",
    image:
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=600&q=85",
    price: 399,
    rating: 4.9,
    reviews: 41,
    specs: {
      availability: "Made to order",
      material: "Solid walnut, leather sling",
      dimensions: "68 × 92 × 90 cm",
      weight: "11 kg",
      colours: "Walnut",
      madeIn: "Denmark",
      assembly: "Ready assembled",
      delivery: "3 weeks",
      warranty: "10 years",
      care: "Oil the wood twice a year",
    },
  },
  {
    id: 6,
    name: "Hand-Thrown Ceramic Mug",
    category: "Kitchen & Dining",
    image:
      "https://images.unsplash.com/photo-1572119865084-43c285814d63?auto=format&fit=crop&w=600&q=85",
    price: 58,
    rating: 4.6,
    reviews: 305,
    specs: {
      availability: "In stock",
      material: "Stoneware, reactive glaze",
      dimensions: "9 × 9 × 10 cm",
      weight: "0.4 kg",
      colours: "Moss, Cream, Slate",
      madeIn: "Portland, USA",
      assembly: "Not needed",
      delivery: "2–3 days",
      warranty: "1 year",
      care: "Dishwasher safe",
    },
  },
];

const SPEC_GROUPS = [
  {
    title: "Overview",
    rows: [
      { label: "Availability", key: "availability" },
      { label: "Made in", key: "madeIn" },
    ],
  },
  {
    title: "Materials & size",
    rows: [
      { label: "Material", key: "material" },
      { label: "Dimensions", key: "dimensions" },
      { label: "Weight", key: "weight" },
      { label: "Colours", key: "colours" },
    ],
  },
  {
    title: "Delivery & care",
    rows: [
      { label: "Delivery", key: "delivery" },
      { label: "Assembly", key: "assembly" },
      { label: "Care", key: "care" },
      { label: "Warranty", key: "warranty" },
    ],
  },
];

const FOOTER_COLUMNS = [
  {
    title: "Shop",
    items: ["Shop All", "Furniture", "Lighting", "Kitchen & Dining"],
  },
  {
    title: "Help",
    items: ["Contact us", "Shipping & delivery", "Returns", "FAQ"],
  },
];

function ProductImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`${className} bg-[#EFE9DC] flex items-center justify-center text-[#8A8378]`}
      >
        <LuImageOff size={24} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

function Rating({ rating, reviews }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-[#5B564C]">
      <LuStar size={13} className="text-[#C9A659] fill-[#C9A659]" />
      <span className="text-[#211F1D]">{rating.toFixed(1)}</span>
      <span className="text-[#8A8378]">({reviews})</span>
    </div>
  );
}

export default function ComparePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([1, 2, 3]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");
  const [diffOnly, setDiffOnly] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const selected = selectedIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean);

  const isFull = selected.length >= MAX_COMPARE;
  const canCompareBest = selected.length >= 2;

  const lowestPrice = Math.min(...selected.map((p) => p.price));
  const topRating = Math.max(...selected.map((p) => p.rating));

  const addProduct = (id) => {
    if (isFull || selectedIds.includes(id)) return;
    setSelectedIds((prev) => [...prev, id]);
  };

  const removeProduct = (id) =>
    setSelectedIds((prev) => prev.filter((x) => x !== id));

  const toggleWishlist = (id) =>
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const pickerResults = PRODUCTS.filter((p) =>
    `${p.name} ${p.category}`.toLowerCase().includes(pickerQuery.toLowerCase()),
  );

  // Rows where every selected product has the same value are "shared"
  const isDifferent = (key) =>
    new Set(selected.map((p) => p.specs[key])).size > 1;

  const gridCols = {
    gridTemplateColumns: `150px repeat(${MAX_COMPARE}, minmax(210px, 1fr))`,
  };

  const labelCell =
    "sticky left-0 z-10 bg-white border-t border-[#E4DED2] px-4 py-3.5 text-xs text-[#8A8378]";
  const valueCell =
    "border-t border-l border-[#E4DED2] px-4 py-3.5 text-sm text-[#211F1D]";

  return (
    <div className="min-h-screen bg-[#F7F3EC] font-sans">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap"
      />

      <style>{`
        .font-serif { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .font-sans { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      `}</style>



      
      <main>
        {/* Breadcrumb */}
        <section className="border-b border-[#E4DED2]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-2 text-xs text-[#8A8378]">
              <a href="#" className="hover:text-[#B65C38] transition-colors">
                Home
              </a>
              <LuChevronRight size={13} />
              <a href="#" className="hover:text-[#B65C38] transition-colors">
                Furniture
              </a>
              <LuChevronRight size={13} />
              <span className="text-[#211F1D]">Compare</span>
            </div>
          </div>
        </section>

        {/* Heading */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
          <p className="text-sm text-[#B65C38] mb-1">Side by side</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#211F1D]">
            Compare products
          </h1>
          <p className="text-sm text-[#5B564C] mt-2 max-w-xl leading-relaxed">
            Pick up to {MAX_COMPARE} products to see price, materials, size and
            delivery next to each other.
          </p>
        </section>

        {/* Toolbar */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-[#211F1D]">
              {selected.length} of {MAX_COMPARE} products selected
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <button
                type="button"
                role="switch"
                aria-checked={diffOnly}
                onClick={() => setDiffOnly((v) => !v)}
                className="flex items-center gap-2.5 text-sm text-[#211F1D]"
              >
                <span
                  className={`relative w-9 h-5 rounded-full transition-colors ${
                    diffOnly ? "bg-[#1F3A2E]" : "bg-[#E4DED2]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      diffOnly ? "translate-x-4" : ""
                    }`}
                  />
                </span>
                Show differences only
              </button>

              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="text-sm text-[#8A8378] hover:text-[#B65C38] transition-colors"
                >
                  Clear all
                </button>
              )}

              <button
                type="button"
                disabled={isFull}
                onClick={() => setPickerOpen(true)}
                className="flex items-center gap-2 bg-[#1F3A2E] text-[#F7F3EC] px-4 py-2.5 rounded-sm text-sm hover:bg-[#16281F] transition-colors disabled:bg-[#E4DED2] disabled:text-[#8A8378] disabled:cursor-not-allowed"
              >
                <LuPlus size={15} />
                Add product
              </button>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="bg-white border border-[#E4DED2] rounded-md overflow-x-auto">
            <div className="grid min-w-max" style={gridCols}>
              {/* ---------- Product header row ---------- */}
              <div className="sticky left-0 z-10 bg-white p-4 flex items-end">
                <p className="text-xs text-[#8A8378] leading-relaxed">
                  {selected.length < 2
                    ? "Add at least two products to compare."
                    : diffOnly
                      ? "Showing what's different."
                      : "Showing all details."}
                </p>
              </div>

              {Array.from({ length: MAX_COMPARE }).map((_, slot) => {
                const product = selected[slot];

                if (!product) {
                  return (
                    <div
                      key={`empty-${slot}`}
                      className="border-l border-[#E4DED2] p-4"
                    >
                      <button
                        type="button"
                        onClick={() => setPickerOpen(true)}
                        className="w-full aspect-[4/5] border border-dashed border-[#C9C2B3] rounded-sm flex flex-col items-center justify-center gap-2 text-[#8A8378] hover:border-[#1F3A2E] hover:text-[#1F3A2E] transition-colors"
                      >
                        <LuPlus size={22} />
                        <span className="text-sm">Add a product</span>
                      </button>
                    </div>
                  );
                }

                const isLowest =
                  canCompareBest && product.price === lowestPrice;
                const isTop = canCompareBest && product.rating === topRating;
                const saved = wishlist.includes(product.id);

                return (
                  <div
                    key={product.id}
                    className="relative border-l border-[#E4DED2] p-4"
                  >
                    <button
                      type="button"
                      onClick={() => removeProduct(product.id)}
                      aria-label={`Remove ${product.name}`}
                      className="absolute top-6 right-6 z-10 w-7 h-7 rounded-full bg-white/90 border border-[#E4DED2] flex items-center justify-center text-[#211F1D] hover:text-[#B65C38] transition-colors"
                    >
                      <LuX size={14} />
                    </button>

                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      className="w-full aspect-[4/5] object-cover rounded-sm"
                    />

                    <div className="flex flex-wrap gap-1.5 mt-3 min-h-[22px]">
                      {isLowest && (
                        <span className="text-[11px] bg-[#EFE9DC] text-[#1F3A2E] px-2 py-0.5 rounded-sm">
                          Lowest price
                        </span>
                      )}
                      {isTop && (
                        <span className="text-[11px] bg-[#EFE9DC] text-[#1F3A2E] px-2 py-0.5 rounded-sm">
                          Top rated
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#8A8378] mt-2">
                      {product.category}
                    </p>
                    <h3 className="font-serif text-lg text-[#211F1D] leading-snug mt-0.5">
                      {product.name}
                    </h3>

                    <div className="mt-2">
                      <Rating
                        rating={product.rating}
                        reviews={product.reviews}
                      />
                    </div>

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-serif text-xl text-[#1F3A2E]">
                        ${product.price}
                      </span>
                      {product.oldPrice && (
                        <span className="text-xs text-[#8A8378] line-through">
                          ${product.oldPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => setCartCount((c) => c + 1)}
                        className="flex-1 bg-[#1F3A2E] text-[#F7F3EC] py-2.5 rounded-sm text-sm hover:bg-[#16281F] transition-colors"
                      >
                        Add to cart
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        aria-label={
                          saved ? "Remove from wishlist" : "Save to wishlist"
                        }
                        aria-pressed={saved}
                        className="w-10 h-10 border border-[#E4DED2] rounded-sm flex items-center justify-center hover:border-[#B65C38] transition-colors"
                      >
                        <LuHeart
                          size={17}
                          className={
                            saved
                              ? "text-[#B65C38] fill-[#B65C38]"
                              : "text-[#211F1D]"
                          }
                        />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* ---------- Spec rows ---------- */}
              {SPEC_GROUPS.map((group) => {
                const rows = group.rows.filter(
                  (row) =>
                    !diffOnly || selected.length < 2 || isDifferent(row.key),
                );

                if (rows.length === 0) return null;

                return (
                  <div key={group.title} className="contents">
                    <div
                      className="border-t border-[#E4DED2] bg-[#EFE9DC]"
                      style={{ gridColumn: "1 / -1" }}
                    >
                      <p className="sticky left-0 w-max px-4 py-2.5 font-serif text-base text-[#211F1D]">
                        {group.title}
                      </p>
                    </div>

                    {rows.map((row) => {
                      const different =
                        selected.length >= 2 && isDifferent(row.key);

                      return (
                        <div key={row.key} className="contents">
                          <div className={labelCell}>{row.label}</div>

                          {Array.from({ length: MAX_COMPARE }).map(
                            (_, slot) => {
                              const product = selected[slot];

                              return (
                                <div
                                  key={`${row.key}-${slot}`}
                                  className={`${valueCell} ${
                                    different && !diffOnly ? "bg-[#FBF9F4]" : ""
                                  } ${product ? "" : "text-[#C9C2B3]"}`}
                                >
                                  {product ? product.specs[row.key] : "—"}
                                </div>
                              );
                            },
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {diffOnly && selected.length >= 2 && (
            <p className="text-xs text-[#8A8378] mt-3">
              Details that are the same across every product are hidden.
            </p>
          )}
          {!diffOnly && selected.length >= 2 && (
            <p className="text-xs text-[#8A8378] mt-3">
              Shaded rows show details that differ between products.
            </p>
          )}
        </section>
      </main>

      {/* =====================================================
          PRODUCT PICKER
      ===================================================== */}

      {pickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Add a product to compare"
        >
          <div
            className="absolute inset-0 bg-[#211F1D]/50"
            onClick={() => setPickerOpen(false)}
          />

          <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-[#F7F3EC] rounded-md overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <div>
                <h2 className="font-serif text-xl text-[#211F1D]">
                  Add a product
                </h2>
                <p className="text-xs text-[#8A8378] mt-0.5">
                  {selected.length} of {MAX_COMPARE} selected
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                aria-label="Close"
              >
                <LuX size={20} className="text-[#211F1D]" />
              </button>
            </div>

            <div className="px-5 pb-4">
              <div className="flex items-center border border-[#E4DED2] rounded-md bg-white overflow-hidden">
                <LuSearch size={16} className="ml-3.5 text-[#8A8378]" />
                <input
                  type="text"
                  value={pickerQuery}
                  onChange={(e) => setPickerQuery(e.target.value)}
                  placeholder="Search products…"
                  className="flex-1 px-3 py-2.5 text-sm text-[#211F1D] placeholder:text-[#8A8378] outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="overflow-y-auto px-5 pb-5 space-y-2">
              {pickerResults.length === 0 && (
                <p className="text-sm text-[#5B564C] py-6 text-center">
                  No products match “{pickerQuery}”. Try a different name or
                  category.
                </p>
              )}

              {pickerResults.map((product) => {
                const added = selectedIds.includes(product.id);
                const disabled = !added && isFull;

                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 bg-white border border-[#E4DED2] rounded-md p-3"
                  >
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-sm shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#211F1D] truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-[#8A8378]">
                        {product.category} · ${product.price}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() =>
                        added
                          ? removeProduct(product.id)
                          : addProduct(product.id)
                      }
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs transition-colors ${
                        added
                          ? "border border-[#1F3A2E] text-[#1F3A2E]"
                          : "bg-[#1F3A2E] text-[#F7F3EC] hover:bg-[#16281F]"
                      } disabled:bg-[#E4DED2] disabled:text-[#8A8378] disabled:cursor-not-allowed`}
                    >
                      {added ? (
                        <>
                          <LuCheck size={13} />
                          Added
                        </>
                      ) : (
                        "Add"
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

   
    </div>
  );
}
