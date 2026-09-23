"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  MdFavorite,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdStar,
  MdStarBorder,
  MdLocalShipping,
  MdSecurity,
  MdReplay,
  MdSupportAgent,
  MdFlashOn,
  MdArrowForward,
  MdAddShoppingCart,
  MdEmail,
  MdFavoriteBorder,
} from "react-icons/md";

/* =========================================================
   DUMMY DATA
========================================================= */

const heroSlides = [
  {
    id: 1,
    title: "Upgrade Your Everyday",
    subtitle: "Latest products. Better prices. Smarter shopping.",
    discount: "UP TO 40% OFF",
    button: "Shop Now",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1800&q=85",
  },
  {
    id: 2,
    title: "Big Season Sale",
    subtitle: "Discover amazing deals across our latest collections.",
    discount: "SAVE UP TO 50%",
    button: "Explore Deals",
    image:
      "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1800&q=85",
  },
  {
    id: 3,
    title: "New Arrivals Are Here",
    subtitle: "Fresh styles and new technology just landed.",
    discount: "NEW COLLECTION",
    button: "Discover Now",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85",
  },
];

const categories = [
  {
    id: 1,
    name: "Electronics",
    count: "120+ Products",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    name: "Fashion",
    count: "250+ Products",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    name: "Beauty",
    count: "90+ Products",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    name: "Home & Living",
    count: "180+ Products",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 5,
    name: "Accessories",
    count: "150+ Products",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 6,
    name: "Sports",
    count: "80+ Products",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=500&q=80",
  },
];

const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    category: "Electronics",
    price: 89,
    oldPrice: 129,
    discount: 31,
    rating: 4.8,
    reviews: 124,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85",
    badge: "Hot Deal",
  },
  {
    id: 2,
    name: "Classic Minimal Watch",
    category: "Accessories",
    price: 64,
    oldPrice: 89,
    discount: 28,
    rating: 4.7,
    reviews: 87,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=85",
    badge: "Best Seller",
  },
  {
    id: 3,
    name: "Modern Running Shoes",
    category: "Sports",
    price: 75,
    oldPrice: 105,
    discount: 29,
    rating: 4.9,
    reviews: 203,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",
    badge: "Popular",
  },
  {
    id: 4,
    name: "Premium Everyday Backpack",
    category: "Fashion",
    price: 49,
    oldPrice: 69,
    discount: 29,
    rating: 4.6,
    reviews: 64,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85",
    badge: "New",
  },
  {
    id: 5,
    name: "Smart Fitness Watch",
    category: "Electronics",
    price: 119,
    oldPrice: 159,
    discount: 25,
    rating: 4.8,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=700&q=85",
    badge: "Hot Deal",
  },
  {
    id: 6,
    name: "Premium Cotton T-Shirt",
    category: "Fashion",
    price: 29,
    oldPrice: 39,
    discount: 26,
    rating: 4.5,
    reviews: 91,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",
    badge: "New",
  },
  {
    id: 7,
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    price: 55,
    oldPrice: 79,
    discount: 30,
    rating: 4.7,
    reviews: 118,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=85",
    badge: "Best Seller",
  },
  {
    id: 8,
    name: "Premium Skincare Set",
    category: "Beauty",
    price: 42,
    oldPrice: 59,
    discount: 29,
    rating: 4.8,
    reviews: 76,
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=700&q=85",
    badge: "Popular",
  },
];

const seasonalOffers = [
  {
    id: 1,
    title: "Summer Collection",
    subtitle: "Fresh styles for your everyday look",
    discount: "30% OFF",
    button: "Shop Fashion",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 2,
    title: "Tech Essentials",
    subtitle: "Upgrade your setup with smarter technology",
    discount: "UP TO 45% OFF",
    button: "Shop Electronics",
    image:
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1000&q=85",
  },
];

/* =========================================================
   PRODUCT CARD
========================================================= */

