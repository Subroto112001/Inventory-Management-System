"use client";

import {
  CATEGORIES,
  ProductCard,
  SORT_OPTIONS,
} from "@/frontEndDataProvider/ProductpageDataProvider";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LuSearch,
  LuUser,
  LuGitCompare,
  LuShoppingCart,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuMenu,
  LuX,
  LuSlidersHorizontal,
  LuGrid2X2,
  LuList,
  LuCheck,
} from "react-icons/lu";

export default function ProductPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All Products";

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState("Featured");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  const productsPerPage = 12;

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "All Products";
    const searchFromUrl = searchParams.get("search") || "";
    setActiveCategory(categoryFromUrl);
    setSearch(searchFromUrl);
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    const controller = new AbortController();
    const sortMap = {
      "Price: Low to High": "priceAsc",
      "Price: High to Low": "priceDesc",
      Newest: "newest",
      Featured: "newest",
      "Highest Rated": "newest",
    };
    const params = new URLSearchParams({
      public: "1",
      page: String(page),
      limit: String(productsPerPage),
      sort: sortMap[sort] || "newest",
    });
    if (activeCategory !== "All Products")
      params.set("category", activeCategory);
    if (search.trim()) params.set("search", search.trim());
    if (inStockOnly) params.set("availability", "in-stock");

    fetch(`/api/product?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Unable to load products");
        return data;
      })
      .then((data) => {
        setProducts(data.products || []);
        setTotalProducts(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 0);
      })
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") setError(fetchError.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [activeCategory, inStockOnly, page, search, sort]);

  const visibleProducts = products;

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

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* BREADCRUMB */}
        <div className="py-6 text-sm text-[#8A8378]">
          Home <span className="mx-2">/</span>
          <span className="text-[#211F1D]">Shop All</span>
        </div>

        {/* PAGE TITLE */}
        <section className="mb-8">
          <p className="text-sm text-[#B65C38] mb-1">Discover our collection</p>

          <h1 className="font-serif text-4xl md:text-5xl mb-3">
            Shop all products
          </h1>

          <p className="text-sm text-[#8A8378] max-w-2xl">
            Thoughtfully selected furniture, lighting, kitchenware, textiles and
            home accents made for everyday living.
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

                <LuSlidersHorizontal size={17} className="text-[#8A8378]" />
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

                    {activeCategory === category && <LuCheck size={15} />}
                  </button>
                ))}
              </div>

              {/* PRICE FILTER */}
              <div className="mt-8">
                <h3 className="font-medium text-sm mb-4">Price range</h3>

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
                <h3 className="font-medium text-sm mb-3">Availability</h3>

                <label className="flex items-center gap-2 text-sm text-[#5B564C]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(event) => {
                      setInStockOnly(event.target.checked);
                      setPage(1);
                    }}
                    className="accent-[#1F3A2E]"
                  />
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
                  {totalProducts}
                </span>{" "}
                products
              </p>

              <div className="flex items-center gap-3">
                {/* VIEW */}
                <div className="hidden sm:flex border border-[#E4DED2] rounded-md overflow-hidden">
                  <button
                    onClick={() => setView("grid")}
                    className={`p-2 ${
                      view === "grid" ? "bg-[#1F3A2E] text-white" : "bg-white"
                    }`}
                  >
                    <LuGrid2X2 size={16} />
                  </button>

                  <button
                    onClick={() => setView("list")}
                    className={`p-2 ${
                      view === "list" ? "bg-[#1F3A2E] text-white" : "bg-white"
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
                    {SORT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <LuChevronDown
                    size={15}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#8A8378]"
                  />
                </div>
              </div>
            </div>

            {/* PRODUCTS */}
            {loading ? (
              <div className="bg-white border border-[#E4DED2] rounded-md py-20 text-center text-sm text-[#8A8378]">
                Loading products...
              </div>
            ) : error ? (
              <div className="bg-white border border-[#E4DED2] rounded-md py-20 text-center text-sm text-red-700">
                {error}
              </div>
            ) : visibleProducts.length > 0 ? (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
                    : "grid grid-cols-1 gap-4"
                }
              >
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#E4DED2] rounded-md py-20 text-center">
                <p className="font-serif text-2xl mb-2">No products found</p>

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
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
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
                    setPage((current) => Math.min(totalPages, current + 1))
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
              <h2 className="font-serif text-xl">Filters</h2>

              <button onClick={() => setMobileFilterOpen(false)}>
                <LuX size={20} />
              </button>
            </div>

            <h3 className="font-medium mb-3">Categories</h3>

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

                  {activeCategory === category && <LuCheck size={15} />}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="font-medium text-sm mb-4">Availability</h3>

              <label className="flex items-center gap-2 text-sm text-[#5B564C]">
                <input type="checkbox" className="accent-[#1F3A2E]" />
                In stock
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
