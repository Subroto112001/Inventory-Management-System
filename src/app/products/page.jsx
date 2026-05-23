import React from "react";
import { GoPlusCircle } from "react-icons/go";

const page = () => {
  return (
    <div className="p-5">
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
    </div>
  );
};

export default page;
