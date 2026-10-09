"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [pendingIds, setPendingIds] = useState([]);
  const pendingRef = useRef(new Set());

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/account/wishlist", { cache: "no-store" });
      const data = await response.json();
      if (response.status === 401 || response.status === 403) {
        setProducts([]);
        setError("");
      } else if (!response.ok) {
        throw new Error(data.message || "Unable to load wishlist");
      } else {
        setProducts(Array.isArray(data.products) ? data.products : []);
        setError("");
      }
    } catch (refreshError) {
      setError(refreshError.message || "Unable to load wishlist");
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
      if (response.status === 401) {
        window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
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
  }, [products, refresh]);

  const has = useCallback((id) => products.some((product) => product.id === String(id)), [products]);
  const value = useMemo(() => ({ products, loaded, error, pendingIds, count: products.length, refresh, toggle, has }), [products, loaded, error, pendingIds, refresh, toggle, has]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const value = useContext(WishlistContext);
  if (!value) throw new Error("useWishlist must be used inside WishlistProvider");
  return value;
}
