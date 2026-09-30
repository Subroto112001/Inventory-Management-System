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

export const CATEGORIES = [
  {
    name: "Lighting",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Kitchen & Dining",
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Furniture",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Textiles & Bedding",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Storage",
    image:
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Outdoor & Garden",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Decor & Accents",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Bath",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=85",
  },
];

export const OFFER_SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85",
    title: "Wool & Wood",
    subtitle: "Up to 30% off cold-weather furnishings",
    cta: "Shop the sale",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",
    title: "The Kitchen Edit",
    subtitle: "Season's essentials, from $18",
    cta: "Shop kitchen",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
    title: "Outdoor Living",
    subtitle: "Get ahead of spring, pre-order now",
    cta: "Shop outdoor",
  },
];

export const EXCLUSIVE_PRODUCTS = [
  {
    id: "ex1",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=85",
    category: "Furniture",
    name: "Alder Oak Dining Chair",
    price: 189,
    oldPrice: 229,
    rating: 4.8,
    reviews: 62,
    badge: "Exclusive",
  },
  {
    id: "ex2",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=85",
    category: "Kitchen & Dining",
    name: "Hand-Thrown Stoneware Mug Set",
    price: 58,
    rating: 4.9,
    reviews: 140,
    badge: "Exclusive",
  },
  {
    id: "ex3",
    image:
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=600&q=85",
    category: "Lighting",
    name: "Brushed Brass Pendant Light",
    price: 145,
    rating: 4.7,
    reviews: 38,
    badge: "Exclusive",
  },
  {
    id: "ex4",
    image:
      "https://images.unsplash.com/photo-1600369671236-e74521d0bde6?auto=format&fit=crop&w=600&q=85",
    category: "Textiles & Bedding",
    name: "Linen Weave Throw Blanket",
    price: 76,
    rating: 4.6,
    reviews: 51,
    badge: "Exclusive",
  },
];

export const FEATURED_PRODUCTS = {
  "Kitchen & Dining": [
    {
      id: "k1",
      image:
        "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=600&q=85",
      category: "Kitchen & Dining",
      name: 'Cast Iron Skillet 10"',
      price: 42,
      rating: 4.9,
      reviews: 210,
    },
    {
      id: "k2",
      image:
        "https://images.unsplash.com/photo-1608755728617-aefab37d2ab2?auto=format&fit=crop&w=600&q=85",
      category: "Kitchen & Dining",
      name: "Olive Wood Cutting Board",
      price: 34,
      rating: 4.7,
      reviews: 88,
    },
    {
      id: "k3",
      image:
        "https://images.unsplash.com/photo-1493106819501-66d381c466f1?auto=format&fit=crop&w=600&q=85",
      category: "Kitchen & Dining",
      name: "Speckled Ceramic Bowl Set",
      price: 64,
      rating: 4.8,
      reviews: 73,
    },
    {
      id: "k4",
      image:
        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=85",
      category: "Kitchen & Dining",
      name: "Hand-Blown Glass Carafe",
      price: 29,
      rating: 4.5,
      reviews: 40,
    },
  ],

  Furniture: [
    {
      id: "f1",
      image:
        "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=600&q=85",
      category: "Furniture",
      name: "Teak Outdoor Bench",
      price: 320,
      rating: 4.6,
      reviews: 27,
    },
    {
      id: "f2",
      image:
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=85",
      category: "Furniture",
      name: "Bouclé Reading Armchair",
      price: 540,
      oldPrice: 620,
      rating: 4.9,
      reviews: 54,
    },
    {
      id: "f3",
      image:
        "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=600&q=85",
      category: "Furniture",
      name: "Floating Walnut Shelf",
      price: 88,
      rating: 4.4,
      reviews: 19,
    },
    {
      id: "f4",
      image:
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=85",
      category: "Furniture",
      name: "Woven Rattan Ottoman",
      price: 165,
      rating: 4.7,
      reviews: 33,
    },
  ],

  Lighting: [
    {
      id: "l1",
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=85",
      category: "Lighting",
      name: "Linen Shade Table Lamp",
      price: 74,
      rating: 4.6,
      reviews: 46,
    },
    {
      id: "l2",
      image:
        "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=600&q=85",
      category: "Lighting",
      name: "Brass Wall Sconce, Pair",
      price: 96,
      rating: 4.8,
      reviews: 22,
    },
    {
      id: "l3",
      image:
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=600&q=85",
      category: "Lighting",
      name: "Arched Iron Floor Lamp",
      price: 132,
      rating: 4.5,
      reviews: 17,
    },
    {
      id: "l4",
      image:
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=85",
      category: "Lighting",
      name: "Rice Paper Pendant Shade",
      price: 48,
      rating: 4.3,
      reviews: 29,
    },
  ],

  Textiles: [
    {
      id: "t1",
      image:
        "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=85",
      category: "Textiles & Bedding",
      name: "Washed Linen Duvet Set",
      price: 128,
      rating: 4.8,
      reviews: 95,
    },
    {
      id: "t2",
      image:
        "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=600&q=85",
      category: "Textiles & Bedding",
      name: "Hand-Knotted Wool Rug",
      price: 240,
      rating: 4.9,
      reviews: 61,
    },
    {
      id: "t3",
      image:
        "https://images.unsplash.com/photo-1583845112203-454c7a2b9b47?auto=format&fit=crop&w=600&q=85",
      category: "Textiles & Bedding",
      name: "Wool Felt Table Runner",
      price: 36,
      rating: 4.4,
      reviews: 12,
    },
    {
      id: "t4",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=85",
      category: "Textiles & Bedding",
      name: "Boucle Cushion Cover, Set of 2",
      price: 44,
      rating: 4.6,
      reviews: 37,
    },
  ],
};

export const NEW_ARRIVALS = [
  {
    id: "n1",
    image:
      "https://images.unsplash.com/photo-1551298370-9d3d53740c72?auto=format&fit=crop&w=600&q=85",
    category: "Furniture",
    name: "Ash Wood Side Table",
    price: 112,
    rating: 4.7,
    reviews: 8,
    badge: "New",
  },
  {
    id: "n2",
    image:
      "https://images.unsplash.com/photo-1572119865084-43c285814d63?auto=format&fit=crop&w=600&q=85",
    category: "Kitchen & Dining",
    name: "Enamel Stovetop Teapot",
    price: 46,
    rating: 4.5,
    reviews: 6,
    badge: "New",
  },
  {
    id: "n3",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=85",
    category: "Decor & Accents",
    name: "Rattan-Framed Wall Mirror",
    price: 68,
    rating: 4.6,
    reviews: 4,
    badge: "New",
  },
  {
    id: "n4",
    image:
      "https://images.unsplash.com/photo-1600369671236-e74521d0bde6?auto=format&fit=crop&w=600&q=85",
    category: "Textiles & Bedding",
    name: "Chunky Knit Wool Throw",
    price: 82,
    rating: 4.8,
    reviews: 11,
    badge: "New",
  },
  {
    id: "n5",
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=85",
    category: "Decor & Accents",
    name: "Forged Iron Candlestick",
    price: 24,
    rating: 4.3,
    reviews: 3,
    badge: "New",
  },
  {
    id: "n6",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=85",
    category: "Decor & Accents",
    name: "Speckled Ceramic Planter",
    price: 32,
    rating: 4.7,
    reviews: 9,
    badge: "New",
  },
];

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
