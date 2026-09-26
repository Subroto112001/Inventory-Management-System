"use client";

/**
 * FIELDHOUSE — E-commerce Home Page
 * ----------------------------------------------------------------
 * Design brief grounded in: a home & lifestyle goods store (furniture,
 * kitchenware, lighting, textiles, outdoor) — natural materials, warm
 * earthy palette instead of the usual blue.
 *
 * Palette (as Tailwind arbitrary values, no config changes required):
 *   forest      #1F3A2E   primary dark / header / footer
 *   forest-dark #16281F   hover states on forest
 *   gold        #C9A659   accent, CTAs, prices
 *   gold-dark   #B08D3E   hover states on gold
 *   cream       #F7F3EC   page background
 *   charcoal    #211F1D   body text
 *   rust        #B65C38   sale / new badges, second accent
 *   line        #E4DED2   hairline borders on cream
 *
 * Type: "Fraunces" (display serif, headings) + "Inter" (UI/body).
 * In production, load both with next/font/google in your root layout
 * instead of the <link> tag below — it's kept inline here only so this
 * single file is self-contained and previewable on its own.
 *
 * Icons: lucide-react (npm i lucide-react)
 * Images: placehold.co placeholders — swap for real product photography.
 * ----------------------------------------------------------------
 */

import { useEffect, useRef, useState } from "react";
import {
  Search,
  User,
  GitCompare,
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
  Menu,
  X,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data                                                                 */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "Shop All", href: "#" },
  { label: "Lighting", href: "#" },
  { label: "Kitchen & Dining", href: "#" },
  { label: "Furniture", href: "#" },
  { label: "Textiles & Bedding", href: "#" },
  { label: "Outdoor & Garden", href: "#" },
  { label: "Decor & Accents", href: "#" },
  { label: "Brands", href: "#" },
  { label: "Sale", href: "#" },
];

const HERO_SLIDES = [
  {
    id: 1,
    image:
      "https://placehold.co/1200x680/1F3A2E/F7F3EC?text=Autumn+Living+Edit",
    eyebrow: "New season",
    title: "Furniture built to live in, not around",
    subtitle: "Solid oak and reclaimed wood pieces, finished by hand.",
    cta: "Shop the edit",
  },
  {
    id: 2,
    image:
      "https://placehold.co/1200x680/B65C38/F7F3EC?text=Kitchen+Essentials",
    eyebrow: "Kitchen & dining",
    title: "Stoneware and cast iron for everyday cooking",
    subtitle: "Small-batch pieces made to be used, not shelved.",
    cta: "Browse kitchenware",
  },
  {
    id: 3,
    image: "https://placehold.co/1200x680/C9A659/211F1D?text=Textile+Restock",
    eyebrow: "Just restocked",
    title: "Linen and wool for the colder months",
    subtitle: "Woven in small runs, softer with every wash.",
    cta: "Shop textiles",
  },
];

const SIDE_BANNERS = [
  {
    image: "https://placehold.co/600x320/93A88A/211F1D?text=Outdoor+%26+Garden",
    title: "Outdoor & garden",
    subtitle: "Teak seating, up to 20% off",
  },
  {
    image: "https://placehold.co/600x320/211F1D/F7F3EC?text=Lighting+Studio",
    title: "Lighting studio",
    subtitle: "Brushed brass, new arrivals",
  },
];

const CATEGORIES = [
  {
    name: "Lighting",
    image: "https://placehold.co/240x240/1F3A2E/F7F3EC?text=Lighting",
  },
  {
    name: "Kitchen & Dining",
    image: "https://placehold.co/240x240/B65C38/F7F3EC?text=Kitchen",
  },
  {
    name: "Furniture",
    image: "https://placehold.co/240x240/C9A659/211F1D?text=Furniture",
  },
  {
    name: "Textiles & Bedding",
    image: "https://placehold.co/240x240/93A88A/211F1D?text=Textiles",
  },
  {
    name: "Storage",
    image: "https://placehold.co/240x240/211F1D/F7F3EC?text=Storage",
  },
  {
    name: "Outdoor & Garden",
    image: "https://placehold.co/240x240/16281F/F7F3EC?text=Outdoor",
  },
  {
    name: "Decor & Accents",
    image: "https://placehold.co/240x240/B08D3E/211F1D?text=Decor",
  },
  {
    name: "Bath",
    image: "https://placehold.co/240x240/E4DED2/211F1D?text=Bath",
  },
];

