
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MdArrowBack,
  MdBusiness,
  MdCheck,
  MdClose,
  MdCloudUpload,
  MdDeleteOutline,
  MdEmail,
  MdLanguage,
  MdLocationOn,
  MdPhone,
  MdPerson,
  MdPublic,
  MdRefresh,
  MdSave,
  MdVerified,
} from "react-icons/md";

const INITIAL_FORM = {
  brandName: "",
  brandCode: "",
  description: "",
  contactPerson: "",
  email: "",
  phoneNumber: "",
  website: "",
  address: "",
  district: "",
  country: "Bangladesh",
  status: "Active",
};

const MAX_LOGO_SIZE = 5 * 1024 * 1024;

const CreateBrandPage = () => {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(INITIAL_FORM);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ------------------------------------------------------------
  // Completion
  // ------------------------------------------------------------

  const completion = useMemo(() => {
    const fields = [
      form.brandName,
      form.brandCode,
      form.description,
      form.contactPerson,
      form.email,
      form.phoneNumber,
      form.website,
      form.address,
      form.district,
      form.country,
      form.status,
    ];

    const completed = fields.filter(
      (field) => String(field || "").trim().length > 0,
    ).length;

    return Math.round((completed / fields.length) * 100);
  }, [form]);

  // ------------------------------------------------------------
  // Cleanup object URL
  // ------------------------------------------------------------

  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  // ------------------------------------------------------------
  // Generic change handler
  // ------------------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setSubmitError("");
    setSuccessMessage("");
  };

  // ------------------------------------------------------------
  // Brand name + automatic brand code
  // ------------------------------------------------------------

  const generateBrandCode = (value) => {
    return value
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, "")
      .slice(0, 10)
      .toUpperCase();
  };

  const handleBrandNameChange = (e) => {
    const value = e.target.value;

    setForm((prev) => {
      const previousGeneratedCode = generateBrandCode(prev.brandName);

      const shouldUpdateCode =
        !prev.brandCode || prev.brandCode === previousGeneratedCode;

      return {
        ...prev,
        brandName: value,
        brandCode: shouldUpdateCode
          ? generateBrandCode(value)
          : prev.brandCode,
      };
    });

    if (errors.brandName) {
      setErrors((prev) => ({
        ...prev,
        brandName: "",
      }));
    }

    setSubmitError("");
    setSuccessMessage("");
  };

  // ------------------------------------------------------------
  // Validation
  // ------------------------------------------------------------

  const validateField = (name, value) => {
    let message = "";

    const trimmedValue = String(value || "").trim();

    switch (name) {
      case "brandName":
        if (!trimmedValue) {
          message = "Brand name is required";
        } else if (trimmedValue.length < 2) {
          message = "Brand name must be at least 2 characters";
        } else if (trimmedValue.length > 100) {
          message = "Brand name cannot exceed 100 characters";
        }
        break;

      case "brandCode":
        if (trimmedValue.length > 30) {
          message = "Brand code cannot exceed 30 characters";
        }
        break;

      case "description":
        if (trimmedValue.length > 1000) {
          message = "Description cannot exceed 1000 characters";
        }
        break;

      case "contactPerson":
        if (trimmedValue.length > 100) {
          message = "Contact person cannot exceed 100 characters";
        }
        break;

      case "email":
        if (trimmedValue) {
          const emailRegex =
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

          if (!emailRegex.test(trimmedValue)) {
            message = "Please provide a valid email address";
          }
        }
        break;

      case "phoneNumber":
        if (trimmedValue) {
          const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;

          if (!phoneRegex.test(trimmedValue)) {
            message = "Please provide a valid Bangladeshi phone number";
          }
        }
        break;

      case "website":
        if (trimmedValue) {
          const websiteRegex = /^https?:\/\/.+/;

          if (!websiteRegex.test(trimmedValue)) {
            message = "Website must start with http:// or https://";
          }
        }
        break;

      case "address":
        if (trimmedValue.length > 250) {
          message = "Address cannot exceed 250 characters";
        }
        break;

      case "district":
        if (trimmedValue.length > 100) {
          message = "District cannot exceed 100 characters";
        }
        break;

      case "country":
        if (!trimmedValue) {
          message = "Country is required";
        } else if (trimmedValue.length > 100) {
          message = "Country cannot exceed 100 characters";
        }
        break;

      case "status":
        if (!["Active", "Inactive"].includes(trimmedValue)) {
          message = "Please select a valid brand status";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: message,
    }));

    return !message;
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    validateField(name, form[name]);
  };

  const validateForm = () => {
    const fieldNames = [
      "brandName",
      "brandCode",
      "description",
      "contactPerson",
      "email",
      "phoneNumber",
      "website",
      "address",
      "district",
      "country",
      "status",
    ];

    const nextErrors = {};
    let isValid = true;

    fieldNames.forEach((name) => {
      const value = String(form[name] || "").trim();
      let message = "";

      switch (name) {
        case "brandName":
          if (!value) {
            message = "Brand name is required";
          } else if (value.length < 2) {
            message = "Brand name must be at least 2 characters";
          } else if (value.length > 100) {
            message = "Brand name cannot exceed 100 characters";
          }
          break;

        case "brandCode":
          if (value.length > 30) {
            message = "Brand code cannot exceed 30 characters";
          }
          break;

        case "description":
          if (value.length > 1000) {
            message = "Description cannot exceed 1000 characters";
          }
          break;

        case "contactPerson":
          if (value.length > 100) {
            message = "Contact person cannot exceed 100 characters";
          }
          break;

        case "email":
          if (value) {
            const emailRegex =
              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            if (!emailRegex.test(value)) {
              message = "Please provide a valid email address";
            }
          }
          break;

        case "phoneNumber":
          if (value) {
            const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;

            if (!phoneRegex.test(value)) {
              message = "Please provide a valid Bangladeshi phone number";
            }
          }
          break;

        case "website":
          if (value && !/^https?:\/\/.+/.test(value)) {
            message = "Website must start with http:// or https://";
          }
          break;

        case "address":
          if (value.length > 250) {
            message = "Address cannot exceed 250 characters";
          }
          break;

        case "district":
          if (value.length > 100) {
            message = "District cannot exceed 100 characters";
          }
          break;

        case "country":
          if (!value) {
            message = "Country is required";
          } else if (value.length > 100) {
            message = "Country cannot exceed 100 characters";
          }
          break;

        case "status":
          if (!["Active", "Inactive"].includes(value)) {
            message = "Please select a valid brand status";
          }
          break;

        default:
          break;
      }

      if (message) {
        isValid = false;
        nextErrors[name] = message;
      }
    });

    setErrors(nextErrors);

    setTouched(
      fieldNames.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {}),
    );

    return isValid;
  };

  // ------------------------------------------------------------
  // Logo handling
  // ------------------------------------------------------------

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSubmitError("Please select a valid image file.");
      return;
    }

    if (file.size > MAX_LOGO_SIZE) {
      setSubmitError("Logo size cannot exceed 5MB.");
      return;
    }

    if (logoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setLogoFile(file);
    setLogoPreview(previewUrl);

    setSubmitError("");
    setSuccessMessage("");
  };

  const removeLogo = () => {
    if (logoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoFile(null);
    setLogoPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ------------------------------------------------------------
  // Reset
  // ------------------------------------------------------------

  const handleReset = () => {
    if (isSubmitting) return;

    if (logoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    setForm(INITIAL_FORM);
    setLogoFile(null);
    setLogoPreview("");
    setErrors({});
    setTouched({});
    setSubmitError("");
    setSuccessMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ------------------------------------------------------------
  // Submit
  // ------------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitError("");
    setSuccessMessage("");

    const isValid = validateForm();

    if (!isValid) {
      setSubmitError(
        "Please fix the highlighted fields before submitting.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("brandName", form.brandName.trim());

      if (form.brandCode.trim()) {
        formData.append(
          "brandCode",
          form.brandCode.trim().toUpperCase(),
        );
      }

      if (form.description.trim()) {
        formData.append("description", form.description.trim());
      }

      if (form.contactPerson.trim()) {
        formData.append(
          "contactPerson",
          form.contactPerson.trim(),
        );
      }

      if (form.email.trim()) {
        formData.append(
          "email",
          form.email.trim().toLowerCase(),
        );
      }

      if (form.phoneNumber.trim()) {
        formData.append(
          "phoneNumber",
          form.phoneNumber.trim(),
        );
      }

      if (form.website.trim()) {
        formData.append("website", form.website.trim());
      }

      if (form.address.trim()) {
        formData.append("address", form.address.trim());
      }

      if (form.district.trim()) {
        formData.append("district", form.district.trim());
      }

      formData.append("country", form.country.trim());
      formData.append("status", form.status);

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const response = await fetch("/api/brand", {
        method: "POST",
        body: formData,
        credentials: "include",
        cache: "no-store",
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to create brand.",
        );
      }

      setSuccessMessage(
        data?.message ||
          "Brand has been created successfully.",
      );

      setTimeout(() => {
        router.push("/dashboard/brands");
      }, 1000);
    } catch (error) {
      console.error("Create brand error:", error);

      setSubmitError(
        error?.message ||
          "Something went wrong while creating the brand.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------

  const getInitial = () => {
    const initial = form.brandName
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase();

    return initial || <MdBusiness size={42} />;
  };

  const inputClass = (name) => `
    w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800
    outline-none transition-all duration-200
    placeholder:text-slate-400
    ${
      errors[name] && touched[name]
        ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-100"
        : "border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
    }
  `;

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#f7f8fa] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              aria-label="Go back"
            >
              <MdArrowBack size={21} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Create Brand
                </h1>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                  New
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Add a new brand to your inventory system.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MdRefresh size={19} />
              Reset
            </button>

            <button
              type="submit"
              form="create-brand-form"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating...
                </>
              ) : (
                <>
                  <MdSave size={19} />
                  Create Brand
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Brand profile completion
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Complete the available information to create a richer
                brand profile.
              </p>
            </div>

            <span className="text-sm font-bold text-slate-900">
              {completion}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-slate-900 transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        {/* Alerts */}
        {submitError && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <MdClose
              className="mt-0.5 shrink-0"
              size={19}
            />

            <span>{submitError}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <MdCheck
              className="mt-0.5 shrink-0"
              size={19}
            />

            <span>{successMessage}</span>
          </div>
        )}

        <form
          id="create-brand-form"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">

            {/* ================================================= */}
            {/* Main Form */}
            {/* ================================================= */}

            <div className="space-y-6">

              {/* Basic Information */}
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <MdBusiness size={21} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-slate-900">
                        Basic Information
                      </h2>

                      <p className="text-xs text-slate-500">
                        Main information about the brand.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">

                  {/* Brand Name */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Brand Name{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="brandName"
                      value={form.brandName}
                      onChange={handleBrandNameChange}
                      onBlur={handleBlur}
                      maxLength={100}
                      placeholder="e.g. Samsung"
                      className={inputClass("brandName")}
                    />

                    <div className="mt-1.5 flex justify-between">
                      {errors.brandName &&
                      touched.brandName ? (
                        <p className="text-xs text-red-500">
                          {errors.brandName}
                        </p>
                      ) : (
                        <span />
                      )}

                      <span className="text-[11px] text-slate-400">
                        {form.brandName.length}/100
                      </span>
                    </div>
                  </div>

                  {/* Brand Code */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Brand Code
                    </label>

                    <input
                      type="text"
                      name="brandCode"
                      value={form.brandCode}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "brandCode",
                            value:
                              e.target.value.toUpperCase(),
                          },
                        })
                      }
                      onBlur={handleBlur}
                      maxLength={30}
                      placeholder="e.g. SAM"
                      className={`${inputClass(
                        "brandCode",
                      )} uppercase`}
                    />

                    <div className="mt-1.5 flex justify-between">
                      {errors.brandCode &&
                      touched.brandCode ? (
                        <p className="text-xs text-red-500">
                          {errors.brandCode}
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400">
                          Automatically suggested from brand name
                        </p>
                      )}

                      <span className="text-[11px] text-slate-400">
                        {form.brandCode.length}/30
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={1000}
                      rows={5}
                      placeholder="Write a short description about this brand..."
                      className={`${inputClass(
                        "description",
                      )} resize-none`}
                    />

                    <div className="mt-1.5 flex justify-between">
                      {errors.description &&
                      touched.description ? (
                        <p className="text-xs text-red-500">
                          {errors.description}
                        </p>
                      ) : (
                        <span />
                      )}

                      <span className="text-[11px] text-slate-400">
                        {form.description.length}/1000
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Logo */}
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <MdCloudUpload size={21} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-slate-900">
                        Brand Logo
                      </h2>

                      <p className="text-xs text-slate-500">
                        Upload a clear logo for this brand.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-5 py-8 text-center transition hover:border-slate-300">

                    {logoPreview ? (
                      <div className="relative">
                        <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                          <img
                            src={logoPreview}
                            alt="Brand logo preview"
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={removeLogo}
                          className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border border-red-100 bg-white text-red-500 shadow-md transition hover:bg-red-50"
                          aria-label="Remove logo"
                        >
                          <MdDeleteOutline size={19} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm">
                        <MdCloudUpload size={36} />
                      </div>
                    )}

                    <div className="mt-5">
                      <p className="text-sm font-semibold text-slate-800">
                        {logoPreview
                          ? "Logo selected"
                          : "Upload your brand logo"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        PNG, JPG, JPEG, WEBP · Maximum 5MB
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      {logoPreview
                        ? "Change Logo"
                        : "Choose Logo"}
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleLogoChange}
                      className="hidden"
                    />

                    {logoFile && (
                      <p className="mt-3 max-w-full truncate text-xs text-slate-400">
                        {logoFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <MdPerson size={21} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-slate-900">
                        Contact Information
                      </h2>

                      <p className="text-xs text-slate-500">
                        Contact details for this brand.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">

                  {/* Contact Person */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Contact Person
                    </label>

                    <div className="relative">
                      <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        name="contactPerson"
                        value={form.contactPerson}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={100}
                        placeholder="e.g. Samsung Bangladesh"
                        className={`${inputClass(
                          "contactPerson",
                        )} pl-10`}
                      />
                    </div>

                    {errors.contactPerson &&
                      touched.contactPerson && (
                        <p className="mt-1.5 text-xs text-red-500">
                          {errors.contactPerson}
                        </p>
                      )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email
                    </label>

                    <div className="relative">
                      <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="contact@example.com"
                        className={`${inputClass(
                          "email",
                        )} pl-10`}
                      />
                    </div>

                    {errors.email && touched.email && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Phone Number
                    </label>

                    <div className="relative">
                      <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                      <input
                        type="tel"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="+8801XXXXXXXXX"
                        className={`${inputClass(
                          "phoneNumber",
                        )} pl-10`}
                      />
                    </div>

                    {errors.phoneNumber &&
                      touched.phoneNumber && (
                        <p className="mt-1.5 text-xs text-red-500">
                          {errors.phoneNumber}
                        </p>
                      )}
                  </div>

                  {/* Website */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Website
                    </label>

                    <div className="relative">
                      <MdLanguage className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                      <input
                        type="url"
                        name="website"
                        value={form.website}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="https://example.com"
                        className={`${inputClass(
                          "website",
                        )} pl-10`}
                      />
                    </div>

                    {errors.website &&
                      touched.website && (
                        <p className="mt-1.5 text-xs text-red-500">
                          {errors.website}
                        </p>
                      )}
                  </div>
                </div>
              </section>

              {/* Address */}
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <MdLocationOn size={21} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-slate-900">
                        Address
                      </h2>

                      <p className="text-xs text-slate-500">
                        Location information for the brand.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Address
                    </label>

                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={250}
                      rows={3}
                      placeholder="Full business address"
                      className={`${inputClass(
                        "address",
                      )} resize-none`}
                    />

                    <div className="mt-1.5 flex justify-between">
                      {errors.address &&
                      touched.address ? (
                        <p className="text-xs text-red-500">
                          {errors.address}
                        </p>
                      ) : (
                        <span />
                      )}

                      <span className="text-[11px] text-slate-400">
                        {form.address.length}/250
                      </span>
                    </div>
                  </div>

                  {/* District */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      District
                    </label>

                    <input
                      type="text"
                      name="district"
                      value={form.district}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={100}
                      placeholder="e.g. Dhaka"
                      className={inputClass("district")}
                    />

                    {errors.district &&
                      touched.district && (
                        <p className="mt-1.5 text-xs text-red-500">
                          {errors.district}
                        </p>
                      )}
                  </div>

                  {/* Country */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Country{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <MdPublic className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={100}
                        className={`${inputClass(
                          "country",
                        )} pl-10`}
                      />
                    </div>

                    {errors.country &&
                      touched.country && (
                        <p className="mt-1.5 text-xs text-red-500">
                          {errors.country}
                        </p>
                      )}
                  </div>
                </div>
              </section>
            </div>

            {/* ================================================= */}
            {/* Right Sidebar */}
            {/* ================================================= */}

            <div className="space-y-6">

              {/* Live Preview */}
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-slate-900 px-5 py-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Live Preview
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Brand Profile
                  </h2>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-2xl font-bold text-slate-700">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Preview"
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        getInitial()
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold text-slate-900">
                        {form.brandName ||
                          "Your Brand Name"}
                      </h3>

                      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {form.brandCode || "BRAND CODE"}
                      </p>

                      <span
                        className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          form.status === "Active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            form.status === "Active"
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        />

                        {form.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Description
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {form.description ||
                        "Your brand description will appear here."}
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    {form.contactPerson && (
                      <PreviewItem
                        icon={<MdPerson size={17} />}
                        label="Contact"
                        value={form.contactPerson}
                      />
                    )}

                    {form.email && (
                      <PreviewItem
                        icon={<MdEmail size={17} />}
                        label="Email"
                        value={form.email}
                      />
                    )}

                    {form.phoneNumber && (
                      <PreviewItem
                        icon={<MdPhone size={17} />}
                        label="Phone"
                        value={form.phoneNumber}
                      />
                    )}

                    {form.website && (
                      <PreviewItem
                        icon={<MdLanguage size={17} />}
                        label="Website"
                        value={form.website}
                      />
                    )}

                    {(form.district ||
                      form.country) && (
                      <PreviewItem
                        icon={<MdLocationOn size={17} />}
                        label="Location"
                        value={[
                          form.district,
                          form.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      />
                    )}
                  </div>
                </div>
              </section>

              {/* Status */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Brand Status
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Control whether this brand is currently
                      available for your inventory.
                    </p>
                  </div>

                  <MdVerified
                    size={23}
                    className={
                      form.status === "Active"
                        ? "text-emerald-500"
                        : "text-slate-300"
                    }
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        status: "Active",
                      }))
                    }
                    className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                      form.status === "Active"
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Active
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        status: "Inactive",
                      }))
                    }
                    className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                      form.status === "Inactive"
                        ? "bg-white text-slate-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Inactive
                  </button>
                </div>
              </section>

              {/* Checklist */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="font-semibold text-slate-900">
                  Before You Create
                </h2>

                <div className="mt-4 space-y-3">
                  <ChecklistItem
                    completed={Boolean(
                      form.brandName.trim(),
                    )}
                    text="Brand name"
                  />

                  <ChecklistItem
                    completed={Boolean(
                      form.brandCode.trim(),
                    )}
                    text="Brand code"
                  />

                  <ChecklistItem
                    completed={Boolean(logoFile)}
                    text="Brand logo"
                    optional
                  />

                  <ChecklistItem
                    completed={Boolean(
                      form.contactPerson.trim() ||
                        form.email.trim() ||
                        form.phoneNumber.trim(),
                    )}
                    text="Contact information"
                    optional
                  />

                  <ChecklistItem
                    completed={Boolean(
                      form.country.trim(),
                    )}
                    text="Country"
                  />
                </div>
              </section>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating Brand...
                </>
              ) : (
                <>
                  <MdSave size={19} />
                  Create Brand
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================
// Preview Item
// ============================================================

const PreviewItem = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="truncate text-sm font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
};

// ============================================================
// Checklist Item
// ============================================================

const ChecklistItem = ({
  completed,
  text,
  optional = false,
}) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          completed
            ? "bg-emerald-100 text-emerald-600"
            : "bg-slate-100 text-slate-300"
        }`}
      >
        <MdCheck size={15} />
      </div>

      <span
        className={`text-sm ${
          completed
            ? "font-medium text-slate-700"
            : "text-slate-400"
        }`}
      >
        {text}

        {optional && (
          <span className="ml-1 text-[11px] text-slate-400">
            (optional)
          </span>
        )}
      </span>
    </div>
  );
};

export default CreateBrandPage;
