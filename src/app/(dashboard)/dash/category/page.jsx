"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  MdAdd,
  MdCategory,
  MdInventory2,
  MdWarning,
  MdCheckCircle,
  MdSearch,
  MdFilterList,
  MdEdit,
  MdDeleteOutline,
  MdMoreVert,
  MdArrowForward,
  MdRefresh,
  MdClose,
  MdErrorOutline,
} from "react-icons/md";

const Page = () => {
  const [categories, setCategories] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [openMenu, setOpenMenu] = useState(null);

  const [deleteCategory, setDeleteCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ============================================================
  // GET CATEGORY ID
  // ============================================================

  const getCategoryId = (category) => {
    return category?._id || category?.id;
  };

  // ============================================================
  // GET CATEGORY NAME
  // ============================================================

  const getCategoryName = (category) => {
    return (
      category?.categoryName ||
      category?.name ||
      category?.title ||
      "Unnamed Category"
    );
  };

  // ============================================================
  // GET DESCRIPTION
  // ============================================================

  const getCategoryDescription = (category) => {
    return category?.description || "No description available";
  };

  // ============================================================
  // GET STATUS
  // ============================================================

  const getCategoryStatus = (category) => {
    if (
      category?.status === "Inactive" ||
      category?.isActive === false ||
      category?.active === false
    ) {
      return "Inactive";
    }

    return "Active";
  };

  // ============================================================
  // GET PRODUCT COUNT
  // ============================================================

  const getProductCount = (category) => {
    // Your API already returns productCount
    if (typeof category?.productCount === "number") {
      return category.productCount;
    }

    // Fallback if products array exists
    if (Array.isArray(category?.products)) {
      return category.products.length;
    }

    return 0;
  };

  // ============================================================
  // GET LOW STOCK COUNT
  // ============================================================

  const getLowStockCount = (category) => {
    // If your API later returns lowStockCount,
    // this will automatically use it.
    if (typeof category?.lowStockCount === "number") {
      return category.lowStockCount;
    }

    // Calculate from products if products are available
    if (Array.isArray(category?.products)) {
      return category.products.filter(
        (product) =>
          Number(product?.currentStock ?? 0) <=
          Number(product?.lowStockAlert ?? 0),
      ).length;
    }

    return 0;
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const getCreatedDate = (category) => {
    if (!category?.createdAt) {
      return "—";
    }

    const date = new Date(category.createdAt);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ============================================================
  // FETCH CATEGORIES
  // ============================================================

  const fetchCategories = useCallback(async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError("");

      const response = await fetch("/api/category", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to fetch categories.");
      }

      if (!result?.success) {
        throw new Error(result?.message || "Failed to fetch categories.");
      }

      setCategories(Array.isArray(result.categories) ? result.categories : []);
    } catch (error) {
      console.error("Fetch Categories Error:", error);

      setError(error?.message || "Unable to load categories.");

      setCategories([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // ============================================================
  // INITIAL FETCH
  // ============================================================

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ============================================================
  // CLOSE DROPDOWN
  // ============================================================

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenu(null);
    };

    if (openMenu !== null) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openMenu]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const categoryStats = useMemo(() => {
    const totalCategories = categories.length;

    const activeCategories = categories.filter(
      (category) => getCategoryStatus(category) === "Active",
    ).length;

    const inactiveCategories = categories.filter(
      (category) => getCategoryStatus(category) === "Inactive",
    ).length;

    const totalProducts = categories.reduce(
      (total, category) => total + getProductCount(category),
      0,
    );

    const totalLowStock = categories.reduce(
      (total, category) => total + getLowStockCount(category),
      0,
    );

    return {
      totalCategories,
      activeCategories,
      inactiveCategories,
      totalProducts,
      totalLowStock,
    };
  }, [categories]);

  // ============================================================
  // FILTER CATEGORIES
  // ============================================================

  const filteredCategories = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return categories.filter((category) => {
      const name = getCategoryName(category).toLowerCase();

      const description = getCategoryDescription(category).toLowerCase();

      const code = category?.categoryCode?.toLowerCase() || "";

      const matchesSearch =
        !normalizedSearch ||
        name.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        code.includes(normalizedSearch);

      const status = getCategoryStatus(category);

      const matchesStatus = statusFilter === "All" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, statusFilter]);

  // ============================================================
  // DELETE CATEGORY
  // ============================================================

  const handleDelete = async () => {
    if (!deleteCategory) {
      return;
    }

    const categoryId = getCategoryId(deleteCategory);

    if (!categoryId) {
      return;
    }

    try {
      setIsDeleting(true);

      /*
       * Your current route only has GET and POST.
       *
       * So there is currently no DELETE /api/category
       * endpoint to call.
       *
       * Once you create the DELETE route, use:
       *
       * const response = await fetch(
       *   `/api/category?id=${categoryId}`,
       *   {
       *     method: "DELETE",
       *   }
       * );
       */

      setCategories((prev) =>
        prev.filter((category) => getCategoryId(category) !== categoryId),
      );

      setDeleteCategory(null);
    } catch (error) {
      console.error("Delete Category Error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <div className="h-screen w-full overflow-hidden bg-gray-50 p-4 sm:p-6">
        <main className="h-full w-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Header Skeleton */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-8 w-52 animate-pulse rounded-md bg-gray-200" />

              <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-gray-200" />
            </div>

            <div className="h-10 w-36 animate-pulse rounded-md bg-gray-200" />
          </div>

          {/* KPI Skeleton */}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex min-h-[140px] animate-pulse flex-col justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="h-3 w-28 rounded bg-gray-200" />

                    <div className="h-7 w-16 rounded bg-gray-200" />
                  </div>

                  <div className="h-10 w-10 rounded-lg bg-gray-200" />
                </div>

                <div className="mt-4 h-3 w-28 rounded bg-gray-200" />
              </div>
            ))}
          </div>

          {/* Table Skeleton */}

          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2">
                <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />

                <div className="h-3 w-64 max-w-full animate-pulse rounded bg-gray-200" />
              </div>

              <div className="h-10 w-64 max-w-full animate-pulse rounded bg-gray-200" />
            </div>

            <div className="p-4">
              <div className="flex flex-col gap-3">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-12 w-full animate-pulse rounded bg-gray-200/60"
                  />
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // ============================================================
  // MAIN PAGE
  // ============================================================

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50">
      <main className="h-full w-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="w-full p-4 sm:p-6 lg:p-7">
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#611F69]/10 text-[#611F69]">
                <MdCategory size={24} />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                  Category Management
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Organize products and manage your inventory categories.
                </p>
              </div>
            </div>

            <Link
              href="/create_category"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#611F69] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#501854] active:scale-[0.98] sm:w-auto"
            >
              <MdAdd size={20} />
              Add Category
            </Link>
          </header>

          {/* ================================================= */}
          {/* ERROR */}
          {/* ================================================= */}

          {error && (
            <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <MdErrorOutline size={21} className="shrink-0 text-red-600" />

                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>

              <button
                type="button"
                onClick={() => fetchCategories()}
                className="shrink-0 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* ================================================= */}
          {/* STATISTICS */}
          {/* ================================================= */}

          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* Total Categories */}

            <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Total Categories
                  </h2>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {categoryStats.totalCategories}
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#611F69]/10 text-[#611F69]">
                  <MdCategory size={23} />
                </div>
              </div>

              <div className="mt-5">
                <span className="text-xs text-gray-500">
                  Product organization
                </span>
              </div>
            </article>

            {/* Active Categories */}

            <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Active Categories
                  </h2>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {categoryStats.activeCategories}
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <MdCheckCircle size={23} />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                  Active
                </span>

                <span className="text-xs text-gray-500">
                  available for inventory
                </span>
              </div>
            </article>

            {/* Products */}

            <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Categorized Products
                  </h2>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {categoryStats.totalProducts}
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#611F69]/10 text-[#611F69]">
                  <MdInventory2 size={23} />
                </div>
              </div>

              <div className="mt-5">
                <span className="text-xs text-gray-500">
                  Products across categories
                </span>
              </div>
            </article>

            {/* Low Stock */}

            <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Low Stock Items
                  </h2>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {categoryStats.totalLowStock}
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-50 text-yellow-600">
                  <MdWarning size={23} />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <span className="rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                  Needs attention
                </span>

                <span className="text-xs text-gray-500">across categories</span>
              </div>
            </article>
          </section>

          {/* ================================================= */}
          {/* TABLE */}
          {/* ================================================= */}

          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Table Header */}

            <header className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Inventory Categories
                </h2>

                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  Manage product classification and category availability.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                  <MdCategory size={14} />
                  {filteredCategories.length} Categories
                </span>

                <Link
                  href="/category/create"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#611F69] px-3.5 py-2 text-sm font-medium text-white transition hover:bg-[#501854]"
                >
                  <MdAdd size={17} />
                  Add Category
                </Link>
              </div>
            </header>

            {/* Search */}

            <div className="border-b border-gray-100 p-4">
              <div className="flex flex-col gap-3 md:flex-row">
                {/* Search */}

                <div className="relative min-w-0 flex-1">
                  <MdSearch
                    size={20}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search category, code or description..."
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#611F69] focus:ring-2 focus:ring-[#611F69]/10"
                  />
                </div>

                {/* Filter */}

                <div className="relative">
                  <MdFilterList
                    size={19}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="h-10 w-full min-w-[150px] appearance-none rounded-lg border border-gray-200 bg-white pl-10 pr-9 text-sm text-gray-700 outline-none focus:border-[#611F69] focus:ring-2 focus:ring-[#611F69]/10"
                  >
                    <option value="All">All Status</option>

                    <option value="Active">Active</option>

                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Refresh */}

                <button
                  type="button"
                  onClick={() => fetchCategories(true)}
                  disabled={isRefreshing}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-gray-600 transition hover:bg-gray-50 hover:text-[#611F69] disabled:cursor-not-allowed disabled:opacity-50"
                  title="Refresh categories"
                >
                  <MdRefresh
                    size={21}
                    className={isRefreshing ? "animate-spin" : ""}
                  />
                </button>
              </div>
            </div>

            {/* ================================================= */}
            {/* TABLE */}
            {/* ================================================= */}

            <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-3.5">Category</th>

                    <th className="px-5 py-3.5">Description</th>

                    <th className="px-5 py-3.5 text-center">Products</th>

                    <th className="px-5 py-3.5 text-center">Low Stock</th>

                    <th className="px-5 py-3.5 text-center">Status</th>

                    <th className="px-5 py-3.5">Created</th>

                    <th className="px-5 py-3.5 text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => {
                      const categoryId = getCategoryId(category);

                      const categoryName = getCategoryName(category);

                      const productCount = getProductCount(category);

                      const lowStockCount = getLowStockCount(category);

                      const status = getCategoryStatus(category);

                      return (
                        <tr
                          key={categoryId}
                          className="transition hover:bg-gray-50/70"
                        >
                          {/* Category */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {/* IMAGE */}

                              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-100">
                                {category?.image ? (
                                  <img
                                    src={category.image}
                                    alt={categoryName}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-[#611F69]">
                                    <MdCategory size={20} />
                                  </div>
                                )}
                              </div>

                              {/* INFO */}

                              <div className="min-w-0">
                                <div className="truncate font-semibold text-gray-800">
                                  {categoryName}
                                </div>

                                <div className="mt-0.5 text-xs text-gray-500">
                                  {category?.categoryCode || "—"}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Description */}

                          <td className="px-5 py-4">
                            <div
                              className="max-w-[280px] truncate text-sm text-gray-500"
                              title={category?.description || ""}
                            >
                              {getCategoryDescription(category)}
                            </div>
                          </td>

                          {/* Products */}

                          <td className="px-5 py-4 text-center">
                            <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                              {productCount}
                            </span>
                          </td>

                          {/* Low Stock */}

                          <td className="px-5 py-4 text-center">
                            {lowStockCount > 0 ? (
                              <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700">
                                {lowStockCount}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">0</span>
                            )}
                          </td>

                          {/* Status */}

                          <td className="px-5 py-4 text-center">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                status === "Active"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {status}
                            </span>
                          </td>

                          {/* Created */}

                          <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                            {getCreatedDate(category)}
                          </td>

                          {/* Actions */}

                          <td className="px-5 py-4 text-center">
                            <div
                              className="relative flex justify-center"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <button
                                type="button"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                                onClick={(event) => {
                                  event.stopPropagation();

                                  setOpenMenu((current) =>
                                    current === categoryId ? null : categoryId,
                                  );
                                }}
                              >
                                <MdMoreVert size={21} />
                              </button>

                              {openMenu === categoryId && (
                                <div className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-lg border border-gray-100 bg-white py-1 text-left shadow-xl">
                                  <Link
                                    href={`/category/${categoryId}/edit`}
                                    onClick={() => setOpenMenu(null)}
                                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-[#611F69]"
                                  >
                                    <MdEdit size={18} />
                                    Edit Category
                                  </Link>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenu(null);

                                      setDeleteCategory(category);
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                                  >
                                    <MdDeleteOutline size={18} />
                                    Delete Category
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
                            <MdCategory size={36} className="text-gray-300" />
                          </div>

                          <p className="mt-2 text-sm font-medium text-gray-700">
                            {searchTerm || statusFilter !== "All"
                              ? "No categories match your filters."
                              : "No categories found yet."}
                          </p>

                          {!searchTerm && statusFilter === "All" && (
                            <Link
                              href="/create_category"
                              className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-[#611F69] hover:underline"
                            >
                              Create your first category
                              <MdArrowForward size={16} />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* ========================================================= */}
      {/* DELETE MODAL */}
      {/* ========================================================= */}

      {deleteCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
            {/* Header */}

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <MdDeleteOutline size={22} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Category
                  </h3>

                  <p className="text-xs text-gray-500">
                    This action requires confirmation.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDeleteCategory(null)}
                disabled={isDeleting}
                className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <MdClose size={22} />
              </button>
            </div>

            {/* Body */}

            <div className="px-5 py-5">
              <p className="text-sm leading-6 text-gray-600">
                Are you sure you want to delete{" "}
                <strong className="font-semibold text-gray-900">
                  {getCategoryName(deleteCategory)}
                </strong>
                ?
              </p>

              <div className="mt-4 rounded-lg border border-yellow-100 bg-yellow-50 p-3">
                <div className="flex gap-2">
                  <MdWarning
                    size={19}
                    className="mt-0.5 shrink-0 text-yellow-600"
                  />

                  <p className="text-xs leading-5 text-yellow-800">
                    If this category is assigned to existing products, make sure
                    those products are reassigned before deleting the category.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setDeleteCategory(null)}
                disabled={isDeleting}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                <MdDeleteOutline size={18} />

                {isDeleting ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
