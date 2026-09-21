
"use client";

import React, { useEffect, useMemo, useState } from "react";
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
} from "react-icons/md";

const dummyCategories = [
  {
    _id: "cat-001",
    categoryName: "Electronics",
    categoryCode: "ELEC-001",
    description: "Smartphones, laptops, tablets and electronic accessories.",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=200&q=80",
    productCount: 48,
    lowStockCount: 6,
    status: "Active",
    createdAt: "2026-01-12T10:30:00.000Z",
  },
  {
    _id: "cat-002",
    categoryName: "Clothing",
    categoryCode: "CLO-002",
    description: "Men's and women's clothing, fashion and accessories.",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=200&q=80",
    productCount: 76,
    lowStockCount: 4,
    status: "Active",
    createdAt: "2026-01-18T08:20:00.000Z",
  },
  {
    _id: "cat-003",
    categoryName: "Home & Kitchen",
    categoryCode: "HOME-003",
    description: "Furniture, kitchen appliances and home essentials.",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=200&q=80",
    productCount: 35,
    lowStockCount: 8,
    status: "Active",
    createdAt: "2026-02-03T14:15:00.000Z",
  },
  {
    _id: "cat-004",
    categoryName: "Beauty & Personal Care",
    categoryCode: "BEAUTY-004",
    description: "Skincare, cosmetics and personal care products.",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=200&q=80",
    productCount: 29,
    lowStockCount: 3,
    status: "Active",
    createdAt: "2026-02-11T09:45:00.000Z",
  },
  {
    _id: "cat-005",
    categoryName: "Sports & Fitness",
    categoryCode: "SPORT-005",
    description: "Sports equipment, fitness gear and accessories.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=200&q=80",
    productCount: 21,
    lowStockCount: 5,
    status: "Active",
    createdAt: "2026-03-01T11:00:00.000Z",
  },
  {
    _id: "cat-006",
    categoryName: "Books",
    categoryCode: "BOOK-006",
    description: "Educational books, novels and other reading materials.",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=200&q=80",
    productCount: 54,
    lowStockCount: 2,
    status: "Active",
    createdAt: "2026-03-08T13:10:00.000Z",
  },
];

