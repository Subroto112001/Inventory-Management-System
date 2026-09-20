"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  MdAdd,
  MdBusiness,
  MdCheckCircle,
  MdCancel,
  MdInventory2,
  MdMoreVert,
  MdSearch,
  MdFilterList,
  MdEdit,
  MdDeleteOutline,
  MdVisibility,
  MdRefresh,
  MdPeople,
  MdEmail,
  MdPhone,
  MdLanguage,
  MdLocationOn,
  MdClose,
  MdChevronLeft,
  MdChevronRight,
  MdErrorOutline,
  MdExpandMore,
  MdUnfoldMore,
  MdArrowUpward,
  MdArrowDownward,
  MdInfoOutline,
} from "react-icons/md";

/* ========================================================= */
/* Helpers */
/* ========================================================= */

const formatDate = (date) => {
  if (!date) return "—";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "—";
  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getBrandInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

const getCreatedByName = (createdBy) => {
  if (!createdBy) return "—";
  const fullName = [createdBy.firstName, createdBy.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  return fullName || createdBy.email || "—";
};

const getProductCount = (brand) => {
  if (typeof brand?.productCount === "number") return brand.productCount;
  if (typeof brand?.productCount === "string")
    return Number(brand.productCount) || 0;
  return 0;
};

/* ========================================================= */
/* Sortable column header */
/* ========================================================= */

const SortableHeader = ({
  label,
  sortKey,
  sortConfig,
  onSort,
  className = "",
}) => {
  const isActive = sortConfig.key === sortKey;

  return (
    <th
      className={`px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 ${className}`}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1 rounded transition hover:text-gray-800 ${
          isActive ? "text-blue-600" : ""
        }`}
      >
        {label}
        {isActive ? (
          sortConfig.direction === "asc" ? (
            <MdArrowUpward size={13} />
          ) : (
            <MdArrowDownward size={13} />
          )
        ) : (
          <MdUnfoldMore size={13} className="text-gray-300" />
        )}
      </button>
    </th>
  );
};

/* ========================================================= */
/* Loading Skeleton */
/* ========================================================= */

const BrandTableSkeleton = () => (
  <tbody className="divide-y divide-gray-100">
    {Array.from({ length: 6 }).map((_, index) => (
      <tr key={index}>
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-40 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        </td>
        <td className="px-5 py-4">
          <div className="h-6 w-16 animate-pulse rounded bg-gray-100" />
        </td>
        <td className="px-5 py-4">
          <div className="mx-auto h-5 w-8 animate-pulse rounded bg-gray-100" />
        </td>
        <td className="px-5 py-4">
          <div className="mx-auto h-6 w-20 animate-pulse rounded-full bg-gray-100" />
        </td>
        <td className="px-5 py-4">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
        </td>
        <td className="px-5 py-4">
          <div className="mx-auto h-8 w-8 animate-pulse rounded-lg bg-gray-100" />
        </td>
      </tr>
    ))}
  </tbody>
);

/* ========================================================= */
/* Toast */
/* ========================================================= */

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(onClose, 3200);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div
      role="status"
      className={`fixed right-5 top-5 z-[100] flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg transition ${
        isError
          ? "border-red-200 bg-white text-red-700"
          : "border-emerald-200 bg-white text-emerald-700"
      }`}
    >
      {isError ? <MdErrorOutline size={18} /> : <MdCheckCircle size={18} />}
      {toast.message}
      <button
        type="button"
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-600"
        aria-label="Dismiss notification"
      >
        <MdClose size={16} />
      </button>
    </div>
  );
};

/* ========================================================= */
/* Delete confirmation modal */
/* ========================================================= */

const DeleteConfirmModal = ({ brand, onCancel, onConfirm }) => {
  if (!brand) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-gray-900/40 px-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-brand-heading"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-500">
          <MdDeleteOutline size={22} />
        </div>

        <h3
          id="delete-brand-heading"
          className="mt-4 text-base font-semibold text-gray-900"
        >
          Delete {brand.brandName || "this brand"}?
        </h3>

        <p className="mt-1.5 text-sm text-gray-500">
          This can't be undone. Any products linked to this brand will keep
          their existing brand reference.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirm(brand)}
            className="rounded-lg bg-red-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Delete brand
          </button>
        </div>
      </div>
    </div>
  );
};

/* ========================================================= */
/* Row action menu (closes on outside click / Escape) */
/* ========================================================= */

const RowActionMenu = ({ brand, onRequestDelete }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
        aria-label={`Actions for ${brand.brandName}`}
        aria-expanded={open}
      >
        <MdMoreVert size={20} />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-30 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 text-left shadow-lg">
          <Link
            href={`/brand/${brand._id}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
          >
            <MdVisibility size={17} />
            View Details
          </Link>

          <Link
            href={`/brand/${brand._id}/edit`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
          >
            <MdEdit size={17} />
            Edit Brand
          </Link>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onRequestDelete(brand);
            }}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
          >
            <MdDeleteOutline size={17} />
            Delete Brand
          </button>
        </div>
      )}
    </div>
  );
};

