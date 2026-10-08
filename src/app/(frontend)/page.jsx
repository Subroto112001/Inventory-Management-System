"use client";

import { PERKS } from "@/frontEndDataProvider/HomepageDataProvider";
import Link from "next/link";
import { useCart } from "@/Component/website/Cart/CartContext";
import { useWishlist } from "@/Component/website/Cart/WishlistContext";
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
  const { has, toggle } = useWishlist();
  const liked = has(product.id);
  const inStock = product.inStock ?? false;

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
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggle(product).catch(() => {})}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[#211F1D] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#B65C38]"
        >
          <LuHeart size={15} className={liked ? "fill-[#B65C38] text-[#B65C38]" : ""} />
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
  const scrollerRef = useRef(null);

  const [heroActive, setHeroActive] = useState(0);
  const [offerActive, setOfferActive] = useState(0);
  const [activeTab, setActiveTab] = useState(FEATURED_TABS[0]);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [slides, setSlides] = useState([]);
  const [slidesLoading, setSlidesLoading] = useState(true);
  const [exclusiveProducts, setExclusiveProducts] = useState([]);
  const [exclusiveProductsLoading, setExclusiveProductsLoading] =
    useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

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

    fetch("/api/homepage/sliders?public=1", { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Unable to load homepage sliders");
        return data;
      })
      .then((data) => setSlides(data.slides || []))
      .catch((error) => {
        if (error.name !== "AbortError") setSlides([]);
      })
      .finally(() => setSlidesLoading(false));

    fetch("/api/homepage/exclusive-products?public=1", {
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Unable to load exclusive products");
        return data;
      })
      .then((data) => setExclusiveProducts(data.items || []))
      .catch((error) => {
        if (error.name !== "AbortError") setExclusiveProducts([]);
      })
      .finally(() => setExclusiveProductsLoading(false));

    fetch("/api/category?public=1", { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Unable to load categories");
        return data;
      })
      .then((data) => setCategories(data.categories || []))
      .catch((error) => {
        if (error.name !== "AbortError") setCategories([]);
      })
      .finally(() => setCategoriesLoading(false));

    return () => controller.abort();
  }, []);

  const featuredProducts = products
    .filter((product) =>
      product.category?.toLowerCase().startsWith(activeTab.toLowerCase()),
    )
    .slice(0, 4);
  const heroSlides = slides.filter((slide) => slide.isActive);
  const offerSlides = heroSlides.length ? heroSlides : [];
  const newArrivals = products.slice(0, 4);

  /* Hero autoplay */
  useEffect(() => {
    if (!heroSlides.length) return undefined;
    const id = setInterval(() => {
      setHeroActive((a) => (a + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(id);
  }, [heroSlides.length]);

  /* Offer autoplay */
  useEffect(() => {
    if (!offerSlides.length) return undefined;
    const id = setInterval(() => {
      setOfferActive((a) => (a + 1) % offerSlides.length);
    }, 6000);

    return () => clearInterval(id);
  }, [offerSlides.length]);

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

        <section className="mx-auto max-w-[1400px] px-3 pt-4 sm:px-6 sm:pt-8">
            <div className="group relative isolate min-h-[560px] overflow-hidden rounded-[26px] bg-[#d9dedf] text-[#182126] sm:min-h-[600px] lg:min-h-[620px]">
              {slidesLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[#d9dedf] text-sm text-[#5B564C]">
                  Loading homepage slides...
                </div>
              ) : heroSlides.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[#d9dedf] text-sm text-[#5B564C]">
                  No active homepage slides available.
                </div>
              ) : (
                heroSlides.map((slide, i) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-700 ${
                      i === heroActive
                        ? "translate-x-0 opacity-100"
                        : "pointer-events-none translate-x-3 opacity-0"
                    }`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_45%,#f6f7f6_0%,#dce2e3_44%,#aeb9bc_100%)]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-black/10" />
                    <div className="absolute left-6 top-6 z-10 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#425158] sm:left-10 sm:top-9">
                      <span className="h-2 w-2 rounded-sm bg-[#425158]" /> {slide.badge || "Curated essentials"}
                    </div>
                    <div className="absolute left-[52px] right-[52px] top-[18%] z-10 sm:left-[76px] sm:right-[76px] sm:top-[27%] sm:max-w-[380px] lg:left-[84px] lg:right-auto lg:top-[30%]">
                      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#56666c]">New season / {slide.productName || "Featured collection"}</p>
                      <h1 className="font-serif text-4xl leading-[0.98] tracking-[-0.04em] text-[#172127] sm:text-5xl lg:text-[64px]">{slide.title}</h1>
                      <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#4d5b61]">{slide.subtitle}</p>
                      <Link href={slide.buttonUrl || "/product"} className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-semibold text-[#1d272b] shadow-sm transition-transform hover:-translate-y-0.5">{slide.buttonText || "Get the look"}<span aria-hidden="true">↗</span></Link>
                    </div>
                    <div className="absolute inset-y-[37%] left-[18%] right-[18%] flex items-center justify-center sm:inset-y-[12%] sm:left-[34%] sm:right-[20%]">
                      <img src={slide.image || "/placeholder-product.svg"} alt={slide.productName || slide.title} onError={(event) => { event.currentTarget.src = "/placeholder-product.svg"; }} className="h-full w-full object-contain drop-shadow-[0_28px_28px_rgba(31,42,46,0.22)] transition-transform duration-700 group-hover:scale-[1.025]" />
                    </div>
                    <div className="absolute right-[52px] top-[20%] z-10 text-right sm:right-[76px] sm:top-[22%] lg:right-[84px]">
                      {slide.discountText ? <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#57656a]">{slide.discountText}</span> : null}
                      <span className="block text-2xl font-light tracking-tight text-[#202b30]">{slide.price != null ? `$${Number(slide.price).toFixed(2)}` : ""}</span>
                      {slide.previousPrice != null ? <span className="text-sm text-[#68767b] line-through">${Number(slide.previousPrice).toFixed(2)}</span> : null}
                    </div>
                    {slide.supportingText ? <p className="absolute bottom-12 left-1/2 z-10 w-40 -translate-x-1/2 text-center text-xs leading-tight text-[#46565c] sm:bottom-14">{slide.supportingText}</p> : null}
                  </div>
                ))
              )}

              {/* Previous */}
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() =>
                  setHeroActive(
                    (a) =>
                      (a - 1 + Math.max(heroSlides.length, 1)) %
                      Math.max(heroSlides.length, 1),
                  )
                }
                className="absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/75 text-[#211F1D] transition-colors hover:bg-white sm:left-4 sm:h-9 sm:w-9"
                disabled={heroSlides.length < 2}
              >
                <LuChevronLeft size={18} />
              </button>

              {/* Next */}
              <button
                type="button"
                aria-label="Next slide"
                onClick={() =>
                  setHeroActive((a) => (a + 1) % Math.max(heroSlides.length, 1))
                }
                className="absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/75 text-[#211F1D] transition-colors hover:bg-white sm:right-4 sm:h-9 sm:w-9"
                disabled={heroSlides.length < 2}
              >
                <LuChevronRight size={18} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-6 left-6 z-20 flex gap-2 sm:left-10">
                {heroSlides.map((slide, i) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setHeroActive(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === heroActive
                        ? "w-6 bg-[#233137]"
                        : "w-1.5 bg-[#233137]/40"
                    }`}
                  />
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

            <Link
              href="/product"
              className="hidden sm:inline-block text-sm text-[#1F3A2E] border-b border-[#1F3A2E] pb-0.5 hover:text-[#B65C38] hover:border-[#B65C38] transition-colors whitespace-nowrap"
            >
              View all categories
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-5">
            {categoriesLoading ? (
              <p className="col-span-full text-sm text-[#8A8378]">
                Loading categories...
              </p>
            ) : categories.length === 0 ? (
              <p className="col-span-full text-sm text-[#8A8378]">
                No categories available right now.
              </p>
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/product?category=${cat.id}`}
                  className="group text-center"
                >
                  <div className="aspect-square rounded-md overflow-hidden mb-2.5 bg-[#F7F3EC]">
                    <img
                      src={cat.image || "/placeholder-product.svg"}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-300"
                    />
                  </div>

                  <p className="text-sm text-[#211F1D] group-hover:text-[#B65C38] transition-colors">
                    {cat.name}
                  </p>
                </Link>
              ))
            )}
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

          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {exclusiveProductsLoading ? (
              <p className="text-sm text-[#8A8378]">
                Loading exclusive products...
              </p>
            ) : exclusiveProducts.length === 0 ? (
              <p className="text-sm text-[#8A8378]">
                No exclusive products available right now.
              </p>
            ) : (
              exclusiveProducts.map((item) => (
                <ProductCard key={item.productId} product={item.product} />
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
                        (a - 1 + Math.max(offerSlides.length, 1)) %
                        Math.max(offerSlides.length, 1),
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
                      (a) => (a + 1) % Math.max(offerSlides.length, 1),
                    )
                  }
                  className="w-9 h-9 rounded-full border border-[#F7F3EC]/30 text-[#F7F3EC] flex items-center justify-center hover:bg-[#F7F3EC]/10 transition-colors"
                >
                  <LuChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="relative h-[300px] sm:h-[360px] rounded-md overflow-hidden">
              {offerSlides.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[#1F3A2E] text-sm text-[#F7F3EC]/80">
                  No active offers available.
                </div>
              ) : (
                offerSlides.map((slide, i) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      i === offerActive
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <img
                      src={slide.image || "/placeholder-product.svg"}
                      alt={slide.title}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-[#211F1D]/40" />

                    <div className="absolute inset-0 flex flex-col items-start justify-center px-8 sm:px-14">
                      <h3 className="mb-2 font-serif text-2xl text-[#F7F3EC] sm:text-3xl">
                        {slide.title}
                      </h3>

                      <p className="mb-5 text-sm text-[#F7F3EC]/90 sm:text-base">
                        {slide.subtitle}
                      </p>

                      <Link
                        href={slide.buttonUrl || "/product"}
                        className="bg-[#F7F3EC] px-5 py-2.5 text-sm text-[#211F1D] transition-colors hover:bg-[#C9A659]"
                      >
                        {slide.buttonText || "Shop now"}
                      </Link>
                    </div>
                  </div>
                ))
              )}

              {offerSlides.length > 0 && (
                <div className="absolute bottom-4 left-8 flex gap-2 sm:left-14">
                  {offerSlides.map((slide, i) => (
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
              )}
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
