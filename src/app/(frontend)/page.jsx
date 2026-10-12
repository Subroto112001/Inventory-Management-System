"use client";

import { PERKS } from "@/frontEndDataProvider/HomepageDataProvider";
import { ProductCard } from "@/frontEndDataProvider/ProductpageDataProvider";
import { SpecialOfferBannerView } from "@/Component/website/Homepage/SpecialOfferBanner";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  LuSearch,
  LuUser,
  LuChevronLeft,
  LuChevronRight,
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

export default function EcommerceHomePage() {
  const scrollerRef = useRef(null);

  const [heroActive, setHeroActive] = useState(0);
  const [offerActive, setOfferActive] = useState(0);
  const [products, setProducts] = useState([]);
  const [upcomingProducts, setUpcomingProducts] = useState([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [slides, setSlides] = useState([]);
  const [slidesLoading, setSlidesLoading] = useState(true);
  const [exclusiveProducts, setExclusiveProducts] = useState([]);
  const [exclusiveProductsLoading, setExclusiveProductsLoading] =
    useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [specialOfferBanner, setSpecialOfferBanner] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/upcoming-products?public=1", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Upcoming products unavailable")))
      .then((data) => setUpcomingProducts(data.products || []))
      .catch((error) => { if (error.name !== "AbortError") setUpcomingProducts([]); })
      .finally(() => setUpcomingLoading(false));
    fetch("/api/product?public=1&page=1&limit=10&sort=newest", {
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
        if (error.name !== "AbortError") {
          setProducts([]);
          setProductsError("Shop products are unavailable right now. Please try again later.");
        }
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

    fetch("/api/homepage/special-offer?public=1", { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load the special offer");
        return data;
      })
      .then((data) => setSpecialOfferBanner(data.banner || null))
      .catch((error) => {
        if (error.name !== "AbortError") setSpecialOfferBanner(null);
      });

    return () => controller.abort();
  }, []);

  const heroSlides = slides.filter((slide) => slide.isActive);
  const offerSlides = heroSlides.length ? heroSlides : [];

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
    <div className="min-h-screen bg-[var(--theme-background)] font-sans">
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

        <section className="mx-auto max-w-[1280px] px-4 pt-4 sm:px-6 sm:pt-8">
            <div className="group relative isolate min-h-[560px] overflow-hidden rounded-[26px] bg-[#d9dedf] text-[#182126] sm:min-h-[600px] lg:min-h-[620px]">
              {slidesLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[#d9dedf] text-sm text-[var(--theme-muted)]">
                  Loading homepage slides...
                </div>
              ) : heroSlides.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[#d9dedf] text-sm text-[var(--theme-muted)]">
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
                className="absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/75 text-[var(--theme-text)] transition-colors hover:bg-white sm:left-4 sm:h-9 sm:w-9"
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
                className="absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/75 text-[var(--theme-text)] transition-colors hover:bg-white sm:right-4 sm:h-9 sm:w-9"
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-[var(--theme-border)] py-6">
            {PERKS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-center gap-3">
                <Icon size={22} className="text-[var(--theme-primary)] shrink-0" />

                <div>
                  <p className="text-sm text-[var(--theme-text)]">{title}</p>

                  <p className="text-xs text-[var(--theme-muted)]">{text}</p>
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
              <p className="text-sm text-[var(--theme-secondary)] mb-1">Browse</p>

              <h2 className="font-serif text-3xl md:text-[2.15rem] text-[var(--theme-text)] leading-tight">
                Shop by category
              </h2>
            </div>

            <Link
              href="/product"
              className="hidden sm:inline-block text-sm text-[var(--theme-primary)] border-b border-[var(--theme-primary)] pb-0.5 hover:text-[var(--theme-secondary)] hover:border-[var(--theme-secondary)] transition-colors whitespace-nowrap"
            >
              View all categories
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-5">
            {categoriesLoading ? (
              <p className="col-span-full text-sm text-[var(--theme-muted)]">
                Loading categories...
              </p>
            ) : categories.length === 0 ? (
              <p className="col-span-full text-sm text-[var(--theme-muted)]">
                No categories available right now.
              </p>
            ) : (
              categories.filter((cat) => !cat.parentCategoryId).map((cat) => (

<Link
  key={cat.id}
  href={`/product?category=${cat.id}`}
  className="group text-center rounded-md shadow-sm hover:shadow-md transition-shadow duration-300"
>
  <div className="aspect-square rounded-md overflow-hidden  p-3 bg-white">
    <img
      src={cat.image || "/placeholder-product.svg"}
      alt={cat.name}
      className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-300"
    />
  </div>

  <p className="text-sm text-[var(--theme-text)] group-hover:text-[var(--theme-secondary)] transition-colors">
    {cat.categoryName || cat.name}
  </p>
</Link>

              ))
            )}
          </div>
        </section>

        {/* ===================================================
            EXCLUSIVE PRODUCTS
        =================================================== */}

        {/* ===================================================
            OFFER SLIDER
        =================================================== */}

        <section className="bg-[var(--theme-primary)] mt-16 py-14">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between gap-6 mb-8">
              <div>
                <p className="text-sm text-[var(--theme-highlight)] mb-1">Limited time</p>

                <h2 className="font-serif text-3xl text-[var(--theme-background)]">
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
                  className="w-9 h-9 rounded-full border border-[var(--theme-background)]/30 text-[var(--theme-background)] flex items-center justify-center hover:bg-[var(--theme-background)]/10 transition-colors"
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
                  className="w-9 h-9 rounded-full border border-[var(--theme-background)]/30 text-[var(--theme-background)] flex items-center justify-center hover:bg-[var(--theme-background)]/10 transition-colors"
                >
                  <LuChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="relative h-[300px] sm:h-[360px] rounded-md overflow-hidden">
              {offerSlides.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--theme-primary)] text-sm text-[var(--theme-background)]/80">
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

                    <div className="absolute inset-0 bg-[var(--theme-text)]/40" />

                    <div className="absolute inset-0 flex flex-col items-start justify-center px-8 sm:px-14">
                      <h3 className="mb-2 font-serif text-2xl text-[var(--theme-background)] sm:text-3xl">
                        {slide.title}
                      </h3>

                      <p className="mb-5 text-sm text-[var(--theme-background)]/90 sm:text-base">
                        {slide.subtitle}
                      </p>

                      <Link
                        href={slide.buttonUrl || "/product"}
                        className="bg-[var(--theme-background)] px-5 py-2.5 text-sm text-[var(--theme-text)] transition-colors hover:bg-[var(--theme-highlight)]"
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
                          ? "w-6 bg-[var(--theme-background)]"
                          : "w-1.5 bg-[var(--theme-background)]/50"
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
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-sm text-[var(--theme-secondary)]">Hand-picked</p>

              <h2 className="font-serif text-3xl md:text-[2.15rem] text-[var(--theme-text)]">
                Featured products
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {exclusiveProductsLoading ? (
              <p className="text-sm text-[var(--theme-muted)]" role="status">Loading featured products...</p>
            ) : exclusiveProducts.length === 0 ? (
              <p className="text-sm text-[var(--theme-muted)]">No featured products are available right now.</p>
            ) : (
              exclusiveProducts.map((item) => (
                <ProductCard key={item.productId} product={item.product} />
              ))
            )}
          </div>
        </section>

        {/* ===================================================
            SHOP
        =================================================== */}

        <section className="mx-auto mt-16 max-w-[1280px] px-4 sm:px-6">
          <div className="mb-6"><p className="mb-1 text-sm text-[var(--theme-secondary)]">Coming soon</p><h2 className="font-serif text-3xl text-[var(--theme-text)]">Upcoming products</h2></div>
          {upcomingLoading ? <p className="text-sm text-[var(--theme-muted)]" role="status">Loading upcoming products...</p> : upcomingProducts.length === 0 ? <p className="rounded-xl border border-[var(--theme-border)] bg-white px-5 py-8 text-sm text-[var(--theme-muted)]">No upcoming products are available right now.</p> : <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-4">{upcomingProducts.map((item) => <article key={item.id} className="overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-white"><Link href={`/product/product_details?id=${encodeURIComponent(item.id)}`} className="block aspect-square bg-gray-50 p-4"><img src={item.image || "/placeholder-product.svg"} alt={item.name} className="h-full w-full object-contain" /></Link><div className="space-y-2 p-4"><Link href={`/product/product_details?id=${encodeURIComponent(item.id)}`} className="font-medium hover:text-[var(--theme-primary)]">{item.name}</Link><p className="text-xs text-[var(--theme-muted)]">Launches {new Date(item.launchAt).toLocaleString()}</p><p className="font-semibold">৳{Number(item.price).toFixed(2)}</p>{item.preorderAvailable && <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">Pre-orders available</span>}</div></article>)}</div>}
        </section>

        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-16">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-sm text-[var(--theme-secondary)] mb-1">Just landed</p>

              <h2 className="font-serif text-3xl md:text-[2.15rem] text-[var(--theme-text)] leading-tight">
                Shop
              </h2>
            </div>

            <Link
              href="/product"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--theme-primary)] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--theme-primary-hover)] sm:px-5 sm:text-sm"
            >
              View All Products
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-5">
            {productsLoading ? (
              Array.from({ length: 10 }, (_, index) => (
                <div key={index} className="animate-pulse overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-white p-3" role="status" aria-label="Loading shop products">
                  <div className="aspect-square rounded-xl bg-[var(--theme-surface-alt)]" />
                  <div className="mt-4 h-4 w-3/4 rounded bg-[var(--theme-surface-alt)]" />
                  <div className="mt-3 h-4 w-1/3 rounded bg-[var(--theme-surface-alt)]" />
                  <div className="mt-4 h-11 rounded-xl bg-[var(--theme-surface-alt)]" />
                </div>
              ))
            ) : productsError ? (
              <p className="col-span-full rounded-xl border border-[var(--theme-border)] bg-white px-5 py-10 text-center text-sm text-[var(--theme-muted)]" role="status">{productsError}</p>
            ) : products.length === 0 ? (
              <p className="col-span-full rounded-xl border border-[var(--theme-border)] bg-white px-5 py-10 text-center text-sm text-[var(--theme-muted)]">No products are available right now.</p>
            ) : (
              products.map((product) => <ProductCard key={product.id} product={product} />)
            )}
          </div>
        </section>

        {specialOfferBanner && <SpecialOfferBannerView banner={specialOfferBanner} />}
      </main>
    </div>
  );
}
