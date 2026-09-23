"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MdArrowBack,
  MdSave,
  MdErrorOutline,
  MdCheckCircle,
} from "react-icons/md";

const AddWarehousePage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });

  const [formData, setFormData] = useState({
    name: "",
    warehouseCode: "",
    address: "",
    district: "",
    country: "Bangladesh",
    contactNumber: "",
    capacity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: "info", message: "Saving warehouse details..." });

    try {
      const response = await fetch("/api/warehouse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          warehouseCode: formData.warehouseCode,
          location: {
            address: formData.address,
            district: formData.district,
            country: formData.country,
          },
          contactNumber: formData.contactNumber,
          capacity: Number(formData.capacity) || 0,
          // TODO: Replace with dynamic user ID from auth context
          createdBy: "64a2f8b9e4b0a1c2d3e4f5g6",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create warehouse.");
      }

      setFormStatus({
        type: "success",
        message: "Warehouse successfully added to the BeeSkript network!",
      });

      setTimeout(() => {
        router.push("/warehouse");
      }, 1500);
    } catch (err) {
      setFormStatus({ type: "error", message: err.message });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-row h-screen bg-gray-50">
      <main
        className="flex-1 w-full overflow-y-auto p-4 md:p-8"
        id="main-content"
      >
        <div className="max-w-4xl mx-auto w-full pb-10">
          {/* Header Section */}
          <header className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex flex-col items-start gap-2">
              <button
                onClick={() => router.back()}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors bg-transparent border-none cursor-pointer"
                aria-label="Go back to warehouse list"
              >
                <MdArrowBack size={16} aria-hidden="true" />
                Back to Warehouses
              </button>
              <div>
                <h1
                  id="add-warehouse-heading"
                  className="text-2xl md:text-3xl font-bold text-gray-900 mt-2"
                >
                  Add New Warehouse
                </h1>
                <p className="text-base text-gray-500 mt-1">
                  Register a new storage facility in your inventory network.
                </p>
              </div>
            </div>
          </header>

          {/* Form Status Live Region */}
          <div
            aria-live="polite"
            aria-atomic="true"
            className="mb-6 min-h-[48px]"
          >
            {formStatus.message && (
              <div
                className={`p-4 rounded-md flex items-center gap-3 border ${
                  formStatus.type === "error"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : formStatus.type === "success"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                }`}
                role={formStatus.type === "error" ? "alert" : "status"}
              >
                {formStatus.type === "error" ? (
                  <MdErrorOutline
                    size={20}
                    aria-hidden="true"
                    className="shrink-0"
                  />
                ) : formStatus.type === "success" ? (
                  <MdCheckCircle
                    size={20}
                    aria-hidden="true"
                    className="shrink-0"
                  />
                ) : null}
                <span className="text-base font-medium">
                  {formStatus.message}
                </span>
              </div>
            )}
          </div>

          {/* Main Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-8 bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-200"
            aria-labelledby="add-warehouse-heading"
          >
            {/* Facility Details Fieldset */}
            <fieldset className="flex flex-col gap-4">
              <legend className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 w-full">
                Facility Details
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-900"
                  >
                    Warehouse Name{" "}
                    <span
                      className="text-red-600"
                      aria-hidden="true"
                      title="Required"
                    >
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-base text-gray-900 transition-shadow"
                    placeholder="e.g., Central Hub Dhaka"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="warehouseCode"
                    className="text-sm font-medium text-gray-900"
                  >
                    Warehouse Code{" "}
                    <span
                      className="text-red-600"
                      aria-hidden="true"
                      title="Required"
                    >
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    id="warehouseCode"
                    name="warehouseCode"
                    value={formData.warehouseCode}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-describedby="code-hint"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-base text-gray-900 uppercase transition-shadow"
                    placeholder="e.g., WH-DHK-01"
                  />
                  <span
                    id="code-hint"
                    className="text-xs font-medium text-gray-500"
                  >
                    Must be unique and under 20 characters.
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="capacity"
                    className="text-sm font-medium text-gray-900"
                  >
                    Capacity (sq ft)
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-base text-gray-900 transition-shadow"
                    placeholder="e.g., 5000"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contactNumber"
                    className="text-sm font-medium text-gray-900"
                  >
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    aria-describedby="phone-hint"
                    pattern="^(?:\+88|88)?(01[3-9]\d{8})$"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-base text-gray-900 transition-shadow"
                    placeholder="e.g., 017XXXXXXXX"
                  />
                  <span
                    id="phone-hint"
                    className="text-xs font-medium text-gray-500"
                  >
                    Valid Bangladeshi format only.
                  </span>
                </div>
              </div>
            </fieldset>

            {/* Location Information Fieldset */}
            <fieldset className="flex flex-col gap-4">
              <legend className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 w-full">
                Location Information
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label
                    htmlFor="address"
                    className="text-sm font-medium text-gray-900"
                  >
                    Street Address{" "}
                    <span
                      className="text-red-600"
                      aria-hidden="true"
                      title="Required"
                    >
                      *
                    </span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-base text-gray-900 resize-y transition-shadow"
                    placeholder="Enter full street address"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="district"
                    className="text-sm font-medium text-gray-900"
                  >
                    District{" "}
                    <span
                      className="text-red-600"
                      aria-hidden="true"
                      title="Required"
                    >
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-base text-gray-900 transition-shadow"
                    placeholder="e.g., Dhaka"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="country"
                    className="text-sm font-medium text-gray-900"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-200 bg-gray-100 rounded-md text-gray-500 cursor-not-allowed select-none"
                  />
                </div>
              </div>
            </fieldset>

            {/* Form Actions */}
            <div className="flex items-center justify-end pt-4 mt-2 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2 px-8 py-3 rounded-md w-full md:w-auto shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                aria-disabled={isSubmitting}
              >
                <MdSave size={20} aria-hidden="true" />
                {isSubmitting ? "Saving..." : "Save Warehouse"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddWarehousePage;
