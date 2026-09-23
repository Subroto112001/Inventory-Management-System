"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  MdArrowBack,
  MdEdit,
  MdInventory2,
  MdLocalOffer,
} from "react-icons/md";
import placeholder from "../../../../assets/image/Camera.png";

const ProductDetailsPage = () => {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/product/${params.id}`, {
        cache: "no-store",
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        throw new Error(data.message || "Failed to load product");
      }

      setProduct(data.product);
    } catch (error) {
      console.error("Fetch product error:", error);
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.id) {
      fetchProduct();
    }
  }, [params?.id]);

  // -----------------------------
  // Loading
  // -----------------------------
  if (loading) {
    return (
      <div className="p-5">
        <div className="min-h-[400px] flex items-center justify-center">
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Error
  // -----------------------------
  if (error || !product) {
    return (
      <div className="p-5">
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
          <p className="text-red-500">{error || "Product not found."}</p>

          <Link
            href="/product"
            className="bg-[#611F69] text-white py-2 px-4 rounded-md border border-[#611F69] hover:bg-transparent hover:text-[#611F69] transition-all"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const price = Number(product.price || 0);
  const wholesalePrice = Number(product.wholesalePrice || 0);
  const discount = Number(product.discount || 0);

  const quantity = Number(product.quantity || 0);
  const initialStock = Number(product.initialStock || 0);
  const currentStock = Number(product.currentStock || 0);
  const lowStockAlert = Number(product.lowStockAlert || 0);

  const offers = product.offers || [];

  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= lowStockAlert;

  return (
    <div className="p-5">
      <div className="flex flex-col gap-5">
        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer"
              aria-label="Go back"
            >
              <MdArrowBack className="text-[22px]" />
            </button>

            <div className="flex flex-col gap-1">
              <h1 className="text-[24px] font-bold">Product Details</h1>

              <p className="text-gray-500">
                View product information & inventory details
              </p>
            </div>
          </div>

          <Link
            href={`/editproduct/${product.id}`}
            className="bg-[#611F69] text-white py-2 px-4 border border-[#611F69] rounded-md flex items-center gap-2 cursor-pointer hover:bg-transparent hover:text-[#611F69] transition-all"
          >
            <MdEdit className="text-[20px]" />
            <span>Edit Product</span>
          </Link>
        </div>

        {/* ================= PRODUCT MAIN ================= */}
        <div className="border border-gray-200 rounded-md p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ================= IMAGE ================= */}
            <div className="relative">
              {/* Stock Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                    isOutOfStock
                      ? "bg-red-600"
                      : isLowStock
                        ? "bg-orange-500"
                        : "bg-green-600"
                  }`}
                >
                  {isOutOfStock
                    ? "Out of Stock"
                    : isLowStock
                      ? "Low Stock"
                      : "In Stock"}
                </span>
              </div>

              <div className="border border-gray-200 rounded-md bg-gray-50 p-5 flex items-center justify-center min-h-[450px]">
                <Image
                  src={product.image || placeholder}
                  alt={product.productName || "Product"}
                  width={500}
                  height={500}
                  className="object-contain rounded-md max-h-[450px]"
                />
              </div>
            </div>

            {/* ================= PRODUCT INFO ================= */}
            <div className="flex flex-col gap-5">
              {/* Product Name */}
              <div>
                <p className="text-sm text-gray-400 mb-1">Product Name</p>

                <h2 className="text-[28px] font-bold text-[#611F69]">
                  {product.productName}
                </h2>
              </div>

              {/* SKU */}
              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-gray-400">SKU</p>

                <p className="font-medium mt-1">
                  {product.productSKU || "N/A"}
                </p>
              </div>

              {/* Brand */}
              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-gray-400">Brand</p>

                <p className="font-medium mt-1">{product.brandName || "N/A"}</p>
              </div>

              {/* Price */}
              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-gray-400">Selling Price</p>

                <div className="flex items-center gap-3 mt-1">
                  <p className="text-[28px] font-bold">${price.toFixed(2)}</p>

                  {discount > 0 && (
                    <span className="bg-red-50 text-red-600 px-2 py-1 rounded-md text-sm font-semibold">
                      {discount}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Wholesale Price */}
              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-gray-400">Wholesale Price</p>

                <p className="text-[20px] font-semibold mt-1">
                  {wholesalePrice > 0 ? `$${wholesalePrice.toFixed(2)}` : "N/A"}
                </p>
              </div>

              {/* Unit */}
              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-gray-400">Unit</p>

                <p className="font-medium mt-1">{product.unit || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= INVENTORY ================= */}
        <div className="border border-gray-200 rounded-md p-5">
          <div className="flex items-center gap-2 mb-5">
            <MdInventory2 className="text-[22px] text-[#611F69]" />

            <h2 className="text-[20px] font-bold">Inventory Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Current Stock */}
            <div className="border border-gray-200 rounded-md p-4">
              <p className="text-sm text-gray-400">Current Stock</p>

              <p className="text-[26px] font-bold mt-2">{currentStock}</p>
            </div>

            {/* Initial Stock */}
            <div className="border border-gray-200 rounded-md p-4">
              <p className="text-sm text-gray-400">Initial Stock</p>

              <p className="text-[26px] font-bold mt-2">{initialStock}</p>
            </div>

            {/* Quantity */}
            <div className="border border-gray-200 rounded-md p-4">
              <p className="text-sm text-gray-400">Quantity</p>

              <p className="text-[26px] font-bold mt-2">{quantity}</p>
            </div>

            {/* Low Stock Alert */}
            <div className="border border-gray-200 rounded-md p-4">
              <p className="text-sm text-gray-400">Low Stock Alert</p>

              <p className="text-[26px] font-bold mt-2">{lowStockAlert}</p>
            </div>
          </div>
        </div>

        {/* ================= OFFERS ================= */}
        {offers.length > 0 && (
          <div className="border border-gray-200 rounded-md p-5">
            <div className="flex items-center gap-2 mb-5">
              <MdLocalOffer className="text-[22px] text-[#611F69]" />

              <h2 className="text-[20px] font-bold">Active Offers</h2>
            </div>

            <div className="flex flex-col gap-3">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="border border-amber-200 bg-amber-50 rounded-md p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <h3 className="font-semibold text-amber-900">
                        {offer.offerName}
                      </h3>

                      {offer.offerCode && (
                        <p className="text-sm text-amber-700 mt-1">
                          Code: {offer.offerCode}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-amber-800">
                        {offer.discountType === "Percentage"
                          ? `${offer.discountValue}% OFF`
                          : `৳${offer.discountValue} OFF`}
                      </p>

                      {offer.maxDiscountAmount && (
                        <p className="text-xs text-amber-700 mt-1">
                          Max discount: ৳{offer.maxDiscountAmount}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-amber-200">
                    <p className="text-xs text-amber-700">
                      Valid from{" "}
                      {new Date(offer.startDate).toLocaleDateString()} to{" "}
                      {new Date(offer.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= DESCRIPTION ================= */}
        <div className="border border-gray-200 rounded-md p-5">
          <h2 className="text-[20px] font-bold mb-4">Description</h2>

          {product.description ? (
            <p className="text-gray-600 leading-7 whitespace-pre-line">
              {product.description}
            </p>
          ) : (
            <p className="text-gray-400">No description available.</p>
          )}
        </div>

        {/* ================= STATUS ================= */}
        <div className="border border-gray-200 rounded-md p-5">
          <h2 className="text-[20px] font-bold mb-4">Product Status</h2>

          <div className="flex items-center gap-3">
            <span
              className={`w-3 h-3 rounded-full ${
                product.isActive ? "bg-green-500" : "bg-red-500"
              }`}
            />

            <p className="font-medium">
              {product.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
