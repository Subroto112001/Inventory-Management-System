import React from 'react'
import Sidebar from './Component/Sidebar'
import dashboard from "../css//Dashboard.css"
const page = () => {
  return (
    <div>
      <div className="flex flex-row h-screen">
        {/* left side sidebar */}
        <div className="w-[%]">
          <Sidebar />
        </div>
        {/* main content */}
        <div className="w-[80%]">
          {" "}
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
                  className="btn-primary text-label-sm"
                  aria-label="Add new product to inventory"
                >
                  <span
                    className="material-symbols-outlined"
                    aria-hidden="true"
                  >
                    add
                  </span>
                  Add Product
                </button>
              </div>
            </header>

            {/* KPI Cards Grid */}
            <section
              aria-label="Key Performance Indicators"
              className="kpi-grid"
            >
              {/* Card 1: Total Products */}
              <article className="card">
                <div className="card-header">
                  <div>
                    <h2 className="text-label-sm text-secondary uppercase">
                      Total Products
                    </h2>
                    <p className="text-h2 text-on-surface">12,450</p>
                  </div>
                  <div
                    className="icon-box icon-box-tertiary"
                    aria-hidden="true"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      package_2
                    </span>
                  </div>
                </div>
                <div className="trend-info">
                  <span className="badge-trend text-label-sm trend-up">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                      aria-hidden="true"
                    >
                      arrow_upward
                    </span>{" "}
                    4.2%
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
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      trending_up
                    </span>
                  </div>
                </div>
                <div className="trend-info">
                  <span className="badge-trend text-label-sm trend-up">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                      aria-hidden="true"
                    >
                      arrow_upward
                    </span>{" "}
                    12.5%
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
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      warning
                    </span>
                  </div>
                </div>
                <div className="trend-info">
                  <span className="badge-trend text-label-sm trend-warning">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                      aria-hidden="true"
                    >
                      arrow_downward
                    </span>{" "}
                    2 less
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
                  <div
                    className="icon-box icon-box-tertiary"
                    aria-hidden="true"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      attach_money
                    </span>
                  </div>
                </div>
                <div className="trend-info">
                  <span className="badge-trend text-label-sm trend-up">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                      aria-hidden="true"
                    >
                      arrow_upward
                    </span>{" "}
                    8.4%
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
                    <span
                      className="material-symbols-outlined"
                      aria-hidden="true"
                    >
                      more_vert
                    </span>
                  </button>
                </div>
                <div className="chart-placeholder text-body" aria-hidden="true">
                  [Chart Area]
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
                    <span
                      className="material-symbols-outlined"
                      aria-hidden="true"
                    >
                      filter_list
                    </span>
                  </button>
                </div>
                <div className="chart-placeholder text-body" aria-hidden="true">
                  [Chart Area]
                </div>
              </article>
            </section>

            {/* Bottom Section: Low Stock Table */}
            <section className="table-section">
              <header className="table-header">
                <div>
                  <h3
                    id="low-stock-heading"
                    className="text-h3 text-on-surface"
                  >
                    Low Stock Action Board
                  </h3>
                  <p className="text-label-sm text-secondary">
                    Items requiring immediate reorder.
                  </p>
                </div>
                <button
                  className="btn-link text-label-sm"
                  aria-label="View all low stock items"
                >
                  View All{" "}
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "16px" }}
                    aria-hidden="true"
                  >
                    arrow_forward
                  </span>
                </button>
              </header>

              <div className="table-responsive">
                <table
                  aria-labelledby="low-stock-heading"
                  className="data-table"
                >
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
                        <span className="status-badge status-low">
                          Low Stock
                        </span>
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
                        <span className="status-badge status-low">
                          Low Stock
                        </span>
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
    </div>
  );
}

export default page