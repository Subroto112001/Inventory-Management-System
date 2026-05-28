"use client";

import React, { useState } from "react";
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdSecurity,
  MdBadge,
  MdStorefront,
  MdCameraAlt,
  MdSave,
  MdVpnKey,
} from "react-icons/md";

// Role-based permissions configuration for the POS system
const ROLE_PERMISSIONS = {
  Admin: [
    "Full System Access",
    "Manage Users & Roles",
    "View Financial Reports",
    "Manage Inventory",
  ],
  "Project Manager": [
    "Manage Inventory",
    "View Sales Reports",
    "Manage Staff Shifts",
    "Handle Returns",
  ],
  Cashier: [
    "Process Sales",
    "Handle Cash Register",
    "Process Basic Returns",
    "View Daily Sales",
  ],
  Staff: ["View Inventory", "Assist Customers", "Basic System Access"],
};

export default function UserProfile() {
  // Demo state with initialized data
  const [profileData, setProfileData] = useState({
    fullName: "Subroto Kumar Barman",
    email: "subroto@skrypt.com",
    phone: "+880 1700-000000",
    location: "Dhaka, Bangladesh",
    role: "Admin", // 'Admin', 'Project Manager', 'Cashier', 'Staff'
    assignedStore: "Main Branch - Dhaka",
    status: "Active",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profileData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setProfileData(formData);
    setIsEditing(false);
    // Here you would typically send an API request to update the backend
  };

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-bold text-2xl text-gray-900">Profile Settings</h1>
        <p className="text-[16px] font-medium text-gray-600 mt-1">
          Manage your personal information and POS system roles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <article className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="h-32 bg-[#6C1B7B]/10 relative"></div>
            <div className="px-6 pb-6 relative">
              {/* Profile Image with Upload Button */}
              <div className="flex justify-between items-end -mt-12 mb-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-white p-1 border-2 border-white shadow-md">
                    <div className="w-full h-full rounded-full bg-[#6C1B7B] text-white flex items-center justify-center text-3xl font-bold">
                      {profileData.fullName.charAt(0)}
                    </div>
                  </div>
                  <button
                    className="absolute bottom-0 right-0 p-1.5 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C1B7B]"
                    aria-label="Update profile picture"
                  >
                    <MdCameraAlt className="text-[16px]" aria-hidden="true" />
                  </button>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    profileData.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {profileData.status}
                </span>
              </div>

              {/* Basic Info */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {profileData.fullName}
                </h2>
                <div className="flex items-center gap-1.5 text-[#6C1B7B] font-medium text-sm mt-1">
                  <MdBadge className="text-lg" aria-hidden="true" />
                  {profileData.role}
                </div>
              </div>

              {/* Contact Details List */}
              <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <MdEmail
                    className="text-lg text-gray-400 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="break-all">{profileData.email}</span>
                </li>
                <li className="flex items-start gap-3">
                  <MdPhone
                    className="text-lg text-gray-400 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{profileData.phone}</span>
                </li>
                <li className="flex items-start gap-3">
                  <MdLocationOn
                    className="text-lg text-gray-400 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{profileData.location}</span>
                </li>
                <li className="flex items-start gap-3 pt-4 border-t border-gray-100">
                  <MdStorefront
                    className="text-lg text-[#6C1B7B] mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                      Assigned Store
                    </p>
                    <p className="font-medium text-gray-900 mt-0.5">
                      {profileData.assignedStore}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </article>

          {/* Security Summary Card */}
          <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MdSecurity
                className="text-lg text-[#6C1B7B]"
                aria-hidden="true"
              />
              Security
            </h3>
            <div className="flex flex-col gap-3">
              <button className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] transition-colors">
                <MdVpnKey className="text-lg" aria-hidden="true" />
                Change Password
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] transition-colors">
                Enable 2FA Authentication
              </button>
            </div>
          </article>
        </div>

        {/* Right Column: Edit Form & Role Info */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MdPerson
                  className="text-xl text-[#6C1B7B]"
                  aria-hidden="true"
                />
                Personal Information
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-[#6C1B7B] bg-[#6C1B7B]/10 rounded-lg hover:bg-[#6C1B7B]/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C1B7B]"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="p-6">
              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      disabled={!isEditing}
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:bg-white disabled:opacity-70 disabled:cursor-not-allowed text-gray-900 transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:bg-white disabled:opacity-70 disabled:cursor-not-allowed text-gray-900 transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:bg-white disabled:opacity-70 disabled:cursor-not-allowed text-gray-900 transition-colors"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Location
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      disabled={!isEditing}
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:bg-white disabled:opacity-70 disabled:cursor-not-allowed text-gray-900 transition-colors"
                    />
                  </div>

                  {/* POS System Role - Dropdown to show different roles */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700"
                    >
                      System Role (Privilege Level)
                    </label>
                    <select
                      id="role"
                      name="role"
                      disabled={!isEditing}
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:bg-white disabled:opacity-70 disabled:cursor-not-allowed text-gray-900 transition-colors appearance-none"
                    >
                      <option value="Admin">Admin (Full Access)</option>
                      <option value="Project Manager">Project Manager</option>
                      <option value="Cashier">Cashier</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(profileData);
                        setIsEditing(false);
                      }}
                      className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#6C1B7B] rounded-lg hover:bg-[#52135d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C1B7B] transition-colors"
                    >
                      <MdSave className="text-lg" aria-hidden="true" />
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </section>

          {/* Current Role Permissions Display */}
          <section
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
            aria-labelledby="permissions-heading"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#6C1B7B]/10 flex items-center justify-center text-[#6C1B7B]">
                <MdBadge className="text-xl" aria-hidden="true" />
              </div>
              <div>
                <h3
                  id="permissions-heading"
                  className="text-lg font-bold text-gray-900"
                >
                  Active Permissions
                </h3>
                <p className="text-sm text-gray-500">
                  Based on your current role:{" "}
                  <strong className="text-[#6C1B7B]">{profileData.role}</strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ROLE_PERMISSIONS[profileData.role]?.map((permission, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-700 font-medium"
                >
                  <div
                    className="w-2 h-2 rounded-full bg-green-500"
                    aria-hidden="true"
                  ></div>
                  {permission}
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Role changes require super-admin
                approval. If you need elevated access for POS operations, please
                contact IT support.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
