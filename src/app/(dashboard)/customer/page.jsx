"use client";

import React, { useState, useMemo } from "react";
import {
  MdSearch,
  MdAdd,
  MdEdit,
  MdDelete,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdReceiptLong,
} from "react-icons/md";

// প্রাথমিক কাস্টমার ডেটা (অর্ডার হিস্ট্রি সহ)
const INITIAL_CUSTOMERS = [
  {
    id: 1,
    name: "John Smith",
    initials: "JS",
    phone: "(555) 123-4567",
    orders: [
      {
        id: "#ORD-101",
        date: "Oct 24, 2023",
        amount: "$120.00",
        status: "Completed",
      },
      {
        id: "#ORD-089",
        date: "Sep 12, 2023",
        amount: "$450.50",
        status: "Completed",
      },
    ],
  },
  {
    id: 2,
    name: "Emily Johnson",
    initials: "EJ",
    phone: "(555) 987-6543",
    orders: [
      {
        id: "#ORD-102",
        date: "Oct 25, 2023",
        amount: "$85.00",
        status: "Pending",
      },
    ],
  },
  {
    id: 3,
    name: "Michael Davis",
    initials: "MD",
    phone: "(555) 555-0192",
    orders: [],
  },
  {
    id: 4,
    name: "Sarah Williams",
    initials: "SW",
    phone: "(555) 321-7654",
    orders: [
      {
        id: "#ORD-095",
        date: "Oct 10, 2023",
        amount: "$1,200.00",
        status: "Completed",
      },
      {
        id: "#ORD-092",
        date: "Oct 05, 2023",
        amount: "$340.00",
        status: "Cancelled",
      },
      {
        id: "#ORD-081",
        date: "Aug 22, 2023",
        amount: "$65.00",
        status: "Completed",
      },
    ],
  },
  {
    id: 5,
    name: "David Brown",
    initials: "DB",
    phone: "(555) 888-2345",
    orders: [
      {
        id: "#ORD-105",
        date: "Oct 28, 2023",
        amount: "$210.00",
        status: "Completed",
      },
    ],
  },
];

