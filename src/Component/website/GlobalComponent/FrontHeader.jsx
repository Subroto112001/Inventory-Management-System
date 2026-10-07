"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  LuChevronLeft,
  LuChevronRight,
  LuGitCompare,
  LuHeart,
  LuMenu,
  LuSearch,
  LuShoppingCart,
  LuUser,
  LuX,
} from "react-icons/lu";
import { useCart } from "../Cart/CartContext";
import { useWishlist } from "../Cart/WishlistContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/product" },
  { label: "Lighting", href: "/product?category=Lighting" },
  {
    label: "Kitchen & Dining",
    href: "/product?category=Kitchen%20%26%20Dining",
  },
  { label: "Furniture", href: "/product?category=Furniture" },
  {
    label: "Textiles & Bedding",
    href: "/product?category=Textiles%20%26%20Bedding",
  },
  {
    label: "Outdoor & Garden",
    href: "/product?category=Outdoor%20%26%20Garden",
  },
  { label: "Decor & Accents", href: "/product?category=Decor%20%26%20Accents" },
  { label: "Sale", href: "/product?sort=priceDesc" },
];

export default function FrontHeader({ settings }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef(null);
  const { openCart, itemCount } = useCart();
  const { count: wishlistCount, refresh: refreshWishlist } = useWishlist();
  const [account, setAccount] = useState(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  useEffect(() => { let active = true; fetch("/api/account", { cache: "no-store" }).then(async (r) => r.ok ? (await r.json()).user : null).then((u) => { if (active) setAccount(u); }).catch(() => {}); return () => { active = false; }; }, [pathname]);
  useEffect(() => {
    const timer = setTimeout(() => refreshWishlist(), 0);
    return () => clearTimeout(timer);
  }, [pathname, refreshWishlist]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); setAccount(null); setAccountMenuOpen(false); await refreshWishlist(); router.push("/"); router.refresh(); };

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      const resetTimer = setTimeout(() => setResults([]), 0);
      return () => clearTimeout(resetTimer);
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/product?public=1&search=${encodeURIComponent(trimmed)}&limit=5&page=1`,
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Search failed");
        }
        setResults(data.products || []);
      } catch (error) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }

    router.push(`/product?search=${encodeURIComponent(trimmed)}`);
    setQuery("");
    setResults([]);
    setMobileOpen(false);
  };

  const isActiveLink = (href) => {
    const basePath = href.split("?")[0];
    return (
      pathname === basePath ||
      (basePath === "/product" && pathname.startsWith("/product"))
    );
  };

  const scrollNav = (dir) => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({
        left: dir * 220,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="bg-[var(--store-surface)] sticky top-0 z-40 text-[var(--store-text)]">
      <div className="bg-[var(--store-primary)] text-[var(--store-surface)] text-xs">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-4 py-2 sm:px-6">
          <p>Free shipping on orders over $75 · Handmade in small batches</p>

          <div className="hidden items-center gap-4 sm:flex">
            <Link
              href="/order"
              className="transition-colors hover:text-[var(--store-accent)]"
            >
              Track order
            </Link>
            <Link
              href="/product"
              className="transition-colors hover:text-[var(--store-accent)]"
            >
              Help
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-4 py-4 sm:gap-8 sm:px-6">
        <button
          type="button"
          className="text-[var(--store-text)] lg:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <LuMenu size={22} />
        </button>

        <Link href="/" className="flex shrink-0 items-center gap-2">
          {settings.logo?.url ? (
            <img
              src={settings.logo.url}
              alt={settings.storeName}
              className="h-9 w-9 rounded-sm object-contain"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-[var(--theme-primary)] font-serif text-lg text-[var(--theme-primary-text)]">
              {settings.storeName.charAt(0)}
            </span>
          )}

          <span className="hidden font-serif text-xl tracking-tight text-[var(--store-text)] xs:inline">
            {settings.storeName}
          </span>
        </Link>

        <div className="relative hidden flex-1 max-w-xl md:block">
          <div className="flex items-center overflow-hidden rounded-md border border-[#E4DED2] bg-white">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSearch(query);
                }
              }}
              placeholder="Search furniture, lighting, decor…"
              className="flex-1 bg-transparent px-4 py-2.5 text-sm text-[#211F1D] placeholder:text-[#8A8378] outline-none"
            />

            <button
              type="button"
              aria-label="Search"
              onClick={() => handleSearch(query)}
              className="bg-[var(--store-primary)] px-4 py-2.5 text-[var(--store-surface)] transition-opacity hover:opacity-90"
            >
              <LuSearch size={17} />
            </button>
          </div>

          {query.trim().length > 0 && (results.length > 0 || loading) ? (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-md border border-[#E4DED2] bg-white shadow-lg">
              {loading ? (
                <div className="px-4 py-3 text-sm text-[#8A8378]">
                  Searching products...
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto p-2">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/product_details?id=${product.id}`}
                      onClick={() => {
                        setQuery("");
                        setResults([]);
                      }}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-[#F7F3EC]"
                    >
                      <img
                        src={product.image || "/placeholder-product.svg"}
                        alt={product.name}
                        className="h-12 w-12 rounded-md object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[#211F1D]">
                          {product.name}
                        </p>
                        <p className="text-xs text-[#8A8378]">
                          {product.category || "Product"}
                        </p>
                      </div>
                    </Link>
                  ))}

                  {results.length === 0 && !loading ? (
                    <div className="px-4 py-3 text-sm text-[#8A8378]">
                      No products found.
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="ml-auto flex items-center gap-4 text-[var(--store-text)] sm:gap-6">
          {account ? <div className="relative"><button type="button" onClick={() => setAccountMenuOpen(v => !v)} className="flex flex-col items-center gap-0.5 transition-colors hover:text-[var(--store-accent)]" aria-expanded={accountMenuOpen} aria-label="Customer account"><LuUser size={20}/><span className="hidden text-[10px] sm:inline">{account.firstName || "Account"}</span></button>{accountMenuOpen && <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-md border border-[#E4DED2] bg-white p-2 shadow-lg"><Link className="block rounded px-3 py-2 text-sm hover:bg-[#F7F3EC]" href="/order?view=dashboard">My account</Link><Link className="block rounded px-3 py-2 text-sm hover:bg-[#F7F3EC]" href="/order?view=orders">My orders</Link><Link className="block rounded px-3 py-2 text-sm hover:bg-[#F7F3EC]" href="/order?view=wishlist">Wishlist</Link><Link className="block rounded px-3 py-2 text-sm hover:bg-[#F7F3EC]" href="/order?view=addresses">Addresses</Link><button onClick={logout} className="block w-full rounded px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50">Log out</button></div>}</div> : <Link href="/login" className="flex flex-col items-center gap-0.5 transition-colors hover:text-[var(--store-accent)]" aria-label="Log in"><LuUser size={20}/><span className="hidden text-[10px] sm:inline">Account</span></Link>}
          <Link href={account ? "/order?view=wishlist" : "/login?next=%2Forder%3Fview%3Dwishlist"} className="relative flex flex-col items-center gap-0.5 transition-colors hover:text-[var(--store-accent)]" aria-label="Wishlist"><LuHeart size={20}/><span className="hidden text-[10px] sm:inline">Wishlist</span>{wishlistCount > 0 && <span className="absolute -right-1.5 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--store-accent)] text-[9px] text-white">{wishlistCount}</span>}</Link>
<Link
            href="/compare"
            className="relative flex flex-col items-center gap-0.5 transition-colors hover:text-[var(--store-accent)]"
            aria-label="Compare"
          >
            <LuGitCompare size={20} />
            <span className="hidden text-[10px] sm:inline">Compare</span>
          </Link>

          <button
            type="button"
            onClick={openCart}
            className="relative flex cursor-pointer flex-col items-center gap-0.5 transition-colors hover:text-[var(--store-accent)]"
            aria-label="Cart"
          >
            <LuShoppingCart size={20} />
            <span className="hidden text-[10px] sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--store-accent)] text-[9px] text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="px-4 pb-3 md:hidden">
        <div className="relative flex items-center overflow-hidden rounded-md border border-[#E4DED2] bg-white">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSearch(query);
              }
            }}
            placeholder="Search products…"
            className="flex-1 bg-transparent px-3 py-2 text-sm text-[#211F1D] placeholder:text-[#8A8378] outline-none"
          />

          <button
            type="button"
            aria-label="Search"
            onClick={() => handleSearch(query)}
            className="bg-[var(--store-primary)] px-3 py-2 text-[var(--store-surface)]"
          >
            <LuSearch size={16} />
          </button>
        </div>

        {query.trim().length > 0 && results.length > 0 && (
          <div className="mt-2 rounded-md border border-[#E4DED2] bg-white shadow-lg">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/product/product_details?id=${product.id}`}
                onClick={() => {
                  setQuery("");
                  setResults([]);
                }}
                className="flex items-center gap-3 px-3 py-2 text-left hover:bg-[#F7F3EC]"
              >
                <img
                  src={product.image || "/placeholder-product.svg"}
                  alt={product.name}
                  className="h-10 w-10 rounded-md object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm text-[#211F1D]">
                    {product.name}
                  </p>
                  <p className="text-xs text-[#8A8378]">
                    {product.category || "Product"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <nav className="hidden border-t border-[#E4DED2] bg-[var(--store-surface)] lg:block">
        <div className="relative mx-auto flex max-w-[1280px] items-center px-4 sm:px-6">
          <button
            type="button"
            aria-label="Scroll navigation left"
            onClick={() => scrollNav(-1)}
            className="shrink-0 pr-2 text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-primary)]"
          >
            <LuChevronLeft size={16} />
          </button>

          <div
            ref={scrollerRef}
            className="flex items-center gap-7 overflow-x-auto scroll-smooth py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`whitespace-nowrap text-sm transition-colors ${
                  isActiveLink(link.href)
                    ? "text-[var(--store-accent)]"
                    : "text-[var(--store-text)] hover:text-[var(--store-accent)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            aria-label="Scroll navigation right"
            onClick={() => scrollNav(1)}
            className="shrink-0 pl-2 text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-primary)]"
          >
            <LuChevronRight size={16} />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-[#211F1D]/50"
            onClick={() => setMobileOpen(false)}
          />

          <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-[#F7F3EC] p-5">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-serif text-lg text-[var(--theme-text)]">
                {settings.storeName}
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <LuX size={20} className="text-[#211F1D]" />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`border-b border-[#E4DED2] py-2.5 text-sm ${
                    isActiveLink(link.href)
                      ? "text-[var(--store-accent)]"
                      : "text-[#211F1D]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
