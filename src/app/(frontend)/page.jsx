"use client";

import React from "react";
import Link from "next/link";
import {
  MdSearch,
  MdMenu,
  MdShoppingBag,
  MdFavoriteBorder,
  MdStar,
  MdLocalShipping,
  MdVerifiedUser,
  MdAutorenew,
  MdAddShoppingCart,
  MdPhoneInTalk,
  MdLocationOn,
  MdSyncAlt,
  MdPersonOutline,
  MdCreditCard,
  MdBolt,
} from "react-icons/md";

/* =========================================================
   DESIGN SYSTEM & TYPOGRAPHY
========================================================= */
const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif';

/* =========================================================
   DUMMY DATA
========================================================= */
const categories = [
  {
    id: 1,
    name: "Phones",
    slug: "phones",
    count: "120+ Items",
    image:
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Laptops",
    slug: "laptops",
    count: "85+ Items",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Smart Watches",
    slug: "smart-watches",
    count: "60+ Items",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    name: "Audio & Headphones",
    slug: "audio",
    count: "110+ Items",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 5,
    name: "Tablets",
    slug: "tablets",
    count: "45+ Items",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 6,
    name: "Accessories",
    slug: "accessories",
    count: "300+ Items",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
  },
];

const topBrands = [
  {
    id: 1,
    name: "Apple",
    logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 2,
    name: "Samsung",
    logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 3,
    name: "Google",
    logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 4,
    name: "Xiaomi",
    logo: "https://images.unsplash.com/photo-1550029402-226115b7c579?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 5,
    name: "Sony",
    logo: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 6,
    name: "Anker",
    logo: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=200&q=80",
  },
];

const flashSaleProducts = [
  {
    id: 101,
    name: "Flagship Smartphone 5G - 256GB Titanium",
    category: "Phones",
    price: 142500,
    oldPrice: 155000,
    discount: "8% OFF",
    rating: 4.9,
    reviews: 320,
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=85",
  },
  {
    id: 102,
    name: "Ultra Thin Pro Laptop 14-inch M-Series",
    category: "Laptops",
    price: 128000,
    oldPrice: 138000,
    discount: "৳10,000 OFF",
    rating: 4.8,
    reviews: 142,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=85",
  },
  {
    id: 103,
    name: "Fitness Smart Watch Series 9 GPS",
    category: "Smart Watches",
    price: 46500,
    oldPrice: 52000,
    discount: "11% OFF",
    rating: 4.7,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=85",
  },
  {
    id: 104,
    name: "Wireless ANC Earbuds Pro Type-C",
    category: "Audio & Headphones",
    price: 24500,
    oldPrice: 28000,
    discount: "12% OFF",
    rating: 4.9,
    reviews: 512,
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=85",
  },
];

const featuredProducts = [
  {
    id: 201,
    name: "NextGen Tablet 11-inch High Refresh Rate",
    category: "Tablets",
    price: 78500,
    oldPrice: 84000,
    rating: 4.8,
    reviews: 64,
    badge: "New Arrival",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=85",
  },
  {
    id: 202,
    name: "Ultra AI Smartphone 12GB/512GB",
    category: "Phones",
    price: 129000,
    oldPrice: 139000,
    rating: 4.9,
    reviews: 210,
    badge: "Official",
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=85",
  },
  {
    id: 203,
    name: "Fast Charging 10000mAh Magnetic Power Bank",
    category: "Accessories",
    price: 6200,
    oldPrice: 7500,
    rating: 4.7,
    reviews: 95,
    badge: "Popular",
    image:
      "https://images.unsplash.com/photo-1609592424074-8b6528d223f6?auto=format&fit=crop&w=600&q=85",
  },
  {
    id: 204,
    name: "Pure Android Camera Phone 128GB",
    category: "Phones",
    price: 89500,
    oldPrice: 98000,
    rating: 4.8,
    reviews: 178,
    badge: "Best Value",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=85",
  },
];