const EXCLUSIVE_PRODUCTS = [
  {
    id: "ex1",
    image: "https://placehold.co/480x480/1F3A2E/F7F3EC?text=Alder+Dining+Chair",
    category: "Furniture",
    name: "Alder Oak Dining Chair",
    price: 189,
    oldPrice: 229,
    rating: 4.8,
    reviews: 62,
    badge: "Exclusive",
  },
  {
    id: "ex2",
    image: "https://placehold.co/480x480/B65C38/F7F3EC?text=Stoneware+Mug+Set",
    category: "Kitchen & Dining",
    name: "Hand-Thrown Stoneware Mug Set",
    price: 58,
    rating: 4.9,
    reviews: 140,
    badge: "Exclusive",
  },
  {
    id: "ex3",
    image:
      "https://placehold.co/480x480/C9A659/211F1D?text=Brass+Pendant+Light",
    category: "Lighting",
    name: "Brushed Brass Pendant Light",
    price: 145,
    rating: 4.7,
    reviews: 38,
    badge: "Exclusive",
  },
  {
    id: "ex4",
    image: "https://placehold.co/480x480/93A88A/211F1D?text=Wool+Throw+Blanket",
    category: "Textiles & Bedding",
    name: "Linen Weave Throw Blanket",
    price: 76,
    rating: 4.6,
    reviews: 51,
    badge: "Exclusive",
  },
];

const OFFER_SLIDES = [
  {
    id: 1,
    image: "https://placehold.co/900x520/16281F/F7F3EC?text=Wool+%26+Wood",
    title: "Wool & Wood",
    subtitle: "Up to 30% off cold-weather furnishings",
    cta: "Shop the sale",
  },
  {
    id: 2,
    image: "https://placehold.co/900x520/B65C38/F7F3EC?text=Kitchen+Edit",
    title: "The Kitchen Edit",
    subtitle: "Season's essentials, from $18",
    cta: "Shop kitchen",
  },
  {
    id: 3,
    image: "https://placehold.co/900x520/B08D3E/211F1D?text=Outdoor+Living",
    title: "Outdoor Living",
    subtitle: "Get ahead of spring, pre-order now",
    cta: "Shop outdoor",
  },
];

const FEATURED_TABS = ["Kitchen & Dining", "Furniture", "Lighting", "Textiles"];

