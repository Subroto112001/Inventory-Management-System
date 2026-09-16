
"use client";

import { useEffect, useState } from "react";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const fetchProducts = async () => {
    setLoadingProducts(true);

    try {
      const res = await fetch("/api/product", {
        cache: "no-store",
      });

      const data = await res.json();

      if (res.ok) {
        setProducts(data.products || []);
      } else {
        console.error(
          "Failed to load products:",
          data.message
        );
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loadingProducts,
    fetchProducts,
  };
};

export default useProducts;
