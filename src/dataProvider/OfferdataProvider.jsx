"use client";

import { useEffect, useState } from "react";

const OfferdataProvider = () => {
  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);

  const fetchOffers = async () => {
    setLoadingOffers(true);

    try {
      const res = await fetch("/api/offers", {
        cache: "no-store",
      });

      const data = await res?.json();

      if (res.ok) {
        setOffers(data?.offers || []);
      } else {
        console.error("Failed to load offers:", data?.message);
      }
    } catch (err) {
      console.error("Failed to load offers:", err);
    } finally {
      setLoadingOffers(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return {
    offers,
    loadingOffers,
    fetchOffers,
  };
};

export default OfferdataProvider;