/* =========================================================
   COMPONENTS
========================================================= */
const ProductCard = ({ product }) => {
  return (
    <article
      className="group flex flex-col rounded-xl bg-white p-3.5 transition-all duration-300 hover:shadow-xl ring-1 ring-[#E2E8F0] hover:ring-[#4F46E5]/40"
      aria-labelledby={`product-title-${product.id}`}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#F8FAFC] p-4 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {product.discount && (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-[#EF4444] px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
            {product.discount}
          </span>
        )}

        {product.badge && !product.discount && (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-[#0F172A] px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#0F172A] backdrop-blur-sm transition-colors hover:bg-white hover:text-[#EF4444] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
        >
          <MdFavoriteBorder size={18} />
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
          {product.category}
        </p>

        <Link
          href={`/products/${product.id}`}
          id={`product-title-${product.id}`}
          className="mt-1 text-[14px] font-semibold text-[#0F172A] line-clamp-2 transition hover:text-[#4F46E5] focus-visible:outline-none focus-visible:underline"
        >
          {product.name}
        </Link>

        <div
          className="mt-2 flex items-center gap-1"
          aria-label={`Rating: ${product.rating} stars`}
        >
          <MdStar className="text-[#F59E0B]" size={14} aria-hidden="true" />
          <span className="text-[12px] font-semibold text-[#0F172A]">
            {product.rating}
          </span>
          <span className="text-[11px] text-[#64748B]">
            ({product.reviews})
          </span>
        </div>

        <div className="mt-auto pt-3 flex items-end justify-between border-t border-[#F1F5F9]">
          <div>
            <span className="text-[16px] font-bold text-[#0F172A]">
              ৳{product.price.toLocaleString("en-BD")}
            </span>
            {product.oldPrice > product.price && (
              <span className="ml-1.5 text-[12px] text-[#94A3B8] line-through">
                ৳{product.oldPrice.toLocaleString("en-BD")}
              </span>
            )}
          </div>

          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F1F5F9] text-[#0F172A] transition hover:bg-[#4F46E5] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <MdAddShoppingCart size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
};

/* =========================================================
   MAIN E-COMMERCE HOMEPAGE (Electric Tech Theme)
========================================================= */
export default function EcommerceHomePage() {
  const mainNavLinks = [
    { label: "Phones", href: "/category/phones" },
    { label: "Laptops", href: "/category/laptops" },
    { label: "Tablets", href: "/category/tablets" },
    { label: "Smart Watches", href: "/category/smart-watches" },
    { label: "Audio", href: "/category/audio" },
    { label: "Accessories", href: "/category/accessories" },
    { label: "Gaming", href: "/category/gaming" },
    { label: "Deals & Offers", href: "/offers" },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#4F46E5] selection:text-white"
      style={{ fontFamily: FONT_STACK }}
    >
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-[#0F172A] focus:text-white focus:px-4 focus:py-2 focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* =====================================================
          1. TOP ANNOUNCEMENT BAR
      ===================================================== */}
      <div className="bg-[#0F172A] text-white text-[12px] py-1.5 border-b border-slate-800">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#818CF8] font-semibold">
              <MdPhoneInTalk size={14} /> Hotline: 09678-000111
            </span>
            <span className="hidden sm:inline-block text-slate-600">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <MdLocationOn size={14} /> Outlets: Dhanmondi, Banani, Jamuna
              Future Park
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <Link
              href="/order-tracking"
              className="hover:text-white transition"
            >
              Order Tracking
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              href="/emi-info"
              className="flex items-center gap-1 hover:text-white transition"
            >
              <MdCreditCard size={14} /> 0% EMI Available
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          2. MAIN HEADER
      ===================================================== */}
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6">
          <button
            type="button"
            aria-label="Open mobile navigation menu"
            className="flex h-10 w-10 items-center justify-center text-[#0F172A] lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded-md"
          >
            <MdMenu size={24} />
          </button>

          <Link
            href="/"
            className="flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded-md"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5] text-white">
              <MdBolt size={20} />
            </div>
            <span className="text-[22px] font-black tracking-tight text-[#0F172A]">
              Gadget<span className="text-[#4F46E5]">Pulse</span>
            </span>
          </Link>

          {/* Search Bar */}
          <div
            role="search"
            className="hidden flex-1 max-w-[560px] lg:flex items-center gap-2 rounded-full border border-[#CBD5E1] bg-[#F1F5F9] px-4 py-2 transition focus-within:border-[#4F46E5] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#4F46E5]/20"
          >
            <MdSearch size={20} className="text-[#64748B]" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search for Smartphones, Laptops, Earbuds, Smart Watches..."
              aria-label="Search products"
              className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#64748B]"
            />
            <button
              type="submit"
              className="rounded-full bg-[#0F172A] px-4 py-1 text-[12px] font-semibold text-white transition hover:bg-[#4F46E5]"
            >
              Search
            </button>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/compare"
              aria-label="Compare products"
              className="hidden sm:flex flex-col items-center text-[11px] font-medium text-[#0F172A] hover:text-[#4F46E5]"
            >
              <MdSyncAlt size={22} />
              <span>Compare</span>
            </Link>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="flex flex-col items-center text-[11px] font-medium text-[#0F172A] hover:text-[#4F46E5]"
            >
              <div className="relative">
                <MdFavoriteBorder size={22} />
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold text-white">
                  0
                </span>
              </div>
              <span className="hidden sm:inline">Wishlist</span>
            </Link>

            <Link
              href="/cart"
              aria-label="Shopping bag"
              className="flex flex-col items-center text-[11px] font-medium text-[#0F172A] hover:text-[#4F46E5]"
            >
              <div className="relative">
                <MdShoppingBag size={22} />
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#4F46E5] text-[9px] font-bold text-white">
                  2
                </span>
              </div>
              <span className="hidden sm:inline">Cart</span>
            </Link>

            <Link
              href="/account"
              aria-label="Account"
              className="flex flex-col items-center text-[11px] font-medium text-[#0F172A] hover:text-[#4F46E5]"
            >
              <MdPersonOutline size={22} />
              <span className="hidden sm:inline">Account</span>
            </Link>
          </div>
        </div>

        {/* Category Nav */}
        <nav
          aria-label="Category Menu"
          className="hidden border-t border-[#E2E8F0] bg-white lg:block"
        >
          <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 sm:px-6">
            {mainNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="py-2.5 text-[13px] font-medium text-[#0F172A] transition hover:text-[#4F46E5] focus-visible:outline-none focus-visible:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main id="main-content" className="space-y-8 pb-16">
        {/* =====================================================
            3. HERO SECTION (Cyber-Tech Gradient)
        ===================================================== */}
        <section
          aria-label="Promotions and Featured Offers"
          className="pt-4 sm:pt-6"
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="relative min-h-[320px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81] lg:col-span-2 sm:min-h-[400px]">
                <img
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=85"
                  alt="Next-Gen Flagship Smartphone Banner"
                  className="absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/80 to-transparent" />
                <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-10">
                  <span className="text-[12px] font-bold uppercase tracking-widest text-[#818CF8]">
                    Next-Gen Hardware
                  </span>
                  <h1 className="mt-2 text-[32px] font-black text-white sm:text-[44px] leading-tight">
                    Flagship Tech Arrived
                  </h1>
                  <p className="mt-2 max-w-md text-[14px] text-slate-300">
                    Sleek titanium builds, neural processing units, and
                    high-performance displays. Official warranty included.
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <Link
                      href="/shop"
                      className="rounded-full bg-[#4F46E5] px-6 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#4338CA] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4F46E5]/50"
                    >
                      Explore Gear
                    </Link>
                    <span className="text-[16px] font-bold text-white">
                      Starting ৳42,500
                    </span>
                  </div>
                </div>
              </div>

              {/* Side Banners */}
              <div className="flex flex-col gap-4">
                <div className="relative flex-1 overflow-hidden rounded-2xl bg-[#0F172A] p-6 text-white min-h-[190px] border border-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
                    alt="Ultrabook Laptops"
                    className="absolute inset-0 h-full w-full object-cover opacity-30"
                  />
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#F59E0B]">
                        Featured Tech
                      </span>
                      <h2 className="text-[20px] font-bold">
                        Pro Laptops & Rig Setup
                      </h2>
                    </div>
                    <Link
                      href="/shop"
                      className="text-[13px] font-semibold text-[#818CF8] hover:underline"
                    >
                      Explore Laptops &rarr;
                    </Link>
                  </div>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-2xl bg-white p-6 text-[#0F172A] min-h-[190px] border border-[#E2E8F0]">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                    alt="Premium Wireless Audio Gear"
                    className="absolute right-0 top-0 h-full w-1/2 object-contain p-2"
                  />
                  <div className="relative z-10 flex h-full flex-col justify-between max-w-[60%]">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#7C3AED]">
                        High Fidelity
                      </span>
                      <h2 className="text-[20px] font-bold">
                        Acoustics & Audio
                      </h2>
                    </div>
                    <Link
                      href="/shop"
                      className="text-[13px] font-semibold text-[#4F46E5] hover:underline"
                    >
                      Up to 30% OFF &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            4. TRUST BADGES
        ===================================================== */}
        <section aria-label="Service Guarantees">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-6 border border-[#E2E8F0] md:grid-cols-4">
              {[
                {
                  icon: MdVerifiedUser,
                  title: "100% Authentic",
                  desc: "Original Tech Guaranteed",
                },
                {
                  icon: MdLocalShipping,
                  title: "Fast Delivery",
                  desc: "Express delivery islandwide",
                },
                {
                  icon: MdAutorenew,
                  title: "Easy Return",
                  desc: "7 Days replacement policy",
                },
                {
                  icon: MdCreditCard,
                  title: "0% EMI Facility",
                  desc: "Up to 36 months EMI option",
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
                      <Icon size={22} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-bold text-[#0F172A]">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-[#64748B]">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            5. BRANDS GRID
        ===================================================== */}
        <section aria-labelledby="top-brands-heading">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="top-brands-heading"
                className="text-[20px] font-bold text-[#0F172A]"
              >
                Top Tech Brands
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {topBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brand/${brand.name.toLowerCase()}`}
                  className="flex flex-col items-center justify-center rounded-xl bg-white p-4 border border-[#E2E8F0] transition hover:border-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                >
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="h-10 w-10 object-contain"
                  />
                  <span className="mt-2 text-[12px] font-semibold text-[#0F172A]">
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            6. FLASH SALE
        ===================================================== */}
        <section aria-labelledby="flash-sale-heading">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="rounded-2xl bg-white p-6 border border-[#E2E8F0]">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-[#F1F5F9] pb-4">
                <div className="flex items-center gap-3">
                  <h2
                    id="flash-sale-heading"
                    className="text-[22px] font-black text-[#0F172A]"
                  >
                    Flash Deals
                  </h2>
                  <span className="rounded-md bg-[#EF4444] px-2.5 py-1 text-[11px] font-bold text-white">
                    Ending Soon
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[13px] font-semibold text-[#0F172A]">
                  <span>Ends In:</span>
                  <div className="flex items-center gap-1 font-mono">
                    <span className="rounded bg-[#0F172A] px-2 py-1 text-white">
                      02
                    </span>
                    :
                    <span className="rounded bg-[#0F172A] px-2 py-1 text-white">
                      14
                    </span>
                    :
                    <span className="rounded bg-[#0F172A] px-2 py-1 text-white">
                      38
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {flashSaleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            7. FEATURED CATEGORIES
        ===================================================== */}
        <section aria-labelledby="featured-categories-heading">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="featured-categories-heading"
                className="text-[20px] font-bold text-[#0F172A]"
              >
                Featured Categories
              </h2>
              <Link
                href="/categories"
                className="text-[13px] font-semibold text-[#4F46E5] hover:underline"
              >
                View All Categories
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col items-center rounded-xl bg-white p-4 border border-[#E2E8F0] text-center transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                >
                  <div className="h-20 w-20 overflow-hidden rounded-full bg-[#F8FAFC] p-2">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="mt-3 text-[13px] font-bold text-[#0F172A]">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[#64748B]">{cat.count}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            8. POPULAR PRODUCTS
        ===================================================== */}
        <section aria-labelledby="popular-heading">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="popular-heading"
                className="text-[20px] font-bold text-[#0F172A]"
              >
                Trending Electronics
              </h2>
              <Link
                href="/shop"
                className="text-[13px] font-semibold text-[#4F46E5] hover:underline"
              >
                See More
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            9. PROMO BANNERS
        ===================================================== */}
        <section aria-label="Special Offers and Services">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] p-6 text-white border border-slate-800">
                <div>
                  <span className="text-[11px] font-bold uppercase text-[#818CF8]">
                    Trade-In Program
                  </span>
                  <h3 className="mt-1 text-[22px] font-bold">
                    Exchange Your Old Device
                  </h3>
                  <p className="mt-1 text-[13px] text-slate-300">
                    Upgrade your phone or laptop with maximum trade-in value.
                  </p>
                  <Link
                    href="/exchange"
                    className="mt-4 inline-block text-[13px] font-bold text-[#818CF8] hover:underline"
                  >
                    Get Instant Valuation &rarr;
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#3730A3] p-6 text-white">
                <div>
                  <span className="text-[11px] font-bold uppercase text-indigo-200">
                    Support & Service
                  </span>
                  <h3 className="mt-1 text-[22px] font-bold">
                    Certified Tech Repair
                  </h3>
                  <p className="mt-1 text-[13px] text-indigo-100">
                    Display replacement, battery fixes & hardware repair by
                    specialists.
                  </p>
                  <Link
                    href="/repair"
                    className="mt-4 inline-block text-[13px] font-bold text-white underline"
                  >
                    Book Service Appointment &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            10. SEO CONTENT SECTION
        ===================================================== */}
        <section aria-labelledby="about-store-heading" className="pt-4">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="rounded-2xl bg-white p-6 sm:p-8 border border-[#E2E8F0]">
              <h2
                id="about-store-heading"
                className="text-[18px] font-bold text-[#0F172A]"
              >
                GadgetPulse - Premium Tech & Gadget Store in Bangladesh
              </h2>
              <p className="mt-3 text-[13px] leading-relaxed text-[#64748B]">
                GadgetPulse is your ultimate destination for authentic consumer
                electronics and gadgets. We bring you official and international
                warranty products from top global technology brands, including
                smartphones, laptops, audio gear, smart home accessories, and
                wearable technology. Enjoy safe online ordering with fast
                delivery, official brand warranties, and flexible 0% EMI
                options.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          11. FOOTER
      ===================================================== */}
      <footer className="border-t border-[#E2E8F0] bg-white text-[#0F172A]">
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4F46E5] text-white">
                  <MdBolt size={18} />
                </div>
                <span className="text-[20px] font-black tracking-tight text-[#0F172A]">
                  Gadget<span className="text-[#4F46E5]">Pulse</span>
                </span>
              </div>
              <p className="mt-3 text-[13px] text-[#64748B]">
                Your trusted e-commerce platform for original gadgets and tech
                solutions.
              </p>
              <div className="mt-4 space-y-2 text-[13px]">
                <p className="font-semibold text-[#0F172A]">
                  Hotline: <span className="text-[#4F46E5]">09678-000111</span>
                </p>
                <p className="text-[#64748B]">Email: support@gadgetpulse.com</p>
                <p className="text-[#64748B]">
                  Hours: 10:00 AM - 8:00 PM (Everyday)
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-[14px] font-bold text-[#0F172A] uppercase tracking-wider">
                Our Outlets
              </h3>
              <ul className="mt-3 space-y-2 text-[13px] text-[#64748B]">
                <li>
                  <strong className="text-[#0F172A]">Dhanmondi:</strong> Level
                  3, Shimanto Square, Dhaka
                </li>
                <li>
                  <strong className="text-[#0F172A]">Bashundhara:</strong> Level
                  5, Jamuna Future Park
                </li>
                <li>
                  <strong className="text-[#0F172A]">Banani:</strong> Road 11,
                  Block C, Dhaka
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[14px] font-bold text-[#0F172A] uppercase tracking-wider">
                Customer Care
              </h3>
              <ul className="mt-3 space-y-2 text-[13px] text-[#64748B]">
                <li>
                  <Link href="/about" className="hover:text-[#4F46E5]">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/warranty-policy"
                    className="hover:text-[#4F46E5]"
                  >
                    Warranty Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/replacement-policy"
                    className="hover:text-[#4F46E5]"
                  >
                    Replacement Policy
                  </Link>
                </li>
                <li>
                  <Link href="/emi-terms" className="hover:text-[#4F46E5]">
                    EMI Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-[#4F46E5]">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[14px] font-bold text-[#0F172A] uppercase tracking-wider">
                Stay Connected
              </h3>
              <p className="mt-3 text-[13px] text-[#64748B]">
                Subscribe to get daily discount codes & news updates.
              </p>
              <form
                onSubmit={handleNewsletterSubmit}
                className="mt-3 flex items-center gap-2"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email address for newsletter"
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#F1F5F9] px-3 py-2 text-[13px] outline-none focus:border-[#4F46E5]"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[#0F172A] px-4 py-2 text-[13px] font-bold text-white transition hover:bg-[#4F46E5]"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#E2E8F0] pt-6 text-[12px] text-[#94A3B8] sm:flex-row">
            <p>
              © {new Date().getFullYear()} GadgetPulse Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span>bKash / Nagad / Visa / Mastercard Accepted</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
