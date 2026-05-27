"use client";

import React from "react";
import {
  MdDownload,
  MdTrendingUp,
  MdTrendingDown,
  MdInventory,
  MdShoppingCart,
  MdVisibility,
} from "react-icons/md";

// গ্রাফের জন্য ডেমো ডেটা
const CHART_DATA = [
  { month: "Jan", profit: 4000, lost: 400 },
  { month: "Feb", profit: 3000, lost: 600 },
  { month: "Mar", profit: 5000, lost: 300 },
  { month: "Apr", profit: 4500, lost: 800 },
  { month: "May", profit: 6000, lost: 200 },
  { month: "Jun", profit: 7000, lost: 100 },
  { month: "Jul", profit: 8500, lost: 500 },
];

// রিসেন্ট ১০ টি অর্ডারের ডেমো ডেটা
const RECENT_ORDERS = [
  {
    id: "#ORD-8830",
    date: "Oct 28, 2023",
    customer: "John Doe",
    amount: "$1,200.00",
    status: "Completed",
  },
  {
    id: "#ORD-8829",
    date: "Oct 27, 2023",
    customer: "Jane Smith",
    amount: "$850.00",
    status: "Completed",
  },
  {
    id: "#ORD-8828",
    date: "Oct 27, 2023",
    customer: "Michael Johnson",
    amount: "$320.00",
    status: "Pending",
  },
  {
    id: "#ORD-8827",
    date: "Oct 26, 2023",
    customer: "Emily Davis",
    amount: "$4,500.00",
    status: "Completed",
  },
  {
    id: "#ORD-8826",
    date: "Oct 25, 2023",
    customer: "Chris Brown",
    amount: "$150.00",
    status: "Cancelled",
  },
  {
    id: "#ORD-8825",
    date: "Oct 25, 2023",
    customer: "Sarah Wilson",
    amount: "$980.00",
    status: "Completed",
  },
  {
    id: "#ORD-8824",
    date: "Oct 24, 2023",
    customer: "David Clark",
    amount: "$2,100.00",
    status: "Pending",
  },
  {
    id: "#ORD-8823",
    date: "Oct 23, 2023",
    customer: "James Lewis",
    amount: "$430.00",
    status: "Completed",
  },
  {
    id: "#ORD-8822",
    date: "Oct 22, 2023",
    customer: "Laura Walker",
    amount: "$760.00",
    status: "Completed",
  },
  {
    id: "#ORD-8821",
    date: "Oct 21, 2023",
    customer: "Eleanor Pena",
    amount: "$1,240.00",
    status: "Completed",
  },
];

