
"use client"
import ProductCard from "@/Component/Product_card/Product_card";

import React from "react";
import { GoPlusCircle } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";

const page = () => {
  const products = [
    {
      SKU: "WTCH-001",
      name: "Minimalist Smart Watch Series 5",
      price: 199.99,
      quantity: 10,
    },
    {
      SKU: "PHN-002",
      name: "Sleek Smartphone Pro Max",
      price: 999.99,
      quantity: 5,
    },
    {
      SKU: "LPTP-003",
      name: "Ultra-thin Laptop X200",
      price: 1499.99,
      quantity: 3,
    }]
  
  return (
    <div className="p-5">
      <div className="flex  flex-col gap-5">
        {/* heading of this page */}

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2 ">
              <h1 className="text-[24px] font-bold">Products</h1>
              <p>Manage Your Inventory Catalog & Product Information</p>
            </div>
            <button className="bg-[#611F69] text-white py-2 px-4 border  border-[#611f69] rounded-md flex items-center gap-2 cursor-pointer hover:bg-transparent hover:text-[#611f69]  transition-all">
              <span>
                <GoPlusCircle />
              </span>
              <span>Add Products</span>
            </button>
          </div>

          <div className=" border border-gray-200 rounded-md p-4 mt-4 flex justify-between items-center">
            {/* search Box */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-md p-2 bg-gray-50">
              <span className="text-[22px]">
                <IoSearchOutline />
              </span>
              <input
                type="text"
                placeholder="Search products..."
                className="outline-none"
              />
            </div>
            {/* search Box */}
            <div className=" flex items-center gap-4">
              {/* category */}
              <select
                className="border border-gray-200 rounded-md p-2 bg-gray-50 focus:outline-none focus:ring-0 focus:border-gray-200"
                name="category"
                id="category"
              >
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="home">Home</option>
              </select>
              {/* category */}
              <select
                className="border border-gray-200 rounded-md p-2 bg-gray-50 focus:outline-none focus:ring-0 focus:border-gray-200"
                name="stockStatus"
                id="stockStatus"
              >
                <option value="">Stock Status</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
              {/* sort by */}
              <select
                className="border border-gray-200 rounded-md p-2 bg-gray-50 focus:outline-none focus:ring-0 focus:border-gray-200"
                name="sortBy"
                id="sortBy"
              >
                <option value="">Sort By</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
              {/* sort by */}
            </div>
          </div>
        </div>
        {/* heading of this page */}
        {/* Product Section*/}
        <div className="flex flex-wrap gap-5 mt-5">
          {products.map((product) => (
            <ProductCard
              key={product.SKU}
              SKU={product.SKU}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
        {/* Product Section*/}
      </div>
    </div>
  );
};

export default page;
