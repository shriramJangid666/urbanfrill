import React, { useMemo, useState, useLayoutEffect } from "react";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/CartContext";
import { productImg, asset } from "../utils/asset";
import { forceTop } from "../utils/scrollToTop";
import "./product-page.css";

export default function ProductPage({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();

  // 🔹 scroll to top before paint whenever product changes
  useLayoutEffect(() => {
    forceTop();
  }, [product?.id]);

  // Normalize images: prefer array, else fall back to single image
  const images = useMemo(() => {
    if (!product) return [];
    const fromArray = Array.isArray(product.images)
      ? product.images.filter(Boolean)
      : [];
    if (fromArray.length) return fromArray;
    return product.image ? [product.image] : [];
  }, [product]);

  const [idx, setIdx] = useState(0);

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

  const current = images[idx] || "images/placeholder.png";

  const handleAdd = () => {
    if (!user) {
      alert("Please log in to add to cart.");
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      image: images[0] || "images/placeholder.png",
      qty: 1,
    });
    alert("Item added to cart!");
  };

  return (
    <div
      className="pp-wrap"
      style={{ maxWidth: 1100, margin: "40px auto", padding: "0 18px" }}
    >
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
              className="pd-main"
              src={productImg(current)}
              alt={product.name}
              loading="eager"
              onError={(e) =>
                (e.currentTarget.src = asset("images/placeholder.png"))
              }
            />
          </div>

          {images.length > 1 && (
            <div className="pp-thumbs" role="list">
              {images.map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  className={`pp-thumb ${i === idx ? "active" : ""}`}
                  onClick={() => setIdx(i)}
                  aria-label={`Show image ${i + 1}`}
                >
                  <img
                    src={productImg(img)}
                    alt={`thumb-${i + 1}`}
                    loading="lazy"
                    onError={(e) =>
                      (e.currentTarget.src = asset("images/placeholder.png"))
                    }
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pp-info">
          <h1>{product.name}</h1>
          <p className="pp-price">
            ₹{Number(product.price || 0).toLocaleString()}
          </p>
          <p className="pp-desc">{product.desc}</p>

          <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
            <button className="pp-btn" onClick={handleAdd}>
              Add to cart
            </button>
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
