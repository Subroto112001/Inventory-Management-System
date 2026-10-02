"use client";

import {
  CATEGORIES,
  HERO_SLIDES,
  OFFER_SLIDES,
  PERKS,
  SIDE_BANNERS,
} from "@/frontEndDataProvider/HomepageDataProvider";
import Link from "next/link";
import { useCart } from "@/Component/website/Cart/CartContext";
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

/**
 *  FEATURED TABS
 * */

const FEATURED_TABS = ["Kitchen & Dining", "Furniture", "Lighting", "Textiles"];

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
  const { image, category, name, price, oldPrice, rating, reviews, badge } =
    product;
  const { addItem } = useCart();
  const inStock = product.inStock ?? true;

  return (
    <div className="group bg-white border border-[#E4DED2] rounded-md overflow-hidden hover:shadow-md hover:border-[#C9A659] transition-all duration-200">
      <div className="relative aspect-square overflow-hidden bg-[#F7F3EC]">
        <Link href={`/product/product_details?id=${product.id}`}>
          <img
            src={image || "/placeholder-product.svg"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
          />
        </Link>

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
          disabled={!inStock}
          onClick={() => addItem(product)}
          className="absolute inset-x-3 bottom-3 bg-[#211F1D] text-[#F7F3EC] text-sm py-2 rounded-sm translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LuShoppingCart size={14} />
          {inStock ? "Add to cart" : "Out of stock"}
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

export default function EcommerceHomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollerRef = useRef(null);

  const [heroActive, setHeroActive] = useState(0);
  const [offerActive, setOfferActive] = useState(0);
  const [activeTab, setActiveTab] = useState(FEATURED_TABS[0]);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/product?public=1&page=1&limit=48&sort=newest", {
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Unable to load products");
        return data;
      })
      .then((data) => setProducts(data.products || []))
      .catch((error) => {
        if (error.name !== "AbortError") setProducts([]);
      })
      .finally(() => setProductsLoading(false));
    return () => controller.abort();
  }, []);

  const featuredProducts = products
    .filter((product) =>
      product.category?.toLowerCase().startsWith(activeTab.toLowerCase()),
    )
    .slice(0, 4);
  const exclusiveProducts = products
    .filter((product) => product.discount > 0)
    .slice(0, 4);
  const newArrivals = products.slice(0, 4);

  /* Hero autoplay */
  useEffect(() => {
    const id = setInterval(() => {
      setHeroActive((a) => (a + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => clearInterval(id);
  }, []);

  /* Offer autoplay */
  useEffect(() => {
    const id = setInterval(() => {
      setOfferActive((a) => (a + 1) % OFFER_SLIDES.length);
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

      {/* Main Section*/}

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
                    (a) => (a - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
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
                  setHeroActive((a) => (a + 1) % HERO_SLIDES.length)
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

        {/* ===================================================
            CATEGORIES
        =================================================== */}

        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-14">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-sm text-[#B65C38] mb-1">Browse</p>

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
            {productsLoading ? (
              <p className="text-sm text-[#8A8378]">Loading products...</p>
            ) : (
              exclusiveProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            )}
          </div>
        </section>

        {/* ===================================================
            OFFER SLIDER
        =================================================== */}

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
                    setOfferActive(
                      (a) =>
                        (a - 1 + OFFER_SLIDES.length) % OFFER_SLIDES.length,
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
                    setOfferActive((a) => (a + 1) % OFFER_SLIDES.length)
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
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* ===================================================
            NEW ARRIVALS
        =================================================== */}

        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-16">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-sm text-[#B65C38] mb-1">Just landed</p>

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
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
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
      </main>
    </div>
  );
}
