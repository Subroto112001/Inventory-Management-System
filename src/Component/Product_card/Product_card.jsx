import React from "react";
import Image from "next/image";

const ProductCard = ({
  SKU,
  name,
  price,
  quantity,
  image,
  currentStock, // true = In Stock, false = Out of Stock
}) => {
  return (
    <article className="relative border border-gray-200 rounded-md p-4 w-87.5 cursor-pointer">
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
        <div className="flex flex-col gap-2 border-b border-gray-100 pb-2">
          <p className="text-gray-400 text-[14px]">{SKU}</p>
          <p className="text-[20px] font-bold truncate text-[#611F69]">
            {name}
          </p>
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
