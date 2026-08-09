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
  currentStock,
  onDeleteClick,
}) => {



  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);


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
    <article className="relative border border-gray-200 rounded-md p-4 w-87.5">
      {/* Stock Badge */}
      <div
        className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-semibold text-white ${
          currentStock > 10 ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {currentStock > 10 ? "In Stock" : "Out of Stock"}
      </div>

      <Image
        src={image}
        alt={name}
        className="object-cover rounded-md mb-4"
        loading="lazy"
      />

      <div className="flex flex-col gap-2 mt-5">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col gap-2 border-b border-gray-100 pb-2">
            <p className="text-gray-400 text-[14px]">{SKU}</p>
            <p className="text-[20px] font-bold truncate text-[#611F69] cursor-pointer">
              {name}
            </p>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 cursor-pointer rounded-full text-gray-700 hover:bg-gray-100 hover:text-[#611F69] focus:outline-none focus:ring-2 focus:ring-[#611F69] transition-colors"
              aria-label="Open product actions"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              <MdMoreVert className="text-[24px]" />
            </button>

            {/* Dropdown Items */}
            {isMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-20 flex flex-col overflow-hidden"
                role="menu"
                aria-orientation="vertical"
              >
                <Link
                  href={`/editproduct/${id}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-[#611F69] focus:outline-none focus:bg-gray-100 transition-colors"
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
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50 focus:outline-none focus:bg-red-50 text-left transition-colors border-t border-gray-100"
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

        <div className="flex justify-between items-center mt-3">
          <p className="text-[16px] font-medium">${price.toFixed(2)}</p>
          <p className="text-[16px]">QTY : {currentStock}</p>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
