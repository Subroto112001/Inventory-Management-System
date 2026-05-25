"use client";
import ColorButton from "@/Component/Button/ColorButton";
import TransparentButton from "@/Component/Button/TransparentButton";
import { IconProvider } from "@/Provider/IconProvider";
import Link from "next/link";
import React, { useState } from "react";

const Page = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  console.log("From data:-", formData);

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
    { label: "Upload Product Picture", name: "productPicture", type: "file" },
  ];

  const handlePublish = () => {
    alert("Product published successfully!");
  };

  return (
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {input_fields.map((item, index) => (
            <div key={index} className="flex flex-col gap-1">
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
                value={formData[item.name]}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#611F69] focus:border-transparent transition-all"
                placeholder={`Enter ${item.label.toLowerCase()}`}
              />
            </div>
          ))}

          {/* Description */}
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
        <div className="mt-5">
          <ColorButton
            value="Publish Product"
            onClick={() => handlePublish()}
          />
        </div>
      </section>
    </main>
  );
};

export default Page;