const FEATURED_PRODUCTS = {
  "Kitchen & Dining": [
    {
      id: "k1",
      image:
        "https://placehold.co/480x480/1F3A2E/F7F3EC?text=Cast+Iron+Skillet",
      category: "Kitchen & Dining",
      name: 'Cast Iron Skillet 10"',
      price: 42,
      rating: 4.9,
      reviews: 210,
    },
    {
      id: "k2",
      image: "https://placehold.co/480x480/B65C38/F7F3EC?text=Olive+Wood+Board",
      category: "Kitchen & Dining",
      name: "Olive Wood Cutting Board",
      price: 34,
      rating: 4.7,
      reviews: 88,
    },
    {
      id: "k3",
      image: "https://placehold.co/480x480/C9A659/211F1D?text=Ceramic+Bowls",
      category: "Kitchen & Dining",
      name: "Speckled Ceramic Bowl Set",
      price: 64,
      rating: 4.8,
      reviews: 73,
    },
    {
      id: "k4",
      image: "https://placehold.co/480x480/93A88A/211F1D?text=Glass+Carafe",
      category: "Kitchen & Dining",
      name: "Hand-Blown Glass Carafe",
      price: 29,
      rating: 4.5,
      reviews: 40,
    },
  ],
  Furniture: [
    {
      id: "f1",
      image: "https://placehold.co/480x480/16281F/F7F3EC?text=Teak+Bench",
      category: "Furniture",
      name: "Teak Outdoor Bench",
      price: 320,
      rating: 4.6,
      reviews: 27,
    },
    {
      id: "f2",
      image: "https://placehold.co/480x480/B08D3E/211F1D?text=Boucle+Armchair",
      category: "Furniture",
      name: "Bouclé Reading Armchair",
      price: 540,
      oldPrice: 620,
      rating: 4.9,
      reviews: 54,
    },
    {
      id: "f3",
      image: "https://placehold.co/480x480/211F1D/F7F3EC?text=Walnut+Shelf",
      category: "Furniture",
      name: "Floating Walnut Shelf",
      price: 88,
      rating: 4.4,
      reviews: 19,
    },
    {
      id: "f4",
      image: "https://placehold.co/480x480/93A88A/211F1D?text=Rattan+Ottoman",
      category: "Furniture",
      name: "Woven Rattan Ottoman",
      price: 165,
      rating: 4.7,
      reviews: 33,
    },
  ],
  Lighting: [
    {
      id: "l1",
      image: "https://placehold.co/480x480/1F3A2E/F7F3EC?text=Table+Lamp",
      category: "Lighting",
      name: "Linen Shade Table Lamp",
      price: 74,
      rating: 4.6,
      reviews: 46,
    },
    {
      id: "l2",
      image: "https://placehold.co/480x480/C9A659/211F1D?text=Wall+Sconce",
      category: "Lighting",
      name: "Brass Wall Sconce, Pair",
      price: 96,
      rating: 4.8,
      reviews: 22,
    },
    {
      id: "l3",
      image: "https://placehold.co/480x480/B65C38/F7F3EC?text=Floor+Lamp",
      category: "Lighting",
      name: "Arched Iron Floor Lamp",
      price: 132,
      rating: 4.5,
      reviews: 17,
    },
    {
      id: "l4",
      image: "https://placehold.co/480x480/16281F/F7F3EC?text=Paper+Pendant",
      category: "Lighting",
      name: "Rice Paper Pendant Shade",
      price: 48,
      rating: 4.3,
      reviews: 29,
    },
  ],
  Textiles: [
    {
      id: "t1",
      image: "https://placehold.co/480x480/93A88A/211F1D?text=Linen+Duvet",
      category: "Textiles & Bedding",
      name: "Washed Linen Duvet Set",
      price: 128,
      rating: 4.8,
      reviews: 95,
    },
    {
      id: "t2",
      image: "https://placehold.co/480x480/B08D3E/211F1D?text=Wool+Rug",
      category: "Textiles & Bedding",
      name: "Hand-Knotted Wool Rug",
      price: 240,
      rating: 4.9,
      reviews: 61,
    },
    {
      id: "t3",
      image: "https://placehold.co/480x480/1F3A2E/F7F3EC?text=Table+Runner",
      category: "Textiles & Bedding",
      name: "Wool Felt Table Runner",
      price: 36,
      rating: 4.4,
      reviews: 12,
    },
    {
      id: "t4",
      image: "https://placehold.co/480x480/211F1D/F7F3EC?text=Cushion+Covers",
      category: "Textiles & Bedding",
      name: "Boucle Cushion Cover, Set of 2",
      price: 44,
      rating: 4.6,
      reviews: 37,
    },
  ],
};

export const NEW_ARRIVALS = [
  {
    id: "n1",
    image: "https://placehold.co/480x480/1F3A2E/F7F3EC?text=Ash+Side+Table",
    category: "Furniture",
    name: "Ash Wood Side Table",
    price: 112,
    rating: 4.7,
    reviews: 8,
    badge: "New",
  },
  {
    id: "n2",
    image: "https://placehold.co/480x480/B65C38/F7F3EC?text=Enamel+Teapot",
    category: "Kitchen & Dining",
    name: "Enamel Stovetop Teapot",
    price: 46,
    rating: 4.5,
    reviews: 6,
    badge: "New",
  },
  {
    id: "n3",
    image: "https://placehold.co/480x480/C9A659/211F1D?text=Rattan+Mirror",
    category: "Decor & Accents",
    name: "Rattan-Framed Wall Mirror",
    price: 68,
    rating: 4.6,
    reviews: 4,
    badge: "New",
  },
  {
    id: "n4",
    image: "https://placehold.co/480x480/93A88A/211F1D?text=Wool+Throw",
    category: "Textiles & Bedding",
    name: "Chunky Knit Wool Throw",
    price: 82,
    rating: 4.8,
    reviews: 11,
    badge: "New",
  },
  {
    id: "n5",
    image: "https://placehold.co/480x480/16281F/F7F3EC?text=Iron+Candlestick",
    category: "Decor & Accents",
    name: "Forged Iron Candlestick",
    price: 24,
    rating: 4.3,
    reviews: 3,
    badge: "New",
  },
  {
    id: "n6",
    image: "https://placehold.co/480x480/B08D3E/211F1D?text=Ceramic+Planter",
    category: "Decor & Accents",
    name: "Speckled Ceramic Planter",
    price: 32,
    rating: 4.7,
    reviews: 9,
    badge: "New",
  },
];

