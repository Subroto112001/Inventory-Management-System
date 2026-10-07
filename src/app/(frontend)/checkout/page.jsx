"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/Component/website/Cart/CartContext";
import {
  LuChevronRight,
  LuTruck,
  LuShieldCheck,
  LuRotateCcw,
  LuHeadphones,
  LuLock,
  LuCheck,
  LuTag,
} from "react-icons/lu";

const PERKS = [
  {
    icon: LuTruck,
    title: "Free shipping",
    text: "On orders over $75",
  },
  {
    icon: LuRotateCcw,
    title: "30-day returns",
    text: "No questions asked",
  },
  {
    icon: LuShieldCheck,
    title: "Secure checkout",
    text: "Encrypted payments",
  },
  {
    icon: LuHeadphones,
    title: "Support",
    text: "Mon–Fri, 9am–6pm",
  },
];

function SectionTitle({ number, title }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-7 h-7 rounded-full bg-[#1F3A2E] text-[#F7F3EC] flex items-center justify-center text-xs">
        {number}
      </span>

      <h2 className="font-serif text-xl sm:text-2xl text-[#211F1D]">{title}</h2>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");


  const [coupon, setCoupon] = useState("");
  const [orderState, setOrderState] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const [form, setForm] = useState({ email: "", firstName: "", lastName: "", phone: "" });

  const checkoutProducts = items;
  const cartPayload = useMemo(() => items.map(({ id, quantity }) => ({ id, quantity })), [items]);
  const cartKey = JSON.stringify(cartPayload);
  const subtotal = quote?.subtotal ?? 0;
  const shipping = quote?.shipping ?? 0;
  const discount = quote?.discount ?? 0;
  const total = quote?.total ?? 0;
  const quoteMatchesCart = Boolean(quote && JSON.stringify(quote.items?.map(({ id, quantity }) => ({ id, quantity })) || []) === cartKey && (appliedCoupon ? String(quote.couponCode).toUpperCase() === appliedCoupon : !quote.couponCode));

  useEffect(() => {
    let active = true;
    fetch("/api/account", { cache: "no-store" }).then(async (response) => {
      if (response.status === 401) { router.replace("/login?next=%2Fcheckout"); return null; }
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load your account");
      return data.user;
    }).then((user) => {
      if (!active || !user) return;
      const savedAddresses = Array.isArray(user.addresses) ? user.addresses : [];
      setAddresses(savedAddresses);
      setAddressId(savedAddresses.find((address) => address.isDefault)?._id || savedAddresses[0]?._id || "");
      setForm((current) => ({ ...current, email: user.email || "", firstName: user.firstName || "", lastName: user.lastName || "", phone: user.phoneNumber || "" }));
    }).catch((error) => { if (active) setOrderState((state) => ({ ...state, error: error.message })); });
    return () => { active = false; };
  }, [router]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => { if (active) { setQuoteLoading(true); setQuoteError(""); } });
    const requestItems = JSON.parse(cartKey);
    if (!requestItems.length) { Promise.resolve().then(() => { if (active) { setQuote(null); setQuoteLoading(false); } }); return () => { active = false; }; }
    fetch("/api/checkout/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: requestItems, couponCode: appliedCoupon }) })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.message || "Unable to calculate totals"); return data; })
      .then((data) => { if (active) setQuote(data); })
      .catch((error) => { if (active) { setQuote(null); setQuoteError(error.message); } })
      .finally(() => { if (active) setQuoteLoading(false); });
    return () => { active = false; };
  }, [cartKey, appliedCoupon]);

  const applyCoupon = () => setAppliedCoupon(coupon.trim().toUpperCase());

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!checkoutProducts.length) {
      setOrderState({
        loading: false,
        error: "Your cart is empty.",
        success: "",
      });
      return;
    }
    if (!addressId) { setOrderState({ loading: false, error: "Choose a saved shipping address before placing your order.", success: "" }); return; }
    if (!quoteMatchesCart || quoteLoading || quoteError) { setOrderState({ loading: false, error: quoteError || "Please wait while your order total is verified.", success: "" }); return; }
    setOrderState({ loading: true, error: "", success: "" });
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId,
          cart: checkoutProducts.map(({ id, quantity }) => ({ id, quantity })),
          orderType: "Home Delivery",
          deliveryPaymentType: "COD",
          paymentMethod: "Cash",
          couponCode: appliedCoupon,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Unable to place order");
      clearCart();
      setOrderState({
        loading: false,
        error: "",
        success: `Order ${data.order?.orderNumber || "created"} successfully.`,
      });
    } catch (error) {
      setOrderState({ loading: false, error: error.message, success: "" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] font-sans">
      <main>
        {/* Breadcrumb */}
        <section className="border-b border-[#E4DED2]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-2 text-xs text-[#8A8378]">
              <a href="#" className="hover:text-[#B65C38] transition-colors">
                Home
              </a>

              <LuChevronRight size={13} />

              <a href="#" className="hover:text-[#B65C38] transition-colors">
                Cart
              </a>

              <LuChevronRight size={13} />

              <span className="text-[#211F1D]">Checkout</span>
            </div>
          </div>
        </section>

        {/* Checkout Heading */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="text-sm text-[#B65C38] mb-1">Almost there</p>

              <h1 className="font-serif text-3xl sm:text-4xl text-[#211F1D]">
                Checkout
              </h1>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#8A8378]">
              <LuLock size={14} className="text-[#1F3A2E]" />
              Secure checkout
            </div>
          </div>

          {/* Checkout Progress */}
          <div className="mt-7 flex items-center max-w-2xl">
            <div className="flex items-center gap-2 text-[#1F3A2E]">
              <span className="w-7 h-7 rounded-full bg-[#1F3A2E] text-[#F7F3EC] flex items-center justify-center text-xs">
                1
              </span>

              <span className="text-xs sm:text-sm">Information</span>
            </div>

            <div className="flex-1 h-px bg-[#C9A659] mx-3 sm:mx-5" />

            <div className="flex items-center gap-2 text-[#8A8378]">
              <span className="w-7 h-7 rounded-full border border-[#E4DED2] flex items-center justify-center text-xs">
                2
              </span>

              <span className="text-xs sm:text-sm">Payment</span>
            </div>

            <div className="flex-1 h-px bg-[#E4DED2] mx-3 sm:mx-5" />

            <div className="flex items-center gap-2 text-[#8A8378]">
              <span className="w-7 h-7 rounded-full border border-[#E4DED2] flex items-center justify-center text-xs">
                3
              </span>

              <span className="text-xs sm:text-sm">Confirmation</span>
            </div>
          </div>
        </section>

        {/* Checkout Form */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <form
            onSubmit={placeOrder}
            className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-6 lg:gap-10"
          >
            {/* =================================================
                LEFT COLUMN
            ================================================= */}

            <div className="space-y-6">
              {/* Contact */}
              <div className="bg-white border border-[#E4DED2] rounded-md p-5 sm:p-7">
                <SectionTitle number="1" title="Contact information" />
                <p className="text-sm text-[#211F1D]">{[form.firstName, form.lastName].filter(Boolean).join(" ")}</p>
                <p className="mt-1 text-sm text-[#5B564C]">{form.email}</p>
                <p className="mt-1 text-sm text-[#5B564C]">{form.phone}</p>
                <Link href="/order?view=dashboard" className="mt-3 inline-block text-sm text-[#1F3A2E] underline">Update account details</Link>
              </div>

              {/* Shipping Address */}
              <div className="bg-white border border-[#E4DED2] rounded-md p-5 sm:p-7">
                <SectionTitle number="2" title="Shipping address" />
                {addresses.length ? (
                  <div className="space-y-3">
                    {addresses.map((address) => <label key={address._id} className="flex cursor-pointer items-start gap-3 rounded-sm border border-[#E4DED2] p-4">
                      <input type="radio" name="shippingAddress" value={address._id} checked={addressId === address._id} onChange={() => setAddressId(address._id)} className="mt-1 accent-[#1F3A2E]" />
                      <span className="text-sm text-[#211F1D]"><strong>{address.label || "Address"}</strong>{address.isDefault ? " (Default)" : ""}<br />{[address.fullName, address.phone, address.address, address.area, address.city, address.postalCode, address.country].filter(Boolean).join(", ")}</span>
                    </label>)}
                  </div>
                ) : <p className="text-sm text-[#5B564C]">Add a saved address to continue checkout. <Link href="/order?view=addresses" className="underline text-[#1F3A2E]">Manage addresses</Link></p>}
                {addresses.length > 0 && <Link href="/order?view=addresses" className="mt-4 inline-block text-sm text-[#1F3A2E] underline">Manage saved addresses</Link>}
              </div>

              {/* Delivery */}
              <div className="bg-white border border-[#E4DED2] rounded-md p-5 sm:p-7">
                <SectionTitle number="3" title="Delivery method" />

                <div className="border border-[#1F3A2E] bg-[#F7F3EC] rounded-sm p-4 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1F3A2E] text-[#F7F3EC] flex items-center justify-center shrink-0">
                      <LuTruck size={17} />
                    </div>

                    <div>
                      <p className="text-sm text-[#211F1D]">
                        Standard delivery
                      </p>

                      <p className="text-xs text-[#8A8378] mt-1">
                        Delivered within 3–5 business days
                      </p>
                    </div>
                  </div>

                  <span className="text-sm text-[#1F3A2E]">
                    {quoteLoading ? "Checking..." : shipping === 0 ? "FREE" : `$${Number(shipping).toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white border border-[#E4DED2] rounded-md p-5 sm:p-7">
                <SectionTitle number="4" title="Payment" />
                <div className="border border-[#1F3A2E] bg-[#F7F3EC] rounded-sm p-4 flex items-center justify-between">
                  <span className="text-sm text-[#211F1D]">Cash on delivery</span>
                  <span className="text-xs text-[#1F3A2E]">Available</span>
                </div>
                <p className="mt-3 text-xs text-[#8A8378]">Online card payments are not enabled yet.</p>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 px-1">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-0.5 accent-[#1F3A2E]"
                />

                <label
                  htmlFor="terms"
                  className="text-xs sm:text-sm text-[#5B564C] leading-relaxed"
                >
                  I agree to the{" "}
                  <a href="#" className="text-[#1F3A2E] underline">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#1F3A2E] underline">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
            </div>

            {/* =================================================
                RIGHT COLUMN
            ================================================= */}

            <aside className="lg:sticky lg:top-28 h-fit">
              <div className="bg-white border border-[#E4DED2] rounded-md overflow-hidden">
                {/* Order Header */}
                <div className="px-5 sm:px-6 py-5 border-b border-[#E4DED2]">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-xl text-[#211F1D]">
                      Your order
                    </h2>

                    <span className="text-xs text-[#8A8378]">
                      {checkoutProducts.reduce(
                        (sum, product) => sum + product.quantity,
                        0,
                      )}{" "}
                      items
                    </span>
                  </div>
                </div>

                {/* Products */}
                <div className="p-5 sm:p-6 space-y-5">
                  {checkoutProducts.map((product) => (
                    <div key={product.id} className="flex gap-3">
                      {/* Real Product Image */}
                      <div className="relative w-20 h-20 rounded-sm overflow-hidden bg-[#F7F3EC] shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />

                        <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#211F1D] text-white text-[10px] flex items-center justify-center">
                          {product.quantity}
                        </span>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#8A8378] mb-0.5">
                          {product.category}
                        </p>

                        <h3 className="text-sm text-[#211F1D] leading-snug">
                          {product.name}
                        </h3>

                        <p className="text-sm text-[#1F3A2E] mt-1">
                          ${product.price}
                        </p>
                      </div>

                      <div className="text-sm text-[#211F1D]">
                        ${(Number(quote?.items?.find((line) => line.id === product.id)?.price ?? product.price) * product.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="px-5 sm:px-6 py-5 border-y border-[#E4DED2] bg-[#F7F3EC]">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LuTag
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8378]"
                      />

                      <input
                        type="text"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="Promo code"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E4DED2] rounded-sm text-sm outline-none focus:border-[#1F3A2E]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={applyCoupon}

                      className="px-4 py-2.5 bg-[#211F1D] text-[#F7F3EC] text-sm rounded-sm hover:bg-[#1F3A2E] transition-colors disabled:opacity-50"
                    >
                      {appliedCoupon ? "Update" : "Apply"}
                    </button>
                  </div>

                  {appliedCoupon && (
                    <p className="flex items-center gap-1.5 text-xs text-[#1F3A2E] mt-2">
                      <LuCheck size={13} />
                      {appliedCoupon} applied
                    </p>
                  )}

                  {quoteError && <p role="alert" className="mt-2 text-xs text-red-700">{quoteError}</p>}
                  {!appliedCoupon && !quoteError && <p className="text-[11px] text-[#8A8378] mt-2">Enter a promotion code to check its current discount.</p>}
                </div>

                {/* Totals */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#5B564C]">Subtotal</span>

                    <span className="text-[#211F1D]">
                      ${Number(subtotal).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#5B564C]">Shipping</span>

                    <span className="text-[#211F1D]">
                      {quoteLoading ? "Checking..." : shipping === 0 ? "FREE" : `$${Number(shipping).toFixed(2)}`}
                    </span>
                  </div>

                  {Number(quote?.tax || 0) > 0 && (
                    <div className="flex items-center justify-between text-sm"><span className="text-[#5B564C]">{quote?.taxName || "Tax"}</span><span className="text-[#211F1D]">${Number(quote.tax).toFixed(2)}</span></div>
                  )}
                  {Boolean(discount) && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#1F3A2E]">Discount</span>

                      <span className="text-[#1F3A2E]">
                        -${Number(discount).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-[#E4DED2] pt-4 mt-4 flex items-center justify-between">
                    <div>
                      <span className="font-serif text-lg text-[#211F1D]">
                        Total
                      </span>

                      <p className="text-[11px] text-[#8A8378] mt-0.5">
                        Including applicable taxes
                      </p>
                    </div>

                    <span className="font-serif text-2xl text-[#1F3A2E]">
                      ${Number(total).toFixed(2)}
                    </span>
                  </div>

                  {/* Place Order */}
                  <button
                    type="submit"
                    disabled={orderState.loading || quoteLoading || !quoteMatchesCart || !addressId}
                    className="w-full mt-3 bg-[#1F3A2E] text-[#F7F3EC] py-3.5 rounded-sm text-sm hover:bg-[#16281F] transition-colors flex items-center justify-center gap-2"
                  >
                    <LuLock size={15} />
                    {orderState.loading
                      ? "Placing order..."
                      : `Place order · $${total.toFixed(2)}`}
                  </button>

                  {orderState.error && (
                    <p className="text-xs text-red-700" role="alert">
                      {orderState.error}{" "}
                      <Link href="/login" className="font-semibold underline">
                        Log in
                      </Link>
                    </p>
                  )}
                  {orderState.success && (
                    <p className="text-xs text-[#1F3A2E]" role="status">
                      {orderState.success}
                    </p>
                  )}

                  <p className="text-[11px] text-[#8A8378] text-center leading-relaxed pt-1">
                    Your payment information is protected using secure
                    encryption.
                  </p>
                </div>
              </div>

              {/* Trust Card */}
              <div className="mt-4 bg-[#EFE9DC] rounded-md p-5">
                <div className="flex items-start gap-3">
                  <LuShieldCheck
                    size={19}
                    className="text-[#1F3A2E] mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="text-sm text-[#211F1D]">
                      Shop with confidence
                    </p>

                    <p className="text-xs text-[#5B564C] leading-relaxed mt-1">
                      Secure payments, easy returns, and customer support
                      whenever you need it.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </form>
        </section>

        {/* =====================================================
            PERKS
        ===================================================== */}

        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 border border-[#E4DED2] bg-white rounded-md overflow-hidden">
            {PERKS.map((perk, index) => {
              const Icon = perk.icon;

              return (
                <div
                  key={perk.title}
                  className={`p-5 sm:p-6 flex items-start gap-3 ${
                    index !== PERKS.length - 1
                      ? "border-b lg:border-b-0 lg:border-r border-[#E4DED2]"
                      : ""
                  }`}
                >
                  <Icon size={20} className="text-[#1F3A2E] mt-0.5 shrink-0" />

                  <div>
                    <p className="text-sm text-[#211F1D]">{perk.title}</p>

                    <p className="text-xs text-[#8A8378] mt-1">{perk.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

    </div>
  );
}
