import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/Component/website/Cart/CartContext";
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

export const PRODUCTS = [
  {
    id: 1,
    name: "Alder Oak Dining Chair",
    category: "Furniture",
    price: 189,
    oldPrice: 229,
    rating: 4.8,
    reviews: 62,
    badge: "Exclusive",
    image: "https://placehold.co/600x600/1F3A2E/F7F3EC?text=Alder+Dining+Chair",
  },
  {
    id: 2,
    name: "Hand-Thrown Stoneware Mug Set",
    category: "Kitchen & Dining",
    price: 58,
    rating: 4.9,
    reviews: 140,
    badge: "Best Seller",
    image: "https://placehold.co/600x600/B65C38/F7F3EC?text=Stoneware+Mug+Set",
  },
  {
    id: 3,
    name: "Brushed Brass Pendant Light",
    category: "Lighting",
    price: 145,
    rating: 4.7,
    reviews: 38,
    badge: "New",
    image: "https://placehold.co/600x600/C9A659/211F1D?text=Brass+Pendant",
  },
  {
    id: 4,
    name: "Linen Weave Throw Blanket",
    category: "Textiles & Bedding",
    price: 76,
    rating: 4.6,
    reviews: 51,
    image: "https://placehold.co/600x600/93A88A/211F1D?text=Wool+Throw",
  },
  {
    id: 5,
    name: 'Cast Iron Skillet 10"',
    category: "Kitchen & Dining",
    price: 42,
    rating: 4.9,
    reviews: 210,
    badge: "Best Seller",
    image: "https://placehold.co/600x600/211F1D/F7F3EC?text=Cast+Iron+Skillet",
  },
  {
    id: 6,
    name: "Olive Wood Cutting Board",
    category: "Kitchen & Dining",
    price: 34,
    rating: 4.7,
    reviews: 88,
    image: "https://placehold.co/600x600/B08D3E/211F1D?text=Olive+Wood+Board",
  },
  {
    id: 7,
    name: "Speckled Ceramic Bowl Set",
    category: "Kitchen & Dining",
    price: 64,
    rating: 4.8,
    reviews: 73,
    image: "https://placehold.co/600x600/E4DED2/211F1D?text=Ceramic+Bowls",
  },
  {
    id: 8,
    name: "Hand-Blown Glass Carafe",
    category: "Kitchen & Dining",
    price: 29,
    rating: 4.5,
    reviews: 40,
    badge: "New",
    image: "https://placehold.co/600x600/93A88A/211F1D?text=Glass+Carafe",
  },
  {
    id: 9,
    name: "Teak Outdoor Bench",
    category: "Furniture",
    price: 320,
    rating: 4.6,
    reviews: 27,
    image: "https://placehold.co/600x600/16281F/F7F3EC?text=Teak+Bench",
  },
  {
    id: 10,
    name: "Bouclé Reading Armchair",
    category: "Furniture",
    price: 540,
    oldPrice: 620,
    rating: 4.9,
    reviews: 54,
    badge: "Sale",
    image: "https://placehold.co/600x600/B08D3E/211F1D?text=Boucle+Armchair",
  },
  {
    id: 11,
    name: "Floating Walnut Shelf",
    category: "Furniture",
    price: 88,
    rating: 4.4,
    reviews: 19,
    image: "https://placehold.co/600x600/211F1D/F7F3EC?text=Walnut+Shelf",
  },
  {
    id: 12,
    name: "Woven Rattan Ottoman",
    category: "Furniture",
    price: 165,
    rating: 4.7,
    reviews: 33,
    image: "https://placehold.co/600x600/93A88A/211F1D?text=Rattan+Ottoman",
  },
  {
    id: 13,
    name: "Linen Shade Table Lamp",
    category: "Lighting",
    price: 74,
    rating: 4.6,
    reviews: 46,
    image: "https://placehold.co/600x600/1F3A2E/F7F3EC?text=Table+Lamp",
  },
  {
    id: 14,
    name: "Brass Wall Sconce, Pair",
    category: "Lighting",
    price: 96,
    rating: 4.8,
    reviews: 22,
    badge: "New",
    image: "https://placehold.co/600x600/C9A659/211F1D?text=Wall+Sconce",
  },
  {
    id: 15,
    name: "Arched Iron Floor Lamp",
    category: "Lighting",
    price: 132,
    rating: 4.5,
    reviews: 17,
    image: "https://placehold.co/600x600/B65C38/F7F3EC?text=Floor+Lamp",
  },
  {
    id: 16,
    name: "Rice Paper Pendant Shade",
    category: "Lighting",
    price: 48,
    rating: 4.3,
    reviews: 29,
    image: "https://placehold.co/600x600/16281F/F7F3EC?text=Paper+Pendant",
  },
  {
    id: 17,
    name: "Washed Linen Duvet Set",
    category: "Textiles & Bedding",
    price: 128,
    rating: 4.8,
    reviews: 95,
    image: "https://placehold.co/600x600/93A88A/211F1D?text=Linen+Duvet",
  },
  {
    id: 18,
    name: "Hand-Knotted Wool Rug",
    category: "Textiles & Bedding",
    price: 240,
    rating: 4.9,
    reviews: 61,
    badge: "Exclusive",
    image: "https://placehold.co/600x600/B08D3E/211F1D?text=Wool+Rug",
  },
  {
    id: 19,
    name: "Rattan-Framed Wall Mirror",
    category: "Decor & Accents",
    price: 68,
    rating: 4.6,
    reviews: 4,
    badge: "New",
    image: "https://placehold.co/600x600/C9A659/211F1D?text=Rattan+Mirror",
  },
  {
    id: 20,
    name: "Speckled Ceramic Planter",
    category: "Decor & Accents",
    price: 32,
    rating: 4.7,
    reviews: 9,
    badge: "New",
    image: "https://placehold.co/600x600/93A88A/211F1D?text=Ceramic+Planter",
  },
];

