"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BiCategory, BiPurchaseTagAlt, BiSolidOffer } from "react-icons/bi";
import { CgShutterstock } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa";
import { FaClipboardUser } from "react-icons/fa6";
import { HiOutlineDocumentReport } from "react-icons/hi";
import {
  LuBuilding2,
  LuCar,
  LuChevronLeft,
  LuLayoutDashboard,
  LuChevronDown,
  LuClipboardList,
  LuSettings2,
  LuMenu,
  LuSearch,
  LuSparkles,
  LuX,
} from "react-icons/lu";
import {
  MdLocalOffer,
  MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import { PiWarehouse } from "react-icons/pi";
import { TbBrandBumble } from "react-icons/tb";
import { VscGraph } from "react-icons/vsc";

const STORAGE_KEY = "sidebar-collapsed";
const DESKTOP_QUERY = "(min-width: 1024px)"; // Tailwind "lg"

/**
 * Menu is grouped so the list is easier to scan.
 * Entries follow the dashboard API's current role access rules.
 */
const MENU_GROUPS = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", icon: <LuLayoutDashboard />, link: "/dash" },
      {
        name: "Reports",
        icon: <HiOutlineDocumentReport />,
        link: "/dash/report",
        allowedRoles: ["System Admin", "Admin", "Warehouse Manager", "Manager", "Auditor", "Senior HR"],
      },
    ],
  },
  {
    title: "Inventory",
    items: [
      {
        name: "Products",
        icon: <MdOutlineProductionQuantityLimits />,
        link: "/dash/products",
        allowedRoles: ["System Admin", "Admin", "Warehouse Manager", "Manager", "Inventory Clerk", "Forklift Operator", "Auditor"],
      },
      { name: "Upcoming products", icon: <LuSparkles />, link: "/dash/upcoming-products", allowedRoles: ["System Admin", "Admin", "Manager"] },
      { name: "Stock", icon: <CgShutterstock />, link: "/dash/stock", allowedRoles: ["System Admin", "Admin", "Warehouse Manager", "Manager", "Inventory Clerk", "Forklift Operator", "Auditor"] },
      { name: "Warehouses", icon: <PiWarehouse />, link: "/dash/warehouse", allowedRoles: ["System Admin", "Admin", "Warehouse Manager", "Manager", "Inventory Clerk", "Forklift Operator", "Auditor"] },
      { name: "Brands", icon: <TbBrandBumble />, link: "/dash/brands", allowedRoles: ["System Admin", "Admin", "Warehouse Manager", "Manager", "Inventory Clerk", "Auditor"] },
      { name: "Categories", icon: <BiCategory />, link: "/dash/category", allowedRoles: ["System Admin", "Admin", "Warehouse Manager", "Manager", "Inventory Clerk", "Auditor"] },
      { name: "Subcategories", icon: <BiCategory />, link: "/dash/subcategory", allowedRoles: ["System Admin", "Admin", "Warehouse Manager", "Manager", "Inventory Clerk", "Auditor"] },
    ],
  },
  {
    title: "Sales and purchasing",
    items: [
      { name: "Orders", icon: <BiPurchaseTagAlt />, link: "/dash/order", allowedRoles: ["System Admin", "Admin", "Warehouse Manager", "Manager", "Inventory Clerk", "Auditor"] },
      { name: "Pre-orders", icon: <BiPurchaseTagAlt />, link: "/dash/preorders", allowedRoles: ["System Admin", "Admin", "Warehouse Manager", "Manager", "Inventory Clerk", "Auditor"] },
      { name: "Create order", icon: <VscGraph />, link: "/dash/create_neworder", allowedRoles: ["System Admin", "Admin", "Manager", "Inventory Clerk"] },
      { name: "Procurement (PO)", icon: <LuCar />, link: "/dash/procurement", allowedRoles: ["System Admin", "Admin", "Manager"] },
      { name: "Promotions", icon: <BiSolidOffer />, link: "/dash/promotions", allowedRoles: ["System Admin", "Admin", "Warehouse Manager", "Manager", "Inventory Clerk", "Auditor"] },
      { name: "Offers", icon: <MdLocalOffer />, link: "/dash/offers", allowedRoles: ["System Admin", "Admin", "Warehouse Manager", "Manager", "Inventory Clerk", "Auditor"] },
      { name: "VAT invoices", icon: <LuClipboardList />, link: "/dash/vat", allowedRoles: ["System Admin", "Admin", "Manager"] },
      {
        name: "Homepage sliders",
        icon: <LuLayoutDashboard />,
        link: "/dash/homepage-sliders",
        allowedRoles: ["Admin", "System Admin", "Manager"],
      },
      {
        name: "Exclusive products",
        icon: <MdLocalOffer />,
        link: "/dash/exclusive-products",
        allowedRoles: ["Admin", "System Admin", "Manager"],
      },
      {
        name: "Special offer banner",
        icon: <LuSparkles />,
        link: "/dash/special-offer-banner",
        allowedRoles: ["Admin", "System Admin", "Manager"],
      },
    ],
  },
  {
    title: "People",
    items: [
      { name: "Customers", icon: <FaClipboardUser />, link: "/dash/customer", allowedRoles: ["System Admin", "Admin", "Warehouse Manager", "Manager", "Inventory Clerk", "Auditor"] },
      { name: "Attendance", icon: <FaClipboardUser />, link: "/dash/attendencepage", allowedRoles: ["System Admin", "Admin", "Manager", "Junior HR", "Assistant HR", "Senior HR"] },
      {
        name: "Users",
        icon: <FaRegUser />,
        link: "/dash/user",
        allowedRoles: ["System Admin", "Junior HR", "Assistant HR", "Senior HR"],
      },
    ],
  },
];

