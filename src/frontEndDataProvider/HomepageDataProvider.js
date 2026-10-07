/**
 * Here slider banner image
 * */

import { LuHeadphones, LuRotateCcw, LuShieldCheck, LuTruck } from "react-icons/lu";

export const HERO_SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
    eyebrow: "New season",
    title: "Furniture built to live in, not around",
    subtitle: "Solid oak and reclaimed wood pieces, finished by hand.",
    cta: "Shop the edit",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=85",
    eyebrow: "Kitchen & dining",
    title: "Stoneware and cast iron for everyday cooking",
    subtitle: "Small-batch pieces made to be used, not shelved.",
    cta: "Browse kitchenware",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1400&q=85",
    eyebrow: "Just restocked",
    title: "Linen and wool for the colder months",
    subtitle: "Woven in small runs, softer with every wash.",
    cta: "Shop textiles",
  },
];

/**
 *Side Banner
 * */

export const SIDE_BANNERS = [
  {
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=85",
    title: "Outdoor & garden",
    subtitle: "Teak seating, up to 20% off",
  },
  {
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85",
    title: "Lighting studio",
    subtitle: "Brushed brass, new arrivals",
  },
];

/**
 * Categories
 *  */

export const PERKS = [
  {
    icon: LuTruck,
    title: "Free shipping",
    text: "On orders over $75",
  },
  {
    icon: LuRotateCcw,
    title: "30-day returns",
    text: "No questions asked",
  },
  {
    icon: LuShieldCheck,
    title: "Secure checkout",
    text: "Encrypted payments",
  },
  {
    icon: LuHeadphones,
    title: "Support",
    text: "Mon–Fri, 9am–6pm",
  },
];
