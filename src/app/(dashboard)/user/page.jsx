"use client";
import React, { useState, useEffect } from "react";
import {
  MdPersonAdd,
  MdPeople,
  MdAdminPanelSettings,
  MdWarehouse,
  MdFilterList,
  MdSearch,
  MdEdit,
  MdDeleteOutline,
  MdArrowUpward,
  MdClose,
} from "react-icons/md";

const defaultFormState = {
  name: "",
  email: "",
  role: "Inventory Clerk",
  department: "Operations",
  status: "Active",
  phoneNumber: "",
  jobTitle: "",
  assignedWarehouse: "",
};

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState(defaultFormState);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // প্রথমবার লোডে ইউজার ও ওয়্যারহাউজ লিস্ট আনা হচ্ছে
  useEffect(() => {
    fetchUsers();
    fetchWarehouses();
  }, []);

  // user will fetch there
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/adduser");
      const data = await res.json();
      console.log("Fetched users:", data.users);
      if (res.ok) setUsers(data.users);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  // warehouse will fetch there
  const fetchWarehouses = async () => {
    try {
      const res = await fetch("/api/warehouses");
      const data = await res.json();
      if (res.ok) setWarehouses(data.warehouses || []);
    } catch (err) {
      console.error("Failed to load warehouses:", err);
    }
  };

  // modal open and close function
  const handleOpenAddModal = () => {
    setEditingUserId(null);
    setFormData(defaultFormState);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
      phoneNumber: user.phoneNumber || "",
      jobTitle: user.jobTitle || "",
      assignedWarehouse: user.assignedWarehouse || "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUserId(null);
    setFormData(defaultFormState);
    setFormError("");
  };

  // form input change and submit function
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // form submit function for add and edit user
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      if (editingUserId) {
        // PUT /api/adduser/[id]
        const res = await fetch(`/api/adduser/${editingUserId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (!res.ok) {
          setFormError(data.message || "একটা সমস্যা হয়েছে");
          setSubmitting(false);
          return;
        }

        setUsers(
          users.map((user) => (user.id === editingUserId ? data.user : user)),
        );
      } else {
        const res = await fetch("/api/adduser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (!res.ok) {
          setFormError(data.message || "একটা সমস্যা হয়েছে");
          setSubmitting(false);
          return;
        }

        setUsers([data.user, ...users]);
      }

      handleCloseModal();
    } catch (err) {
      setFormError("সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete বাটনে ক্লিক করলে শুধু কনফার্মেশন পপ-আপ খুলবে
  const handleDeleteUser = (user) => {
    setDeleteTarget(user);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return;
    setDeleteTarget(null);
  };

  // পপ-আপের ভেতরের Delete বাটনে ক্লিক করলে আসল ডিলিট রিকোয়েস্ট যাবে
  const confirmDeleteUser = async () => {
    if (!deleteTarget) return;

    const id = deleteTarget.id;
    setDeleting(true);

    try {
      const res = await fetch(`/api/adduser/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "User delete করা যায়নি");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setDeleteTarget(null);
    } catch (err) {
      alert("সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans relative">
      <div className="flex flex-row h-screen">
        <main
          className="flex-1 p-6 md:p-8 overflow-y-auto"
          aria-hidden={isModalOpen || deleteTarget ? "true" : "false"}
        >
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1
                id="users-heading"
                className="text-2xl font-bold text-gray-900"
              >
                User Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage system access, roles, and permissions across departments.
              </p>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm transition-all">
                <MdSearch
                  size={20}
                  className="text-gray-500"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Search users..."
                  className="border-none outline-none text-sm text-gray-900 ml-2 w-full md:w-48 bg-transparent"
                  aria-label="Search users by name, email, or role"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-[#611F69] border border-[#611F69] hover:bg-transparent hover:text-[#611F69] cursor-pointer text-white text-sm font-medium rounded-md shadow-sm transition-all "
                aria-label="Open form to add a new user"
                aria-haspopup="dialog"
              >
                <MdPersonAdd size={20} aria-hidden="true" />
                Add User
              </button>
            </div>
          </header>

          {/* KPI Cards */}
          <section
            aria-label="User Statistics Overview"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Total Users
                  </h2>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {users.length}
                  </p>
                </div>
                <div
                  className="p-3 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center"
                  aria-hidden="true"
                >
                  <MdPeople size={24} />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  <MdArrowUpward size={14} aria-hidden="true" /> Active Now
                </span>
              </div>
            </article>

            <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    System Admins
                  </h2>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {users.filter((u) => u.role === "System Admin").length}
                  </p>
                </div>
                <div
                  className="p-3 bg-amber-100 text-amber-900 rounded-lg flex items-center justify-center"
                  aria-hidden="true"
                >
                  <MdAdminPanelSettings size={24} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-sm text-gray-600">
                  Full system access
                </span>
              </div>
            </article>

            <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Warehouse Staff
                  </h2>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {
                      users.filter(
                        (u) =>
                          u.department === "Logistics" ||
                          u.department === "Operations",
                      ).length
                    }
                  </p>
                </div>
                <div
                  className="p-3 bg-emerald-100 text-emerald-800 rounded-lg flex items-center justify-center"
                  aria-hidden="true"
                >
                  <MdWarehouse size={24} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-sm text-gray-600">
                  Logistics & Operations
                </span>
              </div>
            </article>
          </section>

          {/* Users Table */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <header className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3
                  id="directory-heading"
                  className="text-lg font-semibold text-gray-900"
                >
                  User Directory
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  All registered personnel and their current status.
                </p>
              </div>
              <button
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-label="Filter user directory"
              >
                <MdFilterList size={24} aria-hidden="true" />
              </button>
            </header>

            <div className="overflow-x-auto w-full">
              <table
                aria-labelledby="directory-heading"
                className="w-full text-left border-collapse"
              >
                <caption className="sr-only">
                  Comprehensive list of system users including roles and status
                </caption>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-semibold text-gray-800 uppercase tracking-wider"
                    >
                      Employee
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-semibold text-gray-800 uppercase tracking-wider"
                    >
                      Role / Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-semibold text-gray-800 uppercase tracking-wider"
                    >
                      Department
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-semibold text-gray-800 uppercase tracking-wider"
                    >
                      Phone
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-semibold text-gray-800 uppercase tracking-wider text-center"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-semibold text-gray-800 uppercase tracking-wider text-right"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-800">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        লোড হচ্ছে...
                      </td>
                    </tr>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-gray-600 mt-0.5">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-800">
                            {user.role}
                          </div>
                          {user.jobTitle && (
                            <div className="text-gray-500 text-xs mt-0.5">
                              {user.jobTitle}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {user.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {user.phoneNumber || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-900"
                                : user.status === "Suspended"
                                  ? "bg-red-100 text-red-900"
                                  : "bg-gray-200 text-gray-900"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(user)}
                              className="p-1.5 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
                              aria-label={`Edit details for ${user.name}`}
                            >
                              <MdEdit size={20} aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="p-1.5 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-600"
                              aria-label={`Remove user ${user.name}`}
                            >
                              <MdDeleteOutline size={20} aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No users found matching "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        {/* Add / Edit User Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2
                  id="modal-title"
                  className="text-xl font-bold text-gray-900"
                >
                  {editingUserId ? "Edit User Information" : "Add New User"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors "
                  aria-label="Close modal"
                >
                  <MdClose size={24} aria-hidden="true" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto">
                {formError && (
                  <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    {formError}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="userName"
                      className="block text-sm font-semibold text-gray-800 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      id="userName"
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 outline-[#611F69] rounded-md px-3 py-2 text-gray-900 shadow-sm"
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="userEmail"
                      className="block text-sm font-semibold text-gray-800 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      id="userEmail"
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 outline-[#611F69] rounded-md px-3 py-2 text-gray-900 shadow-sm"
                      placeholder="e.g. j.doe@inventory.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="userRole"
                      className="block text-sm font-semibold text-gray-800 mb-1"
                    >
                      System Role
                    </label>
                    <select
                      id="userRole"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 outline-[#611F69] rounded-md px-3 py-2 text-gray-900 shadow-sm"
                    >
                      <option value="System Admin">System Admin</option>
                      <option value="Warehouse Manager">
                        Warehouse Manager
                      </option>
                      <option value="Inventory Clerk">Inventory Clerk</option>
                      <option value="Auditor">Auditor</option>
                      <option value="Forklift Operator">
                        Forklift Operator
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="userDepartment"
                      className="block text-sm font-semibold text-gray-800 mb-1"
                    >
                      Department
                    </label>
                    <select
                      id="userDepartment"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 outline-none rounded-md px-3 py-2 text-gray-900 shadow-sm"
                    >
                      <option value="IT">IT</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Operations">Operations</option>
                      <option value="Finance">Finance</option>
                      <option value="HR">HR</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="userJobTitle"
                      className="block text-sm font-semibold text-gray-800 mb-1"
                    >
                      Job Title
                    </label>
                    <input
                      id="userJobTitle"
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 outline-[#611F69] rounded-md px-3 py-2 text-gray-900 shadow-sm"
                      placeholder="e.g. Senior Inventory Clerk"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="userPhone"
                      className="block text-sm font-semibold text-gray-800 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      id="userPhone"
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 outline-[#611F69] rounded-md px-3 py-2 text-gray-900 shadow-sm"
                      placeholder="e.g. 01712345678"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="userWarehouse"
                      className="block text-sm font-semibold text-gray-800 mb-1"
                    >
                      Assigned Warehouse
                    </label>
                    <select
                      id="userWarehouse"
                      name="assignedWarehouse"
                      value={formData.assignedWarehouse}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 outline-none rounded-md px-3 py-2 text-gray-900 shadow-sm"
                    >
                      <option value="">-- Select Warehouse --</option>
                      {warehouses.map((w) => (
                        <option key={w._id} value={w._id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="userStatus"
                      className="block text-sm font-semibold text-gray-800 mb-1"
                    >
                      Account Status
                    </label>
                    <select
                      id="userStatus"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 outline-none rounded-md px-3 py-2 text-gray-900 shadow-sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Offline">Offline</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md text-sm font-medium shadow-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-[#611F69] border border-[#611F69] hover:bg-transparent hover:text-[#611F69] cursor-pointer text-white text-sm font-medium rounded-md shadow-sm transition-all disabled:opacity-50"
                  >
                    {submitting
                      ? "Saving..."
                      : editingUserId
                        ? "Save Changes"
                        : "Save User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6">
                <h2
                  id="delete-modal-title"
                  className="text-lg font-bold text-gray-900 mb-2"
                >
                  Delete User
                </h2>
                <p className="text-sm text-gray-600">
                  আপনি কি নিশ্চিত যে{" "}
                  <span className="font-semibold text-gray-900">
                    {deleteTarget.name}
                  </span>{" "}
                  কে ডিলিট করতে চান? এই কাজটি আর ফিরিয়ে নেওয়া যাবে না।
                </p>
              </div>
              <div className="flex justify-end gap-3 px-6 pb-6">
                <button
                  type="button"
                  onClick={handleCloseDeleteModal}
                  disabled={deleting}
                  className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md text-sm font-medium shadow-sm transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteUser}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 border border-red-600 hover:bg-transparent hover:text-red-600 cursor-pointer text-white text-sm font-medium rounded-md shadow-sm transition-all disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
