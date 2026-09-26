
"use client";

import { useRef, useState } from "react";
import {
  LuSearch,
  LuUser,
  LuGitCompare,
  LuShoppingCart,
  LuHeart,
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
  LuCreditCard,
  LuLock,
  LuCheck,
  LuTag,
} from "react-icons/lu";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "Shop All", href: "#" },
  { label: "Lighting", href: "#" },
  { label: "Kitchen & Dining", href: "#" },
  { label: "Furniture", href: "#" },
  { label: "Textiles & Bedding", href: "#" },
  { label: "Outdoor & Garden", href: "#" },
  { label: "Decor & Accents", href: "#" },
  { label: "Brands", href: "#" },
  { label: "Sale", href: "#" },
];

/* =========================================================
   REAL PRODUCT IMAGES
   ========================================================= */

const CHECKOUT_PRODUCTS = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=85",
    name: "Alder Oak Lounge Chair",
    category: "Furniture",
    price: 189,
    quantity: 1,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1572119865084-43c285814d63?auto=format&fit=crop&w=500&q=85",
    name: "Hand-Thrown Ceramic Mug",
    category: "Kitchen & Dining",
    price: 58,
    quantity: 2,
  },
];

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

      <h2 className="font-serif text-xl sm:text-2xl text-[#211F1D]">
        {title}
      </h2>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  type = "text",
  required = true,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="block text-sm text-[#211F1D] mb-1.5">
        {label}

        {required && (
          <span className="text-[#B65C38] ml-1">*</span>
        )}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3.5 py-3 bg-white border border-[#E4DED2] rounded-sm text-sm text-[#211F1D] placeholder:text-[#9B9689] outline-none focus:border-[#1F3A2E] focus:ring-1 focus:ring-[#1F3A2E]/10 transition"
      />
    </div>
  );
}

