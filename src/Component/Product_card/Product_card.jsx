import React from "react";
// Import the Next.js Image component
import Image from "next/image";
import watch from "../../assets/image/watch.png";

const ProductCard = ({ SKU, name, price, quantity, image }) => {
  return (
    <article className="border border-gray-200 rounded-md p-4 w-[350px] ">
      <Image
        src={image}
        alt={name}
        className="object-cover rounded-md mb-4"
        loading="lazy"
      />

      <div className="flex flex-col gap-2 mt-5">
        <div className="flex flex-col gap-2 border-b border-gray-100">
          {/* SKU */}
          <p className="text-gray-400 text-[14px]">{SKU}</p>
          {/* NAME */}
          <p className="text-[20px] font-bold truncate">{name}</p>
        </div>
        <div className=" flex justify-between items-center mt-3">
          <p className="text-[16px]">${price.toFixed(2)}</p>
          <p className="text-[16px]">QTY : {quantity}</p>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
