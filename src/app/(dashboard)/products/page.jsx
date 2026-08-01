"use client";
import ProductCard from "@/Component/Product_card/Product_card";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { GoPlusCircle } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import placeholder from '../../../assets/image/Camera.png'
const Page = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();
        console.log(data?.products);
        if (res.ok) {
          setProducts(data.products || []);
        } else {
          console.error("Failed to load products:", data.message);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

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
            <Link
              href="/addnewproduct"
              className="bg-[#611F69] text-white py-2 px-4 border  border-[#611f69] rounded-md flex items-center gap-2 cursor-pointer hover:bg-transparent hover:text-[#611f69]  transition-all"
            >
              <span>
                <GoPlusCircle />
              </span>
              <span>Add Products</span>
            </Link>
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
          {loadingProducts ? (
            <p className="text-gray-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                SKU={product.productSKU}
                name={product.productName}
                price={Number(product.price || 0)}
                quantity={Number(product.quantity || 0)}
                image={product.image || placeholder}
                currentStock={product.currentStock}
              />
            ))
          )}
        </div>
        {/* Product Section*/}
      </div>
    </div>
  );
};

export default Page;
