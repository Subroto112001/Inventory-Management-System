"use client";

import React, { useState, useMemo } from "react";
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

  // সার্চ কোয়েরি অনুযায়ী ডেটা ফিল্টার করার লজিক
  const filteredOrders = useMemo(() => {
    if (!searchQuery) return ORDERS_DATA;

    const lowerCaseQuery = searchQuery.toLowerCase();
    return ORDERS_DATA.filter(
      (order) =>
        order.id.toLowerCase().includes(lowerCaseQuery) ||
        order.customerName.toLowerCase().includes(lowerCaseQuery) ||
        order.customerPhone.toLowerCase().includes(lowerCaseQuery) ||
        order.status.toLowerCase().includes(lowerCaseQuery),
    );
  }, [searchQuery]);

  // নিজস্ব কোডে পিডিএফ/প্রিন্ট কল করার ফাংশন
  const generateReport = () => {
    if (filteredOrders.length === 0) {
      alert("No data available to export/print.");
      return;
    }
    window.print();
  };

  return (
    <main className="p-5 min-h-[calc(100vh-64px)] bg-surface print:bg-white print:p-0">
      {/* শুধু প্রিন্টের সময় দেখানোর জন্য রিপোর্ট হেডার */}
      <div className="hidden print:block mb-8 border-b border-gray-300 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Report</h1>
        <p className="text-gray-600">
          Generated on: {new Date().toLocaleDateString()}
        </p>
        {searchQuery && (
          <p className="text-gray-500 text-sm mt-1">
            Filtered by: "{searchQuery}"
          </p>
        )}
      </div>

      {/* Header - প্রিন্টের সময় লুকানো থাকবে */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 print:hidden">
        <h1 className="text-2xl font-semibold text-on-background">Orders</h1>
      </div>

      {/* KPI Summary Bar */}
      <section
        className="flex flex-col md:flex-row gap-4 mb-8 print:hidden"
        aria-label="Key Performance Indicators"
      >
        <div className="bg-[#611F69] p-5 rounded-lg border text-white border-gray-100 w-full hover:scale-102 transition-all duration-200 ">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-label-sm text-secondary uppercase text-gray-200 print:text-gray-700">
              Total Orders
            </h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center print:hidden">
              <MdReceiptLong
                className="text-white text-[18px]"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-h2 text-h2 text-white print:text-gray-900">
              {filteredOrders.length}
            </span>
            <span className="font-label-sm text-label-sm text-gray-300 print:hidden">
              +12% from last month
            </span>
          </div>
        </div>

        <div className="bg-[#611F69] p-5 rounded-lg border text-white border-gray-100 w-full hover:scale-102 transition-all duration-200 ">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-label-sm text-secondary uppercase text-gray-200 print:text-gray-700">
              Revenue This Month
            </h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center print:hidden">
              <MdPayments
                className="text-white text-[18px]"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-h2 text-h2 text-white print:text-gray-900">
              $84,520.00
            </span>
            <span className="font-label-sm text-label-sm text-gray-300 print:hidden">
              +5.4%
            </span>
          </div>
        </div>

        <div className="bg-[#611F69] p-5 rounded-lg border text-white border-gray-100 w-full hover:scale-102 transition-all duration-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-label-sm text-secondary uppercase text-gray-200 print:text-gray-700">
              Pending Shipments
            </h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center print:hidden">
              <MdLocalShipping
                className="text-white text-[18px]"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-h2 text-h2 text-white print:text-gray-900">
              42
            </span>
            <span className="font-label-sm text-label-sm text-gray-300 print:hidden">
              Requires attention
            </span>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-surface-container-lowest rounded-xl border border-gray-100 overflow-hidden shadow-sm print:border-none print:shadow-none">
        {/* Table Toolbar - প্রিন্টের সময় লুকানো থাকবে */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white print:hidden">
          <div className="relative w-full sm:w-72">
            <label htmlFor="search-orders" className="sr-only">
              Search orders by ID, customer name, phone, or status
            </label>
            <MdSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]"
              aria-hidden="true"
            />
            <input
              id="search-orders"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-[#611F69] transition-all font-body text-body"
              placeholder="Search orders..."
              type="search"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg font-label-sm text-label-sm text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center focus:outline-none focus:ring-2 focus:ring-[#611F69]">
              <MdFilterList className="text-[18px]" aria-hidden="true" />
              Filter
            </button>
            <button
              onClick={generateReport}
              className="flex items-center gap-2 px-4 py-2 border border-[#611F69] bg-[#611F69] text-white rounded-lg font-label-sm text-label-sm hover:bg-[#4a1752] transition-colors w-full sm:w-auto justify-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#611F69]"
              aria-label="Export or Print orders report to PDF"
            >
              <MdDownload className="text-[18px]" aria-hidden="true" />
              Export to PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white print:border print:border-gray-300">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 print:bg-gray-100">
                <th
                  scope="col"
                  className="px-6 py-4 font-semibold text-[13px] text-gray-800 uppercase tracking-wider print:border-b print:border-gray-400"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-semibold text-[13px] text-gray-800 uppercase tracking-wider print:border-b print:border-gray-400"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-semibold text-[13px] text-gray-800 uppercase tracking-wider print:border-b print:border-gray-400"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-semibold text-[13px] text-gray-800 uppercase tracking-wider print:border-b print:border-gray-400"
                >
                  Total Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-semibold text-[13px] text-gray-800 uppercase tracking-wider text-right print:hidden"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[14px] text-gray-900 print:divide-gray-300">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium text-[#611F69] print:text-gray-900 print:py-2">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-gray-600 print:text-gray-900 print:py-2">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 print:py-2">
                      <div className="font-semibold text-gray-900">
                        {order.customerName}
                      </div>
                      <div className="text-gray-500 text-sm print:text-gray-700">
                        {order.customerPhone}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 print:py-2">
                      {order.amount}
                    </td>
                    <td className="px-6 py-4 text-right print:hidden">
                      <button
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-[#611F69] hover:bg-[#611F69] hover:text-white transition-colors font-medium text-[13px] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#611F69]"
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
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500 print:hidden"
                  >
                    <p className="text-lg font-medium">No results found</p>
                    <p className="text-sm mt-1">
                      We couldn't find any orders matching "{searchQuery}"
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer - প্রিন্টের সময় লুকানো থাকবে */}
        <nav
          className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between print:hidden"
          aria-label="Pagination Navigation"
        >
          <span className="text-[14px] text-gray-600" aria-live="polite">
            Showing {filteredOrders.length > 0 ? 1 : 0} to{" "}
            {filteredOrders.length} of {ORDERS_DATA.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#611F69]"
              disabled
              aria-label="Previous page"
            >
              <MdChevronLeft className="text-[18px]" aria-hidden="true" />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center border border-[#611F69] bg-[#611F69] text-white rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#611F69]"
              aria-current="page"
              aria-label="Page 1"
            >
              1
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#611F69]"
              aria-label="Page 2"
            >
              2
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#611F69]"
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
