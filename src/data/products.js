// src/data/products.js
const PRODUCTS = [
  {
    id: 1,
    name: "Elegant Curtains",
    desc: "Custom made | Free on-site measuring",
    price: 299,
    category: "Curtains",
  images: ["/images/hero-left.webp"],          // ✅ converted to webp
  },
  {
    id: 2,
    name: "Wallpapers - Floral",
    desc: "Vinyl, easy-clean finish",
    price: 799,
    category: "Wallpapers",
  images: ["/images/hero-topright.webp"],      // ✅ converted to webp
  },
  {
    id: 3,
    name: "Upholstered Bedback",
    desc: "Premium fabric, stitched",
    price: 1499,
    category: "Bedback",
  images: ["/images/hero-bottomright.webp"],   // ✅ converted to webp
  },
];

// --- extra showcase items (using existing images) ---
PRODUCTS.push(
  {
    id: 901,
    name: "Sheer Daylight Curtains",
    desc: "Airy weave with soft diffused light.",
    category: "Curtains",
    price: 2490,
  image: "images/hero-curtain.webp",
  },
  {
    id: 902,
    name: "Geometric Wallpaper",
    desc: "Matte finish, easy-clean | 57 sq.ft roll",
    category: "Wallpapers",
    price: 1990,
  image: "images/hero-wallpaper.webp",
  },
  {
    id: 903,
    name: "Premium Bedback",
    desc: "Upholstered, tufted, custom sizes",
    category: "Bedback & Sofa",
    price: 12990,
  image: "images/hero-bedback.webp",
  },
  {
    id: 904,
    name: "Orthopedic Mattress",
    desc: "Medium-firm with zoned support",
    category: "Mattress",
    price: 17990,
  image: "images/hero-mattress.webp",
  },
  {
    id: 905,
    name: "Day-Night Blinds",
    desc: "Precise light control with sleek look",
    category: "Blinds",
    price: 5490,
  image: "images/hero-blinds.webp",
  },
  {
    id: 906,
    name: "Oak Textured PVC",
    desc: "Durable planks | easy install",
    category: "Wood & PVC Flooring",
    price: 2990,
  image: "images/hero-flooring.webp",
  }
);


export default PRODUCTS;