const Page = () => {
  const [categories, setCategories] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [openMenu, setOpenMenu] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ------------------------------------------------------------
  // Load Dummy Categories
  // ------------------------------------------------------------

  const fetchCategories = () => {
    setIsLoading(true);

    // Simulate API loading
    setTimeout(() => {
      setCategories(dummyCategories);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ------------------------------------------------------------
  // Close Dropdown When Clicking Outside
  // ------------------------------------------------------------

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

  // ------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------

  const getCategoryId = (category) => {
    return category?._id || category?.id;
  };

  const getCategoryName = (category) => {
    return (
      category?.categoryName ||
      category?.name ||
      category?.title ||
      "Unnamed Category"
    );
  };

  const getCategoryDescription = (category) => {
    return category?.description || "No description available";
  };

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

  const getProductCount = (category) => {
    return (
      Number(
        category?.productCount ??
          category?.productsCount ??
          category?.totalProducts ??
          0
      ) || 0
    );
  };

  const getLowStockCount = (category) => {
    return (
      Number(
        category?.lowStockCount ??
          category?.lowStockProducts ??
          category?.lowStock ??
          0
      ) || 0
    );
  };

  const getCreatedDate = (category) => {
    if (!category?.createdAt) return "—";

    const date = new Date(category.createdAt);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ------------------------------------------------------------
  // Statistics
  // ------------------------------------------------------------

  const categoryStats = useMemo(() => {
    const totalCategories = categories.length;

    const activeCategories = categories.filter(
      (category) => getCategoryStatus(category) === "Active"
    ).length;

    const inactiveCategories = categories.filter(
      (category) => getCategoryStatus(category) === "Inactive"
    ).length;

    const totalProducts = categories.reduce(
      (total, category) => total + getProductCount(category),
      0
    );

    const totalLowStock = categories.reduce(
      (total, category) => total + getLowStockCount(category),
      0
    );

    return {
      totalCategories,
      activeCategories,
      inactiveCategories,
      totalProducts,
      totalLowStock,
    };
  }, [categories]);

  // ------------------------------------------------------------
  // Filter Categories
  // ------------------------------------------------------------

  const filteredCategories = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return categories.filter((category) => {
      const name = getCategoryName(category).toLowerCase();
      const description = getCategoryDescription(category).toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        name.includes(normalizedSearch) ||
        description.includes(normalizedSearch);

      const status = getCategoryStatus(category);

      const matchesStatus =
        statusFilter === "All" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, statusFilter]);

  // ------------------------------------------------------------
  // Delete Category
  // ------------------------------------------------------------

  const handleDelete = () => {
    if (!deleteCategory) return;

    const categoryId = getCategoryId(deleteCategory);

    if (!categoryId) return;

    setIsDeleting(true);

    // Simulate delete request
    setTimeout(() => {
      setCategories((prev) =>
        prev.filter(
          (category) => getCategoryId(category) !== categoryId
        )
      );

      setDeleteCategory(null);
      setIsDeleting(false);
    }, 500);
  };

  // ------------------------------------------------------------
  // Loading
  // ------------------------------------------------------------

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

  // ------------------------------------------------------------
  // Dashboard
  // ------------------------------------------------------------

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50">
      <main className="h-full w-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="w-full p-4 sm:p-6 lg:p-7">

          {/* ------------------------------------------------ */}
          {/* Header */}
          {/* ------------------------------------------------ */}

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

          {/* ------------------------------------------------ */}
          {/* Statistics */}
          {/* ------------------------------------------------ */}

          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Total */}

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

            {/* Active */}

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

                <span className="text-xs text-gray-500">
                  across categories
                </span>
              </div>
            </article>
          </section>

          {/* ------------------------------------------------ */}
          {/* Table */}
          {/* ------------------------------------------------ */}

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
                  href="/create_category"
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

                <div className="relative min-w-0 flex-1">
                  <MdSearch
                    size={20}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search category..."
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
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
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
                  onClick={fetchCategories}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-gray-600 transition hover:bg-gray-50 hover:text-[#611F69]"
                  title="Refresh categories"
                >
                  <MdRefresh size={21} />
                </button>
              </div>
            </div>

            {/* Table */}

            <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full min-w-[950px] text-left">

                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-3.5">
                      Category
                    </th>

                    <th className="px-5 py-3.5">
                      Description
                    </th>

                    <th className="px-5 py-3.5 text-center">
                      Products
                    </th>

                    <th className="px-5 py-3.5 text-center">
                      Low Stock
                    </th>

                    <th className="px-5 py-3.5 text-center">
                      Status
                    </th>

                    <th className="px-5 py-3.5">
                      Created
                    </th>

                    <th className="px-5 py-3.5 text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm">

                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => {
                      const categoryId =
                        getCategoryId(category);

                      const categoryName =
                        getCategoryName(category);

                      const productCount =
                        getProductCount(category);

                      const lowStockCount =
                        getLowStockCount(category);

                      const status =
                        getCategoryStatus(category);

                      return (
                        <tr
                          key={categoryId}
                          className="transition hover:bg-gray-50/70"
                        >
                          {/* Category */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {/* Category Image */}
                              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-100">
                                {category.image ? (
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

                              {/* Category Info */}
                              <div className="min-w-0">
                                <div className="truncate font-semibold text-gray-800">
                                  {categoryName}
                                </div>

                                <div className="mt-0.5 text-xs text-gray-500">
                                  {category.categoryCode}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Description */}

                          <td className="px-5 py-4">
                            <div
                              className="max-w-[280px] truncate text-sm text-gray-500"
                              title={category.description}
                            >
                              {category.description}
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
                      <td
                        colSpan={7}
                        className="px-5 py-16 text-center"
                      >
                        <div className="flex flex-col items-center gap-2">

                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
                            <MdCategory
                              size={36}
                              className="text-gray-300"
                            />
                          </div>

                          <p className="mt-2 text-sm font-medium text-gray-700">
                            {searchTerm ||
                            statusFilter !== "All"
                              ? "No categories match your filters."
                              : "No categories found yet."}
                          </p>

                          {!searchTerm &&
                            statusFilter === "All" && (
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

      {/* ------------------------------------------------ */}
      {/* Delete Modal */}
      {/* ------------------------------------------------ */}

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
                onClick={() =>
                  setDeleteCategory(null)
                }
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
                    If this category is assigned to existing
                    products, make sure those products are
                    reassigned before deleting the category.
                  </p>

                </div>

              </div>

            </div>

            {/* Footer */}

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-4">

              <button
                type="button"
                onClick={() =>
                  setDeleteCategory(null)
                }
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

                {isDeleting
                  ? "Deleting..."
                  : "Delete Category"}
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

