import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/Component/website/Cart/CartContext";
import { useWishlist } from "@/Component/website/Cart/WishlistContext";
import { LuHeart, LuShoppingCart, LuStar } from "react-icons/lu";

export const CATEGORIES = [
  "All Products",
  "Lighting",
  "Kitchen & Dining",
  "Furniture",
  "Textiles & Bedding",
  "Outdoor & Garden",
  "Decor & Accents",
  "Storage",
  "Bath",
];

export const SORT_OPTIONS = [
  "Featured",
  "Newest",
  "Highest Rated",
  "Price: Low to High",
  "Price: High to Low",
  "ABCD",
];

function Stars({ rating = 0 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <LuStar
          key={index}
          size={15}
          className={
            index < Math.round(Number(rating) || 0)
              ? "fill-[#C9A659] text-[#C9A659]"
              : "fill-[#E4DED2] text-[#E4DED2]"
          }
        />
      ))}
    </div>
  );
}

export function ProductCard({ product }) {
  const { has, toggle } = useWishlist();
  const { addItem } = useCart();
  const liked = has(product.id);
  const inStock = product.inStock ?? false;

  return (
    <article className="group overflow-hidden rounded-md border border-[#E4DED2] bg-white transition-all duration-200 hover:border-[#C9A659] hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-[#F7F3EC]">
        <Link href={`/product/product_details?id=${encodeURIComponent(product.id)}`}>
          <img
            src={product.image || "/placeholder-product.svg"}
            alt={product.name || "Product"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        </Link>

        <button
          type="button"
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggle(product).catch(() => {})}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 ${
            liked ? "text-[#B65C38]" : "text-[#211F1D]"
          }`}
        >
          <LuHeart size={16} className={liked ? "fill-[#B65C38]" : ""} />
        </button>

        <button
          type="button"
          disabled={!inStock}
          onClick={() => addItem(product)}
          className="absolute inset-x-3 bottom-3 flex translate-y-10 items-center justify-center gap-2 rounded-sm bg-[#211F1D] py-2.5 text-sm text-[#F7F3EC] opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LuShoppingCart size={15} />
          {inStock ? "Add to cart" : "Out of stock"}
        </button>
      </div>

      <div className="p-4">
        <p className="mb-1 text-xs text-[#8A8378]">{product.category}</p>
        <Link
          href={`/product/product_details?id=${encodeURIComponent(product.id)}`}
          className="mb-2 block text-sm text-[#211F1D] hover:text-[#1F3A2E]"
        >
          {product.name}
        </Link>
        <div className="mb-2 flex items-center gap-1.5">
          <Stars rating={product.rating} />
          <span className="text-xs text-[#8A8378]">({product.reviews ?? 0})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-medium text-[#1F3A2E]">
            ${Number(product.price || 0).toFixed(2)}
          </span>
          {product.oldPrice ? (
            <span className="text-xs text-[#8A8378] line-through">
              ${product.oldPrice}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
