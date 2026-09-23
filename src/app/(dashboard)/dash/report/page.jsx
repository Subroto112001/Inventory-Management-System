"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  MdDownload,
  MdTrendingUp,
  MdTrendingDown,
  MdInventory,
  MdShoppingCart,
  MdVisibility,
  MdErrorOutline,
  MdRefresh,
} from "react-icons/md";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function ReportsDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const [orderRes, productRes] = await Promise.all([
        fetch("/api/orders", { cache: "no-store" }),
        fetch("/api/product", { cache: "no-store" }),
      ]);

      const orderData = await orderRes.json();
      const productData = await productRes.json();

      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || "Failed to load orders");
      }
      if (!productRes.ok || !productData.success) {
        throw new Error(productData.message || "Failed to load products");
      }

      setOrders(orderData.orders || []);
      setProducts(productData.products || []);
    } catch (err) {
      setLoadError(err.message || "Something went wrong while loading reports");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // পিডিএফ/প্রিন্ট কল করার ফাংশন
  const generatePDF = () => {
    window.print();
  };

  // --- Product / stock stats ---
  const productStats = useMemo(() => {
    let inStock = 0;
    let activeCount = 0;
    let lowStockCount = 0;

    products.forEach((p) => {
      inStock += Number(p.currentStock) || 0;
      if (p.isActive) activeCount += 1;
      const alertLevel = Number(p.lowStockAlert) || 0;
      if (alertLevel > 0 && (Number(p.currentStock) || 0) <= alertLevel) {
        lowStockCount += 1;
      }
    });

    return { inStock, activeCount, lowStockCount };
  }, [products]);

  // --- Order / revenue stats, plus last 7 months of chart data ---
  const orderStats = useMemo(() => {
    const months = [];
    const monthMap = {};
    const now = new Date();

    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      months.push(key);
      monthMap[key] = {
        month: d.toLocaleString("en-US", { month: "short" }),
        profit: 0,
        lost: 0,
        sold: 0,
      };
    }

    let productsSold = 0;
    let totalRevenue = 0;
    let revenueLost = 0;

    orders.forEach((order) => {
      const isCancelled = order.status === "Cancelled";
      const grandTotal = Number(order?.financials?.grandTotal) || 0;
      const itemsQty = (order.items || []).reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0,
      );

      if (isCancelled) {
        revenueLost += grandTotal;
      } else {
        totalRevenue += grandTotal;
        productsSold += itemsQty;
      }

      if (order.createdAt) {
        const d = new Date(order.createdAt);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (monthMap[key]) {
          if (isCancelled) {
            monthMap[key].lost += grandTotal;
          } else {
            monthMap[key].profit += grandTotal;
            monthMap[key].sold += itemsQty;
          }
        }
      }
    });

    const chartData = months.map((key) => monthMap[key]);
    const current = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];

    const revenueGrowth =
      previous && previous.profit > 0
        ? ((current.profit - previous.profit) / previous.profit) * 100
        : null;
    const soldGrowth =
      previous && previous.sold > 0
        ? ((current.sold - previous.sold) / previous.sold) * 100
        : null;

    return {
      productsSold,
      totalRevenue,
      revenueLost,
      chartData,
      revenueGrowth,
      soldGrowth,
    };
  }, [orders]);

  const recentOrders = useMemo(() => orders.slice(0, 10), [orders]);

  const maxChartValue = Math.max(
    1,
    ...orderStats.chartData.map((d) => Math.max(d.profit, d.lost)),
  );

  // স্ট্যাটাস অনুযায়ী ব্যাজ স্টাইল
  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-[#611F69]/10 text-[#611F69]";
      case "Confirmed":
        return "bg-blue-100 text-blue-700";
      case "Shipped":
        return "bg-indigo-100 text-indigo-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const formatGrowth = (value) => {
    if (value === null || Number.isNaN(value)) return null;
    const rounded = Math.round(value * 10) / 10;
    return rounded;
  };

  const revenueGrowth = formatGrowth(orderStats.revenueGrowth);
  const soldGrowth = formatGrowth(orderStats.soldGrowth);

  if (isLoading) {
    return (
      <main className="p-5 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading reports...</p>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="p-5 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center max-w-sm">
          <MdErrorOutline
            className="text-4xl text-red-500"
            aria-hidden="true"
          />
          <p className="text-base font-semibold text-gray-900">
            Couldn't load your reports
          </p>
          <p className="text-sm text-gray-500">Something Getting Error, Please try again later.</p>
          <button
            onClick={fetchData}
            className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#611F69] bg-[#611F69]/10 rounded-lg hover:bg-[#611F69]/20 transition-colors"
          >
            <MdRefresh className="text-lg" aria-hidden="true" />
            Try again
          </button>
        </div>
      </main>
    );
  }

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
            Overview of your sales, stock, and revenue performance.
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
          <p className="text-2xl font-bold text-gray-900">
            {orderStats.productsSold.toLocaleString()}
          </p>
          {soldGrowth !== null ? (
            <p
              className={`text-xs font-medium mt-2 flex items-center gap-1 print:hidden ${
                soldGrowth >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {soldGrowth >= 0 ? (
                <MdTrendingUp aria-hidden="true" />
              ) : (
                <MdTrendingDown aria-hidden="true" />
              )}
              {soldGrowth >= 0 ? "+" : ""}
              {soldGrowth}% this month
            </p>
          ) : (
            <p className="text-xs text-gray-400 font-medium mt-2 print:hidden">
              Not enough data yet
            </p>
          )}
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
          <p className="text-2xl font-bold text-gray-900">
            {productStats.inStock.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 font-medium mt-2 print:hidden">
            {productStats.activeCount} active product
            {productStats.activeCount === 1 ? "" : "s"}
            {productStats.lowStockCount > 0
              ? ` · ${productStats.lowStockCount} low on stock`
              : ""}
          </p>
        </div>

        {/* Total Revenue */}
        <div className="bg-[#611F69] rounded-lg border border-[#611F69] p-6 shadow-sm print:bg-white print:border-gray-300">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs text-gray-200 uppercase tracking-wider font-semibold print:text-gray-500">
              Total Revenue
            </h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center print:hidden">
              <MdTrendingUp
                className="text-white text-[18px]"
                aria-hidden="true"
              />
            </div>
          </div>
          <p className="text-2xl font-bold text-white print:text-gray-900">
            {formatCurrency(orderStats.totalRevenue)}
          </p>
          {revenueGrowth !== null ? (
            <p
              className={`text-xs font-medium mt-2 print:hidden ${
                revenueGrowth >= 0 ? "text-green-300" : "text-red-300"
              }`}
            >
              {revenueGrowth >= 0 ? "+" : ""}
              {revenueGrowth}% vs last month
            </p>
          ) : (
            <p className="text-xs text-gray-200 font-medium mt-2 print:hidden">
              Not enough data yet
            </p>
          )}
        </div>

        {/* Revenue Lost */}
        <div className="bg-white rounded-lg border border-red-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs text-red-500 uppercase tracking-wider font-semibold">
              Revenue Lost
            </h3>
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center print:hidden">
              <MdTrendingDown
                className="text-red-600 text-[18px]"
                aria-hidden="true"
              />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(orderStats.revenueLost)}
          </p>
          <p className="text-xs text-gray-500 font-medium mt-2 print:hidden">
            From cancelled orders
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-8 print:border-gray-300">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Revenue vs. Revenue Lost (Last 7 Months)
        </h2>

        {/* Custom SVG Bar Chart */}
        <div className="w-full h-64 flex items-end justify-between gap-2 md:gap-4 mt-8 relative">
          {/* Y-Axis Guidelines */}
          <div className="absolute inset-0 flex flex-col justify-between border-l border-gray-200 text-xs text-gray-400 pb-6 pointer-events-none">
            <div className="border-b border-dashed border-gray-200 w-full flex-1 relative">
              <span className="absolute -left-10 -top-2">
                ${Math.round(maxChartValue)}
              </span>
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
            {orderStats.chartData.map((data, index) => {
              const profitHeight = (data.profit / maxChartValue) * 100;
              const lostHeight = (data.lost / maxChartValue) * 100;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 h-full justify-end w-full group"
                >
                  {/* Tooltip on hover (Hidden on print) */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-900 text-white text-xs px-2 py-1 rounded transition-opacity print:hidden z-20 whitespace-nowrap pointer-events-none">
                    Revenue: {formatCurrency(data.profit)} | Lost:{" "}
                    {formatCurrency(data.lost)}
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
            <span className="text-sm text-gray-600 font-medium">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-sm text-gray-600 font-medium">
              Revenue Lost
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
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-[#611F69] print:text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.customer?.name || "Guest"}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 text-right">
                      {formatCurrency(order.financials?.grandTotal)}
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
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500 bg-gray-50"
                  >
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