const ProductCard = ({ product, isFavorite, onFavorite, onAddCart }) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-[#1D4ED8] px-3 py-1.5 text-[11px] font-bold text-white shadow-sm">
            {product.badge}
          </span>
        </div>

        <div className="absolute right-3 top-3">
          <button
            type="button"
            onClick={() => onFavorite(product.id)}
            aria-label="Add to wishlist"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-md backdrop-blur transition hover:bg-white hover:text-red-500"
          >
            {isFavorite ? (
              <MdFavorite size={19} className="text-red-500" />
            ) : (
              <MdFavoriteBorder size={19} />
            )}
          </button>
        </div>

        <div className="absolute inset-x-3 bottom-3 translate-y-16 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onAddCart(product)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#1D4ED8]"
          >
            <MdAddShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>

      <div className="p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
          {product.category}
        </p>

        <Link
          href={`/products/${product.id}`}
          className="block min-h-[44px] text-sm font-semibold leading-5 text-gray-900 transition hover:text-[#1D4ED8]"
        >
          {product.name}
        </Link>

        <div className="mt-2 flex items-center gap-1">
          <MdStar className="text-amber-400" size={16} />

          <span className="text-xs font-semibold text-gray-700">
            {product.rating}
          </span>

          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-950">
              ${product.price}
            </span>

            <span className="text-xs text-gray-400 line-through">
              ${product.oldPrice}
            </span>
          </div>

          <span className="text-xs font-bold text-emerald-600">
            -{product.discount}%
          </span>
        </div>
      </div>
    </article>
  );
};

/* =========================================================
   MAIN PAGE
========================================================= */

