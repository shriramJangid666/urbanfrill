const PRODUCTS = [
  {
    id: 1,
    name: "Elegant Curtains",
    desc: "Custom made | Free on-site measuring",
    price: 299,
    category: "Curtains",
    images: [
      "/images/hero-left.jpg",               // ✅ exists
      // add more only if the files exist
    ],
  },
  {
    id: 2,
    name: "Wallpapers - Floral",
    desc: "Vinyl, easy-clean finish",
    price: 799,
    category: "Wallpapers",
    images: [
      "/images/hero-topright.jpg"      // ✅ exists
    ],
  },
  {
    id: 3,
    name: "Upholstered Bedback",
    desc: "Premium fabric, stitched",
    price: 1499,
    category: "Bedback",
    images: [
      "/images/hero-bottomright.jpg"   // ✅ exists
    ],
  },
];

export default PRODUCTS;