export default function CustomerManagement() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    name: "",
    phone: "",
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    customerId: null,
  });
  const [editModal, setEditModal] = useState({ isOpen: false, data: null });
  const [ordersModal, setOrdersModal] = useState({
    isOpen: false,
    customer: null,
  });

  // সার্চ ফিল্টারিং লজিক
  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(lowerCaseQuery) ||
        customer.phone.includes(searchQuery),
    );
  }, [searchQuery, customers]);

  // --- Add Handlers ---
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();

    // নতুন কাস্টমারের জন্য ইউনিক আইডি এবং ইনিশিয়ালস তৈরি করা
    const newId =
      customers.length > 0 ? Math.max(...customers.map((c) => c.id)) + 1 : 1;
    const initials =
      newCustomerData.name
        .split(" ")
        .filter((n) => n.length > 0)
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase() || "C";

    const newCustomer = {
      id: newId,
      name: newCustomerData.name,
      initials: initials,
      phone: newCustomerData.phone,
      orders: [], // নতুন কাস্টমারের কোনো অর্ডার হিস্ট্রি থাকবে না
    };

    // নতুন কাস্টমারকে টেবিলের শুরুতে যুক্ত করা
    setCustomers([newCustomer, ...customers]);

    // ফর্ম রিসেট এবং মোডাল বন্ধ করা
    setNewCustomerData({ name: "", phone: "" });
    setIsAddModalOpen(false);
  };

  // --- Delete Handlers ---
  const handleDeleteConfirm = () => {
    setCustomers(customers.filter((c) => c.id !== deleteModal.customerId));
    setDeleteModal({ isOpen: false, customerId: null });
  };

  // --- Edit Handlers ---
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditModal((prev) => ({
      ...prev,
      data: { ...prev.data, [name]: value },
    }));
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    setCustomers(
      customers.map((c) =>
        c.id === editModal.data.id
          ? {
              ...c,
              name: editModal.data.name,
              phone: editModal.data.phone,
              initials:
                editModal.data.name
                  .split(" ")
                  .filter((n) => n.length > 0)
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase() || "C",
            }
          : c,
      ),
    );
    setEditModal({ isOpen: false, data: null });
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
              {customers.length}
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
            placeholder="Search by name or phone..."
            className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500"
          />
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
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
                  className="py-4 px-6 text-xs text-gray-500 uppercase tracking-wider font-semibold text-center"
                >
                  Total Orders
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
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full bg-[#F3EBF4] flex items-center justify-center text-[#6C1B7B] font-bold border border-[#e4d1e8]"
                          aria-hidden="true"
                        >
                          {customer.initials}
                        </div>
                        <span className="font-semibold">{customer.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {customer.phone}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() =>
                          setOrdersModal({ isOpen: true, customer })
                        }
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#6C1B7B]/10 text-[#6C1B7B] font-semibold rounded-full hover:bg-[#6C1B7B]/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C1B7B]"
                        aria-label={`View ${customer.orders.length} orders for ${customer.name}`}
                      >
                        <MdReceiptLong className="text-lg" aria-hidden="true" />
                        {customer.orders.length} Orders
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            setEditModal({
                              isOpen: true,
                              data: { ...customer },
                            })
                          }
                          className="p-2 text-gray-500 hover:text-[#6C1B7B] hover:bg-[#F3EBF4] rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C1B7B]"
                          title={`Edit ${customer.name}`}
                          aria-label={`Edit ${customer.name}`}
                        >
                          <MdEdit className="text-xl" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteModal({
                              isOpen: true,
                              customerId: customer.id,
                            })
                          }
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-600"
                          title={`Delete ${customer.name}`}
                          aria-label={`Delete ${customer.name}`}
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
                      No results found
                    </p>
                    <p className="text-sm mt-1">
                      We couldn't find any customers matching "{searchQuery}"
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
              className="w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 font-medium flex items-center justify-center transition-all duration-300"
              aria-label="Page 2"
            >
              2
            </button>
            <button
              className="w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 font-medium flex items-center justify-center transition-all duration-300"
              aria-label="Page 3"
            >
              3
            </button>
            <span className="text-gray-400 px-1" aria-hidden="true">
              ...
            </span>
            <button
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Next page"
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
                  setNewCustomerData({ name: "", phone: "" });
                }}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Close add modal"
              >
                <MdClose className="text-2xl" aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label
                    htmlFor="add-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="add-name"
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. Robert Fox"
                    value={newCustomerData.name}
                    onChange={handleAddChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="add-phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    id="add-phone"
                    name="phone"
                    type="text"
                    required
                    placeholder="e.g. (555) 012-3456"
                    value={newCustomerData.phone}
                    onChange={handleAddChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setNewCustomerData({ name: "", phone: "" });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#6C1B7B] rounded-lg hover:bg-[#52135d] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#6C1B7B] transition-colors"
                >
                  Add Customer
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
                cannot be undone and will remove their order history.
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
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                Delete
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
                <div>
                  <label
                    htmlFor="edit-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="edit-name"
                    name="name"
                    type="text"
                    required
                    value={editModal.data.name}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:border-transparent text-gray-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    id="edit-phone"
                    name="phone"
                    type="text"
                    required
                    value={editModal.data.phone}
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
                  className="px-4 py-2 text-sm font-medium text-white bg-[#6C1B7B] rounded-lg hover:bg-[#52135d] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#6C1B7B] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. View Orders Modal */}
      {ordersModal.isOpen && ordersModal.customer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="orders-dialog-title"
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <div>
                <h2
                  id="orders-dialog-title"
                  className="text-xl font-bold text-gray-900"
                >
                  Order History
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Customer:{" "}
                  <span className="font-semibold text-gray-900">
                    {ordersModal.customer.name}
                  </span>
                </p>
              </div>
              <button
                onClick={() =>
                  setOrdersModal({ isOpen: false, customer: null })
                }
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors focus:outline-none"
                aria-label="Close orders modal"
              >
                <MdClose className="text-2xl" aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              {ordersModal.customer.orders.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-sm text-gray-500">
                      <th scope="col" className="pb-3 font-semibold">
                        Order ID
                      </th>
                      <th scope="col" className="pb-3 font-semibold">
                        Date
                      </th>
                      <th scope="col" className="pb-3 font-semibold">
                        Amount
                      </th>
                      <th scope="col" className="pb-3 font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-900">
                    {ordersModal.customer.orders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="py-4 font-medium text-[#6C1B7B]">
                          {order.id}
                        </td>
                        <td className="py-4 text-gray-600">{order.date}</td>
                        <td className="py-4 font-semibold">{order.amount}</td>
                        <td className="py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${
                              order.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : order.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                    <MdReceiptLong className="text-3xl" aria-hidden="true" />
                  </div>
                  <p className="text-gray-900 font-medium">
                    No order history found
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    This customer hasn't placed any orders yet.
                  </p>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() =>
                  setOrdersModal({ isOpen: false, customer: null })
                }
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