export default function EcommerceHomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");

  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 12,
    minutes: 45,
    seconds: 30,
  });

  /* ---------------------------------------------------------
     HERO AUTO SLIDER
  --------------------------------------------------------- */

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  /* ---------------------------------------------------------
     COUNTDOWN
  --------------------------------------------------------- */

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;

          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;

            if (hours > 0) {
              hours -= 1;
            } else {
              hours = 23;

              if (days > 0) {
                days -= 1;
              }
            }
          }
        }

        return {
          days,
          hours,
          minutes,
          seconds,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* ---------------------------------------------------------
     FAVORITES
  --------------------------------------------------------- */

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  /* ---------------------------------------------------------
     CART
  --------------------------------------------------------- */

  const addToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  /* ---------------------------------------------------------
     SEARCH
  --------------------------------------------------------- */

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;

    const query = search.toLowerCase();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query),
    );
  }, [search]);

  const slide = heroSlides[activeSlide];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* =====================================================
          TOP ANNOUNCEMENT
      ===================================================== */}

      <div className="bg-gray-950 px-4 py-2 text-center text-xs font-medium text-white">
        Free shipping on orders over $75
        <span className="mx-2 text-gray-500">•</span>
        Easy 30-day returns
      </div>

     

      <main>
        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative overflow-hidden bg-gray-950">
          <div className="relative min-h-[520px] sm:min-h-[580px] lg:min-h-[620px]">
            {heroSlides.map((item, index) => (
              <div
                key={item.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === activeSlide ? "z-10 opacity-100" : "z-0 opacity-0"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/60 to-gray-950/20" />

                <div className="relative z-10 mx-auto flex min-h-[520px] max-w-[1440px] items-center px-5 py-20 sm:min-h-[580px] sm:px-8 lg:min-h-[620px] lg:px-12">
                  <div className="max-w-2xl">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-wide text-white backdrop-blur-md">
                      <MdFlashOn className="text-amber-400" />
                      {item.discount}
                    </div>

                    <h1 className="max-w-2xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-7xl">
                      {item.title}
                    </h1>

                    <p className="mt-6 max-w-xl text-base leading-7 text-gray-200 sm:text-lg">
                      {item.subtitle}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-gray-950 shadow-xl transition hover:bg-gray-100"
                      >
                        {item.button}
                        <MdArrowForward size={18} />
                      </Link>

                      <Link
                        href="/deals"
                        className="inline-flex items-center rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
                      >
                        View Deals
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Hero arrows */}

            <button
              type="button"
              onClick={() =>
                setActiveSlide(
                  (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
                )
              }
              className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 sm:flex"
              aria-label="Previous slide"
            >
              <MdKeyboardArrowLeft size={28} />
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSlide((prev) => (prev + 1) % heroSlides.length)
              }
              className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 sm:flex"
              aria-label="Next slide"
            >
              <MdKeyboardArrowRight size={28} />
            </button>

            {/* Indicators */}

            <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
              {heroSlides.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeSlide ? "w-8 bg-white" : "w-2 bg-white/40"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            TRUST FEATURES
        ===================================================== */}

        <section className="border-b border-gray-100 bg-white">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-gray-100 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              {
                icon: MdLocalShipping,
                title: "Free Delivery",
                text: "On orders over $75",
              },
              {
                icon: MdSecurity,
                title: "Secure Payment",
                text: "100% protected checkout",
              },
              {
                icon: MdReplay,
                title: "Easy Returns",
                text: "30-day return policy",
              },
              {
                icon: MdSupportAgent,
                title: "24/7 Support",
                text: "We're here to help",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    index > 1 ? "hidden lg:flex" : ""
                  }`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1D4ED8]">
                    <Icon size={23} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {item.title}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            CATEGORIES
        ===================================================== */}

        <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1D4ED8]">
                Explore
              </p>

              <h2 className="text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
                Shop by Category
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Find everything you need in one place.
              </p>
            </div>

            <Link
              href="/categories"
              className="hidden items-center gap-1 text-sm font-bold text-gray-700 transition hover:text-[#1D4ED8] sm:flex"
            >
              View All
              <MdArrowForward size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* =====================================================
            HOT DEALS
        ===================================================== */}

        <section className="bg-gray-50">
          <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <div className="flex items-center gap-2">
                  <MdFlashOn className="text-amber-500" size={24} />

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
                    Limited Time
                  </p>
                </div>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
                  Hot Deals
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Grab these deals before they're gone.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {[
                  ["02", "Days"],
                  ["12", "Hours"],
                  ["45", "Min"],
                  ["30", "Sec"],
                ].map(([number, label]) => (
                  <div
                    key={label}
                    className="min-w-[52px] rounded-xl border border-gray-200 bg-white px-2 py-2 text-center shadow-sm"
                  >
                    <p className="text-lg font-black text-gray-950">
                      {label === "Days"
                        ? String(timeLeft.days).padStart(2, "0")
                        : label === "Hours"
                          ? String(timeLeft.hours).padStart(2, "0")
                          : label === "Min"
                            ? String(timeLeft.minutes).padStart(2, "0")
                            : String(timeLeft.seconds).padStart(2, "0")}
                    </p>

                    <p className="text-[9px] font-semibold uppercase text-gray-400">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.includes(product.id)}
                  onFavorite={toggleFavorite}
                  onAddCart={addToCart}
                />
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            SEASONAL OFFERS
        ===================================================== */}

        <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1D4ED8]">
              Special Offers
            </p>

            <h2 className="text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
              Seasonal Offers
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {seasonalOffers.map((offer) => (
              <div
                key={offer.id}
                className="group relative min-h-[300px] overflow-hidden rounded-3xl"
              >
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-gray-950/85 via-gray-950/50 to-transparent" />

                <div className="relative z-10 flex min-h-[300px] max-w-md flex-col justify-center p-7 sm:p-10">
                  <span className="mb-4 w-fit rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                    {offer.discount}
                  </span>

                  <h3 className="text-2xl font-black text-white sm:text-3xl">
                    {offer.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-200">
                    {offer.subtitle}
                  </p>

                  <Link
                    href="/shop"
                    className="mt-6 flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-gray-950 transition hover:bg-gray-100"
                  >
                    {offer.button}
                    <MdArrowForward size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
            FEATURED PRODUCTS
        ===================================================== */}

        <section className="border-y border-gray-100 bg-white">
          <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1D4ED8]">
                  Our Collection
                </p>

                <h2 className="text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
                  Featured Products
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Handpicked products our customers love.
                </p>
              </div>

              <Link
                href="/shop"
                className="hidden items-center gap-1 text-sm font-bold text-gray-700 hover:text-[#1D4ED8] sm:flex"
              >
                View All Products
                <MdArrowForward size={18} />
              </Link>
            </div>

            {search && (
              <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                Showing results for <strong>&quot;{search}&quot;</strong>
              </div>
            )}

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.slice(0, 8).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={favorites.includes(product.id)}
                    onFavorite={toggleFavorite}
                    onAddCart={addToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center">
                <MdSearch size={40} className="mx-auto text-gray-300" />

                <h3 className="mt-3 font-bold text-gray-900">
                  No products found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Try searching for another product.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            PROMOTIONAL BANNER
        ===================================================== */}

        <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="relative overflow-hidden rounded-3xl bg-gray-950">
            <div className="absolute right-0 top-0 h-full w-1/2">
              <img
                src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=85"
                alt="Shopping promotion"
                className="h-full w-full object-cover opacity-70"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/50 to-transparent" />
            </div>

            <div className="relative z-10 px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
              <div className="max-w-xl">
                <span className="rounded-full bg-blue-500/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-300">
                  Member Exclusive
                </span>

                <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Get extra savings on your next order.
                </h2>

                <p className="mt-4 text-sm leading-6 text-gray-300 sm:text-base">
                  Join our shopping community and receive exclusive deals, early
                  access to new products, and special member offers.
                </p>

                <Link
                  href="/shop"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-gray-950 transition hover:bg-gray-100"
                >
                  Start Shopping
                  <MdArrowForward size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            NEW ARRIVALS
        ===================================================== */}

        <section className="bg-gray-50">
          <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1D4ED8]">
                  Just In
                </p>

                <h2 className="text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
                  New Arrivals
                </h2>
              </div>

              <Link
                href="/new-arrivals"
                className="flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-[#1D4ED8]"
              >
                Explore
                <MdArrowForward size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(4, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.includes(product.id)}
                  onFavorite={toggleFavorite}
                  onAddCart={addToCart}
                />
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            WHY CHOOSE US
        ===================================================== */}

        <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1D4ED8]">
              Our Promise
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
              Shopping made simple
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Everything you need for a smooth and reliable shopping experience.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: MdLocalShipping,
                title: "Fast Delivery",
                text: "Reliable delivery directly to your doorstep.",
              },
              {
                icon: MdSecurity,
                title: "Secure Checkout",
                text: "Your payment and personal information stay protected.",
              },
              {
                icon: MdReplay,
                title: "Easy Returns",
                text: "Changed your mind? Return eligible products easily.",
              },
              {
                icon: MdSupportAgent,
                title: "Dedicated Support",
                text: "Our support team is ready whenever you need us.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1D4ED8]">
                    <Icon size={25} />
                  </div>

                  <h3 className="mt-5 text-base font-bold text-gray-950">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            NEWSLETTER
        ===================================================== */}

        <section className="border-y border-gray-100 bg-white">
          <div className="mx-auto max-w-[900px] px-4 py-14 text-center sm:px-6 lg:py-20">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1D4ED8]">
              <MdEmail size={28} />
            </div>

            <h2 className="mt-5 text-2xl font-black text-gray-950 sm:text-3xl">
              Stay in the loop
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500">
              Subscribe to get the latest products, exclusive offers, and
              seasonal deals delivered to your inbox.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto mt-7 flex max-w-xl flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="h-12 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-[#1D4ED8] focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

              <button
                type="submit"
                className="h-12 rounded-xl bg-gray-950 px-6 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
              >
                Subscribe
              </button>
            </form>

            <p className="mt-3 text-[11px] text-gray-400">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </section>
      </main>

     
    </div>
  );
}
