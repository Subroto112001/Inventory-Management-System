"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children, branding = {} }) {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [authenticated, setAuthenticated] = useState(null);
  const [error, setError] = useState("");
  const [pendingIds, setPendingIds] = useState([]);
  const [loginNoticeOpen, setLoginNoticeOpen] = useState(false);
  const [loginReturn, setLoginReturn] = useState("/");
  const pendingRef = useRef(new Set());
  const loginButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  const openLoginNotice = useCallback(() => {
    if (typeof window !== "undefined") {
      const returnPath = `${window.location.pathname}${window.location.search}`;
      setLoginReturn(returnPath.startsWith("/") && !returnPath.startsWith("//") ? returnPath : "/");
      previousFocusRef.current = document.activeElement;
    }
    setLoginNoticeOpen(true);
  }, []);

  const closeLoginNotice = useCallback(() => setLoginNoticeOpen(false), []);

  useEffect(() => {
    if (!loginNoticeOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    loginButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLoginNotice();
      } else if (event.key === "Tab") {
        const focusable = Array.from(document.querySelectorAll("[data-wishlist-dialog] button:not([disabled]), [data-wishlist-dialog] a[href]"));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      if (previousFocusRef.current?.isConnected) previousFocusRef.current.focus();
    };
  }, [loginNoticeOpen, closeLoginNotice]);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/account/wishlist", { cache: "no-store" });
      const data = await response.json();
      if (response.status === 401 || response.status === 403) {
        setProducts([]);
        setAuthenticated(false);
        setError("");
        return false;
      } else if (!response.ok) {
        throw new Error(data.message || "Unable to load wishlist");
      } else {
        setProducts(Array.isArray(data.products) ? data.products : []);
        setAuthenticated(true);
        setError("");
        return true;
      }
    } catch (refreshError) {
      setError(refreshError.message || "Unable to load wishlist");
      return null;
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => { if (active) refresh(); });
    return () => { active = false; };
  }, [refresh]);

  const toggle = useCallback(async (product) => {
    const productId = String(product.id || product._id || "");
    if (!productId) throw new Error("Invalid product");
    if (pendingRef.current.has(productId)) return false;
    let canUpdate = authenticated;
    if (canUpdate !== true) canUpdate = await refresh();
    if (canUpdate === null) throw new Error("Unable to verify your session. Please try again.");
    if (canUpdate === false) {
      openLoginNotice();
      return false;
    }
    pendingRef.current.add(productId);
    setPendingIds(Array.from(pendingRef.current));
    const exists = products.some((item) => item.id === productId);
    try {
      const response = await fetch(exists ? `/api/account/wishlist/${encodeURIComponent(productId)}` : "/api/account/wishlist", {
        method: exists ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        ...(exists ? {} : { body: JSON.stringify({ productId }) }),
      });
      const result = await response.json();
      if (response.status === 401 || response.status === 403) {
        setProducts([]);
        setAuthenticated(false);
        openLoginNotice();
        return false;
      }
      if (!response.ok) throw new Error(result.message || "Unable to update wishlist");
      if (exists) {
        setProducts((current) => current.filter((item) => item.id !== productId));
      } else {
        const normalized = {
          id: productId,
          name: product.name || product.productName || "Product",
          sku: product.sku || product.productSKU || "",
          category: product.category || "",
          price: Number(product.price) || 0,
          discount: Number(product.discount) || 0,
          image: product.image || "",
          inStock: Boolean(product.inStock),
        };
        setProducts((current) => current.some((item) => item.id === productId) ? current : [...current, normalized]);
      }
      setError("");
      await refresh();
      return true;
    } catch (toggleError) {
      setError(toggleError.message || "Unable to update wishlist");
      throw toggleError;
    } finally {
      pendingRef.current.delete(productId);
      setPendingIds(Array.from(pendingRef.current));
    }
  }, [products, authenticated, refresh, openLoginNotice]);

  const has = useCallback((id) => products.some((product) => product.id === String(id)), [products]);
  const value = useMemo(() => ({ products, loaded, error, pendingIds, count: products.length, refresh, toggle, has }), [products, loaded, error, pendingIds, refresh, toggle, has]);
  const logoUrl = branding.logo?.url || branding.logoUrl || "";
  const storeName = branding.storeName || "Our Store";
  const primaryColor = branding.primary || branding.primaryColor || "#1F3A2E";
  const accentColor = branding.accent || branding.accentColor || "#B65C38";
  const borderColor = branding.border || branding.borderColor || "#E4DED2";

  return (
    <WishlistContext.Provider value={value}>
      {children}
      {loginNoticeOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={(event) => { if (event.target === event.currentTarget) closeLoginNotice(); }}
        >
          <section
            data-wishlist-dialog
            role="dialog"
            aria-modal="true"
            aria-labelledby="wishlist-login-title"
            aria-describedby="wishlist-login-description"
            className="relative w-full max-w-sm animate-[wishlist-dialog-in_180ms_ease-out_both] rounded-2xl border bg-white p-6 text-center shadow-2xl motion-reduce:animate-none sm:p-7"
            style={{ borderColor }}
          >
            <button type="button" onClick={closeLoginNotice} aria-label="Close login notice" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2" style={{ "--tw-ring-color": primaryColor }}>
              <span aria-hidden="true">&times;</span>
            </button>
            {logoUrl ? (
              <img src={logoUrl} alt={`${storeName} logo`} className="mx-auto mb-4 h-12 w-12 rounded-full border bg-[#F7F3EC] p-2 object-contain" style={{ borderColor }} />
            ) : (
              <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border bg-[#F7F3EC] text-lg font-semibold" style={{ color: primaryColor, borderColor }} aria-label={storeName}>
                {storeName.trim().charAt(0).toUpperCase() || "S"}
              </span>
            )}
            <h2 id="wishlist-login-title" className="text-xl font-semibold text-[#211F1D]">Login Required</h2>
            <p id="wishlist-login-description" className="mt-2 text-sm leading-6 text-[#6F685E]">Please log in to your account to add products to your wishlist and save your favorite items.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" onClick={closeLoginNotice} className="rounded-xl border px-4 py-3 text-sm font-semibold transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2" style={{ borderColor, color: primaryColor, "--tw-ring-color": primaryColor }}>Maybe Later</button>
              <a ref={loginButtonRef} href={`/login?next=${encodeURIComponent(loginReturn)}`} className="rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" style={{ backgroundColor: primaryColor, "--tw-ring-color": accentColor }}>Log In</a>
            </div>
          </section>
          <style jsx global>{`@keyframes wishlist-dialog-in { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
        </div>
      )}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const value = useContext(WishlistContext);
  if (!value) throw new Error("useWishlist must be used inside WishlistProvider");
  return value;
}
