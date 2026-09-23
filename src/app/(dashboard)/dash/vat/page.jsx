"use client";

import React, { useState, useMemo } from "react";
import {
  MdListAlt,
  MdReceipt,
  MdDownload,
  MdClose,
  MdRemoveRedEye,
} from "react-icons/md";

// ==========================================
// Mock Data for Orders
// ==========================================
const mockOrders = [
  {
    id: "ORD-1001",
    date: "2026-05-29",
    time: "10:30 AM",
    customerName: "Rahim Uddin",
    customerAddress: "Dhanmondi, Dhaka",
    customerBIN: "N/A",
    items: [
      { name: "Premium Wireless Headphones", qty: 2, price: 2000, vatRate: 15 },
      { name: "USB-C Fast Charger", qty: 1, price: 500, vatRate: 15 },
    ],
  },
  {
    id: "ORD-1002",
    date: "2026-05-29",
    time: "11:45 AM",
    customerName: "Karim Enterprise",
    customerAddress: "Gulshan-1, Dhaka",
    customerBIN: "000123456-0101",
    items: [
      { name: "Ergonomic Office Chair", qty: 4, price: 8500, vatRate: 15 },
    ],
  },
  {
    id: "ORD-1003",
    date: "2026-05-28",
    time: "04:20 PM",
    customerName: "Sumi Akter",
    customerAddress: "Mirpur-10, Dhaka",
    customerBIN: "N/A",
    items: [
      { name: "Mechanical Keyboard", qty: 1, price: 1200, vatRate: 5 },
      { name: "Wireless Mouse", qty: 1, price: 600, vatRate: 5 },
    ],
  },
  {
    id: "ORD-1004",
    date: "2026-05-28",
    time: "04:20 PM",
    customerName: "Sumi Akter",
    customerAddress: "Mirpur-10, Dhaka",
    customerBIN: "N/A",
    items: [
      { name: "Mechanical Keyboard", qty: 1, price: 1200, vatRate: 5 },
      { name: "Wireless Mouse", qty: 1, price: 600, vatRate: 5 },
    ],
  },
];

