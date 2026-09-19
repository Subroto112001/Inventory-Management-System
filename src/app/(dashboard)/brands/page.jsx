"use client";

import React, { useMemo, useState } from "react";
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
  MdArrowForward,
  MdEdit,
  MdDeleteOutline,
  MdVisibility,
  MdRefresh,
  MdPeople,
  MdTrendingUp,
} from "react-icons/md";

/* ------------------------------------------------ */
/* Dummy Brand Data */
/* ------------------------------------------------ */

const dummyBrands = [
  {
    id: "brand-001",
    brandName: "Samsung",
    brandCode: "SAM",
    description: "Samsung Electronics",
    contactPerson: "Samsung Bangladesh",
    email: "contact@samsung.com",
    phoneNumber: "+8801300000000",
    status: "Active",
    productCount: 24,
    createdAt: "2026-09-18",
  },
  {
    id: "brand-002",
    brandName: "Xiaomi",
    brandCode: "XIA",
    description: "Xiaomi Corporation",
    contactPerson: "Xiaomi Bangladesh",
    email: "contact@xiaomi.com",
    phoneNumber: "+8801300000001",
    status: "Active",
    productCount: 18,
    createdAt: "2026-09-17",
  },
  {
    id: "brand-003",
    brandName: "Walton",
    brandCode: "WAL",
    description: "Walton Hi-Tech Industries",
    contactPerson: "Walton Bangladesh",
    email: "contact@walton.com",
    phoneNumber: "+8801300000002",
    status: "Active",
    productCount: 32,
    createdAt: "2026-09-16",
  },
  {
    id: "brand-004",
    brandName: "Apple",
    brandCode: "APP",
    description: "Apple Inc.",
    contactPerson: "Apple Bangladesh",
    email: "contact@apple.com",
    phoneNumber: "+8801300000003",
    status: "Inactive",
    productCount: 0,
    createdAt: "2026-09-15",
  },
  {
    id: "brand-005",
    brandName: "HP",
    brandCode: "HP",
    description: "HP Inc.",
    contactPerson: "HP Bangladesh",
    email: "contact@hp.com",
    phoneNumber: "+8801300000004",
    status: "Active",
    productCount: 12,
    createdAt: "2026-09-14",
  },
  {
    id: "brand-006",
    brandName: "Lenovo",
    brandCode: "LEN",
    description: "Lenovo Group Limited",
    contactPerson: "Lenovo Bangladesh",
    email: "contact@lenovo.com",
    phoneNumber: "+8801300000005",
    status: "Active",
    productCount: 15,
    createdAt: "2026-09-13",
  },
  {
    id: "brand-007",
    brandName: "Dell",
    brandCode: "DEL",
    description: "Dell Technologies",
    contactPerson: "Dell Bangladesh",
    email: "contact@dell.com",
    phoneNumber: "+8801300000006",
    status: "Inactive",
    productCount: 0,
    createdAt: "2026-09-12",
  },
  {
    id: "brand-008",
    brandName: "ASUS",
    brandCode: "ASU",
    description: "ASUSTeK Computer Inc.",
    contactPerson: "ASUS Bangladesh",
    email: "contact@asus.com",
    phoneNumber: "+8801300000007",
    status: "Active",
    productCount: 9,
    createdAt: "2026-09-11",
  },
];

/* ------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------ */

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

const getBrandInitial = (name) => {
  if (!name) return "?";

  return name.charAt(0).toUpperCase();
};

/* ------------------------------------------------ */
/* Page */
/* ------------------------------------------------ */

