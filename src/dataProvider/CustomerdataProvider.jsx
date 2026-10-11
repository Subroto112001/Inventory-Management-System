"use client";

import { useCallback, useEffect, useState } from "react";

const CustomerdataProvider = (enabled = true) => {
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const fetchCustomers = useCallback(async () => {
    if (!enabled) {
      setLoadingCustomers(false);
      return;
    }
    setLoadingCustomers(true);

    try {
      const res = await fetch("/api/customer", {
        cache: "no-store",
      });

      const data = await res.json();

      if (res.ok) {
        setCustomers(data.customers || []);
        setTotalCustomers(Number(data.pagination?.total ?? data.customers?.length ?? 0));
      } else {
        console.error(
          "Failed to load customers:",
          data.message
        );
      }
    } catch (err) {
      console.error(
        "Failed to load customers:",
        err
      );
    } finally {
      setLoadingCustomers(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    totalCustomers,
    loadingCustomers,
    fetchCustomers,
  };
};

export default CustomerdataProvider;

