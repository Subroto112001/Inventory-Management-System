import React from 'react'
import { FaUserCircle } from 'react-icons/fa';
import { RiShoppingBag4Line } from 'react-icons/ri';

const Header = () => {
  return (
    <div className="bg-[#611F69] p-5">
      <div className="flex justify-between items-center">
        <div className='flex items-center gap-2'>
          <span className="text-[24px] text-white">
            <RiShoppingBag4Line />
          </span>
          <span className="text-white">Business Management System</span>
        </div>
        <div className=" flex flex-row items-center gap-5">
          <button className="bg-white px-3 py-2 text-[16px] text-[#611F69] font-medium rounded-md cursor-pointer">
            Create New Order
          </button>
          <span className="text-[24px] text-white cursor-pointer">
            <FaUserCircle />
          </span>
        </div>
      </div>
    </div>
  );
}

export default Header