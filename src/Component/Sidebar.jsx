import Link from "next/link";
import React from "react";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { CgShutterstock } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa";
import { FaClipboardUser } from "react-icons/fa6";
import { FcSalesPerformance } from "react-icons/fc";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { LuBuilding2, LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: <LuLayoutDashboard />, link: "/" },
    { name: "Users", icon: <FaRegUser />, link: "/users" },
    {
      name: "Products",
      icon: <MdOutlineProductionQuantityLimits />,
      link: "/products",
    },
    { name: "Stock", icon: <CgShutterstock />, link: "/settings" },
    { name: "Purchase", icon: <BiPurchaseTagAlt />, link: "/settings" },
    {
      name: "Sales",
      icon: <VscGraph />,
      link: "/settings",
    },
    { name: "Customers", icon: <FaClipboardUser />, link: "/settings" },
    { name: "Reports", icon: <HiOutlineDocumentReport />, link: "/settings" },
  ];

  return (
    <div className="bg-white h-screen border-r border-gray-100">
      <div className="p-5">
        <div>
          <div className="border-b border-gray-100">
            <div className="flex items-center gap-2 p-4 mb-3  text-white rounded-md">
              <span className="text-xl p-3 bg-white text-[#611F69] rounded-md">
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
        {menuItems.map((item, index) => (
          <Link href={item.link}>
            <li
              className="text-gray-700 bg-white p-2 cursor-pointer list-none hover:bg-[#611F69] transition-all hover:text-white rounded-md mb-2 flex items-center gap-2 group"
              key={index}
            >
              <span className="text-[#611F69] transition-all group-hover:text-white text-xl">
                {item.icon}
              </span>
              <span>{item.name}</span>
            </li>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
