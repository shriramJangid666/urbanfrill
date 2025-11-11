// src/data/products.js
const PRODUCTS = [
  {
    id: 1,
    name: "Elegant Curtains",
    desc: "Custom made | Free on-site measuring",
    price: 299,
    category: "Curtains",
    images: ["/images/hero-left.jpg"],          // ✅ exists
  },
  {
    id: 2,
    name: "Wallpapers - Floral",
    desc: "Vinyl, easy-clean finish",
    price: 799,
    category: "Wallpapers",
    images: ["/images/hero-topright.jpg"],      // ✅ exists
  },
  {
    id: 3,
    name: "Upholstered Bedback",
    desc: "Premium fabric, stitched",
    price: 1499,
    category: "Bedback",
    images: ["/images/hero-bottomright.jpg"],   // ✅ exists
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
    image: "images/hero-curtain.jpg",
  },
  {
    id: 902,
    name: "Geometric Wallpaper",
    desc: "Matte finish, easy-clean | 57 sq.ft roll",
    category: "Wallpapers",
    price: 1990,
    image: "images/hero-wallpaper.jpg",
  },
  {
    id: 903,
    name: "Premium Bedback",
    desc: "Upholstered, tufted, custom sizes",
    category: "Bedback & Sofa",
    price: 12990,
    image: "images/hero-bedback.jpg",
  },
  {
    id: 904,
    name: "Orthopedic Mattress",
    desc: "Medium-firm with zoned support",
    category: "Mattress",
    price: 17990,
    image: "images/hero-mattress.jpg",
  },
  {
    id: 905,
    name: "Day-Night Blinds",
    desc: "Precise light control with sleek look",
    category: "Blinds",
    price: 5490,
    image: "images/hero-blinds.jpg",
  },
  {
    id: 906,
    name: "Oak Textured PVC",
    desc: "Durable planks | easy install",
    category: "Wood & PVC Flooring",
    price: 2990,
    image: "images/hero-flooring.jpg",
  }
);


export default PRODUCTS;
