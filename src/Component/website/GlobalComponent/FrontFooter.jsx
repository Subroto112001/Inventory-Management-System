import React from "react";
import Link from "next/link";
import { MdCheckCircle } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-black text-gray-950">
                B
              </div>

              <span className="text-xl font-extrabold">YourStore</span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-gray-400">
              A modern shopping experience built around quality products, great
              prices, and reliable service.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
              <MdCheckCircle className="text-emerald-400" />
              Trusted shopping experience
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">Shop</h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/shop"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                All Products
              </Link>

              <Link
                href="/deals"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Hot Deals
              </Link>

              <Link
                href="/new-arrivals"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                New Arrivals
              </Link>

              <Link
                href="/categories"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Categories
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">Help</h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/contact"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Contact Us
              </Link>

              <Link
                href="/shipping"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Shipping Info
              </Link>

              <Link
                href="/returns"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Returns
              </Link>

              <Link
                href="/faq"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                FAQ
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">Company</h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/about"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                About Us
              </Link>

              <Link
                href="/privacy"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/account"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                My Account
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} YourStore. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-xs text-gray-500">
            <span>Secure Payments</span>
            <span>•</span>
            <span>Fast Delivery</span>
            <span>•</span>
            <span>Easy Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
