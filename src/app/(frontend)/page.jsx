
"use client";

import { useEffect, useRef, useState } from "react";
import {
  LuSearch,
  LuUser,
  LuGitCompare,
  LuShoppingCart,
  LuHeart,
  LuChevronLeft,
  LuChevronRight,
  LuStar,
  LuMenu,
  LuX,
  LuTruck,
  LuShieldCheck,
  LuRotateCcw,
  LuHeadphones,
  LuFacebook,
  LuInstagram,
  LuTwitter,
  LuYoutube,
  LuMail,
  LuMapPin,
  LuPhone,
} from "react-icons/lu";

/* =========================================================
   NAVIGATION
========================================================= */

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

/* =========================================================
   HERO SLIDES
========================================================= */

const HERO_SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
    eyebrow: "New season",
    title: "Furniture built to live in, not around",
    subtitle:
      "Solid oak and reclaimed wood pieces, finished by hand.",
    cta: "Shop the edit",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=85",
    eyebrow: "Kitchen & dining",
    title: "Stoneware and cast iron for everyday cooking",
    subtitle:
      "Small-batch pieces made to be used, not shelved.",
    cta: "Browse kitchenware",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1400&q=85",
    eyebrow: "Just restocked",
    title: "Linen and wool for the colder months",
    subtitle:
      "Woven in small runs, softer with every wash.",
    cta: "Shop textiles",
  },
];

/* =========================================================
   SIDE BANNERS
========================================================= */

const SIDE_BANNERS = [
  {
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=85",
    title: "Outdoor & garden",
    subtitle: "Teak seating, up to 20% off",
  },
  {
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85",
    title: "Lighting studio",
    subtitle: "Brushed brass, new arrivals",
  },
];

/* =========================================================
   CATEGORIES
========================================================= */

const CATEGORIES = [
  {
    name: "Lighting",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Kitchen & Dining",
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Furniture",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Textiles & Bedding",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Storage",
    image:
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Outdoor & Garden",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Decor & Accents",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Bath",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=85",
  },
];

/* =========================================================
   EXCLUSIVE PRODUCTS
========================================================= */

const EXCLUSIVE_PRODUCTS = [
  {
    id: "ex1",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=85",
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
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=85",
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
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=600&q=85",
    category: "Lighting",
    name: "Brushed Brass Pendant Light",
    price: 145,
    rating: 4.7,
    reviews: 38,
    badge: "Exclusive",
  },
  {
    id: "ex4",
    image:
      "https://images.unsplash.com/photo-1600369671236-e74521d0bde6?auto=format&fit=crop&w=600&q=85",
    category: "Textiles & Bedding",
    name: "Linen Weave Throw Blanket",
    price: 76,
    rating: 4.6,
    reviews: 51,
    badge: "Exclusive",
  },
];

/* =========================================================
   OFFER SLIDES
========================================================= */

const OFFER_SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85",
    title: "Wool & Wood",
    subtitle:
      "Up to 30% off cold-weather furnishings",
    cta: "Shop the sale",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",
    title: "The Kitchen Edit",
    subtitle:
      "Season's essentials, from $18",
    cta: "Shop kitchen",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
    title: "Outdoor Living",
    subtitle:
      "Get ahead of spring, pre-order now",
    cta: "Shop outdoor",
  },
];

/* =========================================================
   FEATURED TABS
========================================================= */

const FEATURED_TABS = [
  "Kitchen & Dining",
  "Furniture",
  "Lighting",
  "Textiles",
];

/* =========================================================
   FEATURED PRODUCTS
========================================================= */

