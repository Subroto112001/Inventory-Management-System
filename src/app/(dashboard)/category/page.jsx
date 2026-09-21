"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../../css/Dashboard.css";
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
  MdErrorOutline,
  MdClose,
} from "react-icons/md";

const Page = () => {
  const [categories, setCategories] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [openMenu, setOpenMenu] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ------------------------------------------------------------
  // Fetch Categories
  // ------------------------------------------------------------

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const response = await fetch("/api/category", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load categories");
      }

      setCategories(data.categories || []);
    } catch (error) {
      console.error("Category fetch error:", error);

      setLoadError(
        error.message || "Something went wrong while loading categories.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ------------------------------------------------------------
  // Close dropdown when clicking outside
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
          0,
      ) || 0
    );
  };

  const getLowStockCount = (category) => {
    return (
      Number(
        category?.lowStockCount ??
          category?.lowStockProducts ??
          category?.lowStock ??
          0,
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
  // Category Statistics
  // ------------------------------------------------------------

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

  // ------------------------------------------------------------
  // Filtered Categories
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

      const matchesStatus = statusFilter === "All" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, statusFilter]);

  // ------------------------------------------------------------
  // Delete Category
  // ------------------------------------------------------------

  const handleDelete = async () => {
    if (!deleteCategory) return;

    const categoryId = getCategoryId(deleteCategory);

    if (!categoryId) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/category/${categoryId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete category");
      }

      setCategories((prev) =>
        prev.filter((category) => getCategoryId(category) !== categoryId),
      );

      setDeleteCategory(null);
    } catch (error) {
      console.error("Delete category error:", error);

      alert(error.message || "Failed to delete category.");
    } finally {
      setIsDeleting(false);
    }
  };

  // ------------------------------------------------------------
  // Loading UI
  // ------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="h-screen w-full overflow-hidden bg-gray-50/50 p-6">
        <main className="dashboard-main h-full w-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6 animate-pulse">
            <div className="flex flex-col gap-2">
              <div className="h-8 w-52 bg-gray-200 rounded-md" />

              <div className="h-4 w-72 bg-gray-200 rounded-md" />
            </div>

            <div className="h-10 w-36 bg-gray-200 rounded-md" />
          </div>

          {/* KPI Skeleton */}

          <div className="kpi-grid mb-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="card animate-pulse p-4 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="h-3 w-28 bg-gray-200 rounded" />

                    <div className="h-7 w-16 bg-gray-200 rounded" />
                  </div>

                  <div className="w-10 h-10 bg-gray-200 rounded-md" />
                </div>

                <div className="h-3 w-28 bg-gray-200 rounded mt-4" />
              </div>
            ))}
          </div>

          {/* Table Skeleton */}

          <section className="table-section animate-pulse">
            <div className="table-header">
              <div className="flex flex-col gap-2">
                <div className="h-5 w-40 bg-gray-200 rounded" />

                <div className="h-3 w-64 bg-gray-200 rounded" />
              </div>

              <div className="h-10 w-64 bg-gray-200 rounded" />
            </div>

            <div className="p-4">
              <div className="flex flex-col gap-3">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-12 w-full bg-gray-200/60 rounded"
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
  // Error UI
  // ------------------------------------------------------------

  if (loadError) {
    return (
      <div className="flex flex-row h-screen items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center gap-3 text-center max-w-sm">
          <MdErrorOutline size={36} className="text-error" aria-hidden="true" />

          <p className="text-h3 text-on-surface">Couldn't load categories</p>

          <p className="text-body text-secondary">{loadError}</p>

          <button
            onClick={fetchCategories}
            className="btn-primary text-label-sm flex items-center gap-1"
          >
            <MdRefresh size={16} aria-hidden="true" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------
  // Dashboard
  // ------------------------------------------------------------

  return (
    <div className="h-screen w-full overflow-hidden">
      <div className="flex flex-row h-full overflow-hidden">
        <main className="dashboard-main h-full w-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* ------------------------------------------------ */}
          {/* Header */}
          {/* ------------------------------------------------ */}

          <header className="dashboard-header">
            <div>
              <div className="flex items-center gap-2">
                <div className="icon-box icon-box-tertiary">
                  <MdCategory size={24} />
                </div>

                <div>
                  <h1 id="category-heading" className="text-h1">
                    Category Management
                  </h1>

                  <p className="text-body">
                    Organize products and manage your inventory categories.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/create_category"
              className="btn-primary text-label-sm flex items-center gap-1"
              aria-label="Add new category"
            >
              <MdAdd size={20} aria-hidden="true" />
              Add Category
            </Link>
          </header>

          {/* ------------------------------------------------ */}
          {/* KPI Cards */}
          {/* ------------------------------------------------ */}

          <section aria-label="Category Statistics" className="kpi-grid mb-6">
            {/* Total Categories */}

            <article className="card">
              <div className="card-header">
                <div>
                  <h2 className="text-label-sm text-secondary uppercase">
                    Total Categories
                  </h2>

                  <p className="text-h2 text-on-surface">
                    {categoryStats.totalCategories.toLocaleString()}
                  </p>
                </div>

                <div className="icon-box icon-box-tertiary" aria-hidden="true">
                  <MdCategory size={24} />
                </div>
              </div>

              <div className="trend-info">
                <span className="text-label-sm text-secondary">
                  Product organization
                </span>
              </div>
            </article>

            {/* Active Categories */}

            <article className="card">
              <div className="card-header">
                <div>
                  <h2 className="text-label-sm text-secondary uppercase">
                    Active Categories
                  </h2>

                  <p className="text-h2 text-on-surface">
                    {categoryStats.activeCategories.toLocaleString()}
                  </p>
                </div>

                <div className="icon-box icon-box-primary" aria-hidden="true">
                  <MdCheckCircle size={24} />
                </div>
              </div>

              <div className="trend-info">
                <span className="badge-trend text-label-sm trend-up">
                  Active
                </span>

                <span className="text-label-sm text-secondary">
                  available for inventory
                </span>
              </div>
            </article>

            {/* Products */}

            <article className="card">
              <div className="card-header">
                <div>
                  <h2 className="text-label-sm text-secondary uppercase">
                    Categorized Products
                  </h2>

                  <p className="text-h2 text-on-surface">
                    {categoryStats.totalProducts.toLocaleString()}
                  </p>
                </div>

                <div className="icon-box icon-box-tertiary" aria-hidden="true">
                  <MdInventory2 size={24} />
                </div>
              </div>

              <div className="trend-info">
                <span className="text-label-sm text-secondary">
                  Products across categories
                </span>
              </div>
            </article>

            {/* Low Stock */}

            <article className="card">
              <div className="card-header">
                <div>
                  <h2 className="text-label-sm text-secondary uppercase">
                    Low Stock Items
                  </h2>

                  <p className="text-h2 text-on-surface">
                    {categoryStats.totalLowStock.toLocaleString()}
                  </p>
                </div>

                <div className="icon-box icon-box-warning" aria-hidden="true">
                  <MdWarning size={24} />
                </div>
              </div>

              <div className="trend-info">
                <span className="badge-trend text-label-sm trend-warning">
                  Needs attention
                </span>

                <span className="text-label-sm text-secondary">
                  across categories
                </span>
              </div>
            </article>
          </section>

          {/* ------------------------------------------------ */}
          {/* Category Table */}
          {/* ------------------------------------------------ */}

          <section className="table-section">
            <header className="table-header">
              <div>
                <h2
                  id="category-table-heading"
                  className="text-h3 text-on-surface"
                >
                  Inventory Categories
                </h2>

                <p className="text-label-sm text-secondary">
                  Manage product classification and category availability.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="badge-trend text-label-sm flex items-center gap-1">
                  <MdCategory size={14} />
                  {filteredCategories.length} Categories
                </span>

                <Link
                  href="/create_category"
                  className="btn-primary text-label-sm flex items-center gap-1"
                >
                  <MdAdd size={17} />
                  Add Category
                </Link>
              </div>
            </header>

            {/* Search + Filter */}

            <div className="px-4 pb-4">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search */}

                <div className="relative flex-1">
                  <MdSearch
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />

                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search category..."
                    aria-label="Search categories"
                    className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:border-[#611F69] focus:ring-1 focus:ring-[#611F69]/20"
                  />
                </div>

                {/* Status Filter */}

                <div className="relative">
                  <MdFilterList
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    aria-hidden="true"
                  />

                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    aria-label="Filter categories by status"
                    className="h-10 pl-10 pr-8 min-w-[150px] rounded-md border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:border-[#611F69] focus:ring-1 focus:ring-[#611F69]/20"
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
                  className="btn-icon border border-gray-200 rounded-md"
                  title="Refresh categories"
                  aria-label="Refresh categories"
                >
                  <MdRefresh size={21} />
                </button>
              </div>
            </div>

            {/* Table */}

            <div className="table-responsive [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table
                className="data-table"
                aria-labelledby="category-table-heading"
              >
                <thead>
                  <tr className="text-label-sm">
                    <th scope="col">Category</th>

                    <th scope="col">Description</th>

                    <th scope="col" className="text-center">
                      Products
                    </th>

                    <th scope="col" className="text-center">
                      Low Stock
                    </th>

                    <th scope="col" className="text-center">
                      Status
                    </th>

                    <th scope="col">Created</th>

                    <th scope="col" className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="text-body">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => {
                      const categoryId = getCategoryId(category);

                      const categoryName = getCategoryName(category);

                      const productCount = getProductCount(category);

                      const lowStockCount = getLowStockCount(category);

                      const status = getCategoryStatus(category);

                      return (
                        <tr key={categoryId || categoryName}>
                          {/* Category */}

                          <td>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-[#611F69]/10 text-[#611F69] flex items-center justify-center shrink-0">
                                <MdCategory size={19} />
                              </div>

                              <div>
                                <div
                                  style={{
                                    fontWeight: 600,
                                  }}
                                >
                                  {categoryName}
                                </div>

                                {category?.categoryCode && (
                                  <div className="text-label-sm text-secondary">
                                    {category.categoryCode}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Description */}

                          <td>
                            <div
                              className="text-secondary"
                              style={{
                                maxWidth: "280px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              title={getCategoryDescription(category)}
                            >
                              {getCategoryDescription(category)}
                            </div>
                          </td>

                          {/* Products */}

                          <td className="text-center">
                            <span className="badge-trend text-label-sm">
                              {productCount}
                            </span>
                          </td>

                          {/* Low Stock */}

                          <td className="text-center">
                            {lowStockCount > 0 ? (
                              <span className="badge-trend text-label-sm trend-warning">
                                {lowStockCount}
                              </span>
                            ) : (
                              <span className="text-secondary">0</span>
                            )}
                          </td>

                          {/* Status */}

                          <td className="text-center">
                            <span
                              className={`status-badge ${
                                status === "Active"
                                  ? "status-good"
                                  : "status-low"
                              }`}
                            >
                              {status}
                            </span>
                          </td>

                          {/* Created */}

                          <td className="text-secondary">
                            {getCreatedDate(category)}
                          </td>

                          {/* Actions */}

                          <td className="text-center">
                            <div
                              className="relative flex justify-center"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <button
                                type="button"
                                className="btn-icon"
                                aria-label={`More actions for ${categoryName}`}
                                aria-expanded={openMenu === categoryId}
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
                                <div className="absolute right-0 top-9 z-50 w-44 bg-white rounded-lg shadow-xl border border-gray-100 py-1 text-left">
                                  <Link
                                    href={`/category/${categoryId}/edit`}
                                    onClick={() => setOpenMenu(null)}
                                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#611F69]"
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
                                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
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
                        className="text-center text-secondary"
                        style={{
                          padding: "3rem 0",
                        }}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <MdCategory size={40} className="text-gray-300" />

                          <p className="text-body">
                            {searchTerm || statusFilter !== "All"
                              ? "No categories match your filters."
                              : "No categories found yet."}
                          </p>

                          {!searchTerm && statusFilter === "All" && (
                            <Link
                              href="/create_category"
                              className="btn-link text-label-sm flex items-center gap-1"
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
        </main>
      </div>

      {/* ------------------------------------------------ */}
      {/* Delete Confirmation Modal */}
      {/* ------------------------------------------------ */}

      {deleteCategory && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-category-title"
        >
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl">
            {/* Modal Header */}

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <MdDeleteOutline size={22} />
                </div>

                <div>
                  <h3
                    id="delete-category-title"
                    className="text-lg font-semibold text-gray-900"
                  >
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
                className="text-gray-400 hover:text-gray-700"
                aria-label="Close delete dialog"
              >
                <MdClose size={22} />
              </button>
            </div>

            {/* Modal Body */}

            <div className="px-5 py-5">
              <p className="text-sm text-gray-600 leading-6">
                Are you sure you want to delete{" "}
                <strong className="text-gray-900">
                  {getCategoryName(deleteCategory)}
                </strong>
                ?
              </p>

              <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-100">
                <div className="flex gap-2">
                  <MdWarning
                    size={19}
                    className="text-yellow-600 shrink-0 mt-0.5"
                  />

                  <p className="text-xs text-yellow-800 leading-5">
                    If this category is assigned to existing products, make sure
                    those products are reassigned before deleting the category.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}

            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDeleteCategory(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
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
