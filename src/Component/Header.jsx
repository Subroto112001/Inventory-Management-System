import Link from "next/link";
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { RiShoppingBag4Line } from "react-icons/ri";

const Header = () => {
  return (
    <div className="p-5 print:hidden">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-[24px] text-white" aria-hidden="true">
            <RiShoppingBag4Line />
          </span>
          {/* Using h1 for screen reader document structure */}
          <h1 className="text-white font-semibold text-lg m-0">
            Business Management System
          </h1>
        </div>

        {/* Semantic nav wrapper for header actions */}
        <nav
          className="flex flex-row items-center gap-5"
          aria-label="Top navigation"
        >
          <Link
            href="/create_neworder"
            aria-label="Create New Order"
            className="bg-white px-3 py-2 text-[16px] text-[#611F69] font-medium rounded-md cursor-pointer hover:bg-gray-100 transition-all"
          >
            Create New Order
          </Link>

          <Link
            href="/profile"
            aria-label="User Profile"
            className="text-[24px] text-white cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#611F69]"
          >
            <FaUserCircle aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Header;
