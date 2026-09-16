"use client";

import { useEffect, useState } from "react";

const CustomerdataProvider = () => {
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const fetchCustomers = async () => {
    setLoadingCustomers(true);

    try {
      const res = await fetch("/api/customer", {
        cache: "no-store",
      });

      const data = await res.json();

      if (res.ok) {
        setCustomers(data.customers || []);
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
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loadingCustomers,
    fetchCustomers,
  };
};

export default CustomerdataProvider;

