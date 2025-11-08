// src/components/ProductPage.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./product-page.css";

export default function ProductPage({ product }) {
  const [idx, setIdx] = useState(0);
  const { user } = useAuth();
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div style={{ padding: 60, textAlign: "center" }}>
        <h3>Product not found</h3>
        <p>It may have been removed or renamed.</p>
        <button
          onClick={() => (window.location.hash = "#products")}
          className="pp-back"
        >
          ← Back to Products
        </button>
      </div>
    );
  }

  const handleAdd = () => {
    if (!user) {
      alert("Please log in to add to cart.");
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      image: product.images?.[0],
      qty: 1,
    });
    alert("Item added to cart!");
  };

  return (
    <div className="pp-wrap" style={{ maxWidth: 1100, margin: "40px auto", padding: "0 18px" }}>
      <button
        onClick={() => (window.location.hash = "#products")}
        className="pp-back"
      >
        ← Back to Products
      </button>

      <div className="pp-grid">
        <div className="pp-media">
          <div className="pp-main">
            <img
              src={product.images[idx] || "/images/placeholder.png"}
              alt={product.name}
            />
          </div>

          {product.images?.length > 1 && (
            <div className="pp-thumbs">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`pp-thumb ${i === idx ? "active" : ""}`}
                  onClick={() => setIdx(i)}
                >
                  <img src={img} alt={`thumb-${i}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pp-info">
          <h1>{product.name}</h1>
          <p className="pp-price">₹{Number(product.price).toLocaleString()}</p>
          <p className="pp-desc">{product.desc}</p>

          <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
            <button className="pp-btn" onClick={handleAdd}>Add to cart</button>
            <button
              className="pp-btn-outline"
              onClick={() => alert("Buy now → checkout will be added soon")}
            >
              Buy now
            </button>
          </div>

          <div style={{ marginTop: 22, color: "#666" }}>
            <strong>Category:</strong> {product.category}
          </div>
        </div>
      </div>
    </div>
  );
}
