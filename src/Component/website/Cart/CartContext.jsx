"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  startTransition,
} from "react";

const STORAGE_KEY = "fieldhouse-cart";
const MAX_QTY = 10;

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load the saved cart once, after the first render (avoids hydration mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      startTransition(() => {
        if (saved) setItems(JSON.parse(saved));
        setHydrated(true);
      });
    } catch {}
  }, []);

  // Save on every change, but only after the saved cart has been loaded
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  // product needs: id, name, price, image, category
  const addItem = useCallback((product, quantity = 1, { open = true } = {}) => {
    const requestedQuantity = Number.isFinite(Number(quantity))
      ? Math.max(1, Math.floor(Number(quantity)))
      : 1;
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + requestedQuantity, MAX_QTY),
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          image: product.image,
          price: product.price,
          quantity: Math.min(requestedQuantity, MAX_QTY),
        },
      ];
    });

    if (open) setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    const nextQuantity = Number.isFinite(Number(quantity))
      ? Math.floor(Number(quantity))
      : 0;
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.min(Math.max(nextQuantity, 0), MAX_QTY),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      isOpen,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      maxQty: MAX_QTY,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
    }),
    [
      items,
      isOpen,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }

  return context;
}