// ==========================================
// Mushak 6.3 Modal Component
// ==========================================
const MushakModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  // Calculate totals
  let totalExclVat = 0;
  let totalVat = 0;
  let totalInclVat = 0;

  const enrichedItems = order.items.map((item, index) => {
    const totalVal = item.qty * item.price;
    const vatAmt = (totalVal * item.vatRate) / 100;
    const grandTotal = totalVal + vatAmt;

    totalExclVat += totalVal;
    totalVat += vatAmt;
    totalInclVat += grandTotal;

    return { ...item, totalVal, vatAmt, grandTotal, sl: index + 1 };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 print:p-0 print:bg-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mushak-title"
    >
      {/* Modal Container */}
      <div className="bg-white w-full max-w-4xl h-[90vh] md:h-auto overflow-y-auto rounded-xl shadow-2xl flex flex-col print:shadow-none print:h-auto print:w-full print:block">
        {/* Modal Header (Hidden on Print) */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl print:hidden sticky top-0 z-10">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MdReceipt className="text-[#611F69] text-xl" />
            Mushak Challan 6.3 (মূসক ৬.৩)
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-[#611F69] text-white text-sm font-semibold rounded hover:bg-[#4a1752] transition-colors focus:outline-none focus:ring-2 focus:ring-[#611F69]"
            >
              <MdDownload size={18} />
              Download / Print
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Close modal"
            >
              <MdClose size={24} />
            </button>
          </div>
        </div>

        {/* =========================================
            MUSHAK 6.3 PRINTABLE AREA
        =========================================== */}
        <div className="p-8 print:p-0 bg-white text-black font-serif print:text-black">
          {/* NBR Header */}
          <div className="text-center mb-6">
            <h1 className="font-bold text-lg leading-tight">
              গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
            </h1>
            <h2 className="font-bold text-lg leading-tight">
              জাতীয় রাজস্ব বোর্ড
            </h2>
            <div className="inline-block border-2 border-black px-4 py-1 mt-2 font-bold text-lg">
              মূসক ৬.৩
            </div>
            <h3 className="font-bold text-xl mt-4">কর চালানপত্র</h3>
            <p className="text-sm mt-1">
              [বিধি ৪০ এর উপ-বিধি (১) এর দফা (গ) ও দফা (চ) দ্রষ্টব্য]
            </p>
          </div>

          {/* Business & Customer Info */}
          <div className="flex flex-col md:flex-row justify-between mb-6 text-sm border border-black p-4">
            <div className="w-full md:w-1/2 space-y-2">
              <p>
                <span className="font-bold">নিবন্ধিত ব্যক্তির নাম:</span>{" "}
                Skripto Super Shop
              </p>
              <p>
                <span className="font-bold">
                  নিবন্ধিত ব্যক্তির বিআইএন (BIN):
                </span>{" "}
                001122334-0202
              </p>
              <p>
                <span className="font-bold">চালানপত্র ইস্যুর ঠিকানা:</span> Head
                Office, Dhaka, Bangladesh
              </p>
              <div className="border-t border-black my-3 mr-4"></div>
              <p>
                <span className="font-bold">ক্রেতার নাম:</span>{" "}
                {order.customerName}
              </p>
              <p>
                <span className="font-bold">ক্রেতার বিআইএন (যদি থাকে):</span>{" "}
                {order.customerBIN || "প্রযোজ্য নয়"}
              </p>
              <p>
                <span className="font-bold">ক্রেতার গন্তব্যস্থল:</span>{" "}
                {order.customerAddress}
              </p>
            </div>

            <div className="w-full md:w-1/2 md:border-l border-black md:pl-4 space-y-2 mt-4 md:mt-0">
              <p>
                <span className="font-bold">চালানপত্র নম্বর:</span> {order.id}
              </p>
              <p>
                <span className="font-bold">ইস্যুর তারিখ:</span> {order.date}
              </p>
              <p>
                <span className="font-bold">ইস্যুর সময়:</span> {order.time}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-sm border-collapse border border-black mb-6">
            <thead>
              <tr className="bg-gray-100 print:bg-transparent">
                <th
                  className="border border-black p-2 text-center align-middle"
                  rowSpan="2"
                >
                  ক্রমিক নং
                </th>
                <th
                  className="border border-black p-2 text-center align-middle"
                  rowSpan="2"
                >
                  পণ্য বা সেবার বর্ণনা (প্রযোজ্য ক্ষেত্রে ব্রান্ড নামসহ)
                </th>
                <th
                  className="border border-black p-2 text-center align-middle"
                  rowSpan="2"
                >
                  পরিমাণ
                </th>
                <th
                  className="border border-black p-2 text-center align-middle"
                  rowSpan="2"
                >
                  একক মূল্য
                  <br />
                  (টাকায়)
                </th>
                <th
                  className="border border-black p-2 text-center align-middle"
                  rowSpan="2"
                >
                  মোট মূল্য
                  <br />
                  (টাকায়)
                </th>
                <th
                  className="border border-black p-2 text-center align-middle"
                  colSpan="2"
                >
                  মূসক / ভ্যাট
                </th>
                <th
                  className="border border-black p-2 text-center align-middle"
                  rowSpan="2"
                >
                  মোট মূল্য
                  <br />
                  (মূসকসহ)
                </th>
              </tr>
              <tr className="bg-gray-100 print:bg-transparent">
                <th className="border border-black p-2 text-center">হার (%)</th>
                <th className="border border-black p-2 text-center">
                  পরিমাণ (টাকায়)
                </th>
              </tr>
              <tr className="bg-gray-200 print:bg-transparent text-xs text-center">
                <td className="border border-black">(১)</td>
                <td className="border border-black">(২)</td>
                <td className="border border-black">(৩)</td>
                <td className="border border-black">(৪)</td>
                <td className="border border-black">(৫)</td>
                <td className="border border-black">(৬)</td>
                <td className="border border-black">(৭)</td>
                <td className="border border-black">(৮)</td>
              </tr>
            </thead>
            <tbody>
              {enrichedItems.map((item) => (
                <tr key={item.sl}>
                  <td className="border border-black p-2 text-center">
                    {item.sl}
                  </td>
                  <td className="border border-black p-2">{item.name}</td>
                  <td className="border border-black p-2 text-center">
                    {item.qty}
                  </td>
                  <td className="border border-black p-2 text-right">
                    {item.price.toFixed(2)}
                  </td>
                  <td className="border border-black p-2 text-right">
                    {item.totalVal.toFixed(2)}
                  </td>
                  <td className="border border-black p-2 text-center">
                    {item.vatRate}%
                  </td>
                  <td className="border border-black p-2 text-right">
                    {item.vatAmt.toFixed(2)}
                  </td>
                  <td className="border border-black p-2 text-right font-bold">
                    {item.grandTotal.toFixed(2)}
                  </td>
                </tr>
              ))}
              {/* Grand Totals */}
              <tr className="font-bold bg-gray-100 print:bg-transparent">
                <td className="border border-black p-2 text-right" colSpan="4">
                  সর্বমোট:
                </td>
                <td className="border border-black p-2 text-right">
                  {totalExclVat.toFixed(2)}
                </td>
                <td className="border border-black p-2 text-center">-</td>
                <td className="border border-black p-2 text-right">
                  {totalVat.toFixed(2)}
                </td>
                <td className="border border-black p-2 text-right">
                  {totalInclVat.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer & Signature */}
          <div className="mt-16 flex justify-between text-sm">
            <div className="w-64 border-t border-black pt-2 text-center">
              ক্রেতার স্বাক্ষর ও সিল
            </div>
            <div className="w-64 border-t border-black pt-2 text-center">
              প্রতিষ্ঠানের দায়িত্বপ্রাপ্ত ব্যক্তির স্বাক্ষর ও সিল
            </div>
          </div>
          <div className="mt-8 text-xs text-center text-gray-500">
            * This is a system-generated invoice.
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Main Order History Page
// ==========================================
export default function OrderHistoryPage() {
  const [orders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Quick stats calculations
  const { totalOrders, totalRevenue } = useMemo(() => {
    let revenue = 0;
    orders.forEach((order) => {
      order.items.forEach((item) => {
        revenue += item.qty * item.price * (1 + item.vatRate / 100);
      });
    });
    return {
      totalOrders: orders.length,
      totalRevenue: revenue,
    };
  }, [orders]);

  const openMushak = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans p-4 md:p-8">
      {/* Mushak 6.3 Modal */}
      <MushakModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />

      {/* Page Header (Hidden when printing) */}
      <header className="mb-8 print:hidden">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <MdListAlt className="text-[#611F69]" aria-hidden="true" />
          Order History & Invoices
        </h1>
        <p className="text-gray-600 mt-2">
          View all completed orders and generate NBR-compliant Mushak 6.3
          invoices.
        </p>
      </header>

      {/* Content wrapper (Hidden when printing so only Modal prints) */}
      <div className={`${isModalOpen ? "print:hidden" : ""}`}>
        {/* KPI Cards */}
        <section
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          aria-label="Order Statistics"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase">
              Total Orders
            </h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {totalOrders}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase">
              Total Revenue (Incl. VAT)
            </h2>
            <p className="text-3xl font-bold text-[#611F69] mt-2">
              ৳
              {totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase">
              Last Order Date
            </h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {orders[0]?.date || "N/A"}
            </p>
          </div>
        </section>

        {/* Orders Table */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          </div>

          <div className="overflow-x-auto">
            <table
              className="w-full text-left border-collapse"
              aria-label="List of Orders"
            >
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th
                    scope="col"
                    className="py-3 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    Order ID & Date
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    Items
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right"
                  >
                    Total Amount
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider text-center"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  // Calculate order total for the table view
                  const orderTotal = order.items.reduce(
                    (sum, item) =>
                      sum + item.qty * item.price * (1 + item.vatRate / 100),
                    0,
                  );
                  const totalItems = order.items.reduce(
                    (sum, item) => sum + item.qty,
                    0,
                  );

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-900">
                          {order.id}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {order.date} at {order.time}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-800">
                          {order.customerName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.customerAddress}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {totalItems} Items
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-gray-900">
                        ৳
                        {orderTotal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => openMushak(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#611F69]/10 text-[#611F69] text-sm font-semibold rounded hover:bg-[#611F69] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#611F69]"
                          aria-label={`View Mushak 6.3 for order ${order.id}`}
                        >
                          <MdRemoveRedEye size={18} />
                          View Mushak 6.3
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