const PERKS = [
  { icon: Truck, title: "Free shipping", text: "On orders over $75" },
  { icon: RotateCcw, title: "30-day returns", text: "No questions asked" },
  { icon: ShieldCheck, title: "Secure checkout", text: "Encrypted payments" },
  { icon: Headphones, title: "Support", text: "Mon–Fri, 9am–6pm" },
];

/* ------------------------------------------------------------------ */
/* Small shared components                                             */
/* ------------------------------------------------------------------ */

export function Stars({ rating }) {
  const full = Math.round(rating);
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`Rated ${rating} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={
            i < full
              ? "fill-[#C9A659] text-[#C9A659]"
              : "fill-[#E4DED2] text-[#E4DED2]"
          }
        />
      ))}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="flex items-end justify-between gap-6 mb-8">
      <div>
        {eyebrow ? (
          <p className="text-sm text-[#B65C38] mb-1">{eyebrow}</p>
        ) : null}
        <h2 className="font-serif text-3xl md:text-[2.15rem] text-[#211F1D] leading-tight">
          {title}
        </h2>
      </div>
      {action ? (
        <a
          href="#"
          className="hidden sm:inline-block text-sm text-[#1F3A2E] border-b border-[#1F3A2E] pb-0.5 hover:text-[#B65C38] hover:border-[#B65C38] transition-colors whitespace-nowrap"
        >
          {action}
        </a>
      ) : null}
    </div>
  );
}

export function ProductCard({ product }) {
  const { image, category, name, price, oldPrice, rating, reviews, badge } =
    product;
  return (
    <div className="group bg-white border border-[#E4DED2] rounded-md overflow-hidden hover:shadow-md hover:border-[#C9A659] transition-all duration-200">
      <div className="relative aspect-square overflow-hidden bg-[#F7F3EC]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
        />
        {badge ? (
          <span className="absolute top-3 left-3 bg-[#1F3A2E] text-[#F7F3EC] text-xs px-2 py-1 rounded-sm">
            {badge}
          </span>
        ) : null}
        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[#211F1D] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#B65C38]"
        >
          <Heart size={15} />
        </button>
        <button
          type="button"
          className="absolute inset-x-3 bottom-3 bg-[#211F1D] text-[#F7F3EC] text-sm py-2 rounded-sm translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <ShoppingCart size={14} />
          Add to cart
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs text-[#8A8378] mb-1">{category}</p>
        <h3 className="text-sm text-[#211F1D] leading-snug mb-1.5 line-clamp-2">
          {name}
        </h3>
        <div className="flex items-center gap-1.5 mb-2">
          <Stars rating={rating} />
          <span className="text-xs text-[#8A8378]">({reviews})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[#1F3A2E] text-base">${price}</span>
          {oldPrice ? (
            <span className="text-xs text-[#8A8378] line-through">
              ${oldPrice}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                               */
/* ------------------------------------------------------------------ */

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollerRef = useRef(null);

  const scrollNav = (dir) => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: dir * 220, behavior: "smooth" });
    }
  };

  return (
    <header className="bg-[#F7F3EC] sticky top-0 z-40">
      {/* Top strip */}
      <div className="bg-[#1F3A2E] text-[#F7F3EC] text-xs">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
          <p>Free shipping on orders over $75 · Handmade in small batches</p>
          <div className="hidden sm:flex items-center gap-4">
            <a href="#" className="hover:text-[#C9A659] transition-colors">
              Track order
            </a>
            <a href="#" className="hover:text-[#C9A659] transition-colors">
              Help
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 flex items-center gap-4 sm:gap-8">
        <button
          type="button"
          className="lg:hidden text-[#211F1D]"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={22} />
        </button>

        {/* Dummy logo */}
        <a href="#" className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded-sm bg-[#1F3A2E] text-[#F7F3EC] flex items-center justify-center font-serif text-lg">
            F
          </span>
          <span className="font-serif text-xl text-[#211F1D] tracking-tight hidden xs:inline">
            FIELDHOUSE
          </span>
        </a>

        {/* Search bar */}
        <div className="flex-1 max-w-xl hidden md:flex items-center border border-[#E4DED2] rounded-md bg-white overflow-hidden">
          <input
            type="text"
            placeholder="Search for furniture, lighting, decor…"
            className="flex-1 px-4 py-2.5 text-sm text-[#211F1D] placeholder:text-[#8A8378] outline-none bg-transparent"
          />
          <button
            type="button"
            aria-label="Search"
            className="px-4 py-2.5 bg-[#1F3A2E] text-[#F7F3EC] hover:bg-[#16281F] transition-colors"
          >
            <Search size={17} />
          </button>
        </div>

        {/* Icons: user, compare, cart */}
        <div className="flex items-center gap-4 sm:gap-6 ml-auto text-[#211F1D]">
          <button
            type="button"
            className="flex flex-col items-center gap-0.5 hover:text-[#B65C38] transition-colors"
            aria-label="Account"
          >
            <User size={20} />
            <span className="text-[10px] hidden sm:inline">Account</span>
          </button>
          <button
            type="button"
            className="relative flex flex-col items-center gap-0.5 hover:text-[#B65C38] transition-colors"
            aria-label="Compare"
          >
            <GitCompare size={20} />
            <span className="text-[10px] hidden sm:inline">Compare</span>
            <span className="absolute -top-1 -right-1.5 bg-[#B65C38] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </button>
          <button
            type="button"
            className="relative flex flex-col items-center gap-0.5 hover:text-[#B65C38] transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            <span className="text-[10px] hidden sm:inline">Cart</span>
            <span className="absolute -top-1 -right-1.5 bg-[#B65C38] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center border border-[#E4DED2] rounded-md bg-white overflow-hidden">
          <input
            type="text"
            placeholder="Search products…"
            className="flex-1 px-3 py-2 text-sm text-[#211F1D] placeholder:text-[#8A8378] outline-none bg-transparent"
          />
          <button
            type="button"
            aria-label="Search"
            className="px-3 py-2 bg-[#1F3A2E] text-[#F7F3EC]"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Category / brand / product nav slider */}
      <nav className="hidden lg:block border-t border-[#E4DED2] bg-[#F7F3EC]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative flex items-center">
          <button
            type="button"
            aria-label="Scroll navigation left"
            onClick={() => scrollNav(-1)}
            className="shrink-0 text-[#8A8378] hover:text-[#1F3A2E] pr-2"
          >
            <ChevronLeft size={16} />
          </button>
          <div
            ref={scrollerRef}
            className="flex items-center gap-7 overflow-x-auto scroll-smooth py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-[#211F1D] hover:text-[#B65C38] whitespace-nowrap transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <button
            type="button"
            aria-label="Scroll navigation right"
            onClick={() => scrollNav(1)}
            className="shrink-0 text-[#8A8378] hover:text-[#1F3A2E] pl-2"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-[#211F1D]/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#F7F3EC] p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="font-serif text-lg text-[#211F1D]">
                FIELDHOUSE
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} className="text-[#211F1D]" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="py-2.5 border-b border-[#E4DED2] text-sm text-[#211F1D]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero: main slider + two side banners                                */
/* ------------------------------------------------------------------ */

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        {/* Main slider */}
        <div className="relative rounded-md overflow-hidden h-[340px] sm:h-[420px] lg:h-[480px]">
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === active ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#211F1D]/60 via-[#211F1D]/20 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="px-6 sm:px-10 max-w-md">
                  <p className="text-[#C9A659] text-sm mb-2">{slide.eyebrow}</p>
                  <h1 className="font-serif text-2xl sm:text-4xl text-[#F7F3EC] leading-tight mb-3">
                    {slide.title}
                  </h1>
                  <p className="text-[#F7F3EC]/85 text-sm sm:text-base mb-5">
                    {slide.subtitle}
                  </p>
                  <button
                    type="button"
                    className="bg-[#C9A659] text-[#211F1D] text-sm px-5 py-2.5 rounded-sm hover:bg-[#B08D3E] transition-colors"
                  >
                    {slide.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            aria-label="Previous slide"
            onClick={() =>
              setActive(
                (a) => (a - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
              )
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#F7F3EC]/85 text-[#211F1D] flex items-center justify-center hover:bg-[#F7F3EC] transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setActive((a) => (a + 1) % HERO_SLIDES.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#F7F3EC]/85 text-[#211F1D] flex items-center justify-center hover:bg-[#F7F3EC] transition-colors"
          >
            <ChevronRight size={18} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {HERO_SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-6 bg-[#F7F3EC]" : "w-1.5 bg-[#F7F3EC]/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Side banners */}
        <div className="grid grid-rows-2 gap-4 h-[220px] sm:h-[420px] lg:h-[480px]">
          {SIDE_BANNERS.map((banner) => (
            <a
              key={banner.title}
              href="#"
              className="relative rounded-md overflow-hidden group block"
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-[#211F1D]/35" />
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <h3 className="text-[#F7F3EC] text-base mb-0.5">
                  {banner.title}
                </h3>
                <p className="text-[#F7F3EC]/85 text-xs">{banner.subtitle}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Perks strip                                                         */
/* ------------------------------------------------------------------ */

export function PerksStrip() {
  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-10">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-[#E4DED2] py-6">
        {PERKS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <Icon size={22} className="text-[#1F3A2E] shrink-0" />
            <div>
              <p className="text-sm text-[#211F1D]">{title}</p>
              <p className="text-xs text-[#8A8378]">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */
export function Categories() {
  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-14">
      <SectionHeading
        eyebrow="Browse"
        title="Shop by category"
        action="View all categories"
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-5">
        {CATEGORIES.map((cat) => (
          <a key={cat.name} href="#" className="group text-center">
            <div className="aspect-square rounded-md overflow-hidden mb-2.5 bg-[#F7F3EC]">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-300"
              />
            </div>
            <p className="text-sm text-[#211F1D] group-hover:text-[#B65C38] transition-colors">
              {cat.name}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Exclusive products                                                  */
/* ------------------------------------------------------------------ */

export function ExclusiveProducts() {
  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-16">
      <SectionHeading
        eyebrow="Members get first pick"
        title="Exclusive products"
        action="View all exclusives"
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {EXCLUSIVE_PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Offer slider                                                        */
/* ------------------------------------------------------------------ */

export  function OfferSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % OFFER_SLIDES.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-[#1F3A2E] mt-16 py-14">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-sm text-[#C9A659] mb-1">Limited time</p>
            <h2 className="font-serif text-3xl text-[#F7F3EC]">
              Current offers
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous offer"
              onClick={() =>
                setActive(
                  (a) => (a - 1 + OFFER_SLIDES.length) % OFFER_SLIDES.length,
                )
              }
              className="w-9 h-9 rounded-full border border-[#F7F3EC]/30 text-[#F7F3EC] flex items-center justify-center hover:bg-[#F7F3EC]/10 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Next offer"
              onClick={() => setActive((a) => (a + 1) % OFFER_SLIDES.length)}
              className="w-9 h-9 rounded-full border border-[#F7F3EC]/30 text-[#F7F3EC] flex items-center justify-center hover:bg-[#F7F3EC]/10 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="relative h-[300px] sm:h-[360px] rounded-md overflow-hidden">
          {OFFER_SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === active ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#211F1D]/40" />
              <div className="absolute inset-0 flex flex-col items-start justify-center px-8 sm:px-14">
                <h3 className="font-serif text-2xl sm:text-3xl text-[#F7F3EC] mb-2">
                  {slide.title}
                </h3>
                <p className="text-[#F7F3EC]/90 text-sm sm:text-base mb-5">
                  {slide.subtitle}
                </p>
                <button
                  type="button"
                  className="bg-[#F7F3EC] text-[#211F1D] text-sm px-5 py-2.5 rounded-sm hover:bg-[#C9A659] transition-colors"
                >
                  {slide.cta}
                </button>
              </div>
            </div>
          ))}
          <div className="absolute bottom-4 left-8 sm:left-14 flex gap-2">
            {OFFER_SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to offer ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-6 bg-[#F7F3EC]" : "w-1.5 bg-[#F7F3EC]/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Featured products (tabbed by category)                              */
/* ------------------------------------------------------------------ */

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState(FEATURED_TABS[0]);

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-[#B65C38] mb-1">Hand-picked</p>
          <h2 className="font-serif text-3xl md:text-[2.15rem] text-[#211F1D]">
            Featured products
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {FEATURED_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`text-sm px-4 py-1.5 rounded-sm border transition-colors ${
                activeTab === tab
                  ? "bg-[#1F3A2E] border-[#1F3A2E] text-[#F7F3EC]"
                  : "border-[#E4DED2] text-[#211F1D] hover:border-[#1F3A2E]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {FEATURED_PRODUCTS[activeTab].map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* New arrivals                                                        */
/* ------------------------------------------------------------------ */

export function NewArrivals() {
  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-16">
      <SectionHeading
        eyebrow="Just landed"
        title="New arrivals"
        action="View all new arrivals"
      />
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
        {NEW_ARRIVALS.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Newsletter band                                                      */
/* ------------------------------------------------------------------ */

export function Newsletter() {
  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-16">
      <div className="bg-[#EFE9DC] rounded-md px-6 sm:px-12 py-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="text-center lg:text-left">
          <h3 className="font-serif text-2xl text-[#211F1D] mb-1">
            Get first access to restocks
          </h3>
          <p className="text-sm text-[#5B564C]">
            One email a week. No spam, unsubscribe anytime.
          </p>
        </div>
        <div className="flex w-full lg:w-auto max-w-md">
          <input
            type="email"
            placeholder="you@email.com"
            className="flex-1 px-4 py-2.5 text-sm rounded-l-sm border border-[#E4DED2] outline-none bg-white text-[#211F1D] placeholder:text-[#8A8378]"
          />
          <button
            type="button"
            className="px-5 py-2.5 bg-[#1F3A2E] text-[#F7F3EC] text-sm rounded-r-sm hover:bg-[#16281F] transition-colors whitespace-nowrap"
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */

export function Footer() {
  return (
    <footer className="bg-[#211F1D] text-[#D8D3C8] mt-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-sm bg-[#C9A659] text-[#211F1D] flex items-center justify-center font-serif text-base">
              F
            </span>
            <span className="font-serif text-lg text-[#F7F3EC]">
              FIELDHOUSE
            </span>
          </div>
          <p className="text-sm text-[#9B9689] mb-4">
            Everyday goods for the home, made in small batches with natural
            materials.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-[#C9A659] transition-colors"
            >
              <Facebook size={16} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-[#C9A659] transition-colors"
            >
              <Instagram size={16} />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-[#C9A659] transition-colors"
            >
              <Twitter size={16} />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="hover:text-[#C9A659] transition-colors"
            >
              <Youtube size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm text-[#F7F3EC] mb-4">Shop</h4>
          <ul className="space-y-2.5 text-sm text-[#9B9689]">
            <li>
              <a href="#" className="hover:text-[#C9A659] transition-colors">
                All categories
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C9A659] transition-colors">
                New arrivals
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C9A659] transition-colors">
                Best sellers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C9A659] transition-colors">
                Gift cards
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm text-[#F7F3EC] mb-4">Help</h4>
          <ul className="space-y-2.5 text-sm text-[#9B9689]">
            <li>
              <a href="#" className="hover:text-[#C9A659] transition-colors">
                Shipping & returns
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C9A659] transition-colors">
                Track order
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C9A659] transition-colors">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C9A659] transition-colors">
                Contact us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm text-[#F7F3EC] mb-4">Contact</h4>
          <ul className="space-y-2.5 text-sm text-[#9B9689]">
            <li className="flex items-center gap-2">
              <MapPin size={14} /> Dhaka, Bangladesh
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} /> +880 1XXX-XXXXXX
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} /> hello@fieldhouse.shop
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9B9689]">
          <p>© {new Date().getFullYear()} Fieldhouse. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="border border-white/15 rounded-sm px-2 py-1">
              VISA
            </span>
            <span className="border border-white/15 rounded-sm px-2 py-1">
              MASTERCARD
            </span>
            <span className="border border-white/15 rounded-sm px-2 py-1">
              bKash
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export default function EcommerceHomePage() {
  return (
    <div className="min-h-screen bg-[#F7F3EC] font-sans">
      {/* Optional: move to next/font/google in production instead of this link */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap"
      />
      <style>{`.font-serif { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .font-sans { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }`}</style>

      <Header />
      <main>
        <Hero />
        <PerksStrip />
        <Categories />
        <ExclusiveProducts />
        <OfferSlider />
        <FeaturedProducts />
        <NewArrivals />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
