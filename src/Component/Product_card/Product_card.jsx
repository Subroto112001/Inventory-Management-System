import React from "react";
import Image from "next/image";

const ProductCard = ({
  id,
  SKU,
  name,
  price,
  image,
  currentStock,
  onDeleteClick,
}) => {
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

          <button
            onClick={() => onDeleteClick(id, name)}
            className="border border-[#611F69] px-4 py-2 text-[#611F69] rounded-md cursor-pointer bg-[#611F69] text-white hover:bg-transparent hover:text-[#611F69] transition-all duration-300"
          >
            Delete
          </button>
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
