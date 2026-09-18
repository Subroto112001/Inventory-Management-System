"use client";
import useUsers from "@/dataProvider/userData";
import useWarehouses from "@/dataProvider/wareHousedata";
import useCurrentUser from "@/dataProvider/getMe";
import { useRouter } from "next/navigation";
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
  MdEmail,
} from "react-icons/md";
import useMeta from "@/dataProvider/metaData";

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
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState(defaultFormState);
  const [roleOpen, setRoleOpen] = useState(false);
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [warehouseOpen, setWarehouseOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  // Added setUsers to successfully update local state on CRUD actions
  const { users, setUsers, loading, fetchUsers, error } = useUsers();

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { warehouses, loadingWarehouses, fetchWarehouses } = useWarehouses();
  const router = useRouter();

  const { mydata, loading: loadingCurrentUser } = useCurrentUser();
  const { roles, departments, statuses, loadingMeta, fetchMeta } = useMeta();

  useEffect(() => {
    fetchUsers();
    fetchWarehouses();

    fetchMeta();
  }, []);

  useEffect(() => {
    if (!loadingCurrentUser) {
      if (!mydata || mydata.role !== "System Admin") {
        router.push("/");
      }
    }
  }, [mydata, loadingCurrentUser, router]);

  // Modal open and close functions
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      if (editingUserId) {
        const res = await fetch(`/api/adduser/${editingUserId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (!res.ok) {
          setFormError(
            data.message ||
              "There was an issue updating the user, Contact with your Admin",
          );
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
          setFormError(
            data.message ||
              "There was an issue adding the user, Contact with your Admin",
          );
          setSubmitting(false);
          return;
        }

        setUsers([data.user, ...users]);
      }

      handleCloseModal();
    } catch (err) {
      setFormError(
        "There was an issue with the server, please try again later",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = (user) => {
    setDeleteTarget(user);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return;
    setDeleteTarget(null);
  };

  const confirmDeleteUser = async () => {
    if (!deleteTarget) return;

    const id = deleteTarget.id;
    setDeleting(true);

    try {
      const res = await fetch(`/api/adduser/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "User delete failed, please try again later");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setDeleteTarget(null);
    } catch (err) {
      alert("There was an issue with the server, please try again later");
    } finally {
      setDeleting(false);
    }
  };

  const resendInvitation = async (user) => {
    try {
      const res = await fetch(`/api/adduser/${user.id}/resend-invitation`, {
        method: "POST",
      });
      const data = await res.json();
      alert(data.message || "Invitation sent");
    } catch {
      alert("Unable to send invitation");
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
                className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-[#611F69] border border-[#611F69] hover:bg-transparent hover:text-[#611F69] cursor-pointer text-white text-sm font-medium rounded-md shadow-sm transition-all"
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
                        Loading users...
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
                              onClick={() => resendInvitation(user)}
                              className="p-1.5 text-gray-600 hover:text-[#611F69] hover:bg-purple-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#611F69]"
                              aria-label={`Resend invitation to ${user.name}`}
                              title="Resend invitation"
                            >
                              <MdEmail size={20} aria-hidden="true" />
                            </button>
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
                        {error || "No users found."}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[3px] p-4 animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
              {/* Top Accent */}
              <div className="h-1.5 bg-[#611F69]" />

              {/* ================= HEADER ================= */}
              <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-[#611F69]/5 via-white to-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#611F69]/10 flex items-center justify-center">
                    {editingUserId ? (
                      <svg
                        className="w-6 h-6 text-[#611F69]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 text-[#611F69]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6"
                        />
                      </svg>
                    )}
                  </div>

                  <div>
                    <h2
                      id="modal-title"
                      className="text-xl font-bold text-gray-900"
                    >
                      {editingUserId ? "Edit User Information" : "Add New User"}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {editingUserId
                        ? "Update account details and access permissions"
                        : "Create a new user and assign their workplace details"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="group w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
                  aria-label="Close modal"
                >
                  <MdClose
                    size={23}
                    className="group-hover:rotate-90 transition-transform duration-200"
                  />
                </button>
              </div>

              {/* ================= FORM ================= */}
              <form
                onSubmit={handleFormSubmit}
                className="flex-1 overflow-y-auto"
              >
                <div className="p-7">
                  {/* Error */}
                  {formError && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      <svg
                        className="w-5 h-5 shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>

                      <span>{formError}</span>
                    </div>
                  )}

                  {/* ================= PERSONAL INFORMATION ================= */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 rounded-lg bg-[#611F69]/10 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-[#611F69]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          Personal Information
                        </h3>

                        <p className="text-xs text-gray-500">
                          Basic information about the user
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      {/* Full Name */}
                      <div>
                        <label
                          htmlFor="userName"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Full Name
                          <span className="text-red-500 ml-1">*</span>
                        </label>

                        <input
                          id="userName"
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full h-11 border border-gray-200 bg-gray-50/50 outline-none rounded-xl px-4 text-sm text-gray-900 transition-all duration-200 hover:border-gray-300 focus:border-[#611F69] focus:ring-4 focus:ring-[#611F69]/10 focus:bg-white"
                          placeholder="e.g. John Doe"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="userEmail"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Email Address
                          <span className="text-red-500 ml-1">*</span>
                        </label>

                        <input
                          id="userEmail"
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full h-11 border border-gray-200 bg-gray-50/50 outline-none rounded-xl px-4 text-sm text-gray-900 transition-all duration-200 hover:border-gray-300 focus:border-[#611F69] focus:ring-4 focus:ring-[#611F69]/10 focus:bg-white"
                          placeholder="e.g. john@example.com"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="userPhone"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Phone Number
                        </label>

                        <input
                          id="userPhone"
                          type="text"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full h-11 border border-gray-200 bg-gray-50/50 outline-none rounded-xl px-4 text-sm text-gray-900 transition-all duration-200 hover:border-gray-300 focus:border-[#611F69] focus:ring-4 focus:ring-[#611F69]/10 focus:bg-white"
                          placeholder="e.g. 01712345678"
                        />
                      </div>

                      {/* Job Title */}
                      <div>
                        <label
                          htmlFor="userJobTitle"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Job Title
                        </label>

                        <input
                          id="userJobTitle"
                          type="text"
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleInputChange}
                          className="w-full h-11 border border-gray-200 bg-gray-50/50 outline-none rounded-xl px-4 text-sm text-gray-900 transition-all duration-200 hover:border-gray-300 focus:border-[#611F69] focus:ring-4 focus:ring-[#611F69]/10 focus:bg-white"
                          placeholder="e.g. Inventory Manager"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 mb-8" />

                  {/* ================= WORK INFORMATION ================= */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 rounded-lg bg-[#611F69]/10 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-[#611F69]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          Work & Access
                        </h3>

                        <p className="text-xs text-gray-500">
                          Assign the user's role, department and workplace
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      {/* ================= ROLE ================= */}
                      <div className="relative">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          System Role
                        </label>

                        <button
                          type="button"
                          disabled={loadingMeta}
                          onClick={() => {
                            setRoleOpen((prev) => !prev);
                            setDepartmentOpen(false);
                            setWarehouseOpen(false);
                            setStatusOpen(false);
                          }}
                          className="w-full h-11 border border-gray-200 bg-gray-50/50 outline-none rounded-xl px-4 text-sm text-gray-900 flex items-center justify-between cursor-pointer transition-all duration-200 hover:border-gray-300 focus:border-[#611F69] focus:ring-4 focus:ring-[#611F69]/10 focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <span>{formData.role || "Select Role"}</span>

                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                              roleOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 9l6 6 6-6"
                            />
                          </svg>
                        </button>

                        <div
                          className={`absolute z-50 left-0 right-0 mt-2 origin-top rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden transition-all duration-200 ${
                            roleOpen
                              ? "opacity-100 scale-y-100 translate-y-0"
                              : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
                          }`}
                        >
                          {roles.map((role) => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  role,
                                }));
                                setRoleOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 ${
                                formData.role === role
                                  ? "bg-[#611F69]/10 text-[#611F69] font-medium"
                                  : "text-gray-700 hover:bg-[#611F69]/5 hover:text-[#611F69]"
                              }`}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ================= DEPARTMENT ================= */}
                      <div className="relative">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Department
                        </label>

                        <button
                          type="button"
                          disabled={loadingMeta}
                          onClick={() => {
                            setDepartmentOpen((prev) => !prev);
                            setRoleOpen(false);
                            setWarehouseOpen(false);
                            setStatusOpen(false);
                          }}
                          className="w-full h-11 border border-gray-200 bg-gray-50/50 outline-none rounded-xl px-4 text-sm text-gray-900 flex items-center justify-between cursor-pointer transition-all duration-200 hover:border-gray-300 focus:border-[#611F69] focus:ring-4 focus:ring-[#611F69]/10 focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <span>
                            {formData.department || "Select Department"}
                          </span>

                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                              departmentOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 9l6 6 6-6"
                            />
                          </svg>
                        </button>

                        <div
                          className={`absolute z-50 left-0 right-0 mt-2 origin-top rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden transition-all duration-200 ${
                            departmentOpen
                              ? "opacity-100 scale-y-100 translate-y-0"
                              : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
                          }`}
                        >
                          {departments.map((dep) => (
                            <button
                              key={dep}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  department: dep,
                                }));
                                setDepartmentOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 ${
                                formData.department === dep
                                  ? "bg-[#611F69]/10 text-[#611F69] font-medium"
                                  : "text-gray-700 hover:bg-[#611F69]/5 hover:text-[#611F69]"
                              }`}
                            >
                              {dep}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ================= WAREHOUSE ================= */}
                      <div className="relative">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Assigned Warehouse
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            setWarehouseOpen((prev) => !prev);
                            setRoleOpen(false);
                            setDepartmentOpen(false);
                            setStatusOpen(false);
                          }}
                          className="w-full h-11 border border-gray-200 bg-gray-50/50 outline-none rounded-xl px-4 text-sm text-gray-900 flex items-center justify-between cursor-pointer transition-all duration-200 hover:border-gray-300 focus:border-[#611F69] focus:ring-4 focus:ring-[#611F69]/10 focus:bg-white"
                        >
                          <span className="truncate">
                            {formData.assignedWarehouse
                              ? warehouses.find(
                                  (w) => w._id === formData.assignedWarehouse,
                                )?.name || "-- Select Warehouse --"
                              : "-- Select Warehouse --"}
                          </span>

                          <svg
                            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                              warehouseOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 9l6 6 6-6"
                            />
                          </svg>
                        </button>

                        <div
                          className={`absolute z-50 left-0 right-0 mt-2 origin-top rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden transition-all duration-200 ${
                            warehouseOpen
                              ? "opacity-100 scale-y-100 translate-y-0"
                              : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                assignedWarehouse: "",
                              }));
                              setWarehouseOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 ${
                              !formData.assignedWarehouse
                                ? "bg-[#611F69]/10 text-[#611F69] font-medium"
                                : "text-gray-700 hover:bg-[#611F69]/5 hover:text-[#611F69]"
                            }`}
                          >
                            -- Select Warehouse --
                          </button>

                          {warehouses.map((w) => (
                            <button
                              key={w._id}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  assignedWarehouse: w._id,
                                }));
                                setWarehouseOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 ${
                                formData.assignedWarehouse === w._id
                                  ? "bg-[#611F69]/10 text-[#611F69] font-medium"
                                  : "text-gray-700 hover:bg-[#611F69]/5 hover:text-[#611F69]"
                              }`}
                            >
                              {w.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ================= STATUS ================= */}
                      <div className="relative">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Account Status
                        </label>

                        <button
                          type="button"
                          disabled={loadingMeta}
                          onClick={() => {
                            setStatusOpen((prev) => !prev);
                            setRoleOpen(false);
                            setDepartmentOpen(false);
                            setWarehouseOpen(false);
                          }}
                          className="w-full h-11 border border-gray-200 bg-gray-50/50 outline-none rounded-xl px-4 text-sm text-gray-900 flex items-center justify-between cursor-pointer transition-all duration-200 hover:border-gray-300 focus:border-[#611F69] focus:ring-4 focus:ring-[#611F69]/10 focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <span>{formData.status || "Select Status"}</span>

                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                              statusOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 9l6 6 6-6"
                            />
                          </svg>
                        </button>

                        <div
                          className={`absolute z-50 left-0 right-0 mt-2 origin-top rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden transition-all duration-200 ${
                            statusOpen
                              ? "opacity-100 scale-y-100 translate-y-0"
                              : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
                          }`}
                        >
                          {statuses.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  status: s,
                                }));
                                setStatusOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 ${
                                formData.status === s
                                  ? "bg-[#611F69]/10 text-[#611F69] font-medium"
                                  : "text-gray-700 hover:bg-[#611F69]/5 hover:text-[#611F69]"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================= FOOTER ================= */}
                <div className="sticky bottom-0 border-t border-gray-100 bg-white/95 backdrop-blur-md px-7 py-4 flex items-center justify-between">
                  <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M12 22a10 10 0 100-20 10 10 0 000 20z"
                      />
                    </svg>

                    <span>
                      {editingUserId
                        ? "Changes will be saved immediately."
                        : "Fields marked with * are required."}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 ml-auto">
                    {/* Cancel */}
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-5 h-11 border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 rounded-xl text-sm font-semibold transition-all duration-200"
                    >
                      Cancel
                    </button>

                    {/* Save */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group inline-flex items-center justify-center gap-2 px-6 h-11 bg-[#611F69] border border-[#611F69] hover:bg-[#501657] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <svg
                            className="w-4 h-4 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-30"
                              cx="12"
                              cy="12"
                              r="9"
                              stroke="currentColor"
                              strokeWidth="3"
                            />

                            <path
                              d="M21 12a9 9 0 00-9-9"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          {editingUserId ? "Save Changes" : "Create User"}

                          <svg
                            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 12h14M13 6l6 6-6 6"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
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
                  Are you sure you want to delete user{" "}
                  <span className="font-semibold text-gray-900">
                    {deleteTarget.name}
                  </span>{" "}
                  ? Are you sure you want to delete this user? This action
                  cannot be undone.
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