const Page = () => {
  const [brands] = useState(dummyBrands);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [openMenu, setOpenMenu] = useState(null);

  /* ------------------------------------------------ */
  /* Brand Statistics */
  /* ------------------------------------------------ */

  const brandStats = useMemo(() => {
    const totalBrands = brands.length;

    const activeBrands = brands.filter(
      (brand) => brand.status === "Active",
    ).length;

    const inactiveBrands = brands.filter(
      (brand) => brand.status === "Inactive",
    ).length;

    const brandsWithProducts = brands.filter(
      (brand) => Number(brand.productCount) > 0,
    ).length;

    const totalProducts = brands.reduce(
      (total, brand) => total + Number(brand.productCount || 0),
      0,
    );

    return {
      totalBrands,
      activeBrands,
      inactiveBrands,
      brandsWithProducts,
      totalProducts,
    };
  }, [brands]);

  /* ------------------------------------------------ */
  /* Filter Brands */
  /* ------------------------------------------------ */

  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        brand.brandName.toLowerCase().includes(search) ||
        brand.brandCode.toLowerCase().includes(search) ||
        brand.contactPerson.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || brand.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [brands, searchTerm, statusFilter]);

  /* ------------------------------------------------ */
  /* Menu */
  /* ------------------------------------------------ */

  const toggleMenu = (id) => {
    setOpenMenu((prev) => (prev === id ? null : id));
  };

  /* ------------------------------------------------ */
  /* Main UI */
  /* ------------------------------------------------ */

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50/50">
      <main className="h-full w-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="w-full p-4 md:p-5 lg:p-6">
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Brand Management
              </h1>

              <p className="text-sm text-gray-500 mt-1">
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

          {/* ================================================= */}
          {/* KPI CARDS */}
          {/* ================================================= */}

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {/* Total Brands */}

            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Total Brands
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {brandStats.totalBrands.toLocaleString()}
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

            {/* Active Brands */}

            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Active Brands
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {brandStats.activeBrands.toLocaleString()}
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

            {/* Inactive Brands */}

            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Inactive Brands
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {brandStats.inactiveBrands.toLocaleString()}
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

            {/* Brands With Products */}

            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Brands With Products
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {brandStats.brandsWithProducts.toLocaleString()}
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                  <MdInventory2 size={24} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600">
                  {brandStats.totalProducts}
                </span>

                <span className="text-xs text-gray-500">total products</span>
              </div>
            </article>
          </section>

          {/* ================================================= */}
          {/* OVERVIEW */}
          {/* ================================================= */}

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            {/* Brand Status Overview */}

            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Brand Overview
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Current brand distribution
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                  <MdBusiness size={20} />
                </div>
              </div>

              <div className="mt-7 space-y-6">
                {/* Active */}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                      <span className="text-sm text-gray-600">
                        Active Brands
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-gray-900">
                      {brandStats.activeBrands}
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{
                        width: `${
                          brandStats.totalBrands
                            ? (brandStats.activeBrands /
                                brandStats.totalBrands) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Inactive */}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />

                      <span className="text-sm text-gray-600">
                        Inactive Brands
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-gray-900">
                      {brandStats.inactiveBrands}
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gray-400 transition-all"
                      style={{
                        width: `${
                          brandStats.totalBrands
                            ? (brandStats.inactiveBrands /
                                brandStats.totalBrands) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </article>

            {/* Product Coverage */}

            <article className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Product Coverage
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Products associated with each brand
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                  <MdInventory2 size={20} />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {brands
                  .filter((brand) => brand.productCount > 0)
                  .sort((a, b) => b.productCount - a.productCount)
                  .slice(0, 5)
                  .map((brand) => {
                    const percentage =
                      brandStats.totalProducts > 0
                        ? (brand.productCount / brandStats.totalProducts) * 100
                        : 0;

                    return (
                      <div key={brand.id}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600">
                              {getBrandInitial(brand.brandName)}
                            </div>

                            <span className="text-sm font-medium text-gray-800">
                              {brand.brandName}
                            </span>
                          </div>

                          <span className="text-xs font-medium text-gray-500">
                            {brand.productCount} products
                          </span>
                        </div>

                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-blue-600 transition-all"
                            style={{
                              width: `${Math.max(percentage, 3)}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </article>
          </section>

          {/* ================================================= */}
          {/* BRAND LIST */}
          {/* ================================================= */}

          <section className="rounded-xl border border-gray-200 bg-white shadow-sm mb-6">
            {/* Table Header */}

            <div className="flex flex-col gap-4 p-5 border-b border-gray-100 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Brand List
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Manage all brands in your inventory system
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
                  title="Refresh"
                >
                  <MdRefresh size={20} />
                </button>

                <button
                  type="button"
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search brands..."
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">
                  Status:
                </span>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Table */}

            <div className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="border-y border-gray-100 bg-gray-50/70">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Brand
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Brand Code
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Contact
                    </th>

                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Products
                    </th>

                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Created
                    </th>

                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredBrands.length > 0 ? (
                    filteredBrands.map((brand) => (
                      <tr
                        key={brand.id}
                        className="transition hover:bg-gray-50/70"
                      >
                        {/* Brand */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-600">
                              {getBrandInitial(brand.brandName)}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-gray-900">
                                {brand.brandName}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-500">
                                {brand.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Brand Code */}

                        <td className="px-5 py-4">
                          <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold tracking-wide text-gray-700">
                            {brand.brandCode}
                          </span>
                        </td>

                        {/* Contact */}

                        <td className="px-5 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {brand.contactPerson}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500">
                              {brand.email}
                            </p>
                          </div>
                        </td>

                        {/* Products */}

                        <td className="px-5 py-4 text-center">
                          <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                            <MdInventory2 size={16} className="text-gray-400" />

                            {brand.productCount}
                          </div>
                        </td>

                        {/* Status */}

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

                        {/* Created */}

                        <td className="px-5 py-4">
                          <span className="text-sm text-gray-500">
                            {formatDate(brand.createdAt)}
                          </span>
                        </td>

                        {/* Actions */}

                        <td className="px-5 py-4 text-center">
                          <div className="relative inline-block">
                            <button
                              type="button"
                              onClick={() => toggleMenu(brand.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                              aria-label={`Actions for ${brand.brandName}`}
                            >
                              <MdMoreVert size={20} />
                            </button>

                            {openMenu === brand.id && (
                              <div className="absolute right-0 top-9 z-50 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 text-left shadow-lg">
                                <Link
                                  href={`/brand/${brand.id}`}
                                  onClick={() => setOpenMenu(null)}
                                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                                >
                                  <MdVisibility size={17} />
                                  View Details
                                </Link>

                                <Link
                                  href={`/brand/${brand.id}/edit`}
                                  onClick={() => setOpenMenu(null)}
                                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                                >
                                  <MdEdit size={17} />
                                  Edit Brand
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenu(null);
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                                >
                                  <MdDeleteOutline size={17} />
                                  Delete Brand
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                            <MdBusiness size={28} />
                          </div>

                          <p className="mt-3 text-sm font-semibold text-gray-800">
                            No brands found
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Try changing your search or filter.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}

            <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {filteredBrands.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {brands.length}
                </span>{" "}
                brands
              </p>

              <Link
                href="/brands"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Manage Brands
                <MdArrowForward size={15} />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Page;
