"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MdArrowBack,
  MdCategory,
  MdCloudUpload,
  MdClose,
  MdImage,
  MdCheckCircle,
  MdErrorOutline,
} from "react-icons/md";

export default function CreateCategoryPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    categoryName: "",
    categoryCode: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // =====================================================
  // CLEANUP IMAGE PREVIEW
  // =====================================================

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (message.text) {
      setMessage({
        type: "",
        text: "",
      });
    }
  };

  // =====================================================
  // CATEGORY CODE
  // =====================================================

  const handleCategoryCodeChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/\s/g, "");

    setFormData((prev) => ({
      ...prev,
      categoryCode: value,
    }));

    if (message.text) {
      setMessage({
        type: "",
        text: "",
      });
    }
  };

  // =====================================================
  // IMAGE SELECT
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check image type
    if (!file.type.startsWith("image/")) {
      setMessage({
        type: "error",
        text: "Please select a valid image file.",
      });

      return;
    }

    // Maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Image size must be less than 5MB.",
      });

      return;
    }

    // Remove previous object URL
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setImage(file);
    setImagePreview(previewUrl);

    setMessage({
      type: "",
      text: "",
    });
  };

  // REMOVE IMAGE

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // RESET FORM

  const resetForm = () => {
    setFormData({
      categoryName: "",
      categoryCode: "",
      description: "",
    });

    handleRemoveImage();
  };

  // CREATE CATEGORY

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous message
    setMessage({
      type: "",
      text: "",
    });

    // Frontend Validation

    if (!formData.categoryName.trim()) {
      setMessage({
        type: "error",
        text: "Category name is required.",
      });

      return;
    }

    if (!formData.categoryCode.trim()) {
      setMessage({
        type: "error",
        text: "Category code is required.",
      });

      return;
    }

    if (formData.categoryName.trim().length > 100) {
      setMessage({
        type: "error",
        text: "Category name cannot exceed 100 characters.",
      });

      return;
    }

    if (formData.categoryCode.trim().length > 30) {
      setMessage({
        type: "error",
        text: "Category code cannot exceed 30 characters.",
      });

      return;
    }

    if (formData.description.trim().length > 500) {
      setMessage({
        type: "error",
        text: "Description cannot exceed 500 characters.",
      });

      return;
    }

    try {
      setLoading(true);

      // CREATE FORMDATA

      const data = new FormData();

      data.append("categoryName", formData.categoryName.trim());

      data.append("categoryCode", formData.categoryCode.trim().toUpperCase());

      data.append("description", formData.description.trim());

      // Add image only if selected
      if (image) {
        data.append("image", image);
      }

      // POST API

      const response = await fetch("/api/category", {
        method: "POST",
        body: data,
      });

      // Try to read JSON response
      const result = await response.json();

      // API ERROR

      if (!response.ok) {
        throw new Error(result?.message || "Failed to create category.");
      }

      // SUCCESS

      setMessage({
        type: "success",
        text: result?.message || "Category created successfully!",
      });

      // Reset form
      resetForm();

      // Redirect after 1 second
      setTimeout(() => {
        router.push("/category");
      }, 1000);
    } catch (error) {
      console.error("Create Category Error:", error);

      setMessage({
        type: "error",
        text: error?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f8] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/category"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[#611F69] hover:bg-[#611F69] hover:text-white"
            >
              <MdArrowBack size={21} />
            </Link>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Create Category
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Create a new product category.
              </p>
            </div>
          </div>
        </div>

        {/* MESSAGE */}

        {message.text && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 ${
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <MdCheckCircle className="mt-0.5 shrink-0" size={20} />
            ) : (
              <MdErrorOutline className="mt-0.5 shrink-0" size={20} />
            )}

            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            {/* ================================================= */}
            {/* CATEGORY INFORMATION */}
            {/* ================================================= */}

            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#611F69]/10 text-[#611F69]">
                    <MdCategory size={22} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Category Information
                    </h2>

                    <p className="text-xs text-gray-500">
                      Add the basic information for your category.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6">
                {/* CATEGORY NAME */}

                <div>
                  <label
                    htmlFor="categoryName"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Category Name
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id="categoryName"
                    name="categoryName"
                    type="text"
                    value={formData.categoryName}
                    onChange={handleChange}
                    placeholder="e.g. Electronics"
                    maxLength={100}
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#611F69] focus:bg-white focus:ring-4 focus:ring-[#611F69]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <div className="mt-1.5 flex justify-end">
                    <span className="text-xs text-gray-400">
                      {formData.categoryName.length}/100
                    </span>
                  </div>
                </div>

                {/* CATEGORY CODE */}

                <div>
                  <label
                    htmlFor="categoryCode"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Category Code
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id="categoryCode"
                    name="categoryCode"
                    type="text"
                    value={formData.categoryCode}
                    onChange={handleCategoryCodeChange}
                    placeholder="e.g. ELEC"
                    maxLength={30}
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium uppercase tracking-wide text-gray-900 outline-none transition placeholder:normal-case placeholder:tracking-normal placeholder:text-gray-400 focus:border-[#611F69] focus:bg-white focus:ring-4 focus:ring-[#611F69]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <p className="mt-1.5 text-xs text-gray-400">
                    Use a unique code for this category.
                  </p>
                </div>

                {/* DESCRIPTION */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="description"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Description
                    </label>

                    <span className="text-xs text-gray-400">
                      {formData.description.length}/500
                    </span>
                  </div>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Write a short description about this category..."
                    maxLength={500}
                    rows={7}
                    disabled={loading}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#611F69] focus:bg-white focus:ring-4 focus:ring-[#611F69]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* IMAGE */}
            {/* ================================================= */}

            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="font-semibold text-gray-900">Category Image</h2>

                <p className="mt-1 text-xs text-gray-500">
                  Upload an image for this category.
                </p>
              </div>

              <div className="p-6">
                {imagePreview ? (
                  <div>
                    {/* PREVIEW */}

                    <div className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                      <img
                        src={imagePreview}
                        alt="Category preview"
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={loading}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-md transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed"
                      >
                        <MdClose size={20} />
                      </button>
                    </div>

                    {/* FILE NAME */}

                    <div className="mt-4 flex items-center gap-2">
                      <MdImage size={20} className="shrink-0 text-[#611F69]" />

                      <span className="truncate text-sm font-medium text-gray-700">
                        {image?.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={loading}
                      className="mt-3 text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="flex aspect-square w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 text-center transition hover:border-[#611F69]/50 hover:bg-[#611F69]/5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#611F69]/10 text-[#611F69]">
                      <MdCloudUpload size={30} />
                    </div>

                    <p className="text-sm font-semibold text-gray-700">
                      Upload category image
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Click to select an image
                    </p>

                    <p className="mt-3 text-xs text-gray-400">
                      JPG, JPEG, PNG or WEBP
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Maximum size: 5MB
                    </p>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* ACTION BUTTONS */}
          {/* ================================================= */}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard/category"
              className={`flex h-12 items-center justify-center rounded-xl border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 ${
                loading ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#611F69] px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-[#501657] focus:outline-none focus:ring-4 focus:ring-[#611F69]/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating...
                </>
              ) : (
                <>
                  <MdCheckCircle size={20} />
                  Create Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
