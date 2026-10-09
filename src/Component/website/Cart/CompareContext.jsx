"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CompareContext = createContext(null);
const STORAGE_KEY = "ims-product-compare";
const MAX_COMPARE_ITEMS = 4;

export function CompareProvider({ children }) {
  const [ids, setIds] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      try {
        const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
        if (active && Array.isArray(saved)) setIds([...new Set(saved.filter((id) => typeof id === "string"))].slice(0, MAX_COMPARE_ITEMS));
      } catch {
        if (active) setIds([]);
      } finally {
        if (active) setLoaded(true);
      }
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (loaded) {
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); } catch {}
    }
  }, [ids, loaded]);

  const add = useCallback((id) => {
    if (!loaded) return "loading";
    if (ids.includes(id)) return "exists";
    if (ids.length >= MAX_COMPARE_ITEMS) return "full";
    setIds((current) => current.includes(id) || current.length >= MAX_COMPARE_ITEMS ? current : [...current, id]);
    return "added";
  }, [ids, loaded]);
  const remove = useCallback((id) => setIds((current) => current.filter((item) => item !== id)), []);
  const clear = useCallback(() => setIds([]), []);
  const has = useCallback((id) => ids.includes(id), [ids]);
  const value = useMemo(() => ({ ids, count: ids.length, loaded, add, remove, clear, has }), [ids, loaded, add, remove, clear, has]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used inside CompareProvider");
  return context;
}
