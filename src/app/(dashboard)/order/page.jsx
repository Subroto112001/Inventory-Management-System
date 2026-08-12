"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  MdReceiptLong,
  MdPayments,
  MdLocalShipping,
  MdSearch,
  MdFilterList,
  MdSort,
  MdDownload,
  MdVisibility,
  MdChevronLeft,
  MdChevronRight,
  MdCheck,
  MdReceipt,
  MdClose,
} from "react-icons/md";

// ==========================================
// Enriched Demo Orders Data
// ==========================================
const ORDERS_DATA = [
  {
    id: "#ORD-8821",
    date: "Oct 24, 2023",
    time: "10:30 AM",
    customerName: "Eleanor Pena",
    customerPhone: "(555) 019-2834",
    customerAddress: "Dhanmondi, Dhaka",
    customerBIN: "N/A",
    amount: "$1,240.00",
    status: "Completed",
    items: [
      { name: "Premium Wireless Headphones", qty: 2, price: 540, vatRate: 15 },
      { name: "USB-C Fast Charger", qty: 4, price: 40, vatRate: 15 },
    ],
  },
  {
    id: "#ORD-8820",
    date: "Oct 24, 2023",
    time: "11:45 AM",
    customerName: "Wade Warren",
    customerPhone: "(555) 011-9231",
    customerAddress: "Gulshan-1, Dhaka",
    customerBIN: "000123456-0101",
    amount: "$350.50",
    status: "Pending",
    items: [
      { name: "Mechanical Keyboard", qty: 2, price: 152.39, vatRate: 15 },
    ],
  },
  {
    id: "#ORD-8819",
    date: "Jan 23, 2023",
    time: "02:15 PM",
    customerName: "Jacob Jones",
    customerPhone: "(555) 014-4321",
    customerAddress: "Mirpur-10, Dhaka",
    customerBIN: "N/A",
    amount: "$8,920.00",
    status: "Completed",
    items: [
      { name: "Ergonomic Office Chair", qty: 10, price: 775.65, vatRate: 15 },
    ],
  },
  {
    id: "#ORD-8818",
    date: "Oct 22, 2023",
    time: "09:00 AM",
    customerName: "Dianne Russell",
    customerPhone: "(555) 016-8910",
    customerAddress: "Banani, Dhaka",
    customerBIN: "N/A",
    amount: "$145.00",
    status: "Cancelled",
    items: [{ name: "Wireless Mouse", qty: 2, price: 63.04, vatRate: 15 }],
  },
  {
    id: "#ORD-8817",
    date: "Nov 22, 2023",
    time: "04:30 PM",
    customerName: "Guy Hawkins",
    customerPhone: "(555) 012-3456",
    customerAddress: "Uttara, Dhaka",
    customerBIN: "998877665-0202",
    amount: "$2,100.75",
    status: "Pending",
    items: [{ name: "Monitor 27 inch", qty: 3, price: 608.91, vatRate: 15 }],
  },
];