const FEATURED_PRODUCTS = {
  "Kitchen & Dining": [
    {
      id: "k1",
      image:
        "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=600&q=85",
      category: "Kitchen & Dining",
      name: 'Cast Iron Skillet 10"',
      price: 42,
      rating: 4.9,
      reviews: 210,
    },
    {
      id: "k2",
      image:
        "https://images.unsplash.com/photo-1608755728617-aefab37d2ab2?auto=format&fit=crop&w=600&q=85",
      category: "Kitchen & Dining",
      name: "Olive Wood Cutting Board",
      price: 34,
      rating: 4.7,
      reviews: 88,
    },
    {
      id: "k3",
      image:
        "https://images.unsplash.com/photo-1493106819501-66d381c466f1?auto=format&fit=crop&w=600&q=85",
      category: "Kitchen & Dining",
      name: "Speckled Ceramic Bowl Set",
      price: 64,
      rating: 4.8,
      reviews: 73,
    },
    {
      id: "k4",
      image:
        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=85",
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
      image:
        "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=600&q=85",
      category: "Furniture",
      name: "Teak Outdoor Bench",
      price: 320,
      rating: 4.6,
      reviews: 27,
    },
    {
      id: "f2",
      image:
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=85",
      category: "Furniture",
      name: "Bouclé Reading Armchair",
      price: 540,
      oldPrice: 620,
      rating: 4.9,
      reviews: 54,
    },
    {
      id: "f3",
      image:
        "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=600&q=85",
      category: "Furniture",
      name: "Floating Walnut Shelf",
      price: 88,
      rating: 4.4,
      reviews: 19,
    },
    {
      id: "f4",
      image:
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=85",
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
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=85",
      category: "Lighting",
      name: "Linen Shade Table Lamp",
      price: 74,
      rating: 4.6,
      reviews: 46,
    },
    {
      id: "l2",
      image:
        "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=600&q=85",
      category: "Lighting",
      name: "Brass Wall Sconce, Pair",
      price: 96,
      rating: 4.8,
      reviews: 22,
    },
    {
      id: "l3",
      image:
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=600&q=85",
      category: "Lighting",
      name: "Arched Iron Floor Lamp",
      price: 132,
      rating: 4.5,
      reviews: 17,
    },
    {
      id: "l4",
      image:
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=85",
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
      image:
        "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=85",
      category: "Textiles & Bedding",
      name: "Washed Linen Duvet Set",
      price: 128,
      rating: 4.8,
      reviews: 95,
    },
    {
      id: "t2",
      image:
        "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=600&q=85",
      category: "Textiles & Bedding",
      name: "Hand-Knotted Wool Rug",
      price: 240,
      rating: 4.9,
      reviews: 61,
    },
    {
      id: "t3",
      image:
        "https://images.unsplash.com/photo-1583845112203-454c7a2b9b47?auto=format&fit=crop&w=600&q=85",
      category: "Textiles & Bedding",
      name: "Wool Felt Table Runner",
      price: 36,
      rating: 4.4,
      reviews: 12,
    },
    {
      id: "t4",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=85",
      category: "Textiles & Bedding",
      name: "Boucle Cushion Cover, Set of 2",
      price: 44,
      rating: 4.6,
      reviews: 37,
    },
  ],
};

/* =========================================================
   NEW ARRIVALS
========================================================= */

const NEW_ARRIVALS = [
  {
    id: "n1",
    image:
      "https://images.unsplash.com/photo-1551298370-9d3d53740c72?auto=format&fit=crop&w=600&q=85",
    category: "Furniture",
    name: "Ash Wood Side Table",
    price: 112,
    rating: 4.7,
    reviews: 8,
    badge: "New",
  },
  {
    id: "n2",
    image:
      "https://images.unsplash.com/photo-1572119865084-43c285814d63?auto=format&fit=crop&w=600&q=85",
    category: "Kitchen & Dining",
    name: "Enamel Stovetop Teapot",
    price: 46,
    rating: 4.5,
    reviews: 6,
    badge: "New",
  },
  {
    id: "n3",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=85",
    category: "Decor & Accents",
    name: "Rattan-Framed Wall Mirror",
    price: 68,
    rating: 4.6,
    reviews: 4,
    badge: "New",
  },
  {
    id: "n4",
    image:
      "https://images.unsplash.com/photo-1600369671236-e74521d0bde6?auto=format&fit=crop&w=600&q=85",
    category: "Textiles & Bedding",
    name: "Chunky Knit Wool Throw",
    price: 82,
    rating: 4.8,
    reviews: 11,
    badge: "New",
  },
  {
    id: "n5",
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=85",
    category: "Decor & Accents",
    name: "Forged Iron Candlestick",
    price: 24,
    rating: 4.3,
    reviews: 3,
    badge: "New",
  },
  {
    id: "n6",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=85",
    category: "Decor & Accents",
    name: "Speckled Ceramic Planter",
    price: 32,
    rating: 4.7,
    reviews: 9,
    badge: "New",
  },
];

/* =========================================================
   PERKS
========================================================= */

const PERKS = [
  {
    icon: LuTruck,
    title: "Free shipping",
    text: "On orders over $75",
  },
  {
    icon: LuRotateCcw,
    title: "30-day returns",
    text: "No questions asked",
  },
  {
    icon: LuShieldCheck,
    title: "Secure checkout",
    text: "Encrypted payments",
  },
  {
    icon: LuHeadphones,
    title: "Support",
    text: "Mon–Fri, 9am–6pm",
  },
];

