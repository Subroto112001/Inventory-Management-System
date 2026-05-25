"use client";
import TransparentButton from "@/Component/Button/TransparentButton";
import { IconProvider } from "@/Provider/IconProvider";
import { ImageProvider } from "@/Provider/ImgaeProvider";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Page = () => {
  const [imageholder, setImageholder] = useState(ImageProvider.headphone);
  const productInfo = {
    SKU: "AUD-HD-99",
    name: "Professional Studio Headphones",
    price: 8900,
    brand: "AudioTech",
    unit: "Piece",
    quantity: 5,
    category: "Electronics",
    description:
      "Experience unparalleled sound quality with our Professional Studio Headphones. Designed for audiophiles and professionals alike, these headphones deliver crystal-clear audio with deep bass and crisp highs. Featuring a comfortable over-ear design and durable construction, they are perfect for long listening sessions in the studio or on the go.",
    wholesalePrice: 7200,
    Color1: "Black",
    Color2: "White",
    Color3: "Red",
  };
  const imageofProduct = [
    {
      id: 1,
      image: ImageProvider.HeadPhoneone,
    },
    {
      id: 2,
      image: ImageProvider.headphone2,
    },
    {
      id: 3,
      image: ImageProvider.headphone3,
    },
  ];

  const handleimageclick = (image) => {
    setImageholder(image);
  };
  return (
    <div className="p-5">
      <div className="flex flex-col gap-2">
        <Link
          href="/products"
          className="inline-flex gap-2 items-center text-gray-700 hover:text-[#611F69]  rounded-md"
          aria-label="Go back to products page"
        >
          <span className="text-2xl text-[#611F69]" aria-hidden="true">
            {IconProvider.leftIcon}
          </span>
          <span className="text-[16px] font-medium">Back To Products</span>
        </Link>

        {/* heading of product */}

        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-[24px] ">{productInfo.name}</h1>
            <span className="text-gray-500 text-[16px] ">
              SKU : {productInfo.SKU}
            </span>
          </div>

          <div className="flex flex-wrap gap-3" aria-label="Product actions">
            <TransparentButton value="Edit Product" />
            <TransparentButton value="Duplicate" />
          </div>
        </div>
        {/* heading of product */}

        {/* Main section Of Product */}

        <div className="mt-5 flex gap-5">
          <div className="flex flex-col gap-4">
            {/* main image */}
            <div className="p-4 rounded-md border border-gray-100 w-[632px] ">
              <Image
                src={imageholder}
                alt="Product Image"
                className="w-full h-auto object-cover rounded-md "
              />
            </div>
            {/* main image */}
            {/* small images there */}
            <div className="flex gap-4">
              {imageofProduct.map((item) => (
                <div
                  className="w-[200px] border border-gray-100 rounded-md p-2"
                  onClick={() => handleimageclick(item.image)}
                >
                  <Image
                    src={item.image}
                    alt="Product Image"
                    className="w-full h-auto object-cover rounded-md "
                  />
                </div>
              ))}
            </div>
            {/* small images there */}
          </div>

          <article className="border border-gray-100 rounded-md p-5 w-full">
            <div className="flex flex-col gap-4 pb-5 border-b border-gray-200">
              <p className="font-medium text-[14px] text-gray-700">
                Retail Price
              </p>
              <p className="font-bold text-[24px] text-[#611F69]">
                ${productInfo.price.toFixed(2)}
              </p>
              <p className="font-medium text-[16px] ">
                Wholesale: ৳ {productInfo.wholesalePrice.toLocaleString()}
              </p>
            </div>

            <div className="flex gap-[100px] mt-4">
              <p className="font-medium text-[16px] flex flex-col gap-1 ">
                <span className="font-bold text-gray-600">Brand:</span>{" "}
                <span>{productInfo.brand}</span>
              </p>
              <p className="font-medium text-[16px] flex flex-col gap-1">
                <span className="font-bold text-gray-600">Category:</span>{" "}
                <span>{productInfo.category}</span>
              </p>
              <p className="font-medium text-[16px] flex flex-col gap-1">
                <span className="font-bold text-gray-600">Unit:</span>{" "}
                <span>{productInfo.unit}</span>
              </p>
              <p className="font-medium text-[16px] flex flex-col gap-1">
                <span className="font-bold text-gray-600">Quantity:</span>{" "}
                <span>{productInfo.quantity}</span>
              </p>
            </div>
            <div className="flex gap-4 mt-5">
              <div className="w-[100px] py-2 flex justify-center  items-center border bg-black text-white  border-gray-300 rounded-full">
                {productInfo.Color1}
              </div>
              <div className="w-[100px] py-2 flex justify-center  items-center border bg-white text-black  border-gray-300 rounded-full">
                {productInfo.Color2}
              </div>
              <div className="w-[100px] py-2 flex justify-center  items-centerborder bg-red-600 text-white  border-gray-300 rounded-full">
                {productInfo.Color3}
              </div>
            </div>
            <p className="mt-5 text-[16px] text-gray-700">
              Description: {productInfo.description}
            </p>
          </article>
        </div>
        {/* Main section Of Product */}
      </div>
    </div>
  );
};

export default Page;
