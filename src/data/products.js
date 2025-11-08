// src/data/products.js
const PRODUCTS = [
  {
    id: 1,
    name: "Elegant Curtains",
    desc: "Custom made | Free on-site measuring",
    price: 299,
    category: "Curtains",
    images: [
      "/images/hero-left.jpg",
      "/images/curtain-2.jpg",   // optional extra image (create or reuse images)
      "/images/curtain-3.jpg"
    ],
  },
  {
    id: 2,
    name: "Wallpapers - Floral",
    desc: "Vinyl, easy-clean finish",
    price: 799,
    category: "Wallpapers",
    images: [
      "/images/hero-topright.jpg",
      "/images/wallpaper-2.jpg"
    ],
  },
  {
    id: 3,
    name: "Upholstered Bedback",
    desc: "Premium fabric, stitched",
    price: 1499,
    category: "Bedback",
    images: [
      "/images/hero-bottomright.jpg",
      "/images/bedback-2.jpg"
    ],
  },
];

export default PRODUCTS;
