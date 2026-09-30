"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  LuX,
  LuMinus,
  LuPlus,
  LuTrash2,
  LuShoppingBag,
  LuTruck,
  LuLock,
} from "react-icons/lu";
import { useCart } from "./CartContext";

const FREE_SHIPPING_AT = 75;

export default function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    itemCount,
    subtotal,
    maxQty,
  } = useCart();

  // Close with Escape
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  // Stop the page behind from scrolling while the cart is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const remaining = Math.max(FREE_SHIPPING_AT - subtotal, 0);
  const progress = Math.min((subtotal / FREE_SHIPPING_AT) * 100, 100);

  return (
    <div
      className={`fixed inset-0 z-[60] transition-[visibility] duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
      aria-hidden={!isOpen}
    >
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-[#211F1D]/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 bottom-0 w-full max-w-[420px] bg-[#F7F3EC] flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-5 border-b border-[#E4DED2]">
          <div>
            <h2 className="font-serif text-xl text-[#211F1D]">Your cart</h2>
            <p className="text-xs text-[#8A8378] mt-0.5">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="text-[#211F1D] hover:text-[#B65C38] transition-colors"
          >
            <LuX size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <span className="w-14 h-14 rounded-full bg-[#EFE9DC] text-[#1F3A2E] flex items-center justify-center">
              <LuShoppingBag size={22} />
            </span>

            <p className="font-serif text-lg text-[#211F1D] mt-4">
              Your cart is empty
            </p>
            <p className="text-sm text-[#5B564C] mt-1 leading-relaxed">
              Add something you like and it will show up here.
            </p>

            <Link
              href="/shop"
              onClick={closeCart}
              className="mt-6 bg-[#1F3A2E] text-[#F7F3EC] px-6 py-3 rounded-sm text-sm hover:bg-[#16281F] transition-colors"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="px-5 sm:px-6 py-4 border-b border-[#E4DED2]">
              <div className="flex items-center gap-2 text-xs text-[#211F1D]">
                <LuTruck size={15} className="text-[#1F3A2E] shrink-0" />
                {remaining > 0 ? (
                  <span>
                    Add ${remaining.toFixed(2)} more for free shipping
                  </span>
                ) : (
                  <span>You've unlocked free shipping</span>
                )}
              </div>

              <div className="mt-2.5 h-1 bg-[#E4DED2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C9A659] transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <ul className="flex-1 overflow-y-auto px-5 sm:px-6 divide-y divide-[#E4DED2]">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-sm bg-[#EFE9DC] shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-[#8A8378]">
                          {item.category}
                        </p>
                        <h3 className="font-serif text-base text-[#211F1D] leading-snug">
                          {item.name}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="text-[#8A8378] hover:text-[#B65C38] transition-colors shrink-0"
                      >
                        <LuTrash2 size={15} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-[#E4DED2] bg-white rounded-sm">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="w-8 h-8 flex items-center justify-center text-[#211F1D] hover:text-[#B65C38] transition-colors"
                        >
                          <LuMinus size={13} />
                        </button>

                        <span className="w-7 text-center text-sm text-[#211F1D]">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= maxQty}
                          aria-label="Increase quantity"
                          className="w-8 h-8 flex items-center justify-center text-[#211F1D] hover:text-[#B65C38] transition-colors disabled:text-[#C9C2B3] disabled:hover:text-[#C9C2B3]"
                        >
                          <LuPlus size={13} />
                        </button>
                      </div>

                      <span className="font-serif text-base text-[#1F3A2E]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="border-t border-[#E4DED2] bg-white px-5 sm:px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-serif text-lg text-[#211F1D]">
                    Subtotal
                  </span>
                  <p className="text-[11px] text-[#8A8378] mt-0.5">
                    Shipping and taxes are calculated at checkout
                  </p>
                </div>

                <span className="font-serif text-2xl text-[#1F3A2E]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full mt-4 bg-[#1F3A2E] text-[#F7F3EC] py-3.5 rounded-sm text-sm hover:bg-[#16281F] transition-colors flex items-center justify-center gap-2"
              >
                <LuLock size={15} />
                Checkout · ${subtotal.toFixed(2)}
              </Link>

              <button
                type="button"
                onClick={closeCart}
                className="w-full mt-2 py-3 text-sm text-[#211F1D] border border-[#E4DED2] rounded-sm hover:border-[#1F3A2E] transition-colors"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
