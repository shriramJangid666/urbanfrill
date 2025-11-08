// src/components/ProductCard.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./product-card.css";

export default function ProductCard({ product, onView = () => {} }) {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const priceNumber = Number(product.price) || 0;

  const handleAddToCart = () => {
    if (!user) {
      alert("Please log in or sign up to add items to your cart.");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: priceNumber,
      image: product.images?.[0] || product.image,
      qty: 1,
    });
    alert(`${product.name} has been added to your cart!`);
  };

  const handleBuyNow = () => {
    if (!user) {
      alert("Please log in to continue to checkout.");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: priceNumber,
      image: product.images?.[0] || product.image,
      qty: 1,
    });

    window.location.hash = "#cart";
  };

  return (
    <article className="pc-card" role="listitem">
      <div
        className="pc-media"
        onClick={() => onView(product)}
        style={{ cursor: "pointer" }}
      >
        <img
          src={product.images?.[0] || "/images/placeholder.png"}
          alt={product.name}
          onError={(e) => (e.currentTarget.src = "/images/placeholder.png")}
          loading="lazy"
        />
      </div>

      <div className="pc-body">
        <h3
          className="pc-title"
          onClick={() => onView(product)}
          style={{ cursor: "pointer" }}
        >
          {product.name}
        </h3>
        <p className="pc-desc">{product.desc}</p>

        <div className="pc-footer">
          <div className="pc-price">₹{priceNumber.toLocaleString()}</div>

          <div className="pc-buttons">
            <button className="pc-btn pc-add" onClick={handleAddToCart}>
              Add to cart
            </button>
            <button className="pc-btn pc-buy" onClick={handleBuyNow}>
              Buy now
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
