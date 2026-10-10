import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/Component/website/Cart/CartContext";
import { useWishlist } from "@/Component/website/Cart/WishlistContext";
import { LuHeart, LuShoppingCart, LuGitCompare } from "react-icons/lu";
import { useCompare } from "@/Component/website/Cart/CompareContext";

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

export function ProductCard({ product }) {
  const { has, toggle, pendingIds } = useWishlist();
  const { addItem } = useCart();
  const { add: addToCompare, has: isCompared } = useCompare();
  const [compareNotice, setCompareNotice] = useState("");
  const [wishlistNotice, setWishlistNotice] = useState("");
  const liked = has(product.id);
  const inStock = product.inStock ?? false;
  const basePrice = Number(product.price) || 0;
  const discount = Number(product.discount);
  const hasDiscount = Number.isFinite(discount) && discount > 0 && discount <= 100;
  const currentPrice = hasDiscount ? basePrice * (1 - discount / 100) : basePrice;
  const brandName = product.brandName || (typeof product.brand === "string" ? product.brand : product.brand?.brandName) || "";
  const categoryName = typeof product.category === "string" ? product.category : product.category?.categoryName || "";
  const image = product.image || product.images?.[0] || "/placeholder-product.svg";
  const name = product.name || product.productName || "Product";

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E4DED2] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9A659] hover:shadow-lg">
      <div className="relative mx-3 mt-3 aspect-[4/5] overflow-hidden rounded-xl bg-[#F7F3EC] sm:aspect-square">
        <Link href={`/product/product_details?id=${encodeURIComponent(product.id)}`} className="absolute inset-0 flex items-center justify-center p-4 sm:p-5">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        {hasDiscount && <span className="absolute left-3 top-3 rounded-full bg-[#1F3A2E] px-2.5 py-1 text-[11px] font-semibold text-white">-{discount}%</span>}

        <button
          type="button"
          disabled={pendingIds.includes(String(product.id))}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          onClick={async () => { try { const updated = await toggle(product); if (updated) setWishlistNotice(liked ? "Removed from wishlist" : "Added to wishlist"); } catch (error) { setWishlistNotice(error.message || "Unable to update wishlist"); } }}
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3A2E] ${
            liked ? "text-[#B65C38]" : "text-[#211F1D]"
          }`}
        >
          <LuHeart size={16} className={liked ? "fill-[#B65C38]" : ""} />
        </button>

        <button
          type="button"
          aria-label={isCompared(product.id) ? "Already in comparison" : "Add to compare"}
          title={isCompared(product.id) ? "Already in comparison" : "Add to compare"}
          onClick={() => setCompareNotice(addToCompare(product.id))}
          className={`absolute right-3 top-15 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3A2E] ${isCompared(product.id) ? "text-[#1F3A2E]" : "text-[#211F1D]"}`}
        >
          <LuGitCompare size={16} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 pt-3">
        {brandName && <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A8378]">{brandName}</p>}
        <div className="flex items-start justify-between gap-3">
          <Link href={`/product/product_details?id=${encodeURIComponent(product.id)}`} className="line-clamp-2 min-w-0 flex-1 text-sm font-medium leading-5 text-[#211F1D] transition-colors hover:text-[#1F3A2E]">
            {name}
          </Link>
          <div className="shrink-0 text-right">
            <span className="block text-sm font-semibold text-[#1F3A2E]">${currentPrice.toFixed(2)}</span>
            {hasDiscount && <span className="block text-xs text-[#8A8378] line-through">${basePrice.toFixed(2)}</span>}
          </div>
        </div>
        {categoryName && <p className="mt-2 line-clamp-1 text-xs text-[#8A8378]">{categoryName}</p>}
        <button type="button" disabled={!inStock} onClick={() => addItem(product)} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1F3A2E] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#294c3d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3A2E] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#D8D5CE] disabled:text-[#6F685E]">
          <LuShoppingCart size={16} />{inStock ? "Add to Cart" : "Out of Stock"}
        </button>
        {(wishlistNotice || compareNotice) && <p className="mt-2 text-xs text-[#6F685E]" role="status">{wishlistNotice || (compareNotice === "added" ? "Added to compare" : compareNotice === "exists" ? "Already in comparison" : compareNotice === "loading" ? "Loading comparisons..." : "Compare list is full")}</p>}
      </div>
    </article>
  );
}
