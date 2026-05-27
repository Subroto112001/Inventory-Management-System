"use client"
import React from "react";
import Sidebar from "../Component/Sidebar";
import dashboard from "../css//Dashboard.css";
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
} from "react-icons/md";

// Accessible mock datasets for the charts
const salesTrendData = [
  { name: "Mon", revenue: 4000 },
  { name: "Tue", revenue: 3000 },
  { name: "Wed", revenue: 5000 },
  { name: "Thu", revenue: 2780 },
  { name: "Fri", revenue: 6890 },
  { name: "Sat", revenue: 8390 },
  { name: "Sun", revenue: 9490 },
];

const topProductsData = [
  { name: "Bearings", units: 1200 },
  { name: "Wiring", units: 900 },
  { name: "Boxes", units: 750 },
  { name: "Screws", units: 600 },
  { name: "Motors", units: 450 },
];

const page = () => {
  return (
    <div>
      <div className="flex flex-row h-screen">
        <main className="dashboard-main">
          {/* Header Section */}
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

          {/* KPI Cards Grid */}
          <section aria-label="Key Performance Indicators" className="kpi-grid">
            {/* Card 1: Total Products */}
            <article className="card">
              <div className="card-header">
                <div>
                  <h2 className="text-label-sm text-secondary uppercase">
                    Total Products
                  </h2>
                  <p className="text-h2 text-on-surface">12,450</p>
                </div>
                <div className="icon-box icon-box-tertiary" aria-hidden="true">
                  <MdInventory2 size={24} />
                </div>
              </div>
              <div className="trend-info">
                <span className="badge-trend text-label-sm trend-up flex items-center gap-1">
                  <MdArrowUpward size={14} aria-hidden="true" /> 4.2%
                </span>
                <span className="text-label-sm text-secondary">
                  vs last month
                </span>
              </div>
            </article>

            {/* Card 2: Today's Sales */}
            <article className="card">
              <div className="card-header">
                <div>
                  <h2 className="text-label-sm text-secondary uppercase">
                    Today's Sales
                  </h2>
                  <p className="text-h2 text-on-surface">$4,280</p>
                </div>
                <div className="icon-box icon-box-primary" aria-hidden="true">
                  <MdTrendingUp size={24} />
                </div>
              </div>
              <div className="trend-info">
                <span className="badge-trend text-label-sm trend-up flex items-center gap-1">
                  <MdArrowUpward size={14} aria-hidden="true" /> 12.5%
                </span>
                <span className="text-label-sm text-secondary">
                  vs yesterday
                </span>
              </div>
            </article>

            {/* Card 3: Low Stock Alerts */}
            <article className="card">
              <div className="card-header">
                <div>
                  <h2 className="text-label-sm text-secondary uppercase">
                    Low Stock Alerts
                  </h2>
                  <p className="text-h2 text-on-surface">24</p>
                </div>
                <div className="icon-box icon-box-warning" aria-hidden="true">
                  <MdWarning size={24} />
                </div>
              </div>
              <div className="trend-info">
                <span className="badge-trend text-label-sm trend-warning flex items-center gap-1">
                  <MdArrowDownward size={14} aria-hidden="true" /> 2 less
                </span>
                <span className="text-label-sm text-secondary">
                  needs action
                </span>
              </div>
            </article>

            {/* Card 4: Monthly Profit */}
            <article className="card">
              <div className="card-header">
                <div>
                  <h2 className="text-label-sm text-secondary uppercase">
                    Monthly Profit
                  </h2>
                  <p className="text-h2 text-on-surface">$82,400</p>
                </div>
                <div className="icon-box icon-box-tertiary" aria-hidden="true">
                  <MdAttachMoney size={24} />
                </div>
              </div>
              <div className="trend-info">
                <span className="badge-trend text-label-sm trend-up flex items-center gap-1">
                  <MdArrowUpward size={14} aria-hidden="true" /> 8.4%
                </span>
                <span className="text-label-sm text-secondary">
                  vs last month
                </span>
              </div>
            </article>
          </section>

          {/* Charts Section Placeholder */}
          <section aria-label="Dashboard Charts" className="charts-grid">
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
                  <MdMoreVert size={24} aria-hidden="true" />
                </button>
              </div>
              <div
                className="chart-placeholder text-body"
                role="region"
                aria-label="Line chart displaying sales trend over the last 7 days"
                tabIndex={0}
                style={{ width: "100%", height: "280px" }}
              >
                {/* Screen-reader hidden semantic fallback table for full A11y compliance */}
                <table className="sr-only" aria-hidden="false">
                  <caption>Sales Revenue for the last 7 days</caption>
                  <thead>
                    <tr>
                      <th scope="col">Day</th>
                      <th scope="col">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesTrendData.map((data) => (
                      <tr key={data.name}>
                        <td>{data.name}</td>
                        <td>${data.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  aria-hidden="true"
                >
                  <LineChart
                    data={salesTrendData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "#4b5563" }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "#4b5563" }} />
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
                  <MdFilterList size={24} aria-hidden="true" />
                </button>
              </div>
              <div
                className="chart-placeholder text-body"
                role="region"
                aria-label="Bar chart displaying the top selling products this month"
                tabIndex={0}
                style={{ width: "100%", height: "280px" }}
              >
                {/* Screen-reader hidden semantic fallback table for full A11y compliance */}
                <table className="sr-only" aria-hidden="false">
                  <caption>Units sold for top products this month</caption>
                  <thead>
                    <tr>
                      <th scope="col">Product Name</th>
                      <th scope="col">Units Sold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProductsData.map((data) => (
                      <tr key={data.name}>
                        <td>{data.name}</td>
                        <td>{data.units}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  aria-hidden="true"
                >
                  <BarChart
                    data={topProductsData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "#4b5563" }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "#4b5563" }} />
                    <Tooltip
                      cursor={{ fill: "#f3f4f6" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar dataKey="units" fill="#047857" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>

          {/* Bottom Section: Low Stock Table */}
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
                View All <MdArrowForward size={16} aria-hidden="true" />
              </button>
            </header>

            <div className="table-responsive">
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
                  <tr>
                    <td>
                      <div style={{ fontWeight: 600 }}>ITM-8492</div>
                      <div className="text-label-sm text-secondary">
                        Industrial Ball Bearings
                      </div>
                    </td>
                    <td className="text-secondary">Hardware</td>
                    <td>
                      <span className="status-badge status-low">Low Stock</span>
                    </td>
                    <td className="text-right">
                      <div
                        className="text-error"
                        aria-label="12 out of 50 minimum"
                      >
                        12{" "}
                        <span
                          className="text-secondary"
                          style={{ fontSize: "11px", fontWeight: 400 }}
                          aria-hidden="true"
                        >
                          / 50 min
                        </span>
                      </div>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn-primary text-label-sm"
                        style={{ padding: "6px 12px", margin: "0 auto" }}
                        aria-label="Reorder Industrial Ball Bearings"
                      >
                        Reorder
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div style={{ fontWeight: 600 }}>ELC-201A</div>
                      <div className="text-label-sm text-secondary">
                        Copper Wiring Spool (50m)
                      </div>
                    </td>
                    <td className="text-secondary">Electrical</td>
                    <td>
                      <span className="status-badge status-out">
                        Out of Stock
                      </span>
                    </td>
                    <td className="text-right">
                      <div
                        className="text-error"
                        aria-label="0 out of 20 minimum"
                      >
                        0{" "}
                        <span
                          className="text-secondary"
                          style={{ fontSize: "11px", fontWeight: 400 }}
                          aria-hidden="true"
                        >
                          / 20 min
                        </span>
                      </div>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn-primary text-label-sm"
                        style={{ padding: "6px 12px", margin: "0 auto" }}
                        aria-label="Urgent Restock Copper Wiring Spool"
                      >
                        Urgent Restock
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div style={{ fontWeight: 600 }}>PKG-994</div>
                      <div className="text-label-sm text-secondary">
                        Heavy Duty Corrugated Boxes
                      </div>
                    </td>
                    <td className="text-secondary">Packaging</td>
                    <td>
                      <span className="status-badge status-low">Low Stock</span>
                    </td>
                    <td className="text-right">
                      <div
                        style={{ color: "#856404", fontWeight: 600 }}
                        aria-label="45 out of 100 minimum"
                      >
                        45{" "}
                        <span
                          className="text-secondary"
                          style={{ fontSize: "11px", fontWeight: 400 }}
                          aria-hidden="true"
                        >
                          / 100 min
                        </span>
                      </div>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn-primary text-label-sm"
                        style={{ padding: "6px 12px", margin: "0 auto" }}
                        aria-label="Reorder Heavy Duty Corrugated Boxes"
                      >
                        Reorder
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default page;
