"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MdSearch,
  MdShoppingCart,
  MdFavoriteBorder,
  MdPersonOutline,
  MdMenu,
  MdClose,
  MdKeyboardArrowDown,
  MdFlashOn,
} from "react-icons/md";

export default function Header({
  search,
  setSearch,
  favorites = [],
  cartCount = 0,
}) {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-5">
          {/* Logo */}

          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950 text-lg font-black text-white shadow-sm">
              B
            </div>

            <div className="hidden sm:block">
              <p className="text-lg font-extrabold tracking-tight text-gray-950">
                YourStore
              </p>

              <p className="-mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                Shop smarter
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-7 lg:flex">
            <Link href="/" className="text-sm font-semibold text-[#1D4ED8]">
              Home
            </Link>

            <Link
              href="/shop"
              className="flex items-center gap-1 text-sm font-medium text-gray-600 transition hover:text-gray-950"
            >
              Shop
              <MdKeyboardArrowDown size={17} />
            </Link>

            <Link
              href="/categories"
              className="text-sm font-medium text-gray-600 transition hover:text-gray-950"
            >
              Categories
            </Link>

            <Link
              href="/deals"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-950"
            >
              <MdFlashOn className="text-amber-500" />
              Deals
            </Link>

            <Link
              href="/new-arrivals"
              className="text-sm font-medium text-gray-600 transition hover:text-gray-950"
            >
              New Arrivals
            </Link>
          </nav>

          {/* Search */}

          <div className="hidden max-w-md flex-1 md:flex">
            <div className="relative w-full">
              <MdSearch
                size={21}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="search"
                placeholder="Search products..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#1D4ED8] focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </div>

          {/* Actions */}

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/account"
              className="hidden h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 hover:text-gray-950 sm:flex"
              aria-label="Account"
            >
              <MdPersonOutline size={23} />
            </Link>

            <Link
              href="/wishlist"
              className="relative hidden h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 hover:text-gray-950 sm:flex"
              aria-label="Wishlist"
            >
              <MdFavoriteBorder size={22} />

              {favorites.length > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative flex h-10 items-center gap-2 rounded-xl px-2.5 text-gray-700 transition hover:bg-gray-100"
            >
              <MdShoppingCart size={23} />

              <span className="hidden text-sm font-semibold sm:block">
                Cart
              </span>

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1D4ED8] px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenu((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100 lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenu ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}

        <div className="pb-3 md:hidden">
          <div className="relative">
            <MdSearch
              size={20}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Search products..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-[#1D4ED8] focus:bg-white"
            />
          </div>
        </div>

        {/* Mobile Menu */}

        {mobileMenu && (
          <div className="border-t border-gray-100 py-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {[
                ["Home", "/"],
                ["Shop", "/shop"],
                ["Categories", "/categories"],
                ["Deals", "/deals"],
                ["New Arrivals", "/new-arrivals"],
                ["Account", "/account"],
                ["Wishlist", "/wishlist"],
              ].map(([name, href]) => (
                <Link
                  key={name}
                  href={href}
                  onClick={() => setMobileMenu(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
