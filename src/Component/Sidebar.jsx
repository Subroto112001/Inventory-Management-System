"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { BiPurchaseTagAlt, BiSolidOffer } from "react-icons/bi";
import { CgShutterstock } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa";
import { FaClipboardUser } from "react-icons/fa6";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { LuBuilding2, LuCar, LuLayoutDashboard } from "react-icons/lu";
import {
  MdLocalOffer,
  MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import { PiWarehouse } from "react-icons/pi";
import { VscGraph } from "react-icons/vsc";
import useCurrentUser from "@/dataProvider/getMe";
import { TbBrandBumble } from "react-icons/tb";

const Sidebar = () => {
  const pathname = usePathname();
  const { mydata, loading } = useCurrentUser();

  const menuItems = [
    { name: "Dashboard", icon: <LuLayoutDashboard />, link: "/" },
    {
      name: "Users",
      icon: <FaRegUser />,
      link: "/user",
      allowedRoles: ["Admin", "System Admin"],
    },
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
    {
      name: "Offers",
      icon: <MdLocalOffer />,
      link: "/offers",
    },
    {
      name: "Brands",
      icon: <TbBrandBumble />,
      link: "/brands",
    },
    {
      name: "Warehouse",
      icon: <PiWarehouse />,
      link: "/warehouse",
    },
    { name: "Customers", icon: <FaClipboardUser />, link: "/customer" },
    { name: "Reports", icon: <HiOutlineDocumentReport />, link: "/report" },
  ];

  /**
   * Filter menu items based on user role
   */
  const filteredMenuItems = menuItems.filter((item) => {
    // If item has no role restrictions
    if (!item.allowedRoles) return true;

    // If user data or role is missing
    if (!mydata || !mydata.role) return false;

    // Check if user's role matches allowed roles
    return item.allowedRoles.includes(mydata.role);
  });

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
        <ul className="mt-4 flex flex-col gap-2" aria-busy={loading}>
          {loading ? (
            /* Skeleton Loading UI with A11y attributes */
            <React.Fragment>
              <li className="sr-only" role="status" aria-live="polite">
                Loading navigation menu...
              </li>
              {Array.from({ length: 8 }).map((_, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 p-2.5 rounded-md animate-pulse bg-gray-50/80"
                  aria-hidden="true"
                >
                  {/* Skeleton Icon */}
                  <div className="w-5 h-5 bg-gray-200 rounded-md shrink-0" />
                  {/* Skeleton Text with natural varying widths */}
                  <div
                    className={`h-4 bg-gray-200 rounded-md ${
                      index % 3 === 0
                        ? "w-28"
                        : index % 2 === 0
                          ? "w-20"
                          : "w-24"
                    }`}
                  />
                </li>
              ))}
            </React.Fragment>
          ) : (
            filteredMenuItems.map((item, index) => {
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
            })
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