const MONTHS = [
  "All Months",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SORT_OPTIONS = [
  { label: "Default", value: "default" },
  { label: "Completed First", value: "completed" },
  { label: "Not Completed First", value: "not_completed" },
];

// ==========================================
// Standard Memo / Invoice Modal (English)
// ==========================================
const RegularMemoModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  let subtotal = 0;
  let totalVat = 0;

  const orderItems = order.items.map((item) => {
    const itemTotal = item.qty * item.price;
    const itemVat = (itemTotal * item.vatRate) / 100;
    subtotal += itemTotal;
    totalVat += itemVat;
    return { ...item, itemTotal };
  });

  const grandTotal = subtotal + totalVat;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 print:p-0 print:bg-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="memo-title"
    >
      <div className="bg-white w-full max-w-2xl h-[90vh] md:h-auto overflow-y-auto rounded-xl shadow-2xl flex flex-col print:shadow-none print:h-auto print:w-full print:block">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl print:hidden sticky top-0 z-10">
          <h2
            id="memo-title"
            className="text-lg font-bold text-gray-900 flex items-center gap-2"
          >
            <MdVisibility className="text-[#611F69] text-xl" />
            Standard Order Memo
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-[#611F69] text-white text-sm font-semibold rounded hover:bg-[#4a1752] transition-colors focus:outline-none focus:ring-2 focus:ring-[#611F69]"
            >
              <MdDownload size={18} />
              Print Memo
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Close memo"
            >
              <MdClose size={24} />
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="p-8 print:p-8 bg-white text-gray-900 font-sans print:text-black">
          <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
            <h1 className="text-3xl font-extrabold mb-1 uppercase tracking-wider">
              Skripto Super Shop
            </h1>
            <p className="text-sm text-gray-600 font-medium">
              Head Office, Dhaka, Bangladesh
            </p>
            <div className="inline-block mt-4 px-4 py-1.5 border-2 border-[#611F69] text-[#611F69] font-bold text-lg uppercase rounded-full print:border-black print:text-black">
              Order Invoice
            </div>
          </div>

          <div className="flex justify-between items-start mb-8 text-sm">
            <div className="w-1/2">
              <p className="font-bold text-gray-900 mb-1">Billed To:</p>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded print:border-none print:p-0 print:bg-transparent">
                <p className="font-bold text-lg">{order.customerName}</p>
                <p className="text-gray-600 mt-1">{order.customerPhone}</p>
                <p className="text-gray-600">{order.customerAddress}</p>
              </div>
            </div>
            <div className="text-right">
              <p>
                <span className="font-bold">Invoice No:</span> {order.id}
              </p>
              <p className="mt-1">
                <span className="font-bold">Date:</span> {order.date}
              </p>
              <p className="mt-1">
                <span className="font-bold">Time:</span> {order.time}
              </p>
              <p className="mt-1">
                <span className="font-bold">Status:</span> {order.status}
              </p>
            </div>
          </div>

          <table className="w-full text-left border-collapse mb-8">
            <thead>
              <tr className="bg-gray-100 border-y-2 border-gray-800 text-sm print:bg-transparent">
                <th className="py-3 px-4 font-bold text-gray-900">
                  Description
                </th>
                <th className="py-3 px-4 font-bold text-gray-900 text-center">
                  Qty
                </th>
                <th className="py-3 px-4 font-bold text-gray-900 text-right">
                  Price
                </th>
                <th className="py-3 px-4 font-bold text-gray-900 text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orderItems.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-center">{item.qty}</td>
                  <td className="py-3 px-4 text-right">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    ${item.itemTotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-16">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 border-b border-gray-200 pb-2">
                <span>Tax/VAT:</span>
                <span className="font-medium">${totalVat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                <span>Grand Total:</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-500 text-xs border-t border-gray-200 pt-4">
            Thank you for shopping with us! <br />
            This is a system generated document.
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Mushak 6.3 Modal Component (Bengali NBR Format)
// ==========================================
const MushakModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

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

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 print:p-0 print:bg-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mushak-title"
    >
      <div className="bg-white w-full max-w-4xl h-[90vh] md:h-auto overflow-y-auto rounded-xl shadow-2xl flex flex-col print:shadow-none print:h-auto print:w-full print:block">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl print:hidden sticky top-0 z-10">
          <h2
            id="mushak-title"
            className="text-lg font-bold text-gray-900 flex items-center gap-2"
          >
            <MdReceipt className="text-[#611F69] text-xl" />
            Mushak Challan 6.3 (মূসক ৬.৩)
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
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

        {/* Printable Area (Bengali) */}
        <div className="p-8 print:p-0 bg-white text-black font-serif print:text-black">
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

          <div className="flex flex-col md:flex-row justify-between mb-6 text-sm border border-black p-4">
            <div className="w-full md:w-1/2 space-y-2">
              <p>
                <span className="font-bold">নিবন্ধিত ব্যক্তির নাম:</span>{" "}
                Skripto IT
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

          <div className="mt-16 flex justify-between text-sm">
            <div className="w-64 border-t border-black pt-2 text-center">
              ক্রেতার স্বাক্ষর ও সিল
            </div>
            <div className="w-64 border-t border-black pt-2 text-center">
              প্রতিষ্ঠানের দায়িত্বপ্রাপ্ত ব্যক্তির স্বাক্ষর ও সিল
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Main Dashboard Component
// ==========================================
export default function OrdersDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [sortBy, setSortBy] = useState("default");

  // Modals States
  const [isMushakOpen, setIsMushakOpen] = useState(false);
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Dropdown States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filterRef = useRef(null);
  const sortRef = useRef(null);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = await res?.json();

      if (res.ok) {
        setOrders(data?.orders || []);
      } else {
        console.error("Failed to load orders:", data.message);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  console.log(orders);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
const filteredAndSortedOrders = useMemo(() => {
  let result = orders.filter((order) => {
    // Month
    const orderMonthName = new Date(order.createdAt).toLocaleString("en-US", {
      month: "long",
    });

    const matchesMonth =
      selectedMonth === "All Months" ||
      orderMonthName.toLowerCase() === selectedMonth.toLowerCase();

    // Search
    const lowerCaseQuery = searchQuery.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      order.orderNumber?.toLowerCase().includes(lowerCaseQuery) ||
      order.customer?.name?.toLowerCase().includes(lowerCaseQuery) ||
      order.customer?.phone?.toLowerCase().includes(lowerCaseQuery) ||
      order.status?.toLowerCase().includes(lowerCaseQuery) ||
      order.payment?.paymentStatus?.toLowerCase().includes(lowerCaseQuery) ||
      order.payment?.method?.toLowerCase().includes(lowerCaseQuery);

    return matchesMonth && matchesSearch;
  });

  if (sortBy === "completed") {
    result.sort((a, b) =>
      a.status === "Completed" ? -1 : b.status === "Completed" ? 1 : 0,
    );
  } else if (sortBy === "not_completed") {
    result.sort((a, b) =>
      a.status !== "Completed" ? -1 : b.status !== "Completed" ? 1 : 0,
    );
  }

  return result;
}, [orders, searchQuery, selectedMonth, sortBy]);

  const generateReport = () => {
    if (filteredAndSortedOrders.length === 0) {
      alert("No data available to export/print.");
      return;
    }
    window.print();
  };

  const openMushak = (order) => {
    setSelectedOrder(order);
    setIsMushakOpen(true);
  };

  const openMemo = (order) => {
    setSelectedOrder(order);
    setIsMemoOpen(true);
  };

  return (
    <main className="p-5 min-h-[calc(100vh-64px)] bg-surface">
      {/* Modals */}
      <MushakModal
        isOpen={isMushakOpen}
        onClose={() => setIsMushakOpen(false)}
        order={selectedOrder}
      />
      <RegularMemoModal
        isOpen={isMemoOpen}
        onClose={() => setIsMemoOpen(false)}
        order={selectedOrder}
      />

      {/* Hide main dashboard content when printing any modal */}
      <div className={isMushakOpen || isMemoOpen ? "print:hidden" : ""}>
        <div className="hidden print:block mb-8 border-b border-gray-300 pb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Orders Report
          </h1>
          <p className="text-gray-600">
            Generated on: {new Date().toLocaleDateString()}
          </p>
          {(searchQuery ||
            selectedMonth !== "All Months" ||
            sortBy !== "default") && (
            <p className="text-gray-500 text-sm mt-1">
              Active Filters: {searchQuery && `Search: "${searchQuery}" | `}
              {selectedMonth !== "All Months" && `Month: ${selectedMonth} | `}
              {sortBy !== "default" &&
                `Sorted by: ${SORT_OPTIONS.find((o) => o.value === sortBy)?.label}`}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 print:hidden">
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        </div>

        {/* KPI Summary Bar */}
        <section
          className="flex flex-col md:flex-row gap-4 mb-8 print:hidden"
          aria-label="Key Performance Indicators"
        >
          <div className="bg-[#611F69] p-5 rounded-lg border text-white border-gray-100 w-full hover:scale-102 transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-label-sm text-label-sm uppercase text-gray-200">
                Total Orders
              </h3>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MdReceiptLong
                  className="text-white text-[18px]"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                {filteredAndSortedOrders.length}
              </span>
              <span className="text-sm text-gray-300">
                +12% from last month
              </span>
            </div>
          </div>

          <div className="bg-[#611F69] p-5 rounded-lg border text-white border-gray-100 w-full hover:scale-102 transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-label-sm text-label-sm uppercase text-gray-200">
                Revenue This Month
              </h3>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MdPayments
                  className="text-white text-[18px]"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">$84,520.00</span>
              <span className="text-sm text-gray-300">+5.4%</span>
            </div>
          </div>

          <div className="bg-[#611F69] p-5 rounded-lg border text-white border-gray-100 w-full hover:scale-102 transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-label-sm text-label-sm uppercase text-gray-200">
                Pending Shipments
              </h3>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MdLocalShipping
                  className="text-white text-[18px]"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">42</span>
              <span className="text-sm text-gray-300">Requires attention</span>
            </div>
          </div>
        </section>

        {/* Toolbar & Table Section */}
        <section className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm print:border-none print:shadow-none">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-center gap-4 bg-white print:hidden">
            <div className="relative w-full xl:w-72">
              <label htmlFor="search-orders" className="sr-only">
                Search orders
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

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full xl:w-auto">
              {/* Month Filter Dropdown */}
              <div className="relative w-full sm:w-auto" ref={filterRef}>
                <button
                  onClick={() => {
                    setIsFilterOpen(!isFilterOpen);
                    setIsSortOpen(false);
                  }}
                  aria-haspopup="listbox"
                  aria-expanded={isFilterOpen}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-label-sm text-label-sm text-gray-700 hover:bg-gray-50 transition-colors w-full justify-center focus:outline-none focus:ring-2 focus:ring-[#611F69] ${
                    selectedMonth !== "All Months"
                      ? "border-[#611F69] bg-[#611F69]/5 text-[#611F69] font-medium"
                      : "border-gray-200"
                  }`}
                >
                  <MdFilterList className="text-[18px]" aria-hidden="true" />
                  <span>Filter: {selectedMonth}</span>
                </button>

                {isFilterOpen && (
                  <ul
                    role="listbox"
                    className="absolute left-0 sm:right-0 sm:left-auto mt-1 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 max-h-60 overflow-y-auto focus:outline-none"
                  >
                    {MONTHS.map((month) => (
                      <li
                        key={month}
                        role="option"
                        aria-selected={selectedMonth === month}
                        onClick={() => {
                          setSelectedMonth(month);
                          setIsFilterOpen(false);
                        }}
                        className={`flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer ${
                          selectedMonth === month
                            ? "font-semibold text-[#611F69] bg-[#611F69]/5"
                            : ""
                        }`}
                      >
                        <span>{month}</span>
                        {selectedMonth === month && (
                          <MdCheck className="text-[16px]" />
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="relative w-full sm:w-auto" ref={sortRef}>
                <button
                  onClick={() => {
                    setIsSortOpen(!isSortOpen);
                    setIsFilterOpen(false);
                  }}
                  aria-haspopup="listbox"
                  aria-expanded={isSortOpen}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-label-sm text-label-sm text-gray-700 hover:bg-gray-50 transition-colors w-full justify-center focus:outline-none focus:ring-2 focus:ring-[#611F69] ${
                    sortBy !== "default"
                      ? "border-[#611F69] bg-[#611F69]/5 text-[#611F69] font-medium"
                      : "border-gray-200"
                  }`}
                >
                  <MdSort className="text-[18px]" aria-hidden="true" />
                  <span>
                    Sort: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                  </span>
                </button>

                {isSortOpen && (
                  <ul
                    role="listbox"
                    className="absolute left-0 sm:right-0 sm:left-auto mt-1 w-full sm:w-52 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 focus:outline-none"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <li
                        key={option.value}
                        role="option"
                        aria-selected={sortBy === option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortOpen(false);
                        }}
                        className={`flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer ${
                          sortBy === option.value
                            ? "font-semibold text-[#611F69] bg-[#611F69]/5"
                            : ""
                        }`}
                      >
                        <span>{option.label}</span>
                        {sortBy === option.value && (
                          <MdCheck className="text-[16px]" />
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                onClick={generateReport}
                className="flex items-center gap-2 px-4 py-2 border border-[#611F69] bg-[#611F69] text-white rounded-lg font-label-sm text-label-sm hover:bg-[#4a1752] transition-colors w-full sm:w-auto justify-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#611F69]"
                aria-label="Export report to PDF"
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
                    Status
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
                {filteredAndSortedOrders.length > 0 ? (
                  filteredAndSortedOrders.map((order) => (
                    <tr
                      key={order.orderNumber}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-medium text-[#611F69] print:text-gray-900 print:py-2">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 text-gray-600 print:text-gray-900 print:py-2">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 print:py-2">
                        <div className="font-semibold text-gray-900">
                          {order.customer?.name}
                        </div>
                        <div className="text-gray-500 text-sm print:text-gray-700">
                          {order.customer?.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 print:py-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 print:py-2">
                        {order?.financials?.grandTotal}git
                      </td>
                      <td className="px-6 py-4 text-right print:hidden flex justify-end gap-2">
                        {/* 1. Standard Memo Button */}
                        <button
                          onClick={() => openMemo(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#611F69]/30 rounded-md text-[#611F69] hover:bg-[#611F69]/10 transition-colors font-medium text-[13px] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#611F69]"
                          aria-label={`View Standard Memo for order ${order.id}`}
                        >
                          <MdVisibility
                            className="text-[16px]"
                            aria-hidden="true"
                          />
                          View Memo
                        </button>

                        {/* 2. Mushak 6.3 Button */}
                        <button
                          onClick={() => openMushak(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#611F69] bg-[#611F69] text-white rounded-md hover:bg-[#4a1752] transition-colors font-medium text-[13px] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#611F69]"
                          aria-label={`View Mushak 6.3 for order ${order.id}`}
                        >
                          <MdReceipt
                            className="text-[16px]"
                            aria-hidden="true"
                          />
                          View Mushak
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <p className="text-lg font-medium">No results found</p>
                      <p className="text-sm mt-1">
                        We couldn't find any orders matching your selection.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <nav
            className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between print:hidden"
            aria-label="Pagination Navigation"
          >
            <span className="text-[14px] text-gray-600" aria-live="polite">
              Showing {filteredAndSortedOrders.length > 0 ? 1 : 0} to{" "}
              {filteredAndSortedOrders.length} of {orders.length} entries
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
      </div>
    </main>
  );
}