export default function ReportsDashboard() {
  // পিডিএফ/প্রিন্ট কল করার ফাংশন
  const generatePDF = () => {
    window.print();
  };

  // গ্রাফের ম্যাক্সিমাম ভ্যালু বের করা (স্কেলিংয়ের জন্য)
  const maxChartValue = Math.max(
    ...CHART_DATA.map((d) => Math.max(d.profit, d.lost)),
  );

  // স্ট্যাটাস অনুযায়ী ব্যাজ স্টাইল
  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-[#611F69]/10 text-[#611F69]";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <main className="p-5 min-h-screen bg-gray-50 print:bg-white print:p-0">
      {/* প্রিন্ট হেডার */}
      <div className="hidden print:block mb-8 border-b border-gray-300 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Business Performance Report
        </h1>
        <p className="text-gray-600">
          Generated on: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Reports & Analytics
          </h1>
          <p className="text-gray-500 text-sm">
            Overview of your sales, stock, and profit performance.
          </p>
        </div>
        <button
          onClick={generatePDF}
          className="bg-[#611F69] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#4a1752] transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#611F69]"
        >
          <MdDownload className="text-[18px]" aria-hidden="true" />
          Generate PDF Report
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Products Sold */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm print:border-gray-300">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Total Products Sold
            </h3>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center print:hidden">
              <MdShoppingCart
                className="text-blue-600 text-[18px]"
                aria-hidden="true"
              />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">14,284</p>
          <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1 print:hidden">
            <MdTrendingUp aria-hidden="true" /> +8.5% this month
          </p>
        </div>

        {/* Current Stock */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm print:border-gray-300">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Products In Stock
            </h3>
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center print:hidden">
              <MdInventory
                className="text-orange-600 text-[18px]"
                aria-hidden="true"
              />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">8,520</p>
          <p className="text-xs text-gray-500 font-medium mt-2 print:hidden">
            Across 3 warehouses
          </p>
        </div>

        {/* Total Profit */}
        <div className="bg-[#611F69] rounded-lg border border-[#611F69] p-6 shadow-sm print:bg-white print:border-gray-300">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs text-gray-200 uppercase tracking-wider font-semibold print:text-gray-500">
              Total Profit Made
            </h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center print:hidden">
              <MdTrendingUp
                className="text-white text-[18px]"
                aria-hidden="true"
              />
            </div>
          </div>
          <p className="text-2xl font-bold text-white print:text-gray-900">
            $128,450.00
          </p>
          <p className="text-xs text-green-300 font-medium mt-2 print:hidden">
            Exceeds target by 12%
          </p>
        </div>

        {/* Profit Lost */}
        <div className="bg-white rounded-lg border border-red-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs text-red-500 uppercase tracking-wider font-semibold">
              Estimated Profit Lost
            </h3>
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center print:hidden">
              <MdTrendingDown
                className="text-red-600 text-[18px]"
                aria-hidden="true"
              />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600">$4,250.00</p>
          <p className="text-xs text-gray-500 font-medium mt-2 print:hidden">
            Due to stockouts & cancellations
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-8 print:border-gray-300">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Profit vs. Profit Lost Analytics
        </h2>

        {/* Custom SVG Bar Chart */}
        <div className="w-full h-64 flex items-end justify-between gap-2 md:gap-4 mt-8 relative">
          {/* Y-Axis Guidelines */}
          <div className="absolute inset-0 flex flex-col justify-between border-l border-gray-200 text-xs text-gray-400 pb-6 pointer-events-none">
            <div className="border-b border-dashed border-gray-200 w-full flex-1 relative">
              <span className="absolute -left-10 -top-2">${maxChartValue}</span>
            </div>
            <div className="border-b border-dashed border-gray-200 w-full flex-1 relative">
              <span className="absolute -left-10 -top-2">
                ${Math.round(maxChartValue * 0.66)}
              </span>
            </div>
            <div className="border-b border-gray-300 w-full flex-1 relative">
              <span className="absolute -left-10 -top-2">
                ${Math.round(maxChartValue * 0.33)}
              </span>
            </div>
            <span className="absolute -left-8 bottom-5">$0</span>
          </div>

          {/* Chart Bars */}
          <div className="flex w-full h-full pl-8 items-end justify-around relative z-10 pb-6">
            {CHART_DATA.map((data, index) => {
              const profitHeight = (data.profit / maxChartValue) * 100;
              const lostHeight = (data.lost / maxChartValue) * 100;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 h-full justify-end w-full group"
                >
                  {/* Tooltip on hover (Hidden on print) */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-900 text-white text-xs px-2 py-1 rounded transition-opacity print:hidden z-20 whitespace-nowrap pointer-events-none">
                    Profit: ${data.profit} | Lost: ${data.lost}
                  </div>

                  <div className="flex items-end gap-1 w-full justify-center h-full">
                    {/* Profit Bar */}
                    <div
                      className="w-3 sm:w-6 lg:w-8 bg-[#611F69] rounded-t-sm transition-all duration-500 hover:opacity-80"
                      style={{ height: `${profitHeight}%` }}
                    ></div>
                    {/* Lost Bar */}
                    <div
                      className="w-3 sm:w-6 lg:w-8 bg-red-500 rounded-t-sm transition-all duration-500 hover:opacity-80"
                      style={{ height: `${lostHeight}%` }}
                    ></div>
                  </div>
                  {/* X-Axis Label */}
                  <span className="text-xs text-gray-500 font-medium">
                    {data.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart Legends */}
        <div className="flex justify-center items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#611F69]"></span>
            <span className="text-sm text-gray-600 font-medium">
              Profit Made
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-sm text-gray-600 font-medium">
              Profit Lost
            </span>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm print:border-gray-300">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Recent 10 Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse print:border print:border-gray-300">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 print:bg-gray-100">
                <th className="px-6 py-4 text-xs text-gray-500 uppercase tracking-wider font-semibold print:border-b print:border-gray-400">
                  Order ID
                </th>
                <th className="px-6 py-4 text-xs text-gray-500 uppercase tracking-wider font-semibold print:border-b print:border-gray-400">
                  Date
                </th>
                <th className="px-6 py-4 text-xs text-gray-500 uppercase tracking-wider font-semibold print:border-b print:border-gray-400">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs text-gray-500 uppercase tracking-wider font-semibold text-right print:border-b print:border-gray-400">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs text-gray-500 uppercase tracking-wider font-semibold text-center print:border-b print:border-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-xs text-gray-500 uppercase tracking-wider font-semibold text-right print:hidden">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {RECENT_ORDERS.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#611F69] print:text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{order.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 text-right">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold print:border print:border-gray-400 print:bg-white print:text-gray-900 ${getStatusStyle(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right print:hidden">
                    <button className="text-[#611F69] hover:bg-[#611F69]/10 p-2 rounded transition-colors focus:outline-none">
                      <MdVisibility className="text-[18px]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
