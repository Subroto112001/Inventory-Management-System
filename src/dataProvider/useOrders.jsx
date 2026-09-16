"use client";

import { useEffect, useState } from "react";

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoadingOrders(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        cache: "no-store",
      });

      const data = await res.json();

      if (res.ok) {
        setOrders(data?.orders || []);
      } else {
        setError(data?.message || "Failed to load orders");

        console.error(
          "Failed to load orders:",
          data?.message || "Unknown error",
        );
      }
    } catch (err) {
      console.error("Failed to load orders:", err);

      setError(err?.message || "Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loadingOrders,
    error,
    fetchOrders,
  };
};

export default useOrders;
