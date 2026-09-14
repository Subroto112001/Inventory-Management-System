"use client";
import React, { useState, useEffect, useCallback } from "react";
import "../../globals.css";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdErrorOutline,
  MdRefresh,
  MdLocationOn,
} from "react-icons/md";
import Link from "next/link";

const WarehousePage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const response = await fetch("/api/warehouse", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load warehouses");
      }

      setWarehouses(data.warehouses || []);
    } catch (err) {
      setLoadError(
        err.message || "Something went wrong while loading the warehouse list.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div
        className="flex flex-row h-screen items-center justify-center bg-gray-50 dark:bg-gray-900"
        role="status"
        aria-live="polite"
      >
        <p className="text-base text-gray-800 dark:text-gray-200">
          Loading warehouse data...
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-row h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div
          className="flex flex-col items-center gap-3 text-center max-w-sm p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
          role="alert"
          aria-live="assertive"
        >
          <MdErrorOutline
            size={36}
            className="text-red-600 dark:text-red-400"
            aria-hidden="true"
          />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Couldn't load your warehouses
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-300">
            {loadError}
          </p>
          <button
            onClick={fetchData}
            className="mt-2 flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            aria-label="Retry loading warehouse data"
          >
            <MdRefresh size={16} aria-hidden="true" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-row h-full">
        <main
          className="flex-1 w-full p-6 lg:p-8 overflow-y-auto"
          id="main-content"
        >
          {/* Header Section */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1
                id="warehouse-heading"
                className="text-3xl font-bold text-gray-900 dark:text-white"
              >
                Warehouse Management
              </h1>
              <p className="mt-1 text-base text-gray-600 dark:text-gray-400">
                View, manage, and add new storage facilities to your inventory
                system.
              </p>
            </div>
            <div>
              <Link
                href="./addnew_warehouse"
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
                aria-label="Add a new warehouse facility"
              >
                <MdAdd size={20} aria-hidden="true" />
                Add Warehouse
              </Link>
            </div>
          </header>

          {/* Warehouse List Section */}
          <section
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            aria-labelledby="warehouse-list-heading"
          >
            <header className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2
                  id="warehouse-list-heading"
                  className="text-xl font-semibold text-gray-900 dark:text-white"
                >
                  Active Facilities
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  A complete roster of all registered warehouses.
                </p>
              </div>
            </header>

            <div className="overflow-x-auto w-full">
              <table
                aria-labelledby="warehouse-list-heading"
                className="w-full text-left border-collapse min-w-max"
              >
                <caption className="sr-only">
                  List of warehouses including name, code, location, capacity,
                  and status.
                </caption>
                <thead className="bg-gray-100 dark:bg-gray-900/50">
                  <tr className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                    <th scope="col" className="px-6 py-4">
                      Facility Info
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-4 text-right">
                      Capacity (sq ft)
                    </th>
                    <th scope="col" className="px-6 py-4 text-center">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-base text-gray-800 dark:text-gray-200 divide-y divide-gray-100 dark:divide-gray-800">
                  {warehouses.length > 0 ? (
                    warehouses.map((warehouse) => (
                      <tr
                        key={warehouse._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {warehouse.name}
                          </div>
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mt-0.5">
                            Code: {warehouse.warehouseCode}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                            <MdLocationOn
                              size={18}
                              aria-hidden="true"
                              className="text-gray-400"
                            />
                            <span>
                              {warehouse.location?.district},{" "}
                              {warehouse.location?.country}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium">
                          {warehouse.capacity
                            ? warehouse.capacity.toLocaleString()
                            : "—"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              warehouse.isActive
                                ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                                : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                            }`}
                          >
                            {warehouse.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:text-gray-400 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                              aria-label={`Edit details for ${warehouse.name}`}
                              title="Edit"
                            >
                              <MdEdit size={20} aria-hidden="true" />
                            </button>
                            <button
                              className="p-2 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 dark:text-red-400 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                              aria-label={`Delete ${warehouse.name}`}
                              title="Delete"
                            >
                              <MdDelete size={20} aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                      >
                        <p>No warehouses have been added yet.</p>
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

export default WarehousePage;