/* =========================================================
   STARS
========================================================= */

function Stars({ rating }) {
  const full = Math.round(rating);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <LuStar
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

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({ product }) {
  const {
    image,
    category,
    name,
    price,
    oldPrice,
    rating,
    reviews,
    badge,
  } = product;

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
          <LuHeart size={15} />
        </button>

        <button
          type="button"
          className="absolute inset-x-3 bottom-3 bg-[#211F1D] text-[#F7F3EC] text-sm py-2 rounded-sm translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <LuShoppingCart size={14} />
          Add to cart
        </button>
      </div>

      <div className="p-4">
        <p className="text-xs text-[#8A8378] mb-1">
          {category}
        </p>

        <h3 className="text-sm text-[#211F1D] leading-snug mb-1.5 line-clamp-2">
          {name}
        </h3>

        <div className="flex items-center gap-1.5 mb-2">
          <Stars rating={rating} />

          <span className="text-xs text-[#8A8378]">
            ({reviews})
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-[#1F3A2E] text-base">
            ${price}
          </span>

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

/* =========================================================
   MAIN PAGE
========================================================= */

export default function EcommerceHomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollerRef = useRef(null);

  const [heroActive, setHeroActive] = useState(0);
  const [offerActive, setOfferActive] = useState(0);
  const [activeTab, setActiveTab] =
    useState(FEATURED_TABS[0]);

  /* Hero autoplay */
  useEffect(() => {
    const id = setInterval(() => {
      setHeroActive(
        (a) => (a + 1) % HERO_SLIDES.length
      );
    }, 5000);

    return () => clearInterval(id);
  }, []);

  /* Offer autoplay */
  useEffect(() => {
    const id = setInterval(() => {
      setOfferActive(
        (a) => (a + 1) % OFFER_SLIDES.length
      );
    }, 6000);

    return () => clearInterval(id);
  }, []);

  /* Navigation scrolling */
  const scrollNav = (dir) => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({
        left: dir * 220,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] font-sans">
      {/* =====================================================
          GOOGLE FONTS
      ===================================================== */}

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap"
      />

      <style>{`
        .font-serif {
          font-family: 'Fraunces', ui-serif, Georgia, serif;
        }

        .font-sans {
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
        }
      `}</style>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="bg-[#F7F3EC] sticky top-0 z-40">
        {/* Announcement Bar */}
        <div className="bg-[#1F3A2E] text-[#F7F3EC] text-xs">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
            <p>
              Free shipping on orders over $75 · Handmade in
              small batches
            </p>

            <div className="hidden sm:flex items-center gap-4">
              <a
                href="#"
                className="hover:text-[#C9A659] transition-colors"
              >
                Track order
              </a>

              <a
                href="#"
                className="hover:text-[#C9A659] transition-colors"
              >
                Help
              </a>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 flex items-center gap-4 sm:gap-8">
          {/* Mobile Menu */}
          <button
            type="button"
            className="lg:hidden text-[#211F1D]"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <LuMenu size={22} />
          </button>

          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 shrink-0"
          >
            <span className="w-9 h-9 rounded-sm bg-[#1F3A2E] text-[#F7F3EC] flex items-center justify-center font-serif text-lg">
              F
            </span>

            <span className="font-serif text-xl text-[#211F1D] tracking-tight hidden xs:inline">
              FIELDHOUSE
            </span>
          </a>

          {/* Search */}
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
              <LuSearch size={17} />
            </button>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4 sm:gap-6 ml-auto text-[#211F1D]">
            <button
              type="button"
              className="flex flex-col items-center gap-0.5 hover:text-[#B65C38] transition-colors"
              aria-label="Account"
            >
              <LuUser size={20} />

              <span className="text-[10px] hidden sm:inline">
                Account
              </span>
            </button>

            <button
              type="button"
              className="relative flex flex-col items-center gap-0.5 hover:text-[#B65C38] transition-colors"
              aria-label="Compare"
            >
              <LuGitCompare size={20} />

              <span className="text-[10px] hidden sm:inline">
                Compare
              </span>

              <span className="absolute -top-1 -right-1.5 bg-[#B65C38] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </button>

            <button
              type="button"
              className="relative flex flex-col items-center gap-0.5 hover:text-[#B65C38] transition-colors"
              aria-label="Cart"
            >
              <LuShoppingCart size={20} />

              <span className="text-[10px] hidden sm:inline">
                Cart
              </span>

              <span className="absolute -top-1 -right-1.5 bg-[#B65C38] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
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
              <LuSearch size={16} />
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block border-t border-[#E4DED2] bg-[#F7F3EC]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative flex items-center">
            <button
              type="button"
              aria-label="Scroll navigation left"
              onClick={() => scrollNav(-1)}
              className="shrink-0 text-[#8A8378] hover:text-[#1F3A2E] pr-2"
            >
              <LuChevronLeft size={16} />
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
              <LuChevronRight size={16} />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
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
                  <LuX
                    size={20}
                    className="text-[#211F1D]"
                  />
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
        )}
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main>
        {/* ===================================================
            HERO
        =================================================== */}

        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
            {/* Main Slider */}
            <div className="relative rounded-md overflow-hidden h-[340px] sm:h-[420px] lg:h-[480px]">
              {HERO_SLIDES.map((slide, i) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    i === heroActive
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
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
                      <p className="text-[#C9A659] text-sm mb-2">
                        {slide.eyebrow}
                      </p>

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

              {/* Previous */}
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() =>
                  setHeroActive(
                    (a) =>
                      (a - 1 + HERO_SLIDES.length) %
                      HERO_SLIDES.length
                  )
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#F7F3EC]/85 text-[#211F1D] flex items-center justify-center hover:bg-[#F7F3EC] transition-colors"
              >
                <LuChevronLeft size={18} />
              </button>

              {/* Next */}
              <button
                type="button"
                aria-label="Next slide"
                onClick={() =>
                  setHeroActive(
                    (a) => (a + 1) % HERO_SLIDES.length
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#F7F3EC]/85 text-[#211F1D] flex items-center justify-center hover:bg-[#F7F3EC] transition-colors"
              >
                <LuChevronRight size={18} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {HERO_SLIDES.map((slide, i) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setHeroActive(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === heroActive
                        ? "w-6 bg-[#F7F3EC]"
                        : "w-1.5 bg-[#F7F3EC]/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Side Banners */}
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

                    <p className="text-[#F7F3EC]/85 text-xs">
                      {banner.subtitle}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================
            PERKS
        =================================================== */}

        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-[#E4DED2] py-6">
            {PERKS.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex items-center gap-3"
              >
                <Icon
                  size={22}
                  className="text-[#1F3A2E] shrink-0"
                />

                <div>
                  <p className="text-sm text-[#211F1D]">
                    {title}
                  </p>

                  <p className="text-xs text-[#8A8378]">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================
            CATEGORIES
        =================================================== */}

        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-14">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-sm text-[#B65C38] mb-1">
                Browse
              </p>

              <h2 className="font-serif text-3xl md:text-[2.15rem] text-[#211F1D] leading-tight">
                Shop by category
              </h2>
            </div>

            <a
              href="#"
              className="hidden sm:inline-block text-sm text-[#1F3A2E] border-b border-[#1F3A2E] pb-0.5 hover:text-[#B65C38] hover:border-[#B65C38] transition-colors whitespace-nowrap"
            >
              View all categories
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-5">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.name}
                href="#"
                className="group text-center"
              >
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

        {/* ===================================================
            EXCLUSIVE PRODUCTS
        =================================================== */}

        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-16">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-sm text-[#B65C38] mb-1">
                Members get first pick
              </p>

              <h2 className="font-serif text-3xl md:text-[2.15rem] text-[#211F1D] leading-tight">
                Exclusive products
              </h2>
            </div>

            <a
              href="#"
              className="hidden sm:inline-block text-sm text-[#1F3A2E] border-b border-[#1F3A2E] pb-0.5 hover:text-[#B65C38] hover:border-[#B65C38] transition-colors whitespace-nowrap"
            >
              View all exclusives
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {EXCLUSIVE_PRODUCTS.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
              />
            ))}
          </div>
        </section>

        {/* ===================================================
            OFFER SLIDER
        =================================================== */}

        <section className="bg-[#1F3A2E] mt-16 py-14">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between gap-6 mb-8">
              <div>
                <p className="text-sm text-[#C9A659] mb-1">
                  Limited time
                </p>

                <h2 className="font-serif text-3xl text-[#F7F3EC]">
                  Current offers
                </h2>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous offer"
                  onClick={() =>
                    setOfferActive(
                      (a) =>
                        (a - 1 + OFFER_SLIDES.length) %
                        OFFER_SLIDES.length
                    )
                  }
                  className="w-9 h-9 rounded-full border border-[#F7F3EC]/30 text-[#F7F3EC] flex items-center justify-center hover:bg-[#F7F3EC]/10 transition-colors"
                >
                  <LuChevronLeft size={16} />
                </button>

                <button
                  type="button"
                  aria-label="Next offer"
                  onClick={() =>
                    setOfferActive(
                      (a) => (a + 1) % OFFER_SLIDES.length
                    )
                  }
                  className="w-9 h-9 rounded-full border border-[#F7F3EC]/30 text-[#F7F3EC] flex items-center justify-center hover:bg-[#F7F3EC]/10 transition-colors"
                >
                  <LuChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="relative h-[300px] sm:h-[360px] rounded-md overflow-hidden">
              {OFFER_SLIDES.map((slide, i) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    i === offerActive
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
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
                    onClick={() => setOfferActive(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === offerActive
                        ? "w-6 bg-[#F7F3EC]"
                        : "w-1.5 bg-[#F7F3EC]/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            FEATURED PRODUCTS
        =================================================== */}

        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm text-[#B65C38] mb-1">
                Hand-picked
              </p>

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
            {FEATURED_PRODUCTS[activeTab].map(
              (p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                />
              )
            )}
          </div>
        </section>

        {/* ===================================================
            NEW ARRIVALS
        =================================================== */}

        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-16">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-sm text-[#B65C38] mb-1">
                Just landed
              </p>

              <h2 className="font-serif text-3xl md:text-[2.15rem] text-[#211F1D] leading-tight">
                New arrivals
              </h2>
            </div>

            <a
              href="#"
              className="hidden sm:inline-block text-sm text-[#1F3A2E] border-b border-[#1F3A2E] pb-0.5 hover:text-[#B65C38] hover:border-[#B65C38] transition-colors whitespace-nowrap"
            >
              View all new arrivals
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
            {NEW_ARRIVALS.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
              />
            ))}
          </div>
        </section>

        {/* ===================================================
            NEWSLETTER
        =================================================== */}

        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-16">
          <div className="bg-[#EFE9DC] rounded-md px-6 sm:px-12 py-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="font-serif text-2xl text-[#211F1D] mb-1">
                Get first access to restocks
              </h3>

              <p className="text-sm text-[#5B564C]">
                One email a week. No spam, unsubscribe
                anytime.
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
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-[#211F1D] text-[#D8D3C8] mt-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
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
              Everyday goods for the home, made in small
              batches with natural materials.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-[#C9A659] transition-colors"
              >
                <LuFacebook size={16} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-[#C9A659] transition-colors"
              >
                <LuInstagram size={16} />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-[#C9A659] transition-colors"
              >
                <LuTwitter size={16} />
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="hover:text-[#C9A659] transition-colors"
              >
                <LuYoutube size={16} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm text-[#F7F3EC] mb-4">
              Shop
            </h4>

            <ul className="space-y-2.5 text-sm text-[#9B9689]">
              <li>
                <a
                  href="#"
                  className="hover:text-[#C9A659] transition-colors"
                >
                  All categories
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-[#C9A659] transition-colors"
                >
                  New arrivals
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-[#C9A659] transition-colors"
                >
                  Best sellers
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-[#C9A659] transition-colors"
                >
                  Gift cards
                </a>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm text-[#F7F3EC] mb-4">
              Help
            </h4>

            <ul className="space-y-2.5 text-sm text-[#9B9689]">
              <li>
                <a
                  href="#"
                  className="hover:text-[#C9A659] transition-colors"
                >
                  Shipping & returns
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-[#C9A659] transition-colors"
                >
                  Track order
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-[#C9A659] transition-colors"
                >
                  FAQs
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-[#C9A659] transition-colors"
                >
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm text-[#F7F3EC] mb-4">
              Contact
            </h4>

            <ul className="space-y-2.5 text-sm text-[#9B9689]">
              <li className="flex items-center gap-2">
                <LuMapPin size={14} />
                Dhaka, Bangladesh
              </li>

              <li className="flex items-center gap-2">
                <LuPhone size={14} />
                +880 1XXX-XXXXXX
              </li>

              <li className="flex items-center gap-2">
                <LuMail size={14} />
                hello@fieldhouse.shop
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9B9689]">
            <p>
              © {new Date().getFullYear()} Fieldhouse. All
              rights reserved.
            </p>

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
    </div>
  );
}
