"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { LuChevronDown, LuMenu, LuPlus, LuUserRound } from "react-icons/lu";

const MORE_ACTIONS = [
  { label: "Add product", href: "/dash/addnewproduct", roles: ["System Admin", "Admin", "Manager"] },
  { label: "Add brand", href: "/dash/brands/createbrand", roles: ["System Admin", "Admin", "Manager"] },
  { label: "Customers", href: "/dash/customer", roles: ["System Admin", "Admin", "Warehouse Manager", "Manager", "Inventory Clerk", "Auditor"] },
  { label: "Offers", href: "/dash/offers", roles: ["System Admin", "Admin", "Warehouse Manager", "Manager", "Inventory Clerk", "Auditor"] },
  { label: "User management", href: "/dash/user", roles: ["System Admin", "Junior HR", "Assistant HR", "Senior HR"] },
  { label: "Add warehouse", href: "/dash/addnew_warehouse", roles: ["System Admin", "Admin"] },
];

const PAGE_TITLES = [
  ["/dash", "Dashboard"],
  ["/dash/products", "Products"],
  ["/dash/addnewproduct", "Add product"],
  ["/dash/stock", "Stock"],
  ["/dash/warehouse", "Warehouses"],
  ["/dash/brands", "Brands"],
  ["/dash/category", "Categories"],
  ["/dash/subcategory", "Subcategories"],
  ["/dash/order", "Orders"],
  ["/dash/create_neworder", "Create order"],
  ["/dash/procurement", "Procurement"],
  ["/dash/customer", "Customers"],
  ["/dash/report", "Reports"],
  ["/dash/profile", "My profile"],
  ["/dash/settings", "Store settings"],
  ["/dash/promotions", "Promotions"],
  ["/dash/offers", "Offers"],
  ["/dash/user", "User management"],
  ["/dash/attendencepage", "Attendance"],
  ["/dash/vat", "VAT invoices"],
];

export default function Header({ currentUser }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const moreRef = useRef(null);
  const role = currentUser?.role;
  const fullName = [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ") || "Account";
  const initials = fullName === "Account" ? "A" : fullName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  const title = useMemo(() => PAGE_TITLES.find(([path]) => path === "/dash" ? pathname === path : pathname === path || pathname.startsWith(`${path}/`))?.[1] || "Dashboard", [pathname]);
  const visibleActions = useMemo(() => MORE_ACTIONS.filter((action) => action.roles.includes(role)), [role]);

  useEffect(() => {
    Promise.resolve().then(() => setIsMoreOpen(false));
  }, [pathname]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) setIsMoreOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsMoreOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Unable to log out. Try again.");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

  return (
    <header className="z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 sm:px-6 lg:px-7" aria-label="Global Header">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}
          aria-label="Open navigation menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--theme-border)] text-[var(--theme-text)] transition hover:bg-[var(--theme-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] lg:hidden"
        >
          <LuMenu size={20} />
        </button>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold tracking-tight text-[var(--theme-text)] sm:text-lg">{title}</p>
          <p className="hidden truncate text-xs text-[var(--theme-muted)] sm:block">Workspace / {title}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {["System Admin", "Admin", "Manager", "Inventory Clerk"].includes(role) && (
          <Link href="/dash/create_neworder" className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--theme-primary)] px-3 text-sm font-semibold text-[var(--theme-primary-text)] shadow-sm transition hover:bg-[var(--theme-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-2 sm:px-4">
            <LuPlus size={17} /><span className="hidden sm:inline">Create order</span><span className="sm:hidden">Order</span>
          </Link>
        )}

        {visibleActions.length > 0 && (
          <div className="relative" ref={moreRef}>
            <button type="button" onClick={() => setIsMoreOpen((open) => !open)} aria-expanded={isMoreOpen} aria-haspopup="menu" className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 text-sm font-medium text-[var(--theme-text)] transition hover:bg-[var(--theme-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]">
              <span className="hidden sm:inline">Quick actions</span><span className="sm:hidden">More</span><LuChevronDown className={`transition-transform ${isMoreOpen ? "rotate-180" : ""}`} size={15} />
            </button>
            {isMoreOpen && <div role="menu" className="absolute right-0 top-[calc(100%+10px)] z-50 w-52 overflow-hidden rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-1.5 shadow-xl">
              {visibleActions.map((action) => <Link key={action.href} role="menuitem" href={action.href} onClick={() => setIsMoreOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-[var(--theme-text)] transition hover:bg-[var(--theme-background)] hover:text-[var(--theme-primary)]">{action.label}</Link>)}
            </div>}
          </div>
        )}

        <Link href="/dash/profile" aria-label="Open profile" className="group inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-1.5 pr-2.5 transition hover:bg-[var(--theme-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--theme-primary)]/10 text-xs font-semibold text-[var(--theme-primary)]">{initials}</span>
          <span className="hidden max-w-36 truncate text-sm font-medium text-[var(--theme-text)] md:block">{fullName}</span>
          <LuUserRound className="text-[var(--theme-muted)] md:hidden" size={16} />
        </Link>
        <button type="button" onClick={handleLogout} disabled={loggingOut} aria-label="Log out" title={loggingOut ? "Signing out…" : "Log out"} className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--theme-muted)] transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50">
          <FiLogOut size={18} />
        </button>
      </div>
    </header>
  );
}