/* ========================================================= */
/* Expanded row detail panel */
/* ========================================================= */

const BrandDetailRow = ({ brand, columnCount }) => (
  <tr className="bg-gray-50/70">
    <td colSpan={columnCount} className="px-5 py-5">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Description
          </p>
          <p className="mt-1.5 text-sm text-gray-700">
            {brand.description || "No description provided."}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Contact
          </p>

          <div className="mt-1.5 space-y-1.5">
            {brand.contactPerson && (
              <p className="text-sm font-medium text-gray-800">
                {brand.contactPerson}
              </p>
            )}

            {brand.email ? (
              <a
                href={`mailto:${brand.email}`}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600"
              >
                <MdEmail size={15} />
                {brand.email}
              </a>
            ) : null}

            {brand.phoneNumber ? (
              <a
                href={`tel:${brand.phoneNumber}`}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600"
              >
                <MdPhone size={15} />
                {brand.phoneNumber}
              </a>
            ) : null}

            {!brand.contactPerson && !brand.email && !brand.phoneNumber && (
              <p className="text-sm text-gray-400">No contact on file.</p>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Location
          </p>

          <div className="mt-1.5 space-y-1.5">
            {brand.address && (
              <p className="flex items-start gap-1.5 text-sm text-gray-600">
                <MdLocationOn
                  size={16}
                  className="mt-0.5 shrink-0 text-gray-400"
                />
                {brand.address}
              </p>
            )}

            {(brand.district || brand.country) && (
              <p className="text-sm text-gray-500">
                {[brand.district, brand.country].filter(Boolean).join(", ")}
              </p>
            )}

            {brand.website && (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <MdLanguage size={15} />
                Visit website
              </a>
            )}

            {!brand.address &&
              !brand.district &&
              !brand.country &&
              !brand.website && (
                <p className="text-sm text-gray-400">No location on file.</p>
              )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-gray-200 pt-4 text-xs text-gray-500">
        <span>Created {formatDate(brand.createdAt)}</span>

        {brand.updatedAt && brand.updatedAt !== brand.createdAt && (
          <span>Updated {formatDate(brand.updatedAt)}</span>
        )}

        {brand.createdBy && (
          <span className="flex items-center gap-1.5">
            <MdPeople size={14} />
            Added by {getCreatedByName(brand.createdBy)}
          </span>
        )}
      </div>
    </td>
  </tr>
);

/* ========================================================= */
/* Page */
/* ========================================================= */

const Page = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [expandedRow, setExpandedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [pendingDelete, setPendingDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const columnCount = 7;

  /* ========================================================= */
  /* Fetch Brands */
  /* ========================================================= */

  const fetchBrands = useCallback(
    async ({ showLoader = true } = {}) => {
      try {
        if (showLoader) setLoading(true);
        else setRefreshing(true);

        setError("");

        const params = new URLSearchParams();
        params.set("page", String(pagination.page));
        params.set("limit", String(pagination.limit));
        if (searchTerm.trim()) params.set("search", searchTerm.trim());
        if (statusFilter !== "All") params.set("status", statusFilter);

        const response = await fetch(`/api/brand?${params.toString()}`, {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Failed to fetch brands");
        }

        setBrands(Array.isArray(data?.brands) ? data.brands : []);
        setPagination((previous) => ({
          ...previous,
          ...(data?.pagination || {}),
        }));
      } catch (err) {
        console.error("Failed to fetch brands:", err);
        setBrands([]);
        setError(
          err?.message ||
            "Something went wrong while loading brands. Please try again.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [pagination.page, pagination.limit, searchTerm, statusFilter],
  );

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  /* Debounced search resets to page 1 */
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination((previous) =>
        previous.page === 1 ? previous : { ...previous, page: 1 },
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPagination((previous) => ({ ...previous, page: 1 }));
  };

  const handleRefresh = async () => {
    await fetchBrands({ showLoader: false });
  };

  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((previous) => ({ ...previous, page }));
  };

  /* ========================================================= */
  /* Sorting (client-side, current page) */
  /* ========================================================= */

  const handleSort = (key) => {
    setSortConfig((previous) => {
      if (previous.key !== key) return { key, direction: "asc" };
      if (previous.direction === "asc") return { key, direction: "desc" };
      return { key: null, direction: "asc" };
    });
  };

  const sortedBrands = useMemo(() => {
    if (!sortConfig.key) return brands;

    const getValue = (brand) => {
      switch (sortConfig.key) {
        case "brandName":
          return (brand.brandName || "").toLowerCase();
        case "productCount":
          return getProductCount(brand);
        case "status":
          return brand.status || "";
        case "createdAt":
          return brand.createdAt ? new Date(brand.createdAt).getTime() : 0;
        default:
          return "";
      }
    };

    return [...brands].sort((a, b) => {
      const valueA = getValue(a);
      const valueB = getValue(b);

      if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [brands, sortConfig]);

  /* ========================================================= */
  /* Statistics */
  /* ========================================================= */

  const brandStats = useMemo(() => {
    const totalBrands = pagination.total || 0;
    const activeBrands = brands.filter((b) => b?.status === "Active").length;
    const inactiveBrands = brands.filter(
      (b) => b?.status === "Inactive",
    ).length;
    const totalProducts = brands.reduce(
      (total, brand) => total + getProductCount(brand),
      0,
    );
    const brandsWithProducts = brands.filter(
      (brand) => getProductCount(brand) > 0,
    ).length;

    return {
      totalBrands,
      activeBrands,
      inactiveBrands,
      brandsWithProducts,
      totalProducts,
    };
  }, [brands, pagination.total]);

  const productCoverageBrands = useMemo(
    () =>
      [...brands]
        .filter((brand) => getProductCount(brand) > 0)
        .sort((a, b) => getProductCount(b) - getProductCount(a))
        .slice(0, 5),
    [brands],
  );

  const currentPageProducts = useMemo(
    () => brands.reduce((total, brand) => total + getProductCount(brand), 0),
    [brands],
  );

  /* ========================================================= */
  /* Row expand / delete / toast handlers */
  /* ========================================================= */

  const toggleExpandedRow = (brandId) => {
    setExpandedRow((previous) => (previous === brandId ? null : brandId));
  };

  const handleConfirmDelete = async (brand) => {
    setPendingDelete(null);
    // Wire this up once DELETE /api/brand/:id exists.
    setToast({
      type: "error",
      message: `Delete isn't wired up to the API yet for "${brand.brandName}".`,
    });
  };

  /* ========================================================= */
  /* Render */
  /* ========================================================= */

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50/50">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <DeleteConfirmModal
        brand={pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <main className="h-full w-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="w-full p-4 md:p-5 lg:p-6">
          {/* HEADER */}
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                Brand Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your product brands and monitor brand activity.
              </p>
            </div>

            <Link
              href="/brand/add"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98]"
            >
              <MdAdd size={20} />
              Add Brand
            </Link>
          </header>

          {/* ERROR */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <MdErrorOutline
                size={21}
                className="mt-0.5 shrink-0 text-red-500"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-red-700">
                  Failed to load brands
                </p>
                <p className="mt-0.5 text-xs text-red-600">{error}</p>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className="rounded-md px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-100"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={() => setError("")}
                className="text-red-400 transition hover:text-red-600"
                aria-label="Close error"
              >
                <MdClose size={18} />
              </button>
            </div>
          )}

          {/* KPI CARDS */}
          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Total Brands
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {loading ? "—" : brandStats.totalBrands.toLocaleString()}
                  </h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <MdBusiness size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                  All Brands
                </span>
                <span className="text-xs text-gray-500">registered</span>
              </div>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Active Brands
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {loading ? "—" : brandStats.activeBrands.toLocaleString()}
                  </h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <MdCheckCircle size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                  Active
                </span>
                <span className="text-xs text-gray-500">currently enabled</span>
              </div>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Inactive Brands
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {loading ? "—" : brandStats.inactiveBrands.toLocaleString()}
                  </h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <MdCancel size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-600">
                  Inactive
                </span>
                <span className="text-xs text-gray-500">
                  currently disabled
                </span>
              </div>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Brands With Products
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {loading
                      ? "—"
                      : brandStats.brandsWithProducts.toLocaleString()}
                  </h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                  <MdInventory2 size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600">
                  {loading ? "—" : currentPageProducts}
                </span>
                <span className="text-xs text-gray-500">
                  products on this page
                </span>
              </div>
            </article>
          </section>

          {/* OVERVIEW */}
          <section className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Brand Overview
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Current brand distribution
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                  <MdBusiness size={20} />
                </div>
              </div>

              <div className="mt-7 space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <span className="text-sm text-gray-600">
                        Active Brands
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {loading ? "—" : brandStats.activeBrands}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${
                          brandStats.totalBrands
                            ? Math.min(
                                (brandStats.activeBrands /
                                  brandStats.totalBrands) *
                                  100,
                                100,
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                      <span className="text-sm text-gray-600">
                        Inactive Brands
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {loading ? "—" : brandStats.inactiveBrands}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gray-400 transition-all duration-500"
                      style={{
                        width: `${
                          brandStats.totalBrands
                            ? Math.min(
                                (brandStats.inactiveBrands /
                                  brandStats.totalBrands) *
                                  100,
                                100,
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Product Coverage
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Products associated with brands on this page
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                  <MdInventory2 size={20} />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
                        <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-100" />
                    </div>
                  ))
                ) : productCoverageBrands.length > 0 ? (
                  productCoverageBrands.map((brand) => {
                    const productCount = getProductCount(brand);
                    const percentage =
                      currentPageProducts > 0
                        ? (productCount / currentPageProducts) * 100
                        : 0;

                    return (
                      <div key={brand._id}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <div className="flex min-w-0 items-center gap-2.5">
                            {brand?.logo?.url ? (
                              <img
                                src={brand.logo.url}
                                alt={brand.brandName || "Brand"}
                                className="h-8 w-8 rounded-lg border border-gray-100 object-contain"
                              />
                            ) : (
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600">
                                {getBrandInitial(brand.brandName)}
                              </div>
                            )}
                            <span className="truncate text-sm font-medium text-gray-800">
                              {brand.brandName || "Unnamed Brand"}
                            </span>
                          </div>
                          <span className="ml-3 shrink-0 text-xs font-medium text-gray-500">
                            {productCount} products
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-500"
                            style={{
                              width: `${Math.max(Math.min(percentage, 100), 3)}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <MdInventory2 size={30} className="text-gray-300" />
                    <p className="mt-2 text-sm font-medium text-gray-500">
                      No product data available
                    </p>
                  </div>
                )}
              </div>
            </article>
          </section>

          {/* BRAND LIST */}
          <section className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Brand List
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Click any row to see full contact and location details. Sort a
                  column by clicking its header.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Refresh"
                >
                  <MdRefresh
                    size={20}
                    className={refreshing ? "animate-spin" : ""}
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("brand-status-filter")?.focus()
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
                  title="Filter"
                >
                  <MdFilterList size={20} />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-sm">
                <MdSearch
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search brands..."
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-10 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <MdClose size={18} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">
                  Status:
                </span>
                <select
                  id="brand-status-filter"
                  value={statusFilter}
                  onChange={(event) => handleStatusChange(event.target.value)}
                  className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {(searchTerm || statusFilter !== "All") && (
              <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-3">
                <span className="text-xs text-gray-500">Active filters:</span>

                {searchTerm && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                    Search: {searchTerm}
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="hover:text-blue-800"
                    >
                      <MdClose size={14} />
                    </button>
                  </span>
                )}

                {statusFilter !== "All" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    Status: {statusFilter}
                    <button
                      type="button"
                      onClick={() => handleStatusChange("All")}
                      className="hover:text-gray-900"
                    >
                      <MdClose size={14} />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("All");
                    setPagination((previous) => ({ ...previous, page: 1 }));
                  }}
                  className="ml-auto text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Table — fewer, wider columns; details live in the expandable row */}
            <div className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full min-w-[880px] text-left">
                <thead className="border-y border-gray-100 bg-gray-50/70">
                  <tr>
                    <th className="w-10 px-5 py-3" />
                    <SortableHeader
                      label="Brand"
                      sortKey="brandName"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Brand Code
                    </th>
                    <SortableHeader
                      label="Products"
                      sortKey="productCount"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      className="text-center"
                    />
                    <SortableHeader
                      label="Status"
                      sortKey="status"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      className="text-center"
                    />
                    <SortableHeader
                      label="Created"
                      sortKey="createdAt"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                {loading ? (
                  <BrandTableSkeleton />
                ) : (
                  <tbody className="divide-y divide-gray-100">
                    {sortedBrands.length > 0 ? (
                      sortedBrands.map((brand) => {
                        const brandId = brand?._id;
                        const productCount = getProductCount(brand);
                        const isExpanded = expandedRow === brandId;

                        return (
                          <React.Fragment key={brandId}>
                            <tr
                              className={`cursor-pointer transition hover:bg-gray-50/70 ${
                                isExpanded ? "bg-blue-50/40" : ""
                              }`}
                              onClick={() => toggleExpandedRow(brandId)}
                              aria-expanded={isExpanded}
                            >
                              <td className="px-5 py-4 text-gray-400">
                                <MdExpandMore
                                  size={20}
                                  className={`transition-transform ${
                                    isExpanded ? "rotate-180 text-blue-600" : ""
                                  }`}
                                />
                              </td>

                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  {brand?.logo?.url ? (
                                    <img
                                      src={brand.logo.url}
                                      alt={brand.brandName || "Brand logo"}
                                      className="h-10 w-10 shrink-0 rounded-lg border border-gray-100 bg-white object-contain p-1"
                                    />
                                  ) : (
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-600">
                                      {getBrandInitial(brand.brandName)}
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-gray-900">
                                      {brand.brandName || "Unnamed Brand"}
                                    </p>
                                    <p className="mt-0.5 flex items-center gap-1 text-xs text-blue-600">
                                      <MdInfoOutline size={13} />
                                      {isExpanded
                                        ? "Hide details"
                                        : "View details"}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-5 py-4">
                                {brand.brandCode ? (
                                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold tracking-wide text-gray-700">
                                    {brand.brandCode}
                                  </span>
                                ) : (
                                  <span className="text-sm text-gray-400">
                                    —
                                  </span>
                                )}
                              </td>

                              <td className="px-5 py-4 text-center">
                                <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                                  <MdInventory2
                                    size={16}
                                    className="text-gray-400"
                                  />
                                  {productCount}
                                </div>
                              </td>

                              <td className="px-5 py-4 text-center">
                                {brand.status === "Active" ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                                    Inactive
                                  </span>
                                )}
                              </td>

                              <td className="px-5 py-4">
                                <span className="text-sm text-gray-500">
                                  {formatDate(brand.createdAt)}
                                </span>
                              </td>

                              <td
                                className="px-5 py-4 text-center"
                                onClick={(event) => event.stopPropagation()}
                              >
                                <RowActionMenu
                                  brand={brand}
                                  onRequestDelete={setPendingDelete}
                                />
                              </td>
                            </tr>

                            {isExpanded && (
                              <BrandDetailRow
                                brand={brand}
                                columnCount={columnCount}
                              />
                            )}
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={columnCount}
                          className="px-5 py-16 text-center"
                        >
                          <div className="flex flex-col items-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                              <MdBusiness size={28} />
                            </div>
                            <p className="mt-3 text-sm font-semibold text-gray-800">
                              No brands found
                            </p>
                            <p className="mt-1 max-w-sm text-xs text-gray-500">
                              {searchTerm || statusFilter !== "All"
                                ? "Try changing your search or filter."
                                : "No brands have been added to the database yet."}
                            </p>
                            {!searchTerm && statusFilter === "All" && (
                              <Link
                                href="/brand/add"
                                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                              >
                                <MdAdd size={17} />
                                Add First Brand
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                )}
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {brands.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {pagination.total}
                </span>{" "}
                brands
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!pagination.hasPreviousPage || loading}
                  onClick={() => goToPage(pagination.page - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <MdChevronLeft size={19} />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(pagination.totalPages, 5) },
                    (_, index) => {
                      let pageNumber;
                      if (pagination.totalPages <= 5) pageNumber = index + 1;
                      else if (pagination.page <= 3) pageNumber = index + 1;
                      else if (pagination.page >= pagination.totalPages - 2)
                        pageNumber = pagination.totalPages - 4 + index;
                      else pageNumber = pagination.page - 2 + index;

                      return (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() => goToPage(pageNumber)}
                          className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition ${
                            pagination.page === pageNumber
                              ? "bg-blue-600 text-white"
                              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    },
                  )}
                </div>

                <button
                  type="button"
                  disabled={!pagination.hasNextPage || loading}
                  onClick={() => goToPage(pagination.page + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <MdChevronRight size={19} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Page;
