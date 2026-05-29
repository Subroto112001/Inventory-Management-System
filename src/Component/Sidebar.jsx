"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { BiPurchaseTagAlt, BiSolidOffer } from "react-icons/bi";
import { CgShutterstock } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa";
import { FaClipboardUser } from "react-icons/fa6";
import { FcSalesPerformance } from "react-icons/fc";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { LuBuilding2, LuCar, LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <LuLayoutDashboard />, link: "/" },
    { name: "Users", icon: <FaRegUser />, link: "/user" },
    {
      name: "Products",
      icon: <MdOutlineProductionQuantityLimits />,
      link: "/products",
    },
    { name: "Stock", icon: <CgShutterstock />, link: "/stock" },
    { name: "Orders", icon: <BiPurchaseTagAlt />, link: "/order" },
    {
      name: "Sales",
      icon: <VscGraph />,
      link: "/create_neworder",
    },
    {
      name: "Procurement (PO)",
      icon: <LuCar />,
      link: "/procurement",
    },
    {
      name: "Promotions",
      icon: <BiSolidOffer />,
      link: "/promotions",
    },
    { name: "Customers", icon: <FaClipboardUser />, link: "/customer" },
    { name: "Reports", icon: <HiOutlineDocumentReport />, link: "/report" },
  ];

  return (
    <nav
      className="bg-white h-full border-r border-gray-100 print:hidden"
      aria-label="Sidebar Navigation"
    >
      <div className="p-5">
        <div>
          <div className="border-b border-gray-100">
            <div className="flex items-center gap-2 p-4 mb-3 text-white rounded-md">
              <span
                className="text-xl p-3 bg-white text-[#611F69] rounded-md"
                aria-hidden="true"
              >
                <LuBuilding2 />
              </span>
              <div>
                <span className="text-[18px] text-[#611F69] font-medium">
                  Skyirpto Product
                </span>
                <p className="text-gray-400 text-[14px]">Operation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Semantic list wrapper */}
        <ul className="mt-4 flex flex-col gap-2">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.link;

            return (
              <li key={index}>
                <Link
                  href={item.link}
                  aria-current={isActive ? "page" : undefined}
                  className={`p-2 cursor-pointer transition-all rounded-md flex items-center gap-2 group ${
                    isActive
                      ? "bg-[#611F69] text-white font-medium shadow-sm"
                      : "text-gray-700 bg-white hover:bg-[#611F69] hover:text-white"
                  }`}
                >
                  <span
                    className={`text-xl transition-all ${
                      isActive
                        ? "text-white"
                        : "text-[#611F69] group-hover:text-white"
                    }`}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