export default function CheckoutPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollerRef = useRef(null);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [sameBilling, setSameBilling] = useState(true);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Bangladesh",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const scrollNav = (dir) => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({
        left: dir * 220,
        behavior: "smooth",
      });
    }
  };

  const subtotal = CHECKOUT_PRODUCTS.reduce(
    (total, product) =>
      total + product.price * product.quantity,
    0
  );

  const shipping = subtotal >= 75 ? 0 : 12;

  const discount = couponApplied ? 15 : 0;

  const total = subtotal + shipping - discount;

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "FIELD15") {
      setCouponApplied(true);
    }
  };

  const placeOrder = (e) => {
    e.preventDefault();

    alert("Order placed successfully!");
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] font-sans">
      {/* =====================================================
          FONTS
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

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="bg-[#F7F3EC] sticky top-0 z-40">
        {/* Announcement Bar */}
        <div className="bg-[#1F3A2E] text-[#F7F3EC] text-xs">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
            <p>
              Free shipping on orders over $75 · Handmade in
              small batches
            </p>

            <div className="hidden sm:flex items-center gap-4">
              <a
                href="#"
                className="hover:text-[#C9A659] transition-colors"
              >
                Track order
              </a>

              <a
                href="#"
                className="hover:text-[#C9A659] transition-colors"
              >
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
          <a
            href="#"
            className="flex items-center gap-2 shrink-0"
          >
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
            <button
              type="button"
              className="flex flex-col items-center gap-0.5 hover:text-[#B65C38] transition-colors"
              aria-label="Account"
            >
              <LuUser size={20} />
              <span className="text-[10px] hidden sm:inline">
                Account
              </span>
            </button>

            <button
              type="button"
              className="relative flex flex-col items-center gap-0.5 hover:text-[#B65C38] transition-colors"
              aria-label="Compare"
            >
              <LuGitCompare size={20} />

              <span className="text-[10px] hidden sm:inline">
                Compare
              </span>

              <span className="absolute -top-1 -right-1.5 bg-[#B65C38] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </button>

            <button
              type="button"
              className="relative flex flex-col items-center gap-0.5 hover:text-[#B65C38] transition-colors"
              aria-label="Wishlist"
            >
              <LuHeart size={20} />

              <span className="text-[10px] hidden sm:inline">
                Wishlist
              </span>

              <span className="absolute -top-1 -right-1.5 bg-[#B65C38] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                1
              </span>
            </button>

            <button
              type="button"
              className="relative flex flex-col items-center gap-0.5 hover:text-[#B65C38] transition-colors"
              aria-label="Cart"
            >
              <LuShoppingCart size={20} />

              <span className="text-[10px] hidden sm:inline">
                Cart
              </span>

              <span className="absolute -top-1 -right-1.5 bg-[#B65C38] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
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
                  <LuX
                    size={20}
                    className="text-[#211F1D]"
                  />
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

      {/* =====================================================
          MAIN CHECKOUT
      ===================================================== */}

      <main>
        {/* Breadcrumb */}
        <section className="border-b border-[#E4DED2]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-2 text-xs text-[#8A8378]">
              <a
                href="#"
                className="hover:text-[#B65C38] transition-colors"
              >
                Home
              </a>

              <LuChevronRight size={13} />

              <a
                href="#"
                className="hover:text-[#B65C38] transition-colors"
              >
                Cart
              </a>

              <LuChevronRight size={13} />

              <span className="text-[#211F1D]">
                Checkout
              </span>
            </div>
          </div>
        </section>

        {/* Checkout Heading */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="text-sm text-[#B65C38] mb-1">
                Almost there
              </p>

              <h1 className="font-serif text-3xl sm:text-4xl text-[#211F1D]">
                Checkout
              </h1>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#8A8378]">
              <LuLock
                size={14}
                className="text-[#1F3A2E]"
              />

              Secure checkout
            </div>
          </div>

          {/* Checkout Progress */}
          <div className="mt-7 flex items-center max-w-2xl">
            <div className="flex items-center gap-2 text-[#1F3A2E]">
              <span className="w-7 h-7 rounded-full bg-[#1F3A2E] text-[#F7F3EC] flex items-center justify-center text-xs">
                1
              </span>

              <span className="text-xs sm:text-sm">
                Information
              </span>
            </div>

            <div className="flex-1 h-px bg-[#C9A659] mx-3 sm:mx-5" />

            <div className="flex items-center gap-2 text-[#8A8378]">
              <span className="w-7 h-7 rounded-full border border-[#E4DED2] flex items-center justify-center text-xs">
                2
              </span>

              <span className="text-xs sm:text-sm">
                Payment
              </span>
            </div>

            <div className="flex-1 h-px bg-[#E4DED2] mx-3 sm:mx-5" />

            <div className="flex items-center gap-2 text-[#8A8378]">
              <span className="w-7 h-7 rounded-full border border-[#E4DED2] flex items-center justify-center text-xs">
                3
              </span>

              <span className="text-xs sm:text-sm">
                Confirmation
              </span>
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
                <SectionTitle
                  number="1"
                  title="Contact information"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <InputField
                      label="Email address"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) =>
                        updateField(
                          "email",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <InputField
                    label="First name"
                    placeholder="First name"
                    value={form.firstName}
                    onChange={(e) =>
                      updateField(
                        "firstName",
                        e.target.value
                      )
                    }
                  />

                  <InputField
                    label="Last name"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={(e) =>
                      updateField(
                        "lastName",
                        e.target.value
                      )
                    }
                  />

                  <div className="sm:col-span-2">
                    <InputField
                      label="Phone number"
                      type="tel"
                      placeholder="+880 1XXXXXXXXX"
                      value={form.phone}
                      onChange={(e) =>
                        updateField(
                          "phone",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 mt-5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#1F3A2E]"
                  />

                  <span className="text-sm text-[#5B564C]">
                    Email me with news and offers
                  </span>
                </label>
              </div>

              {/* Shipping Address */}
              <div className="bg-white border border-[#E4DED2] rounded-md p-5 sm:p-7">
                <SectionTitle
                  number="2"
                  title="Shipping address"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <InputField
                      label="Address"
                      placeholder="Street address"
                      value={form.address}
                      onChange={(e) =>
                        updateField(
                          "address",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <InputField
                      label="Apartment, suite, etc."
                      placeholder="Apartment, suite, unit (optional)"
                      required={false}
                      value={form.apartment}
                      onChange={(e) =>
                        updateField(
                          "apartment",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <InputField
                    label="City"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) =>
                      updateField(
                        "city",
                        e.target.value
                      )
                    }
                  />

                  <InputField
                    label="State / Province"
                    placeholder="State / Province"
                    value={form.state}
                    onChange={(e) =>
                      updateField(
                        "state",
                        e.target.value
                      )
                    }
                  />

                  <InputField
                    label="Postal code"
                    placeholder="Postal code"
                    value={form.postalCode}
                    onChange={(e) =>
                      updateField(
                        "postalCode",
                        e.target.value
                      )
                    }
                  />

                  <InputField
                    label="Country"
                    placeholder="Country"
                    value={form.country}
                    onChange={(e) =>
                      updateField(
                        "country",
                        e.target.value
                      )
                    }
                  />
                </div>

                <label className="flex items-center gap-2 mt-5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#1F3A2E]"
                  />

                  <span className="text-sm text-[#5B564C]">
                    Save this information for next time
                  </span>
                </label>
              </div>

              {/* Delivery */}
              <div className="bg-white border border-[#E4DED2] rounded-md p-5 sm:p-7">
                <SectionTitle
                  number="3"
                  title="Delivery method"
                />

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
                    {shipping === 0
                      ? "FREE"
                      : `$${shipping}`}
                  </span>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white border border-[#E4DED2] rounded-md p-5 sm:p-7">
                <SectionTitle
                  number="4"
                  title="Payment"
                />

                <p className="text-xs text-[#8A8378] mb-5">
                  All transactions are secure and encrypted.
                </p>

                {/* Card */}
                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("card")
                  }
                  className={`w-full text-left border rounded-sm p-4 transition-colors ${
                    paymentMethod === "card"
                      ? "border-[#1F3A2E] bg-[#F7F3EC]"
                      : "border-[#E4DED2] bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === "card"
                            ? "border-[#1F3A2E]"
                            : "border-[#C9C2B5]"
                        }`}
                      >
                        {paymentMethod === "card" && (
                          <span className="w-2 h-2 rounded-full bg-[#1F3A2E]" />
                        )}
                      </span>

                      <span className="text-sm text-[#211F1D]">
                        Credit / Debit card
                      </span>
                    </div>

                    <LuCreditCard
                      size={20}
                      className="text-[#5B564C]"
                    />
                  </div>
                </button>

                {paymentMethod === "card" && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <InputField
                        label="Card number"
                        placeholder="1234 5678 9012 3456"
                        value={form.cardNumber}
                        onChange={(e) =>
                          updateField(
                            "cardNumber",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <InputField
                      label="Name on card"
                      placeholder="Name on card"
                      value={form.cardName}
                      onChange={(e) =>
                        updateField(
                          "cardName",
                          e.target.value
                        )
                      }
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <InputField
                        label="Expiry"
                        placeholder="MM/YY"
                        value={form.expiry}
                        onChange={(e) =>
                          updateField(
                            "expiry",
                            e.target.value
                          )
                        }
                      />

                      <InputField
                        label="CVV"
                        placeholder="123"
                        value={form.cvv}
                        onChange={(e) =>
                          updateField(
                            "cvv",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Cash On Delivery */}
                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("cod")
                  }
                  className={`w-full text-left border rounded-sm p-4 mt-3 transition-colors ${
                    paymentMethod === "cod"
                      ? "border-[#1F3A2E] bg-[#F7F3EC]"
                      : "border-[#E4DED2] bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === "cod"
                            ? "border-[#1F3A2E]"
                            : "border-[#C9C2B5]"
                        }`}
                      >
                        {paymentMethod === "cod" && (
                          <span className="w-2 h-2 rounded-full bg-[#1F3A2E]" />
                        )}
                      </span>

                      <span className="text-sm text-[#211F1D]">
                        Cash on delivery
                      </span>
                    </div>

                    <span className="text-xs text-[#8A8378]">
                      Available
                    </span>
                  </div>
                </button>

                {/* Billing */}
                <label className="flex items-center gap-2 mt-5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameBilling}
                    onChange={(e) =>
                      setSameBilling(
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 accent-[#1F3A2E]"
                  />

                  <span className="text-sm text-[#5B564C]">
                    Billing address is the same as
                    shipping address
                  </span>
                </label>

                {!sameBilling && (
                  <div className="mt-5 p-4 bg-[#F7F3EC] border border-[#E4DED2]">
                    <p className="text-sm text-[#211F1D] mb-3">
                      Enter billing address
                    </p>

                    <textarea
                      placeholder="Billing address"
                      rows={4}
                      className="w-full px-3.5 py-3 bg-white border border-[#E4DED2] rounded-sm text-sm outline-none resize-none focus:border-[#1F3A2E]"
                    />
                  </div>
                )}
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
                  <a
                    href="#"
                    className="text-[#1F3A2E] underline"
                  >
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-[#1F3A2E] underline"
                  >
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
                      {CHECKOUT_PRODUCTS.reduce(
                        (sum, product) =>
                          sum + product.quantity,
                        0
                      )}{" "}
                      items
                    </span>
                  </div>
                </div>

                {/* Products */}
                <div className="p-5 sm:p-6 space-y-5">
                  {CHECKOUT_PRODUCTS.map(
                    (product) => (
                      <div
                        key={product.id}
                        className="flex gap-3"
                      >
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
                          $
                          {(
                            product.price *
                            product.quantity
                          ).toFixed(2)}
                        </div>
                      </div>
                    )
                  )}
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
                        onChange={(e) =>
                          setCoupon(e.target.value)
                        }
                        placeholder="Promo code"
                        disabled={couponApplied}
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E4DED2] rounded-sm text-sm outline-none focus:border-[#1F3A2E]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={couponApplied}
                      className="px-4 py-2.5 bg-[#211F1D] text-[#F7F3EC] text-sm rounded-sm hover:bg-[#1F3A2E] transition-colors disabled:opacity-50"
                    >
                      {couponApplied
                        ? "Applied"
                        : "Apply"}
                    </button>
                  </div>

                  {couponApplied && (
                    <p className="flex items-center gap-1.5 text-xs text-[#1F3A2E] mt-2">
                      <LuCheck size={13} />
                      $15 promotional discount
                      applied
                    </p>
                  )}

                  {!couponApplied && (
                    <p className="text-[11px] text-[#8A8378] mt-2">
                      Try code{" "}
                      <span className="text-[#211F1D]">
                        FIELD15
                      </span>{" "}
                      for $15 off.
                    </p>
                  )}
                </div>

                {/* Totals */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#5B564C]">
                      Subtotal
                    </span>

                    <span className="text-[#211F1D]">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#5B564C]">
                      Shipping
                    </span>

                    <span className="text-[#211F1D]">
                      {shipping === 0
                        ? "FREE"
                        : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  {couponApplied && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#1F3A2E]">
                        Discount
                      </span>

                      <span className="text-[#1F3A2E]">
                        -${discount.toFixed(2)}
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
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  {/* Place Order */}
                  <button
                    type="submit"
                    className="w-full mt-3 bg-[#1F3A2E] text-[#F7F3EC] py-3.5 rounded-sm text-sm hover:bg-[#16281F] transition-colors flex items-center justify-center gap-2"
                  >
                    <LuLock size={15} />

                    Place order · ${total.toFixed(2)}
                  </button>

                  <p className="text-[11px] text-[#8A8378] text-center leading-relaxed pt-1">
                    Your payment information is
                    protected using secure encryption.
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
                      Secure payments, easy returns, and
                      customer support whenever you need
                      it.
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
                  <Icon
                    size={20}
                    className="text-[#1F3A2E] mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="text-sm text-[#211F1D]">
                      {perk.title}
                    </p>

                    <p className="text-xs text-[#8A8378] mt-1">
                      {perk.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-[#211F1D] text-[#D8D3C8]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-sm bg-[#C9A659] text-[#211F1D] flex items-center justify-center font-serif text-base">
                F
              </span>

              <span className="font-serif text-lg text-[#F7F3EC]">
                FIELDHOUSE
              </span>
            </div>

            <p className="text-sm text-[#9B9689] mb-4">
              Everyday goods for the home, made in small
              batches with natural materials.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-[#C9A659] transition-colors"
              >
                <LuFacebook size={16} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-[#C9A659] transition-colors"
              >
                <LuInstagram size={16} />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-[#C9A659] transition-colors"
              >
                <LuTwitter size={16} />
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="hover:text-[#C9A659] transition-colors"
              >
                <LuYoutube size={16} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm text-[#F7F3EC] mb-4">
              Shop
            </h4>

            <ul className="space-y-2.5 text-sm">
              {[
                "Shop All",
                "Furniture",
                "Lighting",
                "Kitchen & Dining",
                "Textiles & Bedding",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-[#C9A659] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm text-[#F7F3EC] mb-4">
              Help
            </h4>

            <ul className="space-y-2.5 text-sm">
              {[
                "Contact us",
                "Shipping & delivery",
                "Returns",
                "FAQ",
                "Track order",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-[#C9A659] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm text-[#F7F3EC] mb-4">
              Contact
            </h4>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <LuMapPin
                  size={15}
                  className="mt-0.5 text-[#C9A659]"
                />

                <span>
                  124 Market Street
                  <br />
                  Portland, OR 97205
                </span>
              </div>

              <div className="flex items-center gap-2">
                <LuPhone
                  size={15}
                  className="text-[#C9A659]"
                />

                <span>+1 (555) 123-4567</span>
              </div>

              <div className="flex items-center gap-2">
                <LuMail
                  size={15}
                  className="text-[#C9A659]"
                />

                <span>hello@fieldhouse.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-[#3A3733]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#8F8A80]">
              © 2026 FIELDHOUSE. All rights reserved.
            </p>

            <div className="flex items-center gap-4 text-xs text-[#8F8A80]">
              <a
                href="#"
                className="hover:text-[#C9A659] transition-colors"
              >
                Privacy
              </a>

              <a
                href="#"
                className="hover:text-[#C9A659] transition-colors"
              >
                Terms
              </a>

              <a
                href="#"
                className="hover:text-[#C9A659] transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

