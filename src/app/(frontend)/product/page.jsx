
"use client";

import { useMemo, useState } from "react";
import {
  LuSearch,
  LuUser,
  LuGitCompare,
  LuShoppingCart,
  LuHeart,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuStar,
  LuMenu,
  LuX,
  LuSlidersHorizontal,
  LuGrid2X2,
  LuList,
  LuCheck,
} from "react-icons/lu";

const CATEGORIES = [
  "All Products",
  "Lighting",
  "Kitchen & Dining",
  "Furniture",
  "Textiles & Bedding",
  "Outdoor & Garden",
  "Decor & Accents",
  "Storage",
  "Bath",
];

const PRODUCTS = [
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
      "https://placehold.co/600x600/1F3A2E/F7F3EC?text=Alder+Dining+Chair",
  },
  {
    id: 2,
    name: "Hand-Thrown Stoneware Mug Set",
    category: "Kitchen & Dining",
    price: 58,
    rating: 4.9,
    reviews: 140,
    badge: "Best Seller",
    image:
      "https://placehold.co/600x600/B65C38/F7F3EC?text=Stoneware+Mug+Set",
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
      "https://placehold.co/600x600/C9A659/211F1D?text=Brass+Pendant",
  },
  {
    id: 4,
    name: "Linen Weave Throw Blanket",
    category: "Textiles & Bedding",
    price: 76,
    rating: 4.6,
    reviews: 51,
    image:
      "https://placehold.co/600x600/93A88A/211F1D?text=Wool+Throw",
  },
  {
    id: 5,
    name: 'Cast Iron Skillet 10"',
    category: "Kitchen & Dining",
    price: 42,
    rating: 4.9,
    reviews: 210,
    badge: "Best Seller",
    image:
      "https://placehold.co/600x600/211F1D/F7F3EC?text=Cast+Iron+Skillet",
  },
  {
    id: 6,
    name: "Olive Wood Cutting Board",
    category: "Kitchen & Dining",
    price: 34,
    rating: 4.7,
    reviews: 88,
    image:
      "https://placehold.co/600x600/B08D3E/211F1D?text=Olive+Wood+Board",
  },
  {
    id: 7,
    name: "Speckled Ceramic Bowl Set",
    category: "Kitchen & Dining",
    price: 64,
    rating: 4.8,
    reviews: 73,
    image:
      "https://placehold.co/600x600/E4DED2/211F1D?text=Ceramic+Bowls",
  },
  {
    id: 8,
    name: "Hand-Blown Glass Carafe",
    category: "Kitchen & Dining",
    price: 29,
    rating: 4.5,
    reviews: 40,
    badge: "New",
    image:
      "https://placehold.co/600x600/93A88A/211F1D?text=Glass+Carafe",
  },
  {
    id: 9,
    name: "Teak Outdoor Bench",
    category: "Furniture",
    price: 320,
    rating: 4.6,
    reviews: 27,
    image:
      "https://placehold.co/600x600/16281F/F7F3EC?text=Teak+Bench",
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
      "https://placehold.co/600x600/B08D3E/211F1D?text=Boucle+Armchair",
  },
  {
    id: 11,
    name: "Floating Walnut Shelf",
    category: "Furniture",
    price: 88,
    rating: 4.4,
    reviews: 19,
    image:
      "https://placehold.co/600x600/211F1D/F7F3EC?text=Walnut+Shelf",
  },
  {
    id: 12,
    name: "Woven Rattan Ottoman",
    category: "Furniture",
    price: 165,
    rating: 4.7,
    reviews: 33,
    image:
      "https://placehold.co/600x600/93A88A/211F1D?text=Rattan+Ottoman",
  },
  {
    id: 13,
    name: "Linen Shade Table Lamp",
    category: "Lighting",
    price: 74,
    rating: 4.6,
    reviews: 46,
    image:
      "https://placehold.co/600x600/1F3A2E/F7F3EC?text=Table+Lamp",
  },
  {
    id: 14,
    name: "Brass Wall Sconce, Pair",
    category: "Lighting",
    price: 96,
    rating: 4.8,
    reviews: 22,
    badge: "New",
    image:
      "https://placehold.co/600x600/C9A659/211F1D?text=Wall+Sconce",
  },
  {
    id: 15,
    name: "Arched Iron Floor Lamp",
    category: "Lighting",
    price: 132,
    rating: 4.5,
    reviews: 17,
    image:
      "https://placehold.co/600x600/B65C38/F7F3EC?text=Floor+Lamp",
  },
  {
    id: 16,
    name: "Rice Paper Pendant Shade",
    category: "Lighting",
    price: 48,
    rating: 4.3,
    reviews: 29,
    image:
      "https://placehold.co/600x600/16281F/F7F3EC?text=Paper+Pendant",
  },
  {
    id: 17,
    name: "Washed Linen Duvet Set",
    category: "Textiles & Bedding",
    price: 128,
    rating: 4.8,
    reviews: 95,
    image:
      "https://placehold.co/600x600/93A88A/211F1D?text=Linen+Duvet",
  },
  {
    id: 18,
    name: "Hand-Knotted Wool Rug",
    category: "Textiles & Bedding",
    price: 240,
    rating: 4.9,
    reviews: 61,
    badge: "Exclusive",
    image:
      "https://placehold.co/600x600/B08D3E/211F1D?text=Wool+Rug",
  },
  {
    id: 19,
    name: "Rattan-Framed Wall Mirror",
    category: "Decor & Accents",
    price: 68,
    rating: 4.6,
    reviews: 4,
    badge: "New",
    image:
      "https://placehold.co/600x600/C9A659/211F1D?text=Rattan+Mirror",
  },
  {
    id: 20,
    name: "Speckled Ceramic Planter",
    category: "Decor & Accents",
    price: 32,
    rating: 4.7,
    reviews: 9,
    badge: "New",
    image:
      "https://placehold.co/600x600/93A88A/211F1D?text=Ceramic+Planter",
  },
];

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <LuStar
          key={index}
          size={13}
          className={
            index < Math.round(rating)
              ? "fill-[#C9A659] text-[#C9A659]"
              : "fill-[#E4DED2] text-[#E4DED2]"
          }
        />
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group bg-white border border-[#E4DED2] rounded-md overflow-hidden hover:shadow-lg hover:border-[#C9A659] transition-all duration-200">
      <div className="relative aspect-square overflow-hidden bg-[#F7F3EC]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
        />

        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#1F3A2E] text-[#F7F3EC] text-xs px-2 py-1 rounded-sm">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => setLiked(!liked)}
          aria-label="Add to wishlist"
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center transition-all ${
            liked
              ? "text-[#B65C38]"
              : "text-[#211F1D] opacity-0 group-hover:opacity-100"
          }`}
        >
          <LuHeart
            size={16}
            className={liked ? "fill-[#B65C38]" : ""}
          />
        </button>

        <button
          type="button"
          className="absolute inset-x-3 bottom-3 bg-[#211F1D] text-[#F7F3EC] text-sm py-2.5 rounded-sm translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <LuShoppingCart size={15} />
          Add to cart
        </button>
      </div>

      <div className="p-4">
        <p className="text-xs text-[#8A8378] mb-1">
          {product.category}
        </p>

        <h3 className="text-sm text-[#211F1D] leading-snug mb-2 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-2.5">
          <Stars rating={product.rating} />
          <span className="text-xs text-[#8A8378]">
            ({product.reviews})
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-[#1F3A2E] text-base font-medium">
            ${product.price}
          </span>

          {product.oldPrice && (
            <span className="text-xs text-[#8A8378] line-through">
              ${product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Featured");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);

  const productsPerPage = 12;

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (activeCategory !== "All Products") {
      result = result.filter(
        (product) => product.category === activeCategory
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    if (sort === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "Highest Rated") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (sort === "Newest") {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [activeCategory, search, sort]);

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const visibleProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  const changeCategory = (category) => {
    setActiveCategory(category);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#211F1D]">
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

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#F7F3EC] border-b border-[#E4DED2]">
        <div className="bg-[#1F3A2E] text-[#F7F3EC] text-xs">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-2 flex justify-between">
            <p>
              Free shipping on orders over $75 · Handmade in small batches
            </p>

            <div className="hidden sm:flex gap-4">
              <a href="#">Track order</a>
              <a href="#">Help</a>
            </div>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 flex items-center gap-5">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden"
          >
            <LuMenu size={22} />
          </button>

          <a href="#" className="flex items-center gap-2 shrink-0">
            <span className="w-9 h-9 rounded-sm bg-[#1F3A2E] text-[#F7F3EC] flex items-center justify-center font-serif text-lg">
              F
            </span>

            <span className="font-serif text-xl tracking-tight hidden sm:block">
              FIELDHOUSE
            </span>
          </a>

          <div className="flex-1 max-w-xl mx-auto hidden md:flex border border-[#E4DED2] rounded-md bg-white overflow-hidden">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search for furniture, lighting, decor..."
              className="flex-1 px-4 py-2.5 text-sm outline-none"
            />

            <button
              type="button"
              className="px-4 bg-[#1F3A2E] text-[#F7F3EC]"
            >
              <LuSearch size={17} />
            </button>
          </div>

          <div className="ml-auto flex items-center gap-5">
            <button className="flex flex-col items-center">
              <LuUser size={20} />
              <span className="hidden sm:block text-[10px]">
                Account
              </span>
            </button>

            <button className="relative flex flex-col items-center">
              <LuGitCompare size={20} />
              <span className="hidden sm:block text-[10px]">
                Compare
              </span>

              <span className="absolute -top-1 -right-2 bg-[#B65C38] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </button>

            <button className="relative flex flex-col items-center">
              <LuShoppingCart size={20} />
              <span className="hidden sm:block text-[10px]">
                Cart
              </span>

              <span className="absolute -top-1 -right-2 bg-[#B65C38] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="md:hidden px-4 pb-3">
          <div className="flex border border-[#E4DED2] bg-white rounded-md overflow-hidden">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search products..."
              className="flex-1 px-3 py-2 text-sm outline-none"
            />

            <button className="px-3 bg-[#1F3A2E] text-white">
              <LuSearch size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* BREADCRUMB */}
        <div className="py-6 text-sm text-[#8A8378]">
          Home <span className="mx-2">/</span>
          <span className="text-[#211F1D]">Shop All</span>
        </div>

        {/* PAGE TITLE */}
        <section className="mb-8">
          <p className="text-sm text-[#B65C38] mb-1">
            Discover our collection
          </p>

          <h1 className="font-serif text-4xl md:text-5xl mb-3">
            Shop all products
          </h1>

          <p className="text-sm text-[#8A8378] max-w-2xl">
            Thoughtfully selected furniture, lighting, kitchenware,
            textiles and home accents made for everyday living.
          </p>
        </section>

        {/* MOBILE FILTER BUTTON */}
        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden mb-5 flex items-center gap-2 border border-[#E4DED2] bg-white px-4 py-2.5 rounded-md text-sm"
        >
          <LuSlidersHorizontal size={17} />
          Filters
        </button>

        <div className="grid lg:grid-cols-[230px_1fr] gap-8">
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Categories</h2>

                <LuSlidersHorizontal
                  size={17}
                  className="text-[#8A8378]"
                />
              </div>

              <div className="border-t border-[#E4DED2]">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => changeCategory(category)}
                    className={`w-full text-left py-3 border-b border-[#E4DED2] text-sm transition-colors flex justify-between ${
                      activeCategory === category
                        ? "text-[#1F3A2E] font-medium"
                        : "text-[#5B564C] hover:text-[#B65C38]"
                    }`}
                  >
                    <span>{category}</span>

                    {activeCategory === category && (
                      <LuCheck size={15} />
                    )}
                  </button>
                ))}
              </div>

              {/* PRICE FILTER */}
              <div className="mt-8">
                <h3 className="font-medium text-sm mb-4">
                  Price range
                </h3>

                <div className="h-1 bg-[#E4DED2] relative">
                  <div className="absolute left-[15%] right-[15%] h-1 bg-[#1F3A2E]" />

                  <span className="absolute left-[15%] -top-1.5 w-4 h-4 rounded-full bg-[#1F3A2E] border-2 border-white" />

                  <span className="absolute right-[15%] -top-1.5 w-4 h-4 rounded-full bg-[#1F3A2E] border-2 border-white" />
                </div>

                <div className="flex justify-between mt-4 text-xs text-[#8A8378]">
                  <span>$0</span>
                  <span>$600+</span>
                </div>
              </div>

              {/* AVAILABILITY */}
              <div className="mt-8">
                <h3 className="font-medium text-sm mb-3">
                  Availability
                </h3>

                <label className="flex items-center gap-2 text-sm text-[#5B564C]">
                  <input type="checkbox" className="accent-[#1F3A2E]" />
                  In stock
                </label>
              </div>
            </div>
          </aside>

          {/* PRODUCT AREA */}
          <section>
            {/* TOOLBAR */}
            <div className="bg-white border border-[#E4DED2] rounded-md px-4 py-3 mb-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <p className="text-sm text-[#8A8378]">
                Showing{" "}
                <span className="text-[#211F1D] font-medium">
                  {visibleProducts.length}
                </span>{" "}
                of{" "}
                <span className="text-[#211F1D] font-medium">
                  {filteredProducts.length}
                </span>{" "}
                products
              </p>

              <div className="flex items-center gap-3">
                {/* VIEW */}
                <div className="hidden sm:flex border border-[#E4DED2] rounded-md overflow-hidden">
                  <button
                    onClick={() => setView("grid")}
                    className={`p-2 ${
                      view === "grid"
                        ? "bg-[#1F3A2E] text-white"
                        : "bg-white"
                    }`}
                  >
                    <LuGrid2X2 size={16} />
                  </button>

                  <button
                    onClick={() => setView("list")}
                    className={`p-2 ${
                      view === "list"
                        ? "bg-[#1F3A2E] text-white"
                        : "bg-white"
                    }`}
                  >
                    <LuList size={16} />
                  </button>
                </div>

                {/* SORT */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setPage(1);
                    }}
                    className="appearance-none border border-[#E4DED2] rounded-md bg-white text-sm px-4 py-2 pr-9 outline-none cursor-pointer"
                  >
                    <option>Featured</option>
                    <option>Newest</option>
                    <option>Highest Rated</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>

                  <LuChevronDown
                    size={15}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#8A8378]"
                  />
                </div>
              </div>
            </div>

            {/* PRODUCTS */}
            {visibleProducts.length > 0 ? (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
                    : "grid grid-cols-1 gap-4"
                }
              >
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#E4DED2] rounded-md py-20 text-center">
                <p className="font-serif text-2xl mb-2">
                  No products found
                </p>

                <p className="text-sm text-[#8A8378]">
                  Try another search or category.
                </p>
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 py-12">
                <button
                  disabled={page === 1}
                  onClick={() =>
                    setPage((current) => Math.max(1, current - 1))
                  }
                  className="w-9 h-9 border border-[#E4DED2] rounded-md bg-white flex items-center justify-center disabled:opacity-40"
                >
                  <LuChevronLeft size={17} />
                </button>

                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`w-9 h-9 rounded-md text-sm ${
                        page === pageNumber
                          ? "bg-[#1F3A2E] text-white"
                          : "bg-white border border-[#E4DED2] hover:border-[#1F3A2E]"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  disabled={page === totalPages}
                  onClick={() =>
                    setPage((current) =>
                      Math.min(totalPages, current + 1)
                    )
                  }
                  className="w-9 h-9 border border-[#E4DED2] rounded-md bg-white flex items-center justify-center disabled:opacity-40"
                >
                  <LuChevronRight size={17} />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* MOBILE FILTER DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-[#211F1D]/50"
            onClick={() => setMobileFilterOpen(false)}
          />

          <div className="absolute left-0 top-0 bottom-0 w-[310px] max-w-[85%] bg-[#F7F3EC] p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl">
                Filters
              </h2>

              <button
                onClick={() => setMobileFilterOpen(false)}
              >
                <LuX size={20} />
              </button>
            </div>

            <h3 className="font-medium mb-3">
              Categories
            </h3>

            <div className="border-t border-[#E4DED2]">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    changeCategory(category);
                    setMobileFilterOpen(false);
                  }}
                  className={`w-full text-left py-3 border-b border-[#E4DED2] text-sm flex justify-between ${
                    activeCategory === category
                      ? "text-[#1F3A2E] font-medium"
                      : "text-[#5B564C]"
                  }`}
                >
                  {category}

                  {activeCategory === category && (
                    <LuCheck size={15} />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="font-medium text-sm mb-4">
                Availability
              </h3>

              <label className="flex items-center gap-2 text-sm text-[#5B564C]">
                <input
                  type="checkbox"
                  className="accent-[#1F3A2E]"
                />
                In stock
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

