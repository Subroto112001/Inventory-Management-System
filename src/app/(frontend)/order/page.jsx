"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  LuSearch,
  LuUser,
  LuGitCompare,
  LuShoppingCart,
  LuHeart,
  LuChevronLeft,
  LuChevronRight,
  LuChevronDown,
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
  LuPackage,
  LuPackageCheck,
  LuClock,
  LuCircleX,
  LuReceipt,
  LuLayoutDashboard,
  LuLogOut,
  LuSettings,
  LuDownload,
  LuRepeat,
  LuCreditCard,
  LuBanknote,
  LuTrash2,
  LuPlus,
  LuPencil,
  LuCheck,
  LuStar,
  LuBell,
  LuLock,
} from "react-icons/lu";

/* =========================================================
   STATIC DATA
========================================================= */

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

const ACCOUNT_LINKS = [
  { key: "dashboard", label: "Dashboard", icon: LuLayoutDashboard },
  { key: "orders", label: "My orders", icon: LuPackage },
  { key: "wishlist", label: "Wishlist", icon: LuHeart },
  { key: "addresses", label: "Addresses", icon: LuMapPin },
  { key: "settings", label: "Account settings", icon: LuSettings },
];

const VIEW_TITLES = {
  dashboard: {
    eyebrow: "Your account",
    title: "Dashboard",
    text: "A quick look at your orders, saved items and account.",
  },
  orders: {
    eyebrow: "Your account",
    title: "My orders",
    text: "Track deliveries, download invoices and reorder your favourites.",
  },
  wishlist: {
    eyebrow: "Your account",
    title: "Wishlist",
    text: "Pieces you've saved for later.",
  },
  addresses: {
    eyebrow: "Your account",
    title: "Addresses",
    text: "Manage where your orders are delivered.",
  },
  settings: {
    eyebrow: "Your account",
    title: "Account settings",
    text: "Update your details, password and notification preferences.",
  },
};

const ACCOUNT_VIEWS = new Set(Object.keys(VIEW_TITLES));

const HOME_ADDRESS = "House 12, Road 5, Dhanmondi, Dhaka 1205, Bangladesh";

const ORDERS = [
  {
    id: "FH-10482",
    date: "Sep 24, 2026",
    status: "Processing",
    payment: "Card",
    paymentStatus: "Paid",
    shipping: 0,
    discount: 15,
    address: HOME_ADDRESS,
    tracking: null,
    estimated: "Sep 30 – Oct 2",
    items: [
      {
        name: "Alder Oak Dining Chair",
        category: "Furniture",
        price: 189,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=85",
      },
      {
        name: "Hand-Thrown Stoneware Mug Set",
        category: "Kitchen & Dining",
        price: 58,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=300&q=85",
      },
    ],
  },
  {
    id: "FH-10431",
    date: "Sep 18, 2026",
    status: "Shipped",
    payment: "Card",
    paymentStatus: "Paid",
    shipping: 0,
    discount: 0,
    address: HOME_ADDRESS,
    tracking: "BD-7781-2290-4415",
    estimated: "Sep 29 – Oct 1",
    items: [
      {
        name: "Bouclé Reading Armchair",
        category: "Furniture",
        price: 540,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=300&q=85",
      },
    ],
  },
  {
    id: "FH-10377",
    date: "Sep 6, 2026",
    status: "Delivered",
    payment: "Cash on delivery",
    paymentStatus: "Paid",
    shipping: 0,
    discount: 0,
    address: HOME_ADDRESS,
    tracking: "BD-7740-1183-0092",
    estimated: "Delivered Sep 11",
    items: [
      {
        name: "Linen Shade Table Lamp",
        category: "Lighting",
        price: 74,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=300&q=85",
      },
      {
        name: "Washed Linen Duvet Set",
        category: "Textiles & Bedding",
        price: 128,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=300&q=85",
      },
      {
        name: "Wool Felt Table Runner",
        category: "Textiles & Bedding",
        price: 36,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1583845112203-454c7a2b9b47?auto=format&fit=crop&w=300&q=85",
      },
    ],
  },
  {
    id: "FH-10298",
    date: "Aug 21, 2026",
    status: "Delivered",
    payment: "Card",
    paymentStatus: "Paid",
    shipping: 12,
    discount: 0,
    address: HOME_ADDRESS,
    tracking: "BD-7702-6634-8810",
    estimated: "Delivered Aug 26",
    items: [
      {
        name: 'Cast Iron Skillet 10"',
        category: "Kitchen & Dining",
        price: 42,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=300&q=85",
      },
    ],
  },
  {
    id: "FH-10214",
    date: "Aug 3, 2026",
    status: "Cancelled",
    payment: "Card",
    paymentStatus: "Refunded",
    shipping: 0,
    discount: 0,
    address: HOME_ADDRESS,
    tracking: null,
    estimated: "Cancelled Aug 4",
    items: [
      {
        name: "Teak Outdoor Bench",
        category: "Furniture",
        price: 320,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=300&q=85",
      },
    ],
  },
  {
    id: "FH-10156",
    date: "Jul 15, 2026",
    status: "Delivered",
    payment: "Cash on delivery",
    paymentStatus: "Paid",
    shipping: 0,
    discount: 0,
    address: HOME_ADDRESS,
    tracking: "BD-7655-9021-3376",
    estimated: "Delivered Jul 20",
    items: [
      {
        name: "Hand-Knotted Wool Rug",
        category: "Textiles & Bedding",
        price: 240,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=300&q=85",
      },
      {
        name: "Speckled Ceramic Planter",
        category: "Decor & Accents",
        price: 32,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=300&q=85",
      },
    ],
  },
];

