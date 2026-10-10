"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdEdit, MdMoreVert, MdDeleteOutline } from "react-icons/md";

const ProductCard = ({
  id,
  SKU,
  name,
  price,
  image,
  categoryName = "",
  brandName = "",
  discount = 0,
  lowStockAlert = 0,
  currentStock,
  offers = [],
  onDeleteClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const basePrice = Number(price) || 0;
  const discountPercent = Number(discount);
  const hasDiscount = Number.isFinite(discountPercent) && discountPercent > 0 && discountPercent <= 100;
  const currentPrice = hasDiscount ? basePrice * (1 - discountPercent / 100) : basePrice;
  const stock = Number(currentStock) || 0;
  const inStock = stock > 0;
  const lowStock = inStock && Number(lowStockAlert) > 0 && stock <= Number(lowStockAlert);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <article className="group relative w-full min-w-0 overflow-hidden rounded-2xl border border-[#E4DED2] bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9A659] hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#F7F3EC]">
        <Link href={`/dash/product_details/${id}`} className="absolute inset-0 flex items-center justify-center p-5" aria-label={`View ${name}`}>
          <Image src={image} alt={name} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]" loading="lazy" width={400} height={300} />
        </Link>
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${!inStock ? "bg-red-100 text-red-800" : lowStock ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-800"}`}>
          {!inStock ? "Out of stock" : lowStock ? "Low stock" : "In stock"}
        </span>
        {hasDiscount && <span className="absolute right-3 top-3 rounded-full bg-[#1F3A2E] px-2.5 py-1 text-[11px] font-semibold text-white">-{discountPercent}%</span>}
      </div>

      <div className="px-1 pb-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {brandName && <p className="mb-1 truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A8378]">{brandName}</p>}
            <Link href={`/dash/product_details/${id}`} className="line-clamp-2 text-base font-semibold leading-5 text-[#211F1D] transition-colors hover:text-[var(--theme-primary)]">
              {name}
            </Link>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 hover:text-[var(--theme-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
              aria-label="Open product actions"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              <MdMoreVert className="text-[22px]" />
            </button>

            {/* Dropdown Items */}
            {isMenuOpen && (
              <div
                className="absolute right-0 z-20 mt-2 flex w-36 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
                role="menu"
                aria-orientation="vertical"
              >
                <Link
                  href={`/dash/editproduct/${id}`}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-800 transition-colors hover:bg-gray-100 hover:text-[var(--theme-primary)] focus:bg-gray-100 focus:outline-none"
                  role="menuitem"
                  aria-label={`Edit ${name}`}
                >
                  <MdEdit className="text-[18px]" />
                  Edit
                </Link>

                <button
                  onClick={() => {
                    onDeleteClick(id, name);
                    setIsMenuOpen(false); // Close menu after clicking delete
                  }}
                  className="flex items-center gap-2 border-t border-gray-100 px-4 py-2.5 text-left text-sm text-red-700 transition-colors hover:bg-red-50 focus:bg-red-50 focus:outline-none"
                  role="menuitem"
                  aria-label={`Delete ${name}`}
                >
                  <MdDeleteOutline className="text-[18px]" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          {categoryName && <p className="min-w-0 truncate text-xs text-[#8A8378]">{categoryName}</p>}
          <p className="shrink-0 text-xs text-[#6F685E]">SKU: {SKU}</p>
        </div>
        <div className="mt-3 flex items-end justify-between gap-3 border-t border-[#F0EDE7] pt-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#8A8378]">Price</p>
            <p className="text-base font-semibold text-[#1F3A2E]">${currentPrice.toFixed(2)}</p>
            {hasDiscount && <p className="text-xs text-[#8A8378] line-through">${basePrice.toFixed(2)}</p>}
          </div>
          <p className="text-right text-xs text-[#6F685E]">Stock <span className="font-semibold text-[#211F1D]">{stock}</span></p>
        </div>
        {offers.length > 0 && (
          <div className="mt-2 rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
            {offers[0].offerName}:{" "}
            {offers[0].discountType === "Percentage"
              ? `${offers[0].discountValue}% off`
              : `৳${offers[0].discountValue} off`}
            {offers.length > 1 ? ` +${offers.length - 1} more` : ""}
          </div>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
