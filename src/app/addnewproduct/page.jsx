"use client";
import ColorButton from "@/Component/Button/ColorButton";
import TransparentButton from "@/Component/Button/TransparentButton";
import { IconProvider } from "@/Provider/IconProvider";
import Link from "next/link";
import React, { useState } from "react";

const Page = () => {
  // ১. ডাইনামিক স্টেট ম্যানেজমেন্টের জন্য একটি সিঙ্গেল অবজেক্ট
  const [formData, setFormData] = useState({
    productName: "",
    productSKU: "",
    price: "",
    brandName: "",
    unit: "",
    quantity: "",
    description: "",
    wholesalePrice: "",
    discount: "",
    initialStock: "",
    lowStockAlert: "",
  });

  // ২. ডাইনামিক অনচেঞ্জ হ্যান্ডলার
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // যে ফিল্ডে টাইপ করা হবে, শুধু তার মান আপডেট হবে
    }));
  };

  // ইনপুট ফিল্ডের কনফিগারেশন অ্যারে (নাম এবং টাইপ সহ)
  const input_fields = [
    { label: "Product Name", name: "productName", type: "text" },
    { label: "Product SKU", name: "productSKU", type: "text" },
    { label: "Price", name: "price", type: "number" },
    { label: "Brand Name", name: "brandName", type: "text" },
    { label: "Unit", name: "unit", type: "text" },
    { label: "Quantity", name: "quantity", type: "number" },
    { label: "Wholesale Price", name: "wholesalePrice", type: "number" },
    { label: "Discount", name: "discount", type: "number" },
    { label: "Initial Stock", name: "initialStock", type: "number" },
    { label: "Low Stock Alert", name: "lowStockAlert", type: "number" },
  ];

  return (
    // SEO এর জন্য main ট্যাগ ব্যবহার
    <main className="p-5" id="main-content">
      <div>
        <Link
          href="/products"
          className="inline-flex gap-2 items-center text-gray-700 hover:text-[#611F69] focus:outline-none focus:ring-2 focus:ring-[#611F69] rounded-md"
          aria-label="Go back to products page"
        >
          <span className="text-2xl text-[#611F69]" aria-hidden="true">
            {IconProvider.leftIcon}
          </span>
          <span className="text-[16px] font-medium">Back To Products</span>
        </Link>

        <header className="mt-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1">
            {/* পেজে শুধুমাত্র একটি h1 থাকা উচিত (SEO স্ট্যান্ডার্ড) */}
            <h1 className="text-[24px] font-semibold text-gray-900 m-0">
              Add New Product
            </h1>
            <p className="text-gray-600 m-0">
              Fill in the details to add a new product to your inventory
            </p>
          </div>

          <div className="flex flex-wrap gap-3" aria-label="Product actions">
            <TransparentButton value="Cancel" />
            <TransparentButton value="Save As Draft" />
            <ColorButton value="Publish Product" />
          </div>
        </header>
      </div>

      <section
        className="flex flex-col border border-gray-200 rounded-md p-5 mt-6 bg-white"
        aria-labelledby="product-info-heading"
      >
        <h2
          id="product-info-heading"
          className="text-[18px] font-medium mt-2 mb-4 text-gray-800"
        >
          Product Information
        </h2>

        {/* ফর্ম ফিল্ডগুলোর গ্রিড লেআউট */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {input_fields.map((item, index) => (
            <div key={index} className="flex flex-col gap-1">
              {/* Accessibility (A11y) এর জন্য htmlFor এবং id যোগ করা হয়েছে */}
              <label
                htmlFor={item.name}
                className="text-gray-700 font-medium text-sm"
              >
                {item.label}
              </label>
              <input
                id={item.name}
                name={item.name}
                type={item.type}
                value={formData[item.name]} // ডাইনামিক ভ্যালু
                onChange={handleChange} // ডাইনামিক ফাংশন
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#611F69] focus:border-transparent transition-all"
                placeholder={`Enter ${item.label.toLowerCase()}`}
              />
            </div>
          ))}

          {/* Description ফিল্ডের জন্য Textarea (যেহেতু এটি সাধারণত বড় হয়) */}
          <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-3">
            <label
              htmlFor="description"
              className="text-gray-700 font-medium text-sm"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#611F69] focus:border-transparent transition-all resize-y"
              placeholder="Enter product description"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
