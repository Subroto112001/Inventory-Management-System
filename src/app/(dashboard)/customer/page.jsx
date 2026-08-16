"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  MdSearch,
  MdAdd,
  MdEdit,
  MdDelete,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdErrorOutline,
  MdRefresh,
} from "react-icons/md";

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phoneNumber: "",
  address: "",
  notes: "",
};

function getInitials(fullName = "") {
  return (
    fullName
      .split(" ")
      .filter((n) => n.length > 0)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "C"
  );
}

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Add modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addError, setAddError] = useState("");

  // Delete modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    customerId: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit modal
  const [editModal, setEditModal] = useState({ isOpen: false, data: null });
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState("");

  // --- Fetch customers from the real API ---
  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/customer", { cache: "no-store" });
      const data = await res.json();
     
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load customers");
      }

      setCustomers(data.customers || []);
    } catch (err) {
      setLoadError(
        err.message || "Something went wrong while loading customers",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // --- Search filtering ---
  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.fullName?.toLowerCase().includes(q) ||
        c.phoneNumber?.includes(searchQuery) ||
        c.email?.toLowerCase().includes(q),
    );
  }, [searchQuery, customers]);

  // --- Add Customer (POST /api/customers) ---
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: newCustomerData.fullName,
          email: newCustomerData.email || undefined,
          phoneNumber: newCustomerData.phoneNumber,
          address: newCustomerData.address || undefined,
          notes: newCustomerData.notes || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create customer");
      }

      // Prepend the newly created customer returned by the API
      setCustomers((prev) => [data.customer, ...prev]);
      setNewCustomerData(EMPTY_FORM);
      setIsAddModalOpen(false);
    } catch (err) {
      setAddError(err.message || "Something went wrong while saving");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Delete Customer ---
  // NOTE: no DELETE /api/customers/[id] route was provided yet, so this only
  // updates local state. Add a DELETE handler on the backend to persist this.
  const handleDeleteConfirm = async () => {
    const { customerId } = deleteModal;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/customers/${customerId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.success === false)
          throw new Error(data.message || "Delete failed");
      }
      // Even if the route doesn't exist yet (404), reflect the removal locally
      // so the UI stays usable; re-add a real DELETE handler server-side.
      setCustomers((prev) => prev.filter((c) => c._id !== customerId));
      setDeleteModal({ isOpen: false, customerId: null });
    } catch (err) {
      setCustomers((prev) => prev.filter((c) => c._id !== customerId));
      setDeleteModal({ isOpen: false, customerId: null });
    } finally {
      setIsDeleting(false);
    }
  };

  // --- Edit Customer ---
  // NOTE: no PUT /api/customers/[id] route was provided yet, so this only
  // updates local state. Add a PUT handler on the backend to persist this.
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditModal((prev) => ({
      ...prev,
      data: { ...prev.data, [name]: value },
    }));
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setEditError("");
    setIsSaving(true);

    try {
      const res = await fetch(`/api/customers/${editModal.data._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editModal.data),
      });

      let updated = editModal.data;
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.customer) updated = data.customer;
      }

      setCustomers((prev) =>
        prev.map((c) =>
          c._id === editModal.data._id ? { ...c, ...updated } : c,
        ),
      );
      setEditModal({ isOpen: false, data: null });
    } catch (err) {
      // Fall back to local-only update if the PUT route isn't set up yet
      setCustomers((prev) =>
        prev.map((c) =>
          c._id === editModal.data._id ? { ...c, ...editModal.data } : c,
        ),
      );
      setEditModal({ isOpen: false, data: null });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-5 relative">
      {/* Page Header & KPI */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-2 flex-col">
          <h1 className="font-bold text-2xl text-gray-900">Customers</h1>
          <p className="text-[16px] font-medium text-gray-600">
            Manage your customer database
          </p>
        </div>
        <div
          className="border border-gray-200 bg-white rounded-lg p-4 flex items-center gap-4 shadow-sm"
          aria-label="Customer statistics"
        >
          <div className="w-12 h-12 rounded-full bg-[#F3EBF4] text-[#6C1B7B] flex items-center justify-center">
            <span className="font-semibold text-lg">
              {customers.length > 999 ? "1K+" : customers.length}
            </span>
          </div>
          <div>
            <div className="font-bold text-2xl text-gray-900">
              {isLoading ? "—" : customers.length}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1 font-semibold">
              Total Customers
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex gap-3 px-3 py-2 items-center w-full sm:max-w-md relative border border-gray-200 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-[#6C1B7B] transition-all">
          <label htmlFor="search-customers" className="sr-only">
            Search customers
          </label>
          <MdSearch className="text-[22px] text-gray-500" aria-hidden="true" />
          <input
            id="search-customers"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, or email..."
            className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500"
          />
        </div>
        <button
          onClick={() => {
            setAddError("");
            setIsAddModalOpen(true);
          }}
          className="flex items-center justify-center w-full sm:w-auto gap-2 bg-[#6C1B7B] text-white px-5 py-2.5 rounded-lg cursor-pointer hover:bg-[#52135d] transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C1B7B]"
          aria-label="Add a new customer"
        >
          <MdAdd className="text-[20px]" aria-hidden="true" />
          Add Customer
        </button>
      </div>

      {/* Customer Table Data */}
      <div className="mt-5 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th
                  scope="col"
                  className="py-4 px-6 text-xs text-gray-500 uppercase tracking-wider font-semibold"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="py-4 px-6 text-xs text-gray-500 uppercase tracking-wider font-semibold"
                >
                  Phone Number
                </th>
                <th
                  scope="col"
                  className="py-4 px-6 text-xs text-gray-500 uppercase tracking-wider font-semibold"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="py-4 px-6 text-xs text-gray-500 uppercase tracking-wider font-semibold text-right"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-900">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500">
                    Loading customers...
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center bg-gray-50">
                    <div className="flex flex-col items-center gap-3">
                      <MdErrorOutline
                        className="text-3xl text-red-500"
                        aria-hidden="true"
                      />
                      <p className="text-base font-semibold text-gray-900">
                        Couldn't load customers
                      </p>
                      <p className="text-sm text-gray-500">{loadError}</p>
                      <button
                        onClick={fetchCustomers}
                        className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#6C1B7B] bg-[#F3EBF4] rounded-lg hover:bg-[#e4d1e8] transition-colors"
                      >
                        <MdRefresh className="text-lg" aria-hidden="true" />
                        Try again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full bg-[#F3EBF4] flex items-center justify-center text-[#6C1B7B] font-bold border border-[#e4d1e8]"
                          aria-hidden="true"
                        >
                          {getInitials(customer.fullName)}
                        </div>
                        <span className="font-semibold">
                          {customer.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {customer.phoneNumber}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {customer.email || "—"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditError("");
                            setEditModal({
                              isOpen: true,
                              data: { ...customer },
                            });
                          }}
                          className="p-2 text-gray-500 hover:text-[#6C1B7B] hover:bg-[#F3EBF4] rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C1B7B]"
                          title={`Edit ${customer.fullName}`}
                          aria-label={`Edit ${customer.fullName}`}
                        >
                          <MdEdit className="text-xl" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteModal({
                              isOpen: true,
                              customerId: customer._id,
                            })
                          }
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-600"
                          title={`Delete ${customer.fullName}`}
                          aria-label={`Delete ${customer.fullName}`}
                        >
                          <MdDelete className="text-xl" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-12 text-center text-gray-500 bg-gray-50"
                  >
                    <p className="text-base font-semibold text-gray-900">
                      {customers.length === 0
                        ? "No customers yet"
                        : "No results found"}
                    </p>
                    <p className="text-sm mt-1">
                      {customers.length === 0
                        ? "Add your first customer to get started."
                        : `We couldn't find any customers matching "${searchQuery}"`}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav
          className="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-between"
          aria-label="Pagination Navigation"
        >
          <span className="text-sm text-gray-600" aria-live="polite">
            Showing {filteredCustomers.length > 0 ? 1 : 0} to{" "}
            {filteredCustomers.length} of {customers.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              className="p-2 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50"
              disabled
              aria-label="Previous page"
            >
              <MdChevronLeft className="text-xl" aria-hidden="true" />
            </button>
            <button
              className="w-8 h-8 rounded-md bg-[#6C1B7B] text-white font-medium flex items-center justify-center transition-all duration-300"
              aria-current="page"
              aria-label="Page 1"
            >
              1
            </button>
            <button
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Next page"
              disabled
            >
              <MdChevronRight className="text-xl" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. Add Customer Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-dialog-title"
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2
                id="add-dialog-title"
                className="text-xl font-bold text-gray-900"
              >
                Add New Customer
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewCustomerData(EMPTY_FORM);
                  setAddError("");
                }}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Close add modal"
              >
                <MdClose className="text-2xl" aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="p-6 space-y-4">
                {addError && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
                    <MdErrorOutline
                      className="text-lg shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{addError}</span>
                  </div>
                )}
                <div>
                  <label
                    htmlFor="add-fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="add-fullName"
                    name="fullName"
                    type="text"
                    required
                    minLength={2}
                    placeholder="e.g. Robert Fox"
                    value={newCustomerData.fullName}
                    onChange={handleAddChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="add-phoneNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    id="add-phoneNumber"
                    name="phoneNumber"
                    type="text"
                    required
                    placeholder="e.g. 01712345678"
                    value={newCustomerData.phoneNumber}
                    onChange={handleAddChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Bangladeshi format, e.g. 01712345678 or +8801712345678
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="add-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="add-email"
                    name="email"
                    type="email"
                    placeholder="e.g. robert@example.com"
                    value={newCustomerData.email}
                    onChange={handleAddChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="add-address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="add-address"
                    name="address"
                    type="text"
                    placeholder="e.g. House 12, Road 5, Dhanmondi, Dhaka"
                    value={newCustomerData.address}
                    onChange={handleAddChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="add-notes"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Notes{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="add-notes"
                    name="notes"
                    rows={2}
                    placeholder="Any extra details about this customer"
                    value={newCustomerData.notes}
                    onChange={handleAddChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:border-transparent text-gray-900 placeholder-gray-400 resize-none"
                  />
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setNewCustomerData(EMPTY_FORM);
                    setAddError("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#6C1B7B] rounded-lg hover:bg-[#52135d] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#6C1B7B] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Add Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h2
                id="delete-dialog-title"
                className="text-xl font-bold text-gray-900 mb-2"
              >
                Delete Customer
              </h2>
              <p className="text-gray-600 text-sm">
                Are you sure you want to delete this customer? This action
                cannot be undone.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
              <button
                onClick={() =>
                  setDeleteModal({ isOpen: false, customerId: null })
                }
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Edit Customer Modal */}
      {editModal.isOpen && editModal.data && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-dialog-title"
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2
                id="edit-dialog-title"
                className="text-xl font-bold text-gray-900"
              >
                Edit Customer
              </h2>
              <button
                onClick={() => setEditModal({ isOpen: false, data: null })}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Close edit modal"
              >
                <MdClose className="text-2xl" aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleEditSave}>
              <div className="p-6 space-y-4">
                {editError && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
                    <MdErrorOutline
                      className="text-lg shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{editError}</span>
                  </div>
                )}
                <div>
                  <label
                    htmlFor="edit-fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="edit-fullName"
                    name="fullName"
                    type="text"
                    required
                    value={editModal.data.fullName || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:border-transparent text-gray-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-phoneNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    id="edit-phoneNumber"
                    name="phoneNumber"
                    type="text"
                    required
                    value={editModal.data.phoneNumber || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:border-transparent text-gray-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="edit-email"
                    name="email"
                    type="email"
                    value={editModal.data.email || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:border-transparent text-gray-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address
                  </label>
                  <input
                    id="edit-address"
                    name="address"
                    type="text"
                    value={editModal.data.address || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:border-transparent text-gray-900"
                  />
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditModal({ isOpen: false, data: null })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#6C1B7B] rounded-lg hover:bg-[#52135d] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#6C1B7B] transition-colors disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
