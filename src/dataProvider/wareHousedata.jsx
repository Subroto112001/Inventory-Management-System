
"use client";

import { useEffect, useState } from "react";

const useWarehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loadingWarehouses, setLoadingWarehouses] =
    useState(true);

  const fetchWarehouses = async () => {
    setLoadingWarehouses(true);

    try {
      const res = await fetch("/api/warehouse", {
        cache: "no-store",
      });

      const data = await res.json();

      if (res.ok) {
        setWarehouses(data.warehouses || []);
      } else {
        console.error(
          "Failed to load warehouses:",
          data.message
        );
      }
    } catch (err) {
      console.error(
        "Failed to load warehouses:",
        err
      );
    } finally {
      setLoadingWarehouses(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return {
    warehouses,
    loadingWarehouses,
    fetchWarehouses,
  };
};

export default useWarehouses;