const UTILITY_LINKS = [
  { name: "My profile", icon: <FaRegUser />, link: "/dash/profile" },
  { name: "Store settings", icon: <LuSettings2 />, link: "/dash/settings", allowedRoles: ["System Admin", "Admin"] },
];

/**
 * Responsive behavior
 * - Below 1024px: the sidebar is an off-canvas drawer opened with a menu button.
 *   It closes on route change, backdrop tap, Escape, or the close button.
 * - 1024px and up: normal sidebar that can collapse to an icon rail.
 *
 * Props
 * - showMobileButton (default true): shows a floating menu button on small
 *   screens. Set it to false if your header has its own button, then open the
 *   drawer from there with: window.dispatchEvent(new Event("toggle-sidebar"))
 */
const Sidebar = ({ showMobileButton = true, settings, currentUser }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [query, setQuery] = useState("");
  const [closedGroups, setClosedGroups] = useState(() => new Set());
  const [tip, setTip] = useState(null); // { label, top }
  const searchRef = useRef(null);

  // The icon rail only exists on desktop; the mobile drawer is always full width
  const rail = collapsed && isDesktop;

  // Track the breakpoint
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => {
      setIsDesktop(mq.matches);
      if (mq.matches) setMobileOpen(false);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Restore the saved collapsed state after mount (avoids hydration mismatch)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
      } catch {
        /* storage unavailable, keep default */
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Close the drawer after navigating
  useEffect(() => {
    const timer = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Lock page scroll while the drawer is open, close it with Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  // Lets your own header button open the drawer
  useEffect(() => {
    const onToggle = () => setMobileOpen((prev) => !prev);
    window.addEventListener("toggle-sidebar", onToggle);
    return () => window.removeEventListener("toggle-sidebar", onToggle);
  }, []);

  const toggleCollapsed = () => {
    setTip(null);
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const focusSearch = () => {
    setCollapsed(false);
    if (!window.matchMedia(DESKTOP_QUERY).matches) setMobileOpen(true);
    setTimeout(() => searchRef.current?.focus(), 300);
  };

  // Ctrl/Cmd + K focuses the search box
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        focusSearch();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const role = currentUser?.role;
  const loading = !currentUser;
  const displayName = currentUser?.firstName || role || "Account";
  const storeName = settings?.storeName || "Inventory System";

  /**
   * Filter by role first, then by the search text.
   * Groups with no visible items are dropped.
   */
  const visibleGroups = useMemo(() => {
    const q = query.trim().toLowerCase();

    return MENU_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (item.allowedRoles && (!role || !item.allowedRoles.includes(role))) {
          return false;
        }
        return q ? item.name.toLowerCase().includes(q) : true;
      }),
    })).filter((group) => group.items.length > 0);
  }, [role, query]);

  const isActive = (link) => {
    if (link === "/" || link === "/dash") {
      return pathname === link;
    }
    return pathname === link || pathname.startsWith(`${link}/`);
  };

  const showTip = (e, label) => {
    if (!rail) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTip({ label, top: rect.top + rect.height / 2 });
  };

  const onSearchKeyDown = (e) => {
    if (e.key === "Escape") {
      setQuery("");
      e.currentTarget.blur();
    }
    if (e.key === "Enter" && visibleGroups[0]?.items[0]) {
      router.push(visibleGroups[0].items[0].link);
      setQuery("");
      setMobileOpen(false);
    }
  };

  const labelClass = `whitespace-nowrap overflow-hidden transition-opacity duration-200 motion-reduce:transition-none ${
    rail ? "w-0 opacity-0" : "opacity-100"
  }`;

  return (
    <>
      {/* Mobile menu button */}
      {showMobileButton && !mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          className="fixed left-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--theme-primary)] text-xl text-[var(--theme-primary-text)] shadow-lg shadow-black/10 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]/50 focus-visible:ring-offset-2 lg:hidden print:hidden"
        >
          <LuMenu />
        </button>
      )}

      {/* Mobile backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 motion-reduce:transition-none lg:hidden print:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <nav
        aria-label="Sidebar Navigation"
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-2xl transition-[transform,width,visibility] duration-300 ease-out motion-reduce:transition-none lg:relative lg:z-auto lg:h-full lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:shadow-none lg:visible print:hidden ${
          mobileOpen ? "visible translate-x-0" : "invisible -translate-x-full"
        } ${rail ? "lg:w-[68px]" : "lg:w-56"}`}
      >
        {/* Desktop collapse toggle sits on the sidebar edge */}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className="absolute -right-3 top-8 z-20 hidden h-6 w-6 items-center justify-center rounded-full border border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-muted)] shadow-sm transition-colors hover:border-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-[var(--theme-primary-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]/40 lg:flex"
        >
          <LuChevronLeft
            className={`text-sm transition-transform duration-300 motion-reduce:transition-none ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>

        <div className="flex h-full flex-col p-3">
          {/* Brand */}
          <div
            className={`flex items-center gap-3 rounded-xl p-2 text-[var(--theme-text)] ${
              rail ? "justify-center" : ""
            }`}
          >
            {settings?.logo?.url ? (
              <img
                src={settings.logo.url}
                alt={storeName}
                className="h-10 w-10 shrink-0 rounded-lg bg-[var(--theme-primary-text)] object-contain"
              />
            ) : (
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--theme-primary)]/10 text-xl text-[var(--theme-primary)]"
                aria-hidden="true"
              >
                <LuBuilding2 />
              </span>
            )}
            <div className={`min-w-0 ${labelClass}`}>
              <p className="truncate text-[17px] font-medium leading-tight">
                {storeName}
              </p>
              <p className="text-[12px] text-[var(--theme-muted)]">
                Operations
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl text-[var(--theme-muted)] transition-colors hover:bg-[var(--theme-border)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] lg:hidden"
            >
              <LuX />
            </button>
          </div>

          {/* Search */}
          <div className="mt-3">
            {rail ? (
              <button
                type="button"
                onClick={focusSearch}
                onMouseEnter={(e) => showTip(e, "Search menu")}
                onMouseLeave={() => setTip(null)}
                aria-label="Search menu"
                className="flex w-full items-center justify-center rounded-xl p-2.5 text-xl text-[var(--theme-muted)] transition-colors hover:bg-[var(--theme-primary)]/10 hover:text-[var(--theme-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]/40"
              >
                <LuSearch />
              </button>
            ) : (
              <label className="group flex items-center gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-background)] px-3 py-2 transition-colors focus-within:border-[var(--theme-primary)] focus-within:bg-[var(--theme-surface)] focus-within:ring-2 focus-within:ring-[var(--theme-primary)]/15">
                <LuSearch
                  className="shrink-0 text-[var(--theme-muted)] transition-colors group-focus-within:text-[var(--theme-primary)]"
                  aria-hidden="true"
                />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onSearchKeyDown}
                  placeholder="Search menu"
                  aria-label="Search menu"
                  className="min-w-0 flex-1 bg-transparent text-base text-[var(--theme-text)] outline-none placeholder:text-[var(--theme-muted)] lg:text-sm"
                />
                <kbd className="hidden rounded border border-[var(--theme-border)] bg-[var(--theme-surface)] px-1.5 text-[11px] text-[var(--theme-muted)] lg:block">
                  Ctrl K
                </kbd>
              </label>
            )}
          </div>

          {/* Menu */}
          <div
            className="mt-3 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-0.5 [scrollbar-width:thin]"
            aria-busy={loading}
            onScroll={() => setTip(null)}
          >
            {loading ? (
              <ul className="flex flex-col gap-2">
                <li className="sr-only" role="status" aria-live="polite">
                  Loading navigation menu...
                </li>
                {Array.from({ length: 8 }).map((_, index) => (
                  <li
                    key={index}
                    className="flex animate-pulse items-center gap-3 rounded-xl bg-gray-50 p-2.5"
                    aria-hidden="true"
                  >
                    <div className="h-5 w-5 shrink-0 rounded-md bg-gray-200" />
                    {!rail && (
                      <div
                        className={`h-4 rounded-md bg-gray-200 ${
                          index % 3 === 0
                            ? "w-28"
                            : index % 2 === 0
                              ? "w-20"
                              : "w-24"
                        }`}
                      />
                    )}
                  </li>
                ))}
              </ul>
            ) : visibleGroups.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-gray-400">
                {rail ? "–" : `No menu items match "${query}"`}
              </p>
            ) : (
              visibleGroups.map((group, groupIndex) => (
                <div key={group.title} className={groupIndex > 0 ? "mt-3" : ""}>
                  {rail ? (
                    <button type="button" onClick={() => setClosedGroups((previous) => { const next = new Set(previous); next.has(group.title) ? next.delete(group.title) : next.add(group.title); return next; })} aria-label={`${closedGroups.has(group.title) ? "Expand" : "Collapse"} ${group.title}`} aria-expanded={!closedGroups.has(group.title)} className="mx-auto mb-1 flex h-5 w-10 items-center justify-center text-gray-300 hover:text-[var(--theme-primary)]">
                      <span className="h-px w-7 bg-current" aria-hidden="true" />
                    </button>
                  ) : (
                    <button type="button" onClick={() => setClosedGroups((previous) => { const next = new Set(previous); next.has(group.title) ? next.delete(group.title) : next.add(group.title); return next; })} aria-expanded={!closedGroups.has(group.title)} className="mb-1.5 flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--theme-muted)] hover:text-[var(--theme-text)]">
                      {group.title}<LuChevronDown className={`transition-transform ${closedGroups.has(group.title) ? "-rotate-90" : ""}`} size={14} />
                    </button>
                  )}

                  {!closedGroups.has(group.title) && <ul className="flex flex-col gap-1">
                    {group.items.map((item) => {
                      const active = isActive(item.link);

                      return (
                        <li key={item.link}>
                          <Link
                            href={item.link}
                            aria-current={active ? "page" : undefined}
                            onClick={() => setMobileOpen(false)}
                            onMouseEnter={(e) => showTip(e, item.name)}
                            onMouseLeave={() => setTip(null)}
                            onFocus={(e) => showTip(e, item.name)}
                            onBlur={() => setTip(null)}
                            className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]/40 motion-reduce:transition-none lg:py-2.5 ${
                              rail ? "justify-center" : ""
                            } ${
                              active
                                ? "bg-[var(--theme-primary)]/10 font-medium text-[var(--theme-primary)]"
                                : "text-[var(--theme-muted)] hover:bg-[var(--theme-primary)]/10 hover:text-[var(--theme-primary)]"
                            }`}
                          >
                            <span
                              className={`shrink-0 text-xl transition-transform duration-200 group-hover:scale-110 motion-reduce:transition-none ${
                                active
                                  ? "text-[var(--theme-primary)]"
                                  : "text-[var(--theme-primary)]"
                              }`}
                              aria-hidden="true"
                            >
                              {item.icon}
                            </span>
                            <span className={labelClass}>{item.name}</span>
                            {active && !rail && (
                              <span
                                className="ml-auto h-1.5 w-1.5 rounded-full bg-white"
                                aria-hidden="true"
                              />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>}
                </div>
              ))
            )}
          </div>

          <div className={`mb-2 flex flex-col gap-1 border-t border-[var(--theme-border)] pt-2 ${rail ? "items-center" : ""}`}>
            {UTILITY_LINKS.filter((item) => !item.allowedRoles || item.allowedRoles.includes(role)).map((item) => {
              const active = isActive(item.link);
              return <Link key={item.link} href={item.link} onClick={() => setMobileOpen(false)} aria-current={active ? "page" : undefined} title={rail ? item.name : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${rail ? "justify-center" : ""} ${active ? "bg-[var(--theme-primary)]/10 font-medium text-[var(--theme-primary)]" : "text-[var(--theme-muted)] hover:bg-[var(--theme-primary)]/5 hover:text-[var(--theme-primary)]"}`}><span className="shrink-0 text-lg" aria-hidden="true">{item.icon}</span><span className={labelClass}>{item.name}</span></Link>;
            })}
          </div>

          {/* Signed-in user */}
          <div
            className={`mt-3 flex items-center gap-3 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-background)] p-2.5 ${
              rail ? "justify-center" : ""
            }`}
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--theme-primary)]/10 text-sm font-medium text-[var(--theme-primary)]"
              aria-hidden="true"
            >
              {loading ? "" : displayName.charAt(0).toUpperCase()}
            </span>
            <div className={`min-w-0 ${labelClass}`}>
              <p className="truncate text-sm font-medium text-[var(--theme-text)]">
                {loading ? "Loading..." : displayName}
              </p>
              {role && (
                <p className="truncate text-xs text-[var(--theme-muted)]">
                  {role}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tooltip for the desktop icon rail (fixed so the scroll area can't clip it) */}
        {rail && tip && (
          <div
            role="tooltip"
            className="pointer-events-none fixed left-[84px] z-50 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-white shadow-lg"
            style={{ top: tip.top }}
          >
            {tip.label}
          </div>
        )}
      </nav>
    </>
  );
};

export default Sidebar;