export const Stars = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <LuStar
          key={index}
          size={13}
          className={
            index < Math.round(rating)
              ? "fill-[#C9A659] text-[#C9A659]"
              : "fill-[#E4DED2] text-[#E4DED2]"
          }
        />
      ))}
    </div>
  );
};

export const ProductCard = ({ product }) => {
  const [liked, setLiked] = useState(false);
  const { addItem } = useCart();
  const inStock = product.inStock ?? true;

  return (
    <div className="group bg-white border border-[#E4DED2] rounded-md overflow-hidden hover:shadow-lg hover:border-[#C9A659] transition-all duration-200">
      <div className="relative aspect-square overflow-hidden bg-[#F7F3EC]">
        <Link href={`/product/product_details?id=${product.id}`}>
          <img
            src={product.image || "/placeholder-product.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
          />
        </Link>

        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#1F3A2E] text-[#F7F3EC] text-xs px-2 py-1 rounded-sm">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => setLiked(!liked)}
          aria-label="Add to wishlist"
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center transition-all ${
            liked
              ? "text-[#B65C38]"
              : "text-[#211F1D] opacity-0 group-hover:opacity-100"
          }`}
        >
          <LuHeart size={16} className={liked ? "fill-[#B65C38]" : ""} />
        </button>

        <button
          type="button"
          disabled={!inStock}
          onClick={() => addItem(product)}
          className="absolute inset-x-3 bottom-3 bg-[#211F1D] text-[#F7F3EC] text-sm py-2.5 rounded-sm translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LuShoppingCart size={15} />
          {inStock ? "Add to cart" : "Out of stock"}
        </button>
      </div>

      <div className="p-4">
        <p className="text-xs text-[#8A8378] mb-1">{product.category}</p>

        <h3 className="text-sm text-[#211F1D] leading-snug mb-2 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-2.5">
          <Stars rating={product.rating} />
          <span className="text-xs text-[#8A8378]">({product.reviews})</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-[#1F3A2E] text-base font-medium">
            ${product.price}
          </span>

          {product.oldPrice && (
            <span className="text-xs text-[#8A8378] line-through">
              ${product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const SORT_OPTIONS = [
  "Featured",
  "Newest",
  "Highest Rated",
  "Price: Low to High",
  "Price: High to Low",
  "ABCD",
];
