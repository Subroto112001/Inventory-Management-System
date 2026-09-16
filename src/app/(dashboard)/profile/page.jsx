"use client";
import useCurrentUser from "@/dataProvider/getMe";
import React, { useEffect, useState } from "react";

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

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const {
    mydata,
    profileData,
    setProfileData,
    formData,
    setFormData,
    loading,
    getCurrentUser,
  } = useCurrentUser();

  // =========================================================
  // Handle Input Change
  // =========================================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // Handle Edit
  // =========================================================
  const handleEdit = () => {
    setFormData(profileData);
    setIsEditing(true);
  };

  // =========================================================
  // Handle Cancel
  // =========================================================
  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  // =========================================================
  // Handle Form Submit
  // =========================================================
  const handleFormSubmit = (e) => {
    e.preventDefault();

    setProfileData(formData);
    setIsEditing(false);
  };

  /**
   *  Loading time skeleton UI
   */
  if (loading) {
    return (
      <div className="p-5 lg:p-8 mx-auto min-h-screen animate-pulse">
        {/* Page Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-56 bg-gray-200 rounded-lg"></div>

          <div className="h-5 w-96 max-w-full bg-gray-100 rounded-md mt-3"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* =====================================================
            Left Column
        ====================================================== */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card Skeleton */}
            <article className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Cover */}
              <div className="h-32 bg-[#6C1B7B]/10"></div>

              <div className="px-6 pb-6">
                {/* Avatar + Status */}
                <div className="flex justify-between items-end -mt-12 mb-5">
                  {/* Avatar */}
                  <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                    <div className="w-full h-full rounded-full bg-gray-200"></div>
                  </div>

                  {/* Status */}
                  <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                </div>

                {/* Name */}
                <div className="h-6 w-48 bg-gray-200 rounded-md"></div>

                {/* Role */}
                <div className="h-4 w-32 bg-gray-100 rounded-md mt-3"></div>

                {/* Contact Details */}
                <div className="space-y-5 mt-7">
                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded bg-gray-200"></div>
                    <div className="h-4 w-48 bg-gray-100 rounded"></div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded bg-gray-200"></div>
                    <div className="h-4 w-32 bg-gray-100 rounded"></div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded bg-gray-200"></div>
                    <div className="h-4 w-36 bg-gray-100 rounded"></div>
                  </div>

                  {/* Warehouse */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded bg-[#6C1B7B]/20"></div>

                      <div className="flex-1">
                        <div className="h-3 w-32 bg-gray-100 rounded"></div>
                        <div className="h-4 w-40 bg-gray-200 rounded mt-2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Security Card Skeleton */}
            <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-5 h-5 bg-[#6C1B7B]/20 rounded"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>

              <div className="space-y-3">
                <div className="h-10 w-full bg-gray-100 border border-gray-200 rounded-lg"></div>

                <div className="h-10 w-full bg-gray-100 border border-gray-200 rounded-lg"></div>
              </div>
            </article>
          </div>

          {/* =====================================================
            Right Column
        ====================================================== */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Skeleton */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#6C1B7B]/20 rounded"></div>
                  <div className="h-5 w-44 bg-gray-200 rounded"></div>
                </div>

                <div className="h-9 w-28 bg-[#6C1B7B]/10 rounded-lg"></div>
              </div>

              {/* Fields */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Field 1 */}
                  <div>
                    <div className="h-4 w-20 bg-gray-100 rounded mb-2"></div>
                    <div className="h-11 w-full bg-gray-100 border border-gray-200 rounded-lg"></div>
                  </div>

                  {/* Field 2 */}
                  <div>
                    <div className="h-4 w-24 bg-gray-100 rounded mb-2"></div>
                    <div className="h-11 w-full bg-gray-100 border border-gray-200 rounded-lg"></div>
                  </div>

                  {/* Field 3 */}
                  <div className="md:col-span-2">
                    <div className="h-4 w-28 bg-gray-100 rounded mb-2"></div>
                    <div className="h-11 w-full bg-gray-100 border border-gray-200 rounded-lg"></div>
                  </div>

                  {/* Field 4 */}
                  <div className="md:col-span-2">
                    <div className="h-4 w-20 bg-gray-100 rounded mb-2"></div>
                    <div className="h-11 w-full bg-gray-100 border border-gray-200 rounded-lg"></div>
                  </div>

                  {/* Field 5 */}
                  <div>
                    <div className="h-4 w-24 bg-gray-100 rounded mb-2"></div>
                    <div className="h-11 w-full bg-gray-100 border border-gray-200 rounded-lg"></div>
                  </div>

                  {/* Field 6 */}
                  <div>
                    <div className="h-4 w-24 bg-gray-100 rounded mb-2"></div>
                    <div className="h-11 w-full bg-gray-100 border border-gray-200 rounded-lg"></div>
                  </div>

                  {/* Field 7 */}
                  <div className="md:col-span-2">
                    <div className="h-4 w-36 bg-gray-100 rounded mb-2"></div>
                    <div className="h-11 w-full bg-gray-100 border border-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Account Details Skeleton */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#6C1B7B]/20 rounded"></div>
                  <div className="h-5 w-36 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Detail 1 */}
                  <div>
                    <div className="h-3 w-20 bg-gray-100 rounded mb-2"></div>
                    <div className="h-4 w-36 bg-gray-200 rounded"></div>
                  </div>

                  {/* Detail 2 */}
                  <div>
                    <div className="h-3 w-28 bg-gray-100 rounded mb-2"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </div>

                  {/* Detail 3 */}
                  <div>
                    <div className="h-3 w-24 bg-gray-100 rounded mb-2"></div>
                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
                  </div>

                  {/* Detail 4 */}
                  <div>
                    <div className="h-3 w-16 bg-gray-100 rounded mb-2"></div>
                    <div className="h-4 w-52 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  /**
   *  If this user is
   *  unauthorized Or
   *  Not looged in
   *  Or User daTA Is unavailable
   *
   */

  if (!mydata) {
    return (
      <div className="p-5 lg:p-8 mx-auto min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Unable to Load Profile
            </h2>

            <p className="text-gray-500">Please login again to continue.</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // User Display Helpers
  // =========================================================
  const fullName =
    `${mydata.firstName || ""} ${mydata.lastName || ""}`.trim() || "User";

  const firstName = mydata.firstName?.charAt(0)?.toUpperCase() || "U";

  const location = mydata.district
    ? `${mydata.district}${mydata.country ? `, ${mydata.country}` : ""}`
    : mydata.country || "Not Available";

  const assignedWarehouse = mydata.assignedWarehouse || "Not Assigned";

  const department = mydata.department || "Not Available";

  const role = mydata.role || "Not Available";

  const phone = mydata.phoneNumber || "Not Available";

  const email = mydata.email || "Not Available";

  const accountStatus = mydata.accountStatus || "Not Available";

  const emailVerificationStatus = mydata.isEmailVerified
    ? "Verified"
    : "Not Verified";

  // =========================================================
  // Render
  // =========================================================
  return (
    <div className="p-5 lg:p-8 mx-auto min-h-screen">
      {/* =====================================================
          Page Header
      ====================================================== */}
      <div className="mb-8">
        <h1 className="font-bold text-2xl text-gray-900">Profile Settings</h1>

        <p className="text-[16px] font-medium text-gray-600 mt-1">
          Manage your personal information and inventory management system
          profile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ===================================================
            Left Column
        ==================================================== */}
        <div className="lg:col-span-1 space-y-6">
          {/* =================================================
              Profile Summary Card
          ================================================== */}
          <article className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Cover */}
            <div className="h-32 bg-[#6C1B7B]/10 relative"></div>

            <div className="px-6 pb-6 relative">
              {/* Profile Image */}
              <div className="flex justify-between items-end -mt-12 mb-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-white p-1 border-2 border-white shadow-md">
                    <div className="w-full h-full rounded-full bg-[#6C1B7B] text-white flex items-center justify-center text-3xl font-bold">
                      {firstName}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="absolute bottom-0 right-0 p-1.5 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C1B7B]"
                    aria-label="Update profile picture"
                  >
                    <MdCameraAlt className="text-[16px]" aria-hidden="true" />
                  </button>
                </div>

                {/* Account Status */}
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    mydata.accountStatus === "Active"
                      ? "bg-green-100 text-green-700"
                      : mydata.accountStatus === "Suspended"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {accountStatus}
                </span>
              </div>

              {/* Basic Info */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>

                <div className="flex items-center gap-1.5 text-[#6C1B7B] font-medium text-sm mt-1">
                  <MdBadge className="text-lg" aria-hidden="true" />

                  <span>{role}</span>
                </div>
              </div>

              {/* Contact Details */}
              <ul className="space-y-4 text-sm text-gray-600">
                {/* Email */}
                <li className="flex items-start gap-3">
                  <MdEmail
                    className="text-lg text-gray-400 mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />

                  <span className="break-all">{email}</span>
                </li>

                {/* Phone */}
                <li className="flex items-start gap-3">
                  <MdPhone
                    className="text-lg text-gray-400 mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />

                  <span>{phone}</span>
                </li>

                {/* Location */}
                <li className="flex items-start gap-3">
                  <MdLocationOn
                    className="text-lg text-gray-400 mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />

                  <span>{location}</span>
                </li>

                {/* Assigned Warehouse */}
                <li className="flex items-start gap-3 pt-4 border-t border-gray-100">
                  <MdStorefront
                    className="text-lg text-[#6C1B7B] mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                      Assigned Warehouse
                    </p>

                    <p className="font-medium text-gray-900 mt-0.5">
                      {assignedWarehouse}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </article>

          {/* =================================================
              Security Summary
          ================================================== */}
          <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MdSecurity
                className="text-lg text-[#6C1B7B]"
                aria-hidden="true"
              />
              Security
            </h3>

            <div className="flex flex-col gap-3">
              {/* Change Password */}
              <button
                type="button"
                className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] transition-colors"
              >
                <MdVpnKey className="text-lg" aria-hidden="true" />
                Change Password
              </button>

              {/* 2FA */}
              <button
                type="button"
                className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] transition-colors"
              >
                Enable 2FA Authentication
              </button>
            </div>
          </article>
        </div>

        {/* ===================================================
            Right Column
        ==================================================== */}
        <div className="lg:col-span-2 space-y-6">
          {/* =================================================
              Personal Information
          ================================================== */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Section Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MdPerson
                  className="text-xl text-[#6C1B7B]"
                  aria-hidden="true"
                />
                Personal Information
              </h2>

              {(mydata.role === "System Admin" || mydata.role === "Admin") && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="px-4 py-2 text-sm font-medium text-[#6C1B7B] bg-[#6C1B7B]/10 rounded-lg hover:bg-[#6C1B7B]/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C1B7B]"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* Form */}
            <div className="p-6">
              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* =================================================
                      Full Name
                  ================================================== */}
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

                  {/* =================================================
                      Phone Number
                  ================================================== */}
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

                  {/* =================================================
                      Email
                  ================================================== */}
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
                      disabled
                      value={formData.email}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:bg-white disabled:opacity-70 disabled:cursor-not-allowed text-gray-900 transition-colors"
                    />
                  </div>

                  {/* =================================================
                      Location
                  ================================================== */}
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

                  {/* =================================================
                      Department
                  ================================================== */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="department"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Department
                    </label>

                    <input
                      id="department"
                      name="department"
                      type="text"
                      disabled
                      value={formData.department}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:bg-white disabled:opacity-70 disabled:cursor-not-allowed text-gray-900 transition-colors"
                    />
                  </div>

                  {/* =================================================
                      System Role
                  ================================================== */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700"
                    >
                      System Role
                    </label>

                    <input
                      id="role"
                      name="role"
                      type="text"
                      disabled
                      value={formData.role}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:bg-white disabled:opacity-70 disabled:cursor-not-allowed text-gray-900 transition-colors"
                    />
                  </div>

                  {/* =================================================
                      Assigned Warehouse
                  ================================================== */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label
                      htmlFor="assignedStore"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Assigned Warehouse
                    </label>

                    <input
                      id="assignedStore"
                      name="assignedStore"
                      type="text"
                      disabled
                      value={formData.assignedStore}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:bg-white disabled:opacity-70 disabled:cursor-not-allowed text-gray-900 transition-colors"
                    />
                  </div>
                </div>

                {/* =================================================
                    Additional Account Information
                ================================================== */}
                <div className="border-t border-gray-100 pt-6 mb-6">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                    Account Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Account Status */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Account Status
                      </label>

                      <input
                        id="status"
                        name="status"
                        type="text"
                        disabled
                        value={formData.status}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C1B7B] focus:bg-white disabled:opacity-70 disabled:cursor-not-allowed text-gray-900 transition-colors"
                      />
                    </div>

                    {/* Email Verification */}
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Email Verification
                      </label>

                      <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            mydata.isEmailVerified
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {emailVerificationStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    Form Actions
                ================================================== */}
                {isEditing && (
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    {/* Cancel */}
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                    >
                      Cancel
                    </button>

                    {/* Save */}
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

          {/* =================================================
              Login / Account Details
          ================================================== */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MdSecurity
                  className="text-xl text-[#6C1B7B]"
                  aria-hidden="true"
                />
                Account Details
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Last Login */}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Last Login
                  </p>

                  <p className="text-sm font-semibold text-gray-900">
                    {mydata.lastLogin
                      ? new Date(mydata.lastLogin).toLocaleString()
                      : "Not Available"}
                  </p>
                </div>

                {/* Account Created */}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Account Created
                  </p>

                  <p className="text-sm font-semibold text-gray-900">
                    {mydata.createdAt
                      ? new Date(mydata.createdAt).toLocaleDateString()
                      : "Not Available"}
                  </p>
                </div>

                {/* Account Updated */}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Last Updated
                  </p>

                  <p className="text-sm font-semibold text-gray-900">
                    {mydata.updatedAt
                      ? new Date(mydata.updatedAt).toLocaleString()
                      : "Not Available"}
                  </p>
                </div>

                {/* User ID */}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    User ID
                  </p>

                  <p className="text-sm font-semibold text-gray-900 break-all">
                    {mydata._id?.toString() || "Not Available"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
