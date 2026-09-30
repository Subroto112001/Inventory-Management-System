"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import {
  LuSearch,
  LuUser,
  LuGitCompare,
  LuShoppingCart,
  LuMenu,
  LuX,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import { useCart } from "../Cart/CartContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "./product" },
  { label: "Lighting", href: "#" },
  { label: "Kitchen & Dining", href: "#" },
  { label: "Furniture", href: "#" },
  { label: "Textiles & Bedding", href: "#" },
  { label: "Outdoor & Garden", href: "#" },
  { label: "Decor & Accents", href: "#" },
  { label: "Brands", href: "#" },
  { label: "Sale", href: "#" },
];

export default function FrontHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollerRef = useRef(null);
  const { openCart, itemCount } = useCart();
  
  const scrollNav = (dir) => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({
        left: dir * 220,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="bg-[#F7F3EC] sticky top-0 z-40">
      {/* Announcement Bar */}
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
        <a href="#" className="flex items-center gap-2 shrink-0">
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
          <Link
            href="/order?view=dashboard"
            className="flex flex-col items-center gap-0.5 hover:text-[#B65C38] transition-colors"
            aria-label="Account"
          >
            <LuUser size={20} />

            <span className="text-[10px] hidden sm:inline">Account</span>
          </Link>

          <Link
            href={"/compare"}
            className="relative flex flex-col items-center gap-0.5 hover:text-[#B65C38] transition-colors"
            aria-label="Compare"
          >
            <LuGitCompare size={20} />

            <span className="text-[10px] hidden sm:inline">Compare</span>

            <span className="absolute -top-1 -right-1.5 bg-[#B65C38] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </Link>

          <button
            type="button"
            onClick={openCart}
            className="relative flex flex-col items-center gap-0.5 hover:text-[#B65C38] transition-colors"
            aria-label="Cart"
          >
            <LuShoppingCart size={20} />

            <span className="text-[10px] hidden sm:inline">Cart</span>

            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#B65C38] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
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
                <LuX size={20} className="text-[#211F1D]" />
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
  );
}
