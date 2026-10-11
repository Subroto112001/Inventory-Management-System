"use client";

import { useCallback, useEffect, useState } from "react";

const OfferdataProvider = (enabled = true) => {
  const [offers, setOffers] = useState([]);
  const [totalOffers, setTotalOffers] = useState(0);
  const [loadingOffers, setLoadingOffers] = useState(true);

  const fetchOffers = useCallback(async () => {
    if (!enabled) {
      setLoadingOffers(false);
      return;
    }
    setLoadingOffers(true);

    try {
      const res = await fetch("/api/offers", {
        cache: "no-store",
      });

      const data = await res?.json();

      if (res.ok) {
        setOffers(data?.offers || []);
        setTotalOffers(Number(data?.pagination?.total ?? data?.offers?.length ?? 0));
      } else {
        console.error("Failed to load offers:", data?.message);
      }
    } catch (err) {
      console.error("Failed to load offers:", err);
    } finally {
      setLoadingOffers(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return {
    offers,
    totalOffers,
    loadingOffers,
    fetchOffers,
  };
};

export default OfferdataProvider;