const INITIAL_WISHLIST = [
  {
    id: "w1",
    name: "Brushed Brass Pendant Light",
    category: "Lighting",
    price: 145,
    rating: 4.7,
    reviews: 38,
    image:
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=600&q=85",
  },
  {
    id: "w2",
    name: "Linen Weave Throw Blanket",
    category: "Textiles & Bedding",
    price: 76,
    rating: 4.6,
    reviews: 51,
    image:
      "https://images.unsplash.com/photo-1600369671236-e74521d0bde6?auto=format&fit=crop&w=600&q=85",
  },
  {
    id: "w3",
    name: "Woven Rattan Ottoman",
    category: "Furniture",
    price: 165,
    oldPrice: 190,
    rating: 4.7,
    reviews: 33,
    image:
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=85",
  },
  {
    id: "w4",
    name: "Olive Wood Cutting Board",
    category: "Kitchen & Dining",
    price: 34,
    rating: 4.7,
    reviews: 88,
    image:
      "https://images.unsplash.com/photo-1608755728617-aefab37d2ab2?auto=format&fit=crop&w=600&q=85",
  },
];

const INITIAL_ADDRESSES = [
  {
    id: "a1",
    label: "Home",
    name: "Subroto Barman",
    phone: "+880 1700-000000",
    line1: "House 12, Road 5",
    line2: "Dhanmondi",
    city: "Dhaka",
    state: "Dhaka Division",
    postalCode: "1205",
    country: "Bangladesh",
    isDefault: true,
  },
  {
    id: "a2",
    label: "Office",
    name: "Subroto Barman",
    phone: "+880 1700-000000",
    line1: "Level 6, Plot 22, Gulshan Avenue",
    line2: "",
    city: "Dhaka",
    state: "Dhaka Division",
    postalCode: "1212",
    country: "Bangladesh",
    isDefault: false,
  },
];

const EMPTY_ADDRESS = {
  label: "Home",
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Bangladesh",
};

const STATUS_TABS = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_STYLES = {
  Processing: {
    icon: LuClock,
    className: "bg-[#F5ECD3] text-[#8A6A1F]",
  },
  Shipped: {
    icon: LuTruck,
    className: "bg-[#DDE8E1] text-[#1F3A2E]",
  },
  Delivered: {
    icon: LuPackageCheck,
    className: "bg-[#1F3A2E] text-[#F7F3EC]",
  },
  Cancelled: {
    icon: LuCircleX,
    className: "bg-[#F3DED5] text-[#B65C38]",
  },
};

const TRACK_STEPS = ["Placed", "Processing", "Shipped", "Delivered"];

const PERKS = [
  { icon: LuTruck, title: "Free shipping", text: "On orders over $75" },
  { icon: LuRotateCcw, title: "30-day returns", text: "No questions asked" },
  { icon: LuShieldCheck, title: "Secure checkout", text: "Encrypted payments" },
  { icon: LuHeadphones, title: "Support", text: "Mon–Fri, 9am–6pm" },
];

/* =========================================================
   HELPERS
========================================================= */

const orderSubtotal = (order) =>
  order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

const orderTotal = (order) =>
  orderSubtotal(order) + order.shipping - order.discount;

