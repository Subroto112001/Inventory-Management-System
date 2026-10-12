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
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--theme-highlight)] hover:shadow-lg">
      <div className="relative mx-2 mt-2 aspect-square overflow-hidden rounded-xl bg-[var(--theme-background)] sm:mx-3 sm:mt-3">
        <Link href={`/product/product_details?id=${encodeURIComponent(product.id)}`} className="absolute inset-0 flex items-center justify-center p-4 sm:p-5">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        {hasDiscount && <span className="absolute left-3 top-3 rounded-full bg-[var(--theme-primary)] px-2.5 py-1 text-[11px] font-semibold text-white">-{discount}%</span>}

        <button
          type="button"
          disabled={pendingIds.includes(String(product.id))}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          onClick={async () => { try { const updated = await toggle(product); if (updated) setWishlistNotice(liked ? "Removed from wishlist" : "Added to wishlist"); } catch (error) { setWishlistNotice(error.message || "Unable to update wishlist"); } }}
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] ${
            liked ? "text-[var(--theme-secondary)]" : "text-[var(--theme-text)]"
          }`}
        >
          <LuHeart size={16} className={liked ? "fill-[var(--theme-secondary)]" : ""} />
        </button>

        <button
          type="button"
          aria-label={isCompared(product.id) ? "Already in comparison" : "Add to compare"}
          title={isCompared(product.id) ? "Already in comparison" : "Add to compare"}
          onClick={() => setCompareNotice(addToCompare(product.id))}
          className={`absolute right-3 top-[3.75rem] flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] ${isCompared(product.id) ? "text-[var(--theme-primary)]" : "text-[var(--theme-text)]"}`}
        >
          <LuGitCompare size={16} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3 pt-3 sm:p-4 sm:pt-3">
        {brandName && <p className="mb-1 line-clamp-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--theme-muted)]">{brandName}</p>}
        <Link href={`/product/product_details?id=${encodeURIComponent(product.id)}`} className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-[var(--theme-text)] transition-colors hover:text-[var(--theme-primary)]">
            {name}
        </Link>
        <div className="mt-2 flex min-h-10 items-center gap-2">
          <div className="min-w-0">
            <span className="block text-sm font-semibold text-[var(--theme-primary)]">${currentPrice.toFixed(2)}</span>
            {hasDiscount && <span className="block text-xs leading-4 text-[var(--theme-muted)] line-through">${basePrice.toFixed(2)}</span>}
          </div>
          {hasDiscount && <span className="ml-auto shrink-0 rounded-full bg-[var(--theme-background)] px-2 py-1 text-[10px] font-semibold text-[var(--theme-primary)]">-{discount}%</span>}
        </div>
        {categoryName && <p className="mt-2 min-h-4 line-clamp-1 text-xs text-[var(--theme-muted)]">{categoryName}</p>}
        <button type="button" disabled={!inStock} onClick={() => addItem(product)} className="mt-auto flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--theme-primary)] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--theme-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#D8D5CE] disabled:text-[var(--theme-muted)]">
          <LuShoppingCart size={16} />{inStock ? "Add to Cart" : "Out of Stock"}
        </button>
        {(wishlistNotice || compareNotice) && <p className="mt-2 text-xs text-[var(--theme-muted)]" role="status">{wishlistNotice || (compareNotice === "added" ? "Added to compare" : compareNotice === "exists" ? "Already in comparison" : compareNotice === "loading" ? "Loading comparisons..." : "Compare list is full")}</p>}
      </div>
    </article>
  );
}
