"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MdAdd,
  MdReceiptLong,
  MdPayments,
  MdLocalShipping,
  MdSearch,
  MdFilterList,
  MdDownload,
  MdVisibility,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

// ডেমো অর্ডার ডেটা
const ORDERS_DATA = [
  {
    id: "#ORD-8821",
    date: "Oct 24, 2023",
    customerName: "Eleanor Pena",
    customerPhone: "(555) 019-2834",
    amount: "$1,240.00",
    status: "Completed",
  },
  {
    id: "#ORD-8820",
    date: "Oct 24, 2023",
    customerName: "Wade Warren",
    customerPhone: "(555) 011-9231",
    amount: "$350.50",
    status: "Pending",
  },
  {
    id: "#ORD-8819",
    date: "Oct 23, 2023",
    customerName: "Jacob Jones",
    customerPhone: "(555) 014-4321",
    amount: "$8,920.00",
    status: "Completed",
  },
  {
    id: "#ORD-8818",
    date: "Oct 22, 2023",
    customerName: "Dianne Russell",
    customerPhone: "(555) 016-8910",
    amount: "$145.00",
    status: "Cancelled",
  },
  {
    id: "#ORD-8817",
    date: "Oct 22, 2023",
    customerName: "Guy Hawkins",
    customerPhone: "(555) 012-3456",
    amount: "$2,100.75",
    status: "Pending",
  },
];

export default function OrdersDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="p-5 min-h-[calc(100vh-64px)] bg-surface">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-semibold text-on-background">Orders</h1>
      </div>

      {/* KPI Summary Bar */}
      <section
        className="flex  flex-row gap-4 mb-8"
        aria-label="Key Performance Indicators"
      >
        <div className="bg-[#611F69] p-5 rounded-lg border text-white border-gray-100 w-full hover:scale-102 transition-all duration-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-label-sm text-secondary uppercase">
              Total Orders
            </h3>
            <div className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center">
              <MdReceiptLong
                className="text-primary text-[18px]"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-h2 text-h2 text-on-background">1,284</span>
            <span className="font-label-sm text-label-sm text-tertiary-container">
              +12% from last month
            </span>
          </div>
        </div>

        <div className="bg-[#611F69] p-5 rounded-lg border text-white border-gray-100 w-full hover:scale-102 transition-all duration-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-label-sm text-secondary uppercase">
              Revenue This Month
            </h3>
            <div className="w-8 h-8 rounded-full bg-tertiary-fixed-dim/20 flex items-center justify-center">
              <MdPayments
                className="text-tertiary-container text-[18px]"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-h2 text-h2 text-on-background">
              $84,520.00
            </span>
            <span className="font-label-sm text-label-sm text-tertiary-container">
              +5.4%
            </span>
          </div>
        </div>

        <div className="bg-[#611F69] p-5 rounded-lg border text-white border-gray-100 w-full hover:scale-102 transition-all duration-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-label-sm text-secondary uppercase">
              Pending Shipments
            </h3>
            <div className="w-8 h-8 rounded-full bg-surface-tint/10 flex items-center justify-center">
              <MdLocalShipping
                className="text-surface-tint text-[18px]"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-h2 text-h2 text-on-background">42</span>
            <span className="font-label-sm text-label-sm text-secondary">
              Requires attention
            </span>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-surface-container-lowest rounded-xl border border-gray-100 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-bright">
          <div className="relative w-full sm:w-72">
            <label htmlFor="search-orders" className="sr-only">
              Search orders
            </label>
            <MdSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]"
              aria-hidden="true"
            />
            <input
              id="search-orders"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-secondary-container text-on-background rounded-lg pl-10 pr-4 py-2 outline-none font-body text-body"
              placeholder="Search orders..."
              type="search"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 border border-secondary-container rounded-lg font-label-sm text-label-sm text-on-background hover:bg-surface-container-low transition-colors w-full sm:w-auto justify-center">
              <MdFilterList className="text-[18px]" aria-hidden="true" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-secondary-container rounded-lg font-label-sm text-label-sm text-on-background hover:bg-surface-container-low transition-colors w-full sm:w-auto justify-center">
              <MdDownload className="text-[18px]" aria-hidden="true" />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-gray-100">
                <th
                  scope="col"
                  className="px-6 py-4 font-label-sm text-label-sm text-secondary uppercase tracking-wider"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-label-sm text-label-sm text-secondary uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-label-sm text-label-sm text-secondary uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-label-sm text-label-sm text-secondary uppercase tracking-wider"
                >
                  Total Amount
                </th>

                <th
                  scope="col"
                  className="px-6 py-4 font-label-sm text-label-sm text-secondary uppercase tracking-wider text-right"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="border-b border-gray-100 font-body text-body text-on-surface-variant">
              {ORDERS_DATA.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-[#F3EBF4] transition-colors group border-b border-gray-100"
                >
                  <td className="px-6 py-4 font-h3 text-h3 text-primary">
                    {order.id}
                  </td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-on-background">
                      {order.customerName}
                    </div>
                    <div className="text-secondary text-sm">
                      {order.customerPhone}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-on-background">
                    {order.amount}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant rounded-md text-primary hover:bg-primary-container/10 transition-colors font-label-sm text-label-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      aria-label={`View memo for order ${order.id}`}
                    >
                      <MdVisibility
                        className="text-[16px]"
                        aria-hidden="true"
                      />
                      View Memo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <nav
          className="px-6 py-4 border-t border-gray-100 bg-surface-bright flex items-center justify-between"
          aria-label="Pagination Navigation"
        >
          <span
            className="font-body text-body text-secondary"
            aria-live="polite"
          >
            Showing 1 to 5 of 1,284 entries
          </span>
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 flex items-center justify-center border border-secondary-container rounded text-secondary hover:bg-surface-container-high disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/30"
              disabled
              aria-label="Previous page"
            >
              <MdChevronLeft className="text-[18px]" aria-hidden="true" />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center border border-primary bg-primary-container/10 rounded text-primary font-bold"
              aria-current="page"
              aria-label="Page 1"
            >
              1
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center border border-secondary-container rounded text-secondary hover:bg-surface-container-high "
              aria-label="Page 2"
            >
              2
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center border border-secondary-container rounded text-secondary hover:bg-surface-container-high "
              aria-label="Page 3"
            >
              3
            </button>
            <span className="text-secondary mx-1" aria-hidden="true">
              ...
            </span>
            <button
              className="w-8 h-8 flex items-center justify-center border border-secondary-container rounded text-secondary hover:bg-surface-container-high"
              aria-label="Page 257"
            >
              257
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center border border-secondary-container rounded text-secondary hover:bg-surface-container-high"
              aria-label="Next page"
            >
              <MdChevronRight className="text-[18px]" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </section>
    </main>
  );
}