/* =========================================================
   SMALL SHARED COMPONENTS
========================================================= */

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <LuStar
          key={i}
          size={13}
          className={
            i < Math.round(rating)
              ? "fill-[#C9A659] text-[#C9A659]"
              : "fill-[#E4DED2] text-[#E4DED2]"
          }
        />
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const { icon: Icon, className } = STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-sm ${className}`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

function TrackProgress({ status }) {
  if (status === "Cancelled") return null;

  const current = status === "Processing" ? 1 : status === "Shipped" ? 2 : 3;

  return (
    <div className="flex items-center w-full max-w-lg">
      {TRACK_STEPS.map((step, i) => (
        <div
          key={step}
          className={`flex items-center ${
            i < TRACK_STEPS.length - 1 ? "flex-1" : ""
          }`}
        >
          <div className="flex flex-col items-center gap-1.5">
            <span
              className={`w-3 h-3 rounded-full ${
                i <= current ? "bg-[#1F3A2E]" : "bg-[#E4DED2]"
              }`}
            />

            <span
              className={`text-[11px] whitespace-nowrap ${
                i <= current ? "text-[#211F1D]" : "text-[#8A8378]"
              }`}
            >
              {step}
            </span>
          </div>

          {i < TRACK_STEPS.length - 1 && (
            <div
              className={`flex-1 h-px mx-2 mb-5 ${
                i < current ? "bg-[#1F3A2E]" : "bg-[#E4DED2]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
}) {
  return (
    <div>
      <label className="block text-sm text-[#211F1D] mb-1.5">
        {label}
        {required && <span className="text-[#B65C38] ml-1">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full px-3.5 py-3 bg-white border border-[#E4DED2] rounded-sm text-sm text-[#211F1D] placeholder:text-[#9B9689] outline-none focus:border-[#1F3A2E] focus:ring-1 focus:ring-[#1F3A2E]/10 transition disabled:bg-[#F7F3EC] disabled:text-[#8A8378]"
      />
    </div>
  );
}

function Toggle({ checked, onChange, label, text }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-[#E4DED2] last:border-b-0">
      <div>
        <p className="text-sm text-[#211F1D]">{label}</p>
        <p className="text-xs text-[#8A8378] mt-0.5">{text}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full shrink-0 transition-colors ${
          checked ? "bg-[#1F3A2E]" : "bg-[#E4DED2]"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </button>
    </div>
  );
}

function Panel({ title, text, children, action }) {
  return (
    <div className="bg-white border border-[#E4DED2] rounded-md p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-[#211F1D]">
            {title}
          </h2>

          {text && <p className="text-xs text-[#8A8378] mt-1">{text}</p>}
        </div>

        {action}
      </div>

      {children}
    </div>
  );
}

function EmptyState({ icon: Icon, title, text, action, onAction }) {
  return (
    <div className="bg-white border border-[#E4DED2] rounded-md py-16 px-6 text-center">
      <Icon size={32} className="mx-auto text-[#8A8378] mb-4" />

      <p className="font-serif text-2xl mb-2">{title}</p>

      <p className="text-sm text-[#8A8378] mb-6">{text}</p>

      {action && (
        <button
          type="button"
          onClick={onAction}
          className="bg-[#1F3A2E] text-[#F7F3EC] text-sm px-5 py-2.5 rounded-sm hover:bg-[#16281F] transition-colors"
        >
          {action}
        </button>
      )}
    </div>
  );
}

/* =========================================================
   ORDER CARD
========================================================= */

function OrderCard({ order, onBuyAgain }) {
  const [open, setOpen] = useState(false);

  const total = orderTotal(order);
  const PayIcon = order.payment === "Card" ? LuCreditCard : LuBanknote;

  return (
    <div className="bg-white border border-[#E4DED2] rounded-md overflow-hidden hover:border-[#C9A659] transition-colors">
      <div className="px-5 sm:px-6 py-4 bg-[#F7F3EC] border-b border-[#E4DED2] grid grid-cols-2 md:grid-cols-[1.2fr_1fr_1fr_auto] gap-4 items-center">
        <div>
          <p className="text-xs text-[#8A8378]">Order</p>
          <p className="text-sm text-[#211F1D] font-medium">#{order.id}</p>
        </div>

        <div>
          <p className="text-xs text-[#8A8378]">Placed on</p>
          <p className="text-sm text-[#211F1D]">{order.date}</p>
        </div>

        <div>
          <p className="text-xs text-[#8A8378]">Total</p>
          <p className="text-sm text-[#1F3A2E] font-medium">
            ${total.toFixed(2)}
          </p>
        </div>

        <div className="col-span-2 md:col-span-1 md:justify-self-end">
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="px-5 sm:px-6 py-5 space-y-4">
        {order.items.map((item) => (
          <div key={item.name} className="flex gap-4">
            <div className="w-20 h-20 rounded-sm overflow-hidden bg-[#F7F3EC] shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#8A8378] mb-0.5">{item.category}</p>

              <h3 className="text-sm text-[#211F1D] leading-snug">
                {item.name}
              </h3>

              <p className="text-xs text-[#8A8378] mt-1.5">
                Qty {item.quantity}
              </p>
            </div>

            <p className="text-sm text-[#211F1D] shrink-0">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="px-5 sm:px-6 pb-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-5 border-t border-[#E4DED2]">
          {order.status !== "Cancelled" ? (
            <TrackProgress status={order.status} />
          ) : (
            <p className="text-sm text-[#5B564C]">
              This order was cancelled and your payment was refunded.
            </p>
          )}

          <div className="md:text-right">
            <p className="text-xs text-[#8A8378]">
              {order.status === "Delivered" || order.status === "Cancelled"
                ? "Status"
                : "Estimated delivery"}
            </p>

            <p className="text-sm text-[#211F1D]">{order.estimated}</p>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-6 py-4 border-t border-[#E4DED2] flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex items-center gap-1.5 text-sm text-[#1F3A2E] border-b border-[#1F3A2E] pb-0.5 hover:text-[#B65C38] hover:border-[#B65C38] transition-colors"
        >
          {open ? "Hide details" : "View details"}

          <LuChevronDown
            size={15}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        <div className="ml-auto flex flex-wrap gap-2">
          {order.tracking && order.status === "Shipped" && (
            <button
              type="button"
              className="flex items-center gap-2 bg-[#1F3A2E] text-[#F7F3EC] text-sm px-4 py-2 rounded-sm hover:bg-[#16281F] transition-colors"
            >
              <LuTruck size={15} />
              Track package
            </button>
          )}

          {order.status === "Processing" && (
            <button
              type="button"
              className="text-sm px-4 py-2 rounded-sm border border-[#E4DED2] text-[#211F1D] hover:border-[#B65C38] hover:text-[#B65C38] transition-colors"
            >
              Cancel order
            </button>
          )}

          {(order.status === "Delivered" || order.status === "Cancelled") && (
            <button
              type="button"
              onClick={() => onBuyAgain(order)}
              className="flex items-center gap-2 bg-[#1F3A2E] text-[#F7F3EC] text-sm px-4 py-2 rounded-sm hover:bg-[#16281F] transition-colors"
            >
              <LuRepeat size={15} />
              Buy again
            </button>
          )}

          {order.status === "Delivered" && (
            <button
              type="button"
              className="text-sm px-4 py-2 rounded-sm border border-[#E4DED2] text-[#211F1D] hover:border-[#1F3A2E] transition-colors"
            >
              Write a review
            </button>
          )}

          {order.status !== "Cancelled" && (
            <button
              type="button"
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-sm border border-[#E4DED2] text-[#211F1D] hover:border-[#1F3A2E] transition-colors"
            >
              <LuDownload size={15} />
              Invoice
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="px-5 sm:px-6 py-6 border-t border-[#E4DED2] bg-[#F7F3EC] grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm text-[#211F1D] font-medium mb-2 flex items-center gap-2">
              <LuMapPin size={15} className="text-[#1F3A2E]" />
              Shipping address
            </h4>

            <p className="text-sm text-[#5B564C] leading-relaxed">
              {order.address}
            </p>

            {order.tracking && (
              <p className="text-xs text-[#8A8378] mt-3">
                Tracking no.{" "}
                <span className="text-[#211F1D]">{order.tracking}</span>
              </p>
            )}
          </div>

          <div>
            <h4 className="text-sm text-[#211F1D] font-medium mb-2 flex items-center gap-2">
              <PayIcon size={15} className="text-[#1F3A2E]" />
              Payment
            </h4>

            <p className="text-sm text-[#5B564C]">{order.payment}</p>

            <p className="text-xs text-[#8A8378] mt-1">{order.paymentStatus}</p>
          </div>

          <div>
            <h4 className="text-sm text-[#211F1D] font-medium mb-2 flex items-center gap-2">
              <LuReceipt size={15} className="text-[#1F3A2E]" />
              Summary
            </h4>

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#5B564C]">Subtotal</span>
                <span>${orderSubtotal(order).toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5B564C]">Shipping</span>
                <span>
                  {order.shipping === 0
                    ? "FREE"
                    : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-[#1F3A2E]">
                  <span>Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-[#E4DED2] pt-2 mt-2">
                <span className="font-serif text-base">Total</span>
                <span className="font-serif text-base text-[#1F3A2E]">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   VIEW: DASHBOARD
========================================================= */

function DashboardView({
  profile,
  orders,
  wishlist,
  addresses,
  goTo,
  onAddToCart,
}) {
  const totalSpent = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + orderTotal(o), 0);

  const inProgress = orders.filter(
    (o) => o.status === "Processing" || o.status === "Shipped",
  );

  const delivered = orders.filter((o) => o.status === "Delivered").length;

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  const recent = orders.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-[#1F3A2E] rounded-md px-6 sm:px-8 py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F7F3EC]">
            Welcome back, {profile.firstName}
          </h2>

          <p className="text-sm text-[#F7F3EC]/80 mt-1.5">
            {inProgress.length > 0
              ? `You have ${inProgress.length} order${
                  inProgress.length > 1 ? "s" : ""
                } on the way.`
              : "You have no orders in progress."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => goTo("orders")}
          className="bg-[#C9A659] text-[#211F1D] text-sm px-5 py-2.5 rounded-sm hover:bg-[#B08D3E] transition-colors self-start sm:self-auto"
        >
          View all orders
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total orders", value: orders.length, icon: LuPackage },
          { label: "In progress", value: inProgress.length, icon: LuTruck },
          { label: "Delivered", value: delivered, icon: LuPackageCheck },
          {
            label: "Total spent",
            value: `$${totalSpent.toFixed(0)}`,
            icon: LuReceipt,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-white border border-[#E4DED2] rounded-md p-4 flex items-start justify-between"
          >
            <div>
              <p className="text-xs text-[#8A8378]">{label}</p>

              <p className="font-serif text-2xl text-[#1F3A2E] mt-1">{value}</p>
            </div>

            <Icon size={18} className="text-[#8A8378]" />
          </div>
        ))}
      </div>

      {/* Active shipments */}
      {inProgress.length > 0 && (
        <Panel title="Orders on the way">
          <div className="space-y-6">
            {inProgress.map((order) => (
              <div
                key={order.id}
                className="border border-[#E4DED2] rounded-sm p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div>
                    <p className="text-sm text-[#211F1D] font-medium">
                      #{order.id}
                    </p>

                    <p className="text-xs text-[#8A8378] mt-0.5">
                      Estimated delivery {order.estimated}
                    </p>
                  </div>

                  <StatusBadge status={order.status} />
                </div>

                <TrackProgress status={order.status} />
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* Recent orders */}
      <Panel
        title="Recent orders"
        action={
          <button
            type="button"
            onClick={() => goTo("orders")}
            className="text-sm text-[#1F3A2E] border-b border-[#1F3A2E] pb-0.5 hover:text-[#B65C38] hover:border-[#B65C38] transition-colors whitespace-nowrap"
          >
            View all
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="text-left text-xs text-[#8A8378] border-b border-[#E4DED2]">
                <th className="font-normal pb-3">Order</th>
                <th className="font-normal pb-3">Date</th>
                <th className="font-normal pb-3">Status</th>
                <th className="font-normal pb-3 text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {recent.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[#E4DED2] last:border-b-0"
                >
                  <td className="py-3.5 text-[#211F1D]">#{order.id}</td>
                  <td className="py-3.5 text-[#5B564C]">{order.date}</td>
                  <td className="py-3.5">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-3.5 text-right text-[#1F3A2E]">
                    ${orderTotal(order).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Default address */}
        <Panel
          title="Default address"
          action={
            <button
              type="button"
              onClick={() => goTo("addresses")}
              className="text-sm text-[#1F3A2E] border-b border-[#1F3A2E] pb-0.5 hover:text-[#B65C38] hover:border-[#B65C38] transition-colors"
            >
              Manage
            </button>
          }
        >
          {defaultAddress ? (
            <div className="flex gap-3">
              <LuMapPin size={18} className="text-[#1F3A2E] mt-0.5 shrink-0" />

              <div className="text-sm text-[#5B564C] leading-relaxed">
                <p className="text-[#211F1D]">{defaultAddress.name}</p>
                <p>
                  {defaultAddress.line1}
                  {defaultAddress.line2 ? `, ${defaultAddress.line2}` : ""}
                </p>
                <p>
                  {defaultAddress.city}, {defaultAddress.state}{" "}
                  {defaultAddress.postalCode}
                </p>
                <p>{defaultAddress.country}</p>
                <p className="mt-1">{defaultAddress.phone}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#8A8378]">
              You haven't saved an address yet.
            </p>
          )}
        </Panel>

        {/* Account details */}
        <Panel
          title="Account details"
          action={
            <button
              type="button"
              onClick={() => goTo("settings")}
              className="text-sm text-[#1F3A2E] border-b border-[#1F3A2E] pb-0.5 hover:text-[#B65C38] hover:border-[#B65C38] transition-colors"
            >
              Edit
            </button>
          }
        >
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <LuUser size={17} className="text-[#1F3A2E]" />
              <span className="text-[#211F1D]">
                {profile.firstName} {profile.lastName}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <LuMail size={17} className="text-[#1F3A2E]" />
              <span className="text-[#5B564C]">{profile.email}</span>
            </div>

            <div className="flex items-center gap-3">
              <LuPhone size={17} className="text-[#1F3A2E]" />
              <span className="text-[#5B564C]">{profile.phone}</span>
            </div>
          </div>
        </Panel>
      </div>

      {/* Wishlist preview */}
      <Panel
        title="Saved for later"
        action={
          <button
            type="button"
            onClick={() => goTo("wishlist")}
            className="text-sm text-[#1F3A2E] border-b border-[#1F3A2E] pb-0.5 hover:text-[#B65C38] hover:border-[#B65C38] transition-colors whitespace-nowrap"
          >
            View wishlist
          </button>
        }
      >
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {wishlist.slice(0, 4).map((item) => (
              <div key={item.id} className="group">
                <div className="aspect-square rounded-sm overflow-hidden bg-[#F7F3EC] mb-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                  />
                </div>

                <p className="text-sm text-[#211F1D] leading-snug line-clamp-1">
                  {item.name}
                </p>

                <p className="text-sm text-[#1F3A2E] mt-0.5">${item.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#8A8378]">Your wishlist is empty.</p>
        )}
      </Panel>
    </div>
  );
}

/* =========================================================
   VIEW: ORDERS
========================================================= */

function OrdersView({ orders, onBuyAgain }) {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Newest first");
  const [page, setPage] = useState(1);

  const ordersPerPage = 4;

  const counts = useMemo(() => {
    const c = { All: orders.length };
    orders.forEach((o) => {
      c[o.status] = (c[o.status] || 0) + 1;
    });
    return c;
  }, [orders]);

  const totalSpent = useMemo(
    () =>
      orders
        .filter((o) => o.status !== "Cancelled")
        .reduce((sum, o) => sum + orderTotal(o), 0),
    [orders],
  );

  const filtered = useMemo(() => {
    let result = [...orders];

    if (activeTab !== "All") {
      result = result.filter((o) => o.status === activeTab);
    }

    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.items.some((i) => i.name.toLowerCase().includes(q)),
      );
    }

    if (sort === "Oldest first") result.reverse();
    if (sort === "Total: High to Low")
      result.sort((a, b) => orderTotal(b) - orderTotal(a));
    if (sort === "Total: Low to High")
      result.sort((a, b) => orderTotal(a) - orderTotal(b));

    return result;
  }, [orders, activeTab, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ordersPerPage));

  const visible = filtered.slice(
    (page - 1) * ordersPerPage,
    page * ordersPerPage,
  );

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total orders", value: orders.length },
          {
            label: "In progress",
            value: (counts.Processing || 0) + (counts.Shipped || 0),
          },
          { label: "Delivered", value: counts.Delivered || 0 },
          { label: "Total spent", value: `$${totalSpent.toFixed(0)}` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-[#E4DED2] rounded-md p-4"
          >
            <p className="text-xs text-[#8A8378]">{stat.label}</p>

            <p className="font-serif text-2xl text-[#1F3A2E] mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E4DED2] rounded-md p-4 mb-5 space-y-4">
        <div className="flex overflow-x-auto gap-2 -mx-1 px-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              className={`text-sm px-4 py-1.5 rounded-sm border whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-[#1F3A2E] border-[#1F3A2E] text-[#F7F3EC]"
                  : "border-[#E4DED2] text-[#211F1D] hover:border-[#1F3A2E]"
              }`}
            >
              {tab}{" "}
              <span
                className={
                  activeTab === tab ? "text-[#F7F3EC]/70" : "text-[#8A8378]"
                }
              >
                {counts[tab] || 0}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <LuSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8378]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by order number or product"
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E4DED2] rounded-sm text-sm outline-none focus:border-[#1F3A2E] placeholder:text-[#8A8378]"
            />
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="appearance-none w-full sm:w-auto border border-[#E4DED2] rounded-sm bg-white text-sm px-4 py-2.5 pr-9 outline-none cursor-pointer focus:border-[#1F3A2E]"
            >
              <option>Newest first</option>
              <option>Oldest first</option>
              <option>Total: High to Low</option>
              <option>Total: Low to High</option>
            </select>

            <LuChevronDown
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#8A8378]"
            />
          </div>
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="space-y-5">
          {visible.map((order) => (
            <OrderCard key={order.id} order={order} onBuyAgain={onBuyAgain} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={LuPackage}
          title="No orders found"
          text="Try a different status or search term, or start shopping."
          action="Shop all products"
        />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-10">
          <button
            type="button"
            aria-label="Previous page"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="w-9 h-9 border border-[#E4DED2] rounded-md bg-white flex items-center justify-center disabled:opacity-40"
          >
            <LuChevronLeft size={17} />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-md text-sm ${
                page === i + 1
                  ? "bg-[#1F3A2E] text-white"
                  : "bg-white border border-[#E4DED2] hover:border-[#1F3A2E]"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            type="button"
            aria-label="Next page"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="w-9 h-9 border border-[#E4DED2] rounded-md bg-white flex items-center justify-center disabled:opacity-40"
          >
            <LuChevronRight size={17} />
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   VIEW: WISHLIST
========================================================= */

function WishlistView({ wishlist, onRemove, onAddToCart, onAddAll, goShop }) {
  if (wishlist.length === 0) {
    return (
      <EmptyState
        icon={LuHeart}
        title="Your wishlist is empty"
        text="Tap the heart on any product to save it here for later."
        action="Start shopping"
        onAction={goShop}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5">
        <p className="text-sm text-[#8A8378]">
          <span className="text-[#211F1D] font-medium">{wishlist.length}</span>{" "}
          saved {wishlist.length === 1 ? "item" : "items"}
        </p>

        <button
          type="button"
          onClick={onAddAll}
          className="flex items-center gap-2 bg-[#1F3A2E] text-[#F7F3EC] text-sm px-4 py-2 rounded-sm hover:bg-[#16281F] transition-colors"
        >
          <LuShoppingCart size={15} />
          Add all to cart
        </button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="group bg-white border border-[#E4DED2] rounded-md overflow-hidden hover:shadow-md hover:border-[#C9A659] transition-all duration-200"
          >
            <div className="relative aspect-square overflow-hidden bg-[#F7F3EC]">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
              />

              <button
                type="button"
                onClick={() => onRemove(item.id)}
                aria-label={`Remove ${item.name} from wishlist`}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center text-[#B65C38] hover:bg-white"
              >
                <LuHeart size={15} className="fill-[#B65C38]" />
              </button>
            </div>

            <div className="p-4">
              <p className="text-xs text-[#8A8378] mb-1">{item.category}</p>

              <h3 className="text-sm text-[#211F1D] leading-snug mb-1.5 line-clamp-2 min-h-[40px]">
                {item.name}
              </h3>

              <div className="flex items-center gap-1.5 mb-2">
                <Stars rating={item.rating} />

                <span className="text-xs text-[#8A8378]">({item.reviews})</span>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-[#1F3A2E] text-base">${item.price}</span>

                {item.oldPrice && (
                  <span className="text-xs text-[#8A8378] line-through">
                    ${item.oldPrice}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onAddToCart(item)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#211F1D] text-[#F7F3EC] text-sm py-2 rounded-sm hover:bg-[#1F3A2E] transition-colors"
                >
                  <LuShoppingCart size={14} />
                  Add to cart
                </button>

                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  aria-label="Remove"
                  className="w-9 border border-[#E4DED2] rounded-sm flex items-center justify-center text-[#5B564C] hover:border-[#B65C38] hover:text-[#B65C38] transition-colors"
                >
                  <LuTrash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   VIEW: ADDRESSES
========================================================= */

function AddressesView({ addresses, onSave, onDelete, onSetDefault }) {
  const [editing, setEditing] = useState(null); // null | "new" | id
  const [form, setForm] = useState(EMPTY_ADDRESS);

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const startNew = () => {
    setForm(EMPTY_ADDRESS);
    setEditing("new");
  };

  const startEdit = (address) => {
    setForm({ ...address });
    setEditing(address.id);
  };

  const cancel = () => {
    setEditing(null);
    setForm(EMPTY_ADDRESS);
  };

  const submit = (e) => {
    e.preventDefault();
    onSave(editing, form);
    cancel();
  };

  return (
    <div className="space-y-6">
      {editing === null && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={startNew}
            className="flex items-center gap-2 bg-[#1F3A2E] text-[#F7F3EC] text-sm px-4 py-2.5 rounded-sm hover:bg-[#16281F] transition-colors"
          >
            <LuPlus size={16} />
            Add new address
          </button>
        </div>
      )}

      {editing !== null && (
        <form onSubmit={submit}>
          <Panel title={editing === "new" ? "New address" : "Edit address"}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#211F1D] mb-1.5">
                  Address label
                </label>

                <div className="flex gap-2">
                  {["Home", "Office", "Other"].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => update("label", label)}
                      className={`flex-1 text-sm py-2.5 rounded-sm border transition-colors ${
                        form.label === label
                          ? "bg-[#1F3A2E] border-[#1F3A2E] text-[#F7F3EC]"
                          : "border-[#E4DED2] text-[#211F1D] hover:border-[#1F3A2E]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <Field
                label="Full name"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Full name"
              />

              <Field
                label="Phone number"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+880 1XXXXXXXXX"
              />

              <Field
                label="Street address"
                required
                value={form.line1}
                onChange={(e) => update("line1", e.target.value)}
                placeholder="House, road"
              />

              <Field
                label="Area / apartment"
                value={form.line2}
                onChange={(e) => update("line2", e.target.value)}
                placeholder="Area, apartment, suite (optional)"
              />

              <Field
                label="City"
                required
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="City"
              />

              <Field
                label="State / Province"
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                placeholder="State / Province"
              />

              <Field
                label="Postal code"
                required
                value={form.postalCode}
                onChange={(e) => update("postalCode", e.target.value)}
                placeholder="Postal code"
              />

              <Field
                label="Country"
                required
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                placeholder="Country"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="bg-[#1F3A2E] text-[#F7F3EC] text-sm px-5 py-2.5 rounded-sm hover:bg-[#16281F] transition-colors"
              >
                Save address
              </button>

              <button
                type="button"
                onClick={cancel}
                className="text-sm px-5 py-2.5 rounded-sm border border-[#E4DED2] text-[#211F1D] hover:border-[#1F3A2E] transition-colors"
              >
                Cancel
              </button>
            </div>
          </Panel>
        </form>
      )}

      {addresses.length === 0 && editing === null ? (
        <EmptyState
          icon={LuMapPin}
          title="No saved addresses"
          text="Add an address to speed up checkout."
          action="Add new address"
          onAction={startNew}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white border rounded-md p-5 flex flex-col ${
                address.isDefault ? "border-[#1F3A2E]" : "border-[#E4DED2]"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <LuMapPin size={17} className="text-[#1F3A2E]" />

                  <span className="text-sm text-[#211F1D] font-medium">
                    {address.label}
                  </span>
                </div>

                {address.isDefault && (
                  <span className="text-xs px-2 py-1 rounded-sm bg-[#1F3A2E] text-[#F7F3EC]">
                    Default
                  </span>
                )}
              </div>

              <div className="text-sm text-[#5B564C] leading-relaxed flex-1">
                <p className="text-[#211F1D]">{address.name}</p>

                <p>
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}
                </p>

                <p>
                  {address.city}
                  {address.state ? `, ${address.state}` : ""}{" "}
                  {address.postalCode}
                </p>

                <p>{address.country}</p>

                <p className="mt-1">{address.phone}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-[#E4DED2]">
                <button
                  type="button"
                  onClick={() => startEdit(address)}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-sm border border-[#E4DED2] text-[#211F1D] hover:border-[#1F3A2E] transition-colors"
                >
                  <LuPencil size={14} />
                  Edit
                </button>

                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => onSetDefault(address.id)}
                    className="text-sm px-3 py-1.5 rounded-sm border border-[#E4DED2] text-[#211F1D] hover:border-[#1F3A2E] transition-colors"
                  >
                    Set as default
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onDelete(address.id)}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-sm text-[#B65C38] hover:bg-[#F3DED5] transition-colors ml-auto"
                >
                  <LuTrash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// account  settings

function SettingsView({ profile, onSaveProfile, onToast }) {
  const [details, setDetails] = useState(profile);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [prefs, setPrefs] = useState({
    orderUpdates: true,
    offers: false,
    restocks: true,
    newsletter: true,
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const saveDetails = (e) => {
    e.preventDefault();
    onSaveProfile(details);
    onToast("Account details saved");
  };

  const savePassword = (e) => {
    e.preventDefault();

    if (passwords.next.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (passwords.next !== passwords.confirm) {
      setPasswordError("New password and confirmation don't match.");
      return;
    }

    setPasswordError("");
    setPasswords({ current: "", next: "", confirm: "" });
    onToast("Password updated");
  };

  return (
    <div className="space-y-6">
      {/* Personal details */}
      <form onSubmit={saveDetails}>
        <Panel
          title="Personal details"
          text="This information is used for your orders and receipts."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="First name"
              required
              value={details.firstName}
              onChange={(e) =>
                setDetails({ ...details, firstName: e.target.value })
              }
            />

            <Field
              label="Last name"
              required
              value={details.lastName}
              onChange={(e) =>
                setDetails({ ...details, lastName: e.target.value })
              }
            />

            <Field
              label="Email address"
              type="email"
              required
              value={details.email}
              onChange={(e) =>
                setDetails({ ...details, email: e.target.value })
              }
            />

            <Field
              label="Phone number"
              type="tel"
              value={details.phone}
              onChange={(e) =>
                setDetails({ ...details, phone: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="mt-6 bg-[#1F3A2E] text-[#F7F3EC] text-sm px-5 py-2.5 rounded-sm hover:bg-[#16281F] transition-colors"
          >
            Save changes
          </button>
        </Panel>
      </form>

      {/* Password */}
      <form onSubmit={savePassword}>
        <Panel title="Change password" text="Use at least 8 characters.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field
                label="Current password"
                type="password"
                required
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
              />
            </div>

            <Field
              label="New password"
              type="password"
              required
              value={passwords.next}
              onChange={(e) =>
                setPasswords({ ...passwords, next: e.target.value })
              }
            />

            <Field
              label="Confirm new password"
              type="password"
              required
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
            />
          </div>

          {passwordError && (
            <p className="text-sm text-[#B65C38] mt-4" role="alert">
              {passwordError}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 flex items-center gap-2 bg-[#1F3A2E] text-[#F7F3EC] text-sm px-5 py-2.5 rounded-sm hover:bg-[#16281F] transition-colors"
          >
            <LuLock size={15} />
            Update password
          </button>
        </Panel>
      </form>

      {/* Notifications */}
      <Panel
        title="Notifications"
        text="Choose which emails you'd like to receive."
      >
        <Toggle
          label="Order updates"
          text="Confirmation, shipping and delivery emails."
          checked={prefs.orderUpdates}
          onChange={(v) => setPrefs({ ...prefs, orderUpdates: v })}
        />

        <Toggle
          label="Restock alerts"
          text="Get notified when saved items are back in stock."
          checked={prefs.restocks}
          onChange={(v) => setPrefs({ ...prefs, restocks: v })}
        />

        <Toggle
          label="Offers and sales"
          text="Occasional emails about promotions."
          checked={prefs.offers}
          onChange={(v) => setPrefs({ ...prefs, offers: v })}
        />

        <Toggle
          label="Weekly newsletter"
          text="One email a week with new arrivals."
          checked={prefs.newsletter}
          onChange={(v) => setPrefs({ ...prefs, newsletter: v })}
        />

        <button
          type="button"
          onClick={() => onToast("Notification preferences saved")}
          className="mt-5 flex items-center gap-2 border border-[#E4DED2] text-[#211F1D] text-sm px-5 py-2.5 rounded-sm hover:border-[#1F3A2E] transition-colors"
        >
          <LuBell size={15} />
          Save preferences
        </button>
      </Panel>

      {/* Delete */}
      <Panel
        title="Delete account"
        text="This permanently removes your account, saved addresses and wishlist."
      >
        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="text-sm px-5 py-2.5 rounded-sm border border-[#B65C38] text-[#B65C38] hover:bg-[#B65C38] hover:text-white transition-colors"
          >
            Delete my account
          </button>
        ) : (
          <div className="bg-[#F3DED5] rounded-sm p-4">
            <p className="text-sm text-[#211F1D] mb-4">
              Are you sure? This can't be undone.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setConfirmDelete(false);
                  onToast("Account deletion requested");
                }}
                className="text-sm px-4 py-2 rounded-sm bg-[#B65C38] text-white hover:bg-[#9E4D2E] transition-colors"
              >
                Yes, delete account
              </button>

              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-sm px-4 py-2 rounded-sm border border-[#E4DED2] bg-white text-[#211F1D] hover:border-[#1F3A2E] transition-colors"
              >
                Keep account
              </button>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}

// account page content function

function AccountPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollerRef = useRef(null);

  const requestedView = searchParams.get("view");
  const view = ACCOUNT_VIEWS.has(requestedView) ? requestedView : "orders";
  const [cartCount, setCartCount] = useState(3);
  const [wishlist, setWishlist] = useState(INITIAL_WISHLIST);
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [profile, setProfile] = useState({
    firstName: "Subroto",
    lastName: "Barman",
    email: "you@example.com",
    phone: "+880 1700-000000",
  });
  const [toast, setToast] = useState("");

  const scrollNav = (dir) => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({
        left: dir * 220,
        behavior: "smooth",
      });
    }
  };

  const showToast = (message) => {
    setToast(message);
  };

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(id);
  }, [toast]);

  const goTo = (next) => {
    setMobileOpen(false);
    router.push(`/order?view=${next}`, { scroll: false });

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /* Cart */
  const addToCart = (item) => {
    setCartCount((c) => c + 1);
    showToast(`${item.name} added to cart`);
  };

  const buyAgain = (order) => {
    const qty = order.items.reduce((s, i) => s + i.quantity, 0);
    setCartCount((c) => c + qty);
    showToast(
      `${qty} item${qty > 1 ? "s" : ""} from #${order.id} added to cart`,
    );
  };

  /* Wishlist */
  const removeFromWishlist = (id) => {
    setWishlist((list) => list.filter((i) => i.id !== id));
    showToast("Removed from wishlist");
  };

  const addAllToCart = () => {
    setCartCount((c) => c + wishlist.length);
    showToast(`${wishlist.length} items added to cart`);
  };

  /* Addresses */
  const saveAddress = (id, data) => {
    if (id === "new") {
      setAddresses((list) => {
        const isFirst = list.length === 0;
        return [...list, { ...data, id: `a${Date.now()}`, isDefault: isFirst }];
      });
      showToast("Address added");
    } else {
      setAddresses((list) =>
        list.map((a) => (a.id === id ? { ...a, ...data } : a)),
      );
      showToast("Address updated");
    }
  };

  const deleteAddress = (id) => {
    setAddresses((list) => {
      const remaining = list.filter((a) => a.id !== id);

      if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
        remaining[0] = { ...remaining[0], isDefault: true };
      }

      return remaining;
    });
    showToast("Address deleted");
  };

  const setDefaultAddress = (id) => {
    setAddresses((list) => list.map((a) => ({ ...a, isDefault: a.id === id })));
    showToast("Default address updated");
  };

  const heading = VIEW_TITLES[view];

  return (
    <div className="min-h-screen bg-[#F7F3EC] font-sans text-[#211F1D]">
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

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-[#211F1D] text-[#F7F3EC] text-sm px-5 py-3 rounded-md shadow-lg flex items-center gap-2"
        >
          <LuCheck size={16} className="text-[#C9A659]" />
          {toast}
        </div>
      )}

      <main>
        <section className="border-b border-[#E4DED2]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-2 text-xs text-[#8A8378]">
              <a href="#" className="hover:text-[#B65C38] transition-colors">
                Home
              </a>

              <LuChevronRight size={13} />

              <button
                type="button"
                onClick={() => goTo("dashboard")}
                className="hover:text-[#B65C38] transition-colors"
              >
                Account
              </button>

              <LuChevronRight size={13} />

              <span className="text-[#211F1D]">{heading.title}</span>
            </div>
          </div>
        </section>

        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
          <p className="text-sm text-[#B65C38] mb-1">{heading.eyebrow}</p>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#211F1D]">
            {heading.title}
          </h1>

          <p className="text-sm text-[#8A8378] mt-2 max-w-xl">{heading.text}</p>
        </section>

        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)] gap-8">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-40 h-fit">
              <div className="bg-white border border-[#E4DED2] rounded-md overflow-hidden">
                <div className="p-5 flex items-center gap-3 border-b border-[#E4DED2]">
                  <span className="w-11 h-11 rounded-full bg-[#1F3A2E] text-[#F7F3EC] flex items-center justify-center font-serif text-lg">
                    {profile.firstName.charAt(0).toUpperCase()}
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm text-[#211F1D] truncate">
                      {profile.firstName} {profile.lastName}
                    </p>

                    <p className="text-xs text-[#8A8378] truncate">
                      {profile.email}
                    </p>
                  </div>
                </div>

                <nav className="p-2 flex lg:block overflow-x-auto gap-1">
                  {ACCOUNT_LINKS.map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => goTo(key)}
                      aria-current={view === key ? "page" : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors whitespace-nowrap lg:w-full text-left ${
                        view === key
                          ? "bg-[#F7F3EC] text-[#1F3A2E] font-medium"
                          : "text-[#5B564C] hover:text-[#B65C38]"
                      }`}
                    >
                      <Icon size={17} />
                      {label}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-[#5B564C] hover:text-[#B65C38] transition-colors whitespace-nowrap lg:w-full text-left"
                  >
                    <LuLogOut size={17} />
                    Sign out
                  </button>
                </nav>
              </div>

              <div className="hidden lg:block mt-4 bg-[#EFE9DC] rounded-md p-5">
                <p className="text-sm text-[#211F1D]">
                  Need help with an order?
                </p>

                <p className="text-xs text-[#5B564C] leading-relaxed mt-1">
                  Our support team is available Mon–Fri, 9am–6pm.
                </p>

                <a
                  href="#"
                  className="inline-block text-sm text-[#1F3A2E] border-b border-[#1F3A2E] pb-0.5 mt-3 hover:text-[#B65C38] hover:border-[#B65C38] transition-colors"
                >
                  Contact support
                </a>
              </div>
            </aside>

            {/* Content */}
            <div className="min-w-0">
              {view === "dashboard" && (
                <DashboardView
                  profile={profile}
                  orders={ORDERS}
                  wishlist={wishlist}
                  addresses={addresses}
                  goTo={goTo}
                  onAddToCart={addToCart}
                />
              )}

              {view === "orders" && (
                <OrdersView orders={ORDERS} onBuyAgain={buyAgain} />
              )}

              {view === "wishlist" && (
                <WishlistView
                  wishlist={wishlist}
                  onRemove={removeFromWishlist}
                  onAddToCart={addToCart}
                  onAddAll={addAllToCart}
                  goShop={() => {}}
                />
              )}

              {view === "addresses" && (
                <AddressesView
                  addresses={addresses}
                  onSave={saveAddress}
                  onDelete={deleteAddress}
                  onSetDefault={setDefaultAddress}
                />
              )}

              {view === "settings" && (
                <SettingsView
                  profile={profile}
                  onSaveProfile={setProfile}
                  onToast={showToast}
                />
              )}
            </div>
          </div>
        </section>

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

export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountPageContent />
    </Suspense>
  );
}
