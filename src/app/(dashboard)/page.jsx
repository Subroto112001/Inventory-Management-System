"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import "../../css/Dashboard.css";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  MdAdd,
  MdInventory2,
  MdTrendingUp,
  MdWarning,
  MdAttachMoney,
  MdArrowUpward,
  MdArrowDownward,
  MdMoreVert,
  MdFilterList,
  MdArrowForward,
  MdErrorOutline,
  MdRefresh,
  MdPeople,
  MdShoppingCart,
  MdLocalOffer,
} from "react-icons/md";
import CustomerdataProvider from "@/dataProvider/CustomerdataProvider";
import Link from "next/link";

const formatCurrency = (value) =>
  `$${(Number(value) || 0).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

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

const getOrderCustomerName = (order) => {
  return (
    order?.customer?.name ||
    order?.customerName ||
    order?.customer?.fullName ||
    order?.shippingAddress?.name ||
    order?.billingAddress?.name ||
    order?.user?.name ||
    order?.user?.fullName ||
    "Guest Customer"
  );
};

const getOrderId = (order) => {
  return order?.orderNumber || order?.orderId || order?._id || order?.id || "—";
};

const getOrderStatusClass = (status) => {
  const normalized = String(status || "").toLowerCase();

  if (
    normalized.includes("cancel") ||
    normalized.includes("reject") ||
    normalized.includes("fail")
  ) {
    return "status-out";
  }

  if (normalized.includes("pending") || normalized.includes("processing")) {
    return "status-low";
  }

  return "status-good";
};

const Page = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const { customers, loadingCustomers, fetchCustomers } =
    CustomerdataProvider();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const [productRes, orderRes] = await Promise.all([
        fetch("/api/product", {
          cache: "no-store",
        }),

        fetch("/api/orders", {
          cache: "no-store",
        }),
      ]);

      const productData = await productRes.json();
      const orderData = await orderRes.json();

      if (!productRes.ok || !productData.success) {
        throw new Error(productData.message || "Failed to load products");
      }

      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || "Failed to load orders");
      }

      setProducts(productData.products || []);
      setOrders(orderData.orders || []);
    } catch (err) {
      setLoadError(
        err.message || "Something went wrong while loading the dashboard",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ------------------------------------------------------------
  // Time boundaries
  // ------------------------------------------------------------

  const now = new Date();

  const todayStart = startOfDay(now);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // ------------------------------------------------------------
  // Product-derived stats
  // ------------------------------------------------------------

  const productStats = useMemo(() => {
    const totalProducts = products.length;

    const productsBeforeThisMonth = products.filter(
      (p) => p.createdAt && new Date(p.createdAt) < thisMonthStart,
    ).length;

    const productGrowth =
      productsBeforeThisMonth > 0
        ? ((totalProducts - productsBeforeThisMonth) /
            productsBeforeThisMonth) *
          100
        : null;

    const lowStock = products.filter((p) => {
      const alert = Number(p.lowStockAlert) || 0;
      const stock = Number(p.currentStock) || 0;

      return alert > 0 && stock <= alert;
    });

    const outOfStockCount = lowStock.filter(
      (p) => (Number(p.currentStock) || 0) <= 0,
    ).length;

    return {
      totalProducts,
      productGrowth,
      lowStock,
      outOfStockCount,
    };
  }, [products, thisMonthStart]);

  // ------------------------------------------------------------
  // Order-derived stats
  // ------------------------------------------------------------

  const orderStats = useMemo(() => {
    let todaySales = 0;
    let yesterdaySales = 0;
    let monthRevenue = 0;
    let lastMonthRevenue = 0;

    const dayBuckets = [];

    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(todayStart);

      d.setDate(d.getDate() - i);

      dayBuckets.push({
        key: d.toDateString(),

        name: d.toLocaleDateString("en-US", {
          weekday: "short",
        }),

        revenue: 0,
      });
    }

    const dayMap = Object.fromEntries(dayBuckets.map((b) => [b.key, b]));

    const productUnits = {};

    orders.forEach((order) => {
      if (order.status === "Cancelled") return;

      const grand = Number(order?.financials?.grandTotal) || 0;

      const created = order.createdAt ? new Date(order.createdAt) : null;

      if (!created) return;

      if (created >= todayStart) {
        todaySales += grand;
      } else if (created >= yesterdayStart && created < todayStart) {
        yesterdaySales += grand;
      }

      if (created >= thisMonthStart) {
        monthRevenue += grand;
      } else if (created >= lastMonthStart && created < thisMonthStart) {
        lastMonthRevenue += grand;
      }

      const dayKey = startOfDay(created).toDateString();

      if (dayMap[dayKey]) {
        dayMap[dayKey].revenue += grand;
      }

      if (created >= thisMonthStart) {
        (order.items || []).forEach((item) => {
          const name = item.name || "Unknown";

          productUnits[name] =
            (productUnits[name] || 0) + (Number(item.quantity) || 0);
        });
      }
    });

    const salesGrowth =
      yesterdaySales > 0
        ? ((todaySales - yesterdaySales) / yesterdaySales) * 100
        : null;

    const revenueGrowth =
      lastMonthRevenue > 0
        ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : null;

    const topProducts = Object.entries(productUnits)
      .map(([name, units]) => ({
        name,
        units,
      }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);

    return {
      todaySales,
      salesGrowth,
      monthRevenue,
      revenueGrowth,

      salesTrendData: dayBuckets.map(({ name, revenue }) => ({
        name,
        revenue,
      })),

      topProducts,
    };
  }, [orders, todayStart, yesterdayStart, thisMonthStart, lastMonthStart]);

  // ------------------------------------------------------------
  // Latest 4 Orders
  // ------------------------------------------------------------

  const latestOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      )
      .slice(0, 4);
  }, [orders]);

  // ------------------------------------------------------------
  // Offers
  // ------------------------------------------------------------

  const offerList = useMemo(() => {
    const allOffers = [];

    products.forEach((product) => {
      const productOffers = Array.isArray(product.offers) ? product.offers : [];

      productOffers.forEach((offer, index) => {
        allOffers.push({
          ...offer,

          productName: product.productName || product.name || "Unknown Product",

          productSKU: product.productSKU || product.SKU || "—",

          offerKey:
            offer?._id || offer?.id || `${product.id || product._id}-${index}`,
        });
      });
    });

    return allOffers;
  }, [products]);

  // ------------------------------------------------------------
  // Customers
  // ------------------------------------------------------------

  const totalCustomers = customers.length;

  // ------------------------------------------------------------
  // Percentage helper
  // ------------------------------------------------------------

  const roundPct = (v) =>
    v === null || Number.isNaN(v) ? null : Math.round(v * 10) / 10;

  const salesGrowth = roundPct(orderStats.salesGrowth);

  const revenueGrowth = roundPct(orderStats.revenueGrowth);

  const productGrowth = roundPct(productStats.productGrowth);

  // ------------------------------------------------------------
  // Offer helpers
  // ------------------------------------------------------------

  const getOfferName = (offer) => {
    return (
      offer?.name ||
      offer?.title ||
      offer?.offerName ||
      offer?.type ||
      "Special Offer"
    );
  };

  const getOfferDiscount = (offer) => {
    if (
      offer?.discountPercentage !== undefined &&
      offer?.discountPercentage !== null
    ) {
      return `${offer.discountPercentage}%`;
    }

    if (
      offer?.discountPercent !== undefined &&
      offer?.discountPercent !== null
    ) {
      return `${offer.discountPercent}%`;
    }

    if (offer?.percentage !== undefined && offer?.percentage !== null) {
      return `${offer.percentage}%`;
    }

    if (offer?.discount !== undefined && offer?.discount !== null) {
      const discount =
        typeof offer.discount === "number"
          ? offer.discount
          : String(offer.discount);

      return String(discount).includes("%") ? discount : discount;
    }

    return "—";
  };

  const getOfferStatus = (offer) => {
    if (offer?.isActive === false) {
      return "Inactive";
    }

    if (offer?.active === false) {
      return "Inactive";
    }

    return "Active";
  };

  // ------------------------------------------------------------
  // Loading UI
  // ------------------------------------------------------------

  if (isLoading || loadingCustomers) {
    return (
      <div className="h-screen w-full overflow-hidden bg-gray-50/50 p-6 flex flex-col justify-between">
        <span className="sr-only" role="status" aria-live="polite">
          Loading dashboard metrics and statistics...
        </span>

        {/* Header Skeleton */}

        <div className="flex items-center justify-between mb-6 animate-pulse">
          <div className="flex flex-col gap-2">
            <div className="h-8 w-48 bg-gray-200 rounded-md" />

            <div className="h-4 w-64 bg-gray-200 rounded-md" />
          </div>

          <div className="h-10 w-32 bg-gray-200 rounded-md" />
        </div>

        {/* KPI Cards Skeleton */}

        <div className="kpi-grid mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="card animate-pulse flex flex-col justify-between p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-24 bg-gray-200 rounded" />

                  <div className="h-7 w-20 bg-gray-200 rounded" />
                </div>

                <div className="w-10 h-10 bg-gray-200 rounded-md" />
              </div>

              <div className="h-3 w-32 bg-gray-200 rounded mt-4" />
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}

        <div className="charts-grid mb-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="card animate-pulse p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col gap-2">
                  <div className="h-5 w-32 bg-gray-200 rounded" />

                  <div className="h-3 w-40 bg-gray-200 rounded" />
                </div>

                <div className="w-6 h-6 bg-gray-200 rounded" />
              </div>

              <div className="h-[240px] w-full bg-gray-200/70 rounded-md" />
            </div>
          ))}
        </div>

        {/* Latest Orders + Customer Skeleton */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 card animate-pulse p-4">
            <div className="h-5 w-44 bg-gray-200 rounded mb-5" />

            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 w-full bg-gray-200/60 rounded" />
              ))}
            </div>
          </div>

          <div className="card animate-pulse p-4">
            <div className="h-5 w-40 bg-gray-200 rounded mb-5" />

            <div className="h-12 w-24 bg-gray-200 rounded mb-3" />

            <div className="h-3 w-32 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Offers Skeleton */}

        <div className="table-section animate-pulse p-4 card mb-6">
          <div className="h-5 w-40 bg-gray-200 rounded mb-5" />

          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 w-full bg-gray-200/60 rounded" />
            ))}
          </div>
        </div>

        {/* Table Skeleton */}

        <div className="table-section animate-pulse p-4 card">
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 w-44 bg-gray-200 rounded" />

            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>

          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 w-full bg-gray-200/60 rounded" />
            ))}
          </div>
        </div>
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

          <p className="text-h3 text-on-surface">
            Couldn't load your dashboard
          </p>

          <p className="text-body text-secondary">{loadError}</p>

          <button
            onClick={fetchData}
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
              <h1 id="dashboard-heading" className="text-h1">
                Dashboard Overview
              </h1>

              <p className="text-body">
                Real-time inventory and sales metrics.
              </p>
            </div>

            <div>
              <button
                className="btn-primary text-label-sm flex items-center gap-1"
                aria-label="Add new product to inventory"
              >
                <MdAdd size={20} aria-hidden="true" />
                Add Product
              </button>
            </div>
          </header>

          {/* ------------------------------------------------ */}
          {/* KPI Cards */}
          {/* ------------------------------------------------ */}

          <section aria-label="Key Performance Indicators" className="kpi-grid">
            {/* Total Products */}

            <article className="card">
              <div className="card-header">
                <div>
                  <h2 className="text-label-sm text-secondary uppercase">
                    Total Products
                  </h2>

                  <p className="text-h2 text-on-surface">
                    {productStats.totalProducts.toLocaleString()}
                  </p>
                </div>

                <div className="icon-box icon-box-tertiary" aria-hidden="true">
                  <MdInventory2 size={24} />
                </div>
              </div>

              <div className="trend-info">
                {productGrowth !== null ? (
                  <span
                    className={`badge-trend text-label-sm flex items-center gap-1 ${
                      productGrowth >= 0 ? "trend-up" : "trend-warning"
                    }`}
                  >
                    {productGrowth >= 0 ? (
                      <MdArrowUpward size={14} />
                    ) : (
                      <MdArrowDownward size={14} />
                    )}
                    {Math.abs(productGrowth)}%
                  </span>
                ) : (
                  <span className="text-label-sm text-secondary">
                    New catalog
                  </span>
                )}

                <span className="text-label-sm text-secondary">
                  vs last month
                </span>
              </div>
            </article>

            {/* Today's Sales */}

            <article className="card">
              <div className="card-header">
                <div>
                  <h2 className="text-label-sm text-secondary uppercase">
                    Today's Sales
                  </h2>

                  <p className="text-h2 text-on-surface">
                    {formatCurrency(orderStats.todaySales)}
                  </p>
                </div>

                <div className="icon-box icon-box-primary" aria-hidden="true">
                  <MdTrendingUp size={24} />
                </div>
              </div>

              <div className="trend-info">
                {salesGrowth !== null ? (
                  <span
                    className={`badge-trend text-label-sm flex items-center gap-1 ${
                      salesGrowth >= 0 ? "trend-up" : "trend-warning"
                    }`}
                  >
                    {salesGrowth >= 0 ? (
                      <MdArrowUpward size={14} />
                    ) : (
                      <MdArrowDownward size={14} />
                    )}
                    {Math.abs(salesGrowth)}%
                  </span>
                ) : (
                  <span className="text-label-sm text-secondary">
                    No sales yesterday
                  </span>
                )}

                <span className="text-label-sm text-secondary">
                  vs yesterday
                </span>
              </div>
            </article>

            {/* Low Stock */}

            <article className="card">
              <div className="card-header">
                <div>
                  <h2 className="text-label-sm text-secondary uppercase">
                    Low Stock Alerts
                  </h2>

                  <p className="text-h2 text-on-surface">
                    {productStats.lowStock.length}
                  </p>
                </div>

                <div className="icon-box icon-box-warning" aria-hidden="true">
                  <MdWarning size={24} />
                </div>
              </div>

              <div className="trend-info">
                <span className="badge-trend text-label-sm trend-warning flex items-center gap-1">
                  {productStats.outOfStockCount} out of stock
                </span>

                <span className="text-label-sm text-secondary">
                  needs action
                </span>
              </div>
            </article>

            {/* Monthly Revenue */}

            <article className="card">
              <div className="card-header">
                <div>
                  <h2 className="text-label-sm text-secondary uppercase">
                    Monthly Revenue
                  </h2>

                  <p className="text-h2 text-on-surface">
                    {formatCurrency(orderStats.monthRevenue)}
                  </p>
                </div>

                <div className="icon-box icon-box-tertiary" aria-hidden="true">
                  <MdAttachMoney size={24} />
                </div>
              </div>

              <div className="trend-info">
                {revenueGrowth !== null ? (
                  <span
                    className={`badge-trend text-label-sm flex items-center gap-1 ${
                      revenueGrowth >= 0 ? "trend-up" : "trend-warning"
                    }`}
                  >
                    {revenueGrowth >= 0 ? (
                      <MdArrowUpward size={14} />
                    ) : (
                      <MdArrowDownward size={14} />
                    )}
                    {Math.abs(revenueGrowth)}%
                  </span>
                ) : (
                  <span className="text-label-sm text-secondary">
                    No data last month
                  </span>
                )}

                <span className="text-label-sm text-secondary">
                  vs last month
                </span>
              </div>
            </article>
          </section>

          {/* ------------------------------------------------ */}
          {/* Charts */}
          {/* ------------------------------------------------ */}

          <section aria-label="Dashboard Charts" className="charts-grid">
            {/* Sales Trend */}

            <article className="card chart-container">
              <div className="chart-header">
                <div>
                  <h3 className="text-h3 text-on-surface">Sales Trend</h3>

                  <p className="text-label-sm text-secondary">
                    Revenue over last 7 days
                  </p>
                </div>

                <button
                  className="btn-icon"
                  aria-label="More options for Sales Trend chart"
                >
                  <MdMoreVert size={24} />
                </button>
              </div>

              <div
                className="chart-placeholder text-body"
                role="region"
                aria-label="Line chart displaying sales trend over the last 7 days"
                tabIndex={0}
                style={{
                  width: "100%",
                  height: "280px",
                }}
              >
                <table className="sr-only" aria-hidden="false">
                  <caption>Sales Revenue for the last 7 days</caption>

                  <thead>
                    <tr>
                      <th scope="col">Day</th>
                      <th scope="col">Revenue</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orderStats.salesTrendData.map((data, i) => (
                      <tr key={`${data.name}-${i}`}>
                        <td>{data.name}</td>
                        <td>${data.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={orderStats.salesTrendData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -20,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 12,
                        fill: "#4b5563",
                      }}
                    />

                    <YAxis
                      tick={{
                        fontSize: 12,
                        fill: "#4b5563",
                      }}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#1D4ED8"
                      strokeWidth={3}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>

            {/* Top Selling Products */}

            <article className="card chart-container">
              <div className="chart-header">
                <div>
                  <h3 className="text-h3 text-on-surface">
                    Top Selling Products
                  </h3>

                  <p className="text-label-sm text-secondary">
                    Units sold this month
                  </p>
                </div>

                <button
                  className="btn-icon"
                  aria-label="Filter Top Selling Products"
                >
                  <MdFilterList size={24} />
                </button>
              </div>

              <div
                className="chart-placeholder text-body"
                role="region"
                aria-label="Bar chart displaying the top selling products this month"
                tabIndex={0}
                style={{
                  width: "100%",
                  height: "280px",
                }}
              >
                <table className="sr-only" aria-hidden="false">
                  <caption>Units sold for top products this month</caption>

                  <thead>
                    <tr>
                      <th scope="col">Product Name</th>
                      <th scope="col">Units Sold</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orderStats.topProducts.map((data) => (
                      <tr key={data.name}>
                        <td>{data.name}</td>
                        <td>{data.units}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {orderStats.topProducts.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={orderStats.topProducts}
                      margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                      <XAxis
                        dataKey="name"
                        tick={{
                          fontSize: 12,
                          fill: "#4b5563",
                        }}
                      />

                      <YAxis
                        tick={{
                          fontSize: 12,
                          fill: "#4b5563",
                        }}
                      />

                      <Tooltip
                        cursor={{
                          fill: "#f3f4f6",
                        }}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />

                      <Bar
                        dataKey="units"
                        fill="#047857"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-secondary text-label-sm">
                    No sales recorded yet this month.
                  </div>
                )}
              </div>
            </article>
          </section>

          {/* ------------------------------------------------ */}
          {/* Latest Orders + Customers */}
          {/* ------------------------------------------------ */}

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Latest 4 Orders */}

            <article className="card lg:col-span-2">
              <div className="chart-header">
                <div>
                  <h3 className="text-h3 text-on-surface">Latest Orders</h3>

                  <p className="text-label-sm text-secondary">
                    Your 4 most recent orders
                  </p>
                </div>

                <Link
                  href="/order"
                  className="btn-link text-label-sm flex items-center gap-1"
                  aria-label="View all orders"
                >
                  View All
                  <MdArrowForward size={16} />
                </Link>
              </div>

              <div className="table-responsive [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <table className="data-table">
                  <thead>
                    <tr className="text-label-sm">
                      <th scope="col">Order</th>

                      <th scope="col">Customer</th>

                      <th scope="col" className="text-right">
                        Amount
                      </th>

                      <th scope="col" className="text-center">
                        Status
                      </th>

                      <th scope="col" className="text-right">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-body">
                    {latestOrders.length > 0 ? (
                      latestOrders.map((order, index) => {
                        const orderStatus =
                          order?.status || order?.orderStatus || "Pending";

                        const grandTotal =
                          Number(order?.financials?.grandTotal) ||
                          Number(order?.grandTotal) ||
                          0;

                        return (
                          <tr key={order?._id || order?.id || index}>
                            <td>
                              <div
                                style={{
                                  fontWeight: 600,
                                }}
                              >
                                #{String(getOrderId(order)).slice(-10)}
                              </div>
                            </td>

                            <td>
                              <div
                                style={{
                                  fontWeight: 500,
                                }}
                              >
                                {getOrderCustomerName(order)}
                              </div>
                            </td>

                            <td className="text-right">
                              {formatCurrency(grandTotal)}
                            </td>

                            <td className="text-center">
                              <span
                                className={`status-badge ${getOrderStatusClass(
                                  orderStatus,
                                )}`}
                              >
                                {orderStatus}
                              </span>
                            </td>

                            <td className="text-right text-secondary">
                              {formatDate(order?.createdAt)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center text-secondary"
                          style={{
                            padding: "2rem 0",
                          }}
                        >
                          No orders found yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            {/* Customers */}

            <article className="card">
              <div className="card-header">
                <div>
                  <h3 className="text-h3 text-on-surface">Customers</h3>

                  <p className="text-label-sm text-secondary">
                    Total registered customers
                  </p>
                </div>

                <div className="icon-box icon-box-primary" aria-hidden="true">
                  <MdPeople size={24} />
                </div>
              </div>

              <div className="mt-6">
                <p className="text-h1 text-on-surface">
                  {totalCustomers.toLocaleString()}
                </p>

                <p className="text-label-sm text-secondary mt-2">
                  Total Customers
                </p>
              </div>

              <div className="mt-6">
                <Link
                  href="/customers"
                  className="btn-link text-label-sm flex items-center gap-1"
                  aria-label="View all customers"
                >
                  View Customers
                  <MdArrowForward size={16} />
                </Link>
              </div>
            </article>
          </section>

          {/* ------------------------------------------------ */}
          {/* Offers */}
          {/* ------------------------------------------------ */}

          <section className="table-section mb-6">
            <header className="table-header">
              <div>
                <h3 id="offers-heading" className="text-h3 text-on-surface">
                  Current Offers
                </h3>

                <p className="text-label-sm text-secondary">
                  Offers currently available on your products.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="badge-trend text-label-sm trend-up flex items-center gap-1">
                  <MdLocalOffer size={14} />
                  {offerList.length} Offers
                </span>

                <Link
                  href="/offers"
                  className="btn-link text-label-sm flex items-center gap-1"
                  aria-label="View all offers"
                >
                  View All
                  <MdArrowForward size={16} />
                </Link>
              </div>
            </header>

            <div className="table-responsive [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table aria-labelledby="offers-heading" className="data-table">
                <thead>
                  <tr className="text-label-sm">
                    <th scope="col">Product</th>

                    <th scope="col">SKU</th>

                    <th scope="col">Offer</th>

                    <th scope="col" className="text-center">
                      Discount
                    </th>

                    <th scope="col" className="text-center">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="text-body">
                  {offerList.length > 0 ? (
                    offerList.slice(0, 8).map((offer) => {
                      const status = getOfferStatus(offer);

                      return (
                        <tr key={offer.offerKey}>
                          <td>
                            <div
                              style={{
                                fontWeight: 600,
                              }}
                            >
                              {offer.productName}
                            </div>
                          </td>

                          <td className="text-secondary">{offer.productSKU}</td>

                          <td>
                            <div
                              style={{
                                fontWeight: 500,
                              }}
                            >
                              {getOfferName(offer)}
                            </div>
                          </td>

                          <td className="text-center">
                            <span className="badge-trend text-label-sm trend-up">
                              {getOfferDiscount(offer)}
                            </span>
                          </td>

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
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center text-secondary"
                        style={{
                          padding: "2rem 0",
                        }}
                      >
                        No offers available right now.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ------------------------------------------------ */}
          {/* Low Stock Action Board */}
          {/* ------------------------------------------------ */}

          <section className="table-section">
            <header className="table-header">
              <div>
                <h3 id="low-stock-heading" className="text-h3 text-on-surface">
                  Low Stock Action Board
                </h3>

                <p className="text-label-sm text-secondary">
                  Items requiring immediate reorder.
                </p>
              </div>

              <button
                className="btn-link text-label-sm flex items-center gap-1"
                aria-label="View all low stock items"
              >
                View All
                <MdArrowForward size={16} />
              </button>
            </header>

            <div className="table-responsive [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table aria-labelledby="low-stock-heading" className="data-table">
                <thead>
                  <tr className="text-label-sm">
                    <th scope="col">SKU / Product</th>

                    <th scope="col">Category</th>

                    <th scope="col">Status</th>

                    <th scope="col" className="text-right">
                      Stock Lvl
                    </th>

                    <th scope="col" className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="text-body">
                  {productStats.lowStock.length > 0 ? (
                    productStats.lowStock.slice(0, 8).map((p) => {
                      const stock = Number(p.currentStock) || 0;

                      const minLevel = Number(p.lowStockAlert) || 0;

                      const isOut = stock <= 0;

                      return (
                        <tr key={p.id || p._id}>
                          <td>
                            <div
                              style={{
                                fontWeight: 600,
                              }}
                            >
                              {p.productSKU}
                            </div>

                            <div className="text-label-sm text-secondary">
                              {p.productName}
                            </div>
                          </td>

                          <td className="text-secondary">
                            {p.brandName || "—"}
                          </td>

                          <td>
                            <span
                              className={`status-badge ${
                                isOut ? "status-out" : "status-low"
                              }`}
                            >
                              {isOut ? "Out of Stock" : "Low Stock"}
                            </span>
                          </td>

                          <td className="text-right">
                            <div
                              className={isOut ? "text-error" : ""}
                              style={
                                !isOut
                                  ? {
                                      color: "#856404",
                                      fontWeight: 600,
                                    }
                                  : undefined
                              }
                              aria-label={`${stock} out of ${minLevel} minimum`}
                            >
                              {stock}{" "}
                              <span
                                className="text-secondary"
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 400,
                                }}
                                aria-hidden="true"
                              >
                                / {minLevel} min
                              </span>
                            </div>
                          </td>

                          <td className="text-center">
                            <button
                              className="btn-primary text-label-sm"
                              style={{
                                padding: "6px 12px",
                                margin: "0 auto",
                              }}
                              aria-label={`${
                                isOut ? "Urgent restock" : "Reorder"
                              } ${p.productName}`}
                            >
                              {isOut ? "Urgent Restock" : "Reorder"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center text-secondary"
                        style={{
                          padding: "2rem 0",
                        }}
                      >
                        Nothing needs restocking right now.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Page;
