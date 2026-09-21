"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { RiShoppingBag4Line } from "react-icons/ri";
import { FiLogOut, FiMoreVertical } from "react-icons/fi";
import {
  MdBusiness,
  MdInventory2,
  MdPeople,
  MdLocalOffer,
  MdManageAccounts,
} from "react-icons/md";

const Header = () => {
  const router = useRouter();

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef(null);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const moreOptions = [
    {
      label: "Add Brand",
      href: "/brands/createbrand",
      icon: <MdBusiness />,
    },
    {
      label: "Add New Product",
      href: "/addnewproduct",
      icon: <MdInventory2 />,
    },
    {
      label: "Add New Customer",
      href: "/customer",
      icon: <MdPeople />,
    },
    {
      label: "Add an Offer",
      href: "/offers",
      icon: <MdLocalOffer />,
    },
    {
      label: "User Management",
      href: "/user",
      icon: <MdManageAccounts />,
    },
  ];

  return (
    <div className="p-5 print:hidden">
      <div className="flex justify-between items-center">
        {/* Logo / Title */}
        <div className="flex items-center gap-2">
          <span className="text-[24px] text-white" aria-hidden="true">
            <RiShoppingBag4Line />
          </span>

          <h1 className="text-white font-semibold text-lg m-0">
            Business Management System
          </h1>
        </div>

        {/* Header Actions */}
        <nav
          className="flex flex-row items-center gap-5"
          aria-label="Top navigation"
        >
          {/* Create New Order */}
          <Link
            href="/create_neworder"
            aria-label="Create New Order"
            className="bg-white px-3 py-2 text-[16px] text-[#611F69] font-medium rounded-md cursor-pointer hover:bg-gray-100 transition-all"
          >
            Create New Order
          </Link>

          {/* More Menu */}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setIsMoreOpen((prev) => !prev)}
              aria-label="More options"
              aria-expanded={isMoreOpen}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 text-white rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-white"
            >
              <FiMoreVertical className="text-[21px]" />

              <span className="text-[15px] font-medium">More</span>
            </button>

            {/* Dropdown */}
            {isMoreOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-[230px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                {/* Dropdown Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">
                    Quick Actions
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Manage your business
                  </p>
                </div>

                {/* Options */}
                <div className="py-2">
                  {moreOptions.map((option) => (
                    <Link
                      key={option.href}
                      href={option.href}
                      onClick={() => setIsMoreOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#611F69]/5 hover:text-[#611F69] transition-all group"
                    >
                      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-[#611F69]/10 group-hover:text-[#611F69] transition-all">
                        <span className="text-[20px]">{option.icon}</span>
                      </span>

                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <Link
            href="/profile"
            aria-label="User Profile"
            className="text-[24px] text-white cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#611F69]"
          >
            <FaUserCircle aria-hidden="true" />
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
            className="text-[22px] text-white cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#611F69]"
          >
            <FiLogOut aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Header;
