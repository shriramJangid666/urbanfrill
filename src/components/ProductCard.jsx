// src/components/ProductCard.jsx
import React, { useMemo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/CartContext";
import { productImg, productPath, asset } from "../utils/asset";
import "./product-card.css";

function ProductCard({ product, onView = () => {}, index = 0, promptLogin = () => {} }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const priceNumber = useMemo(
    () => Number(product.price) || 0,
    [product.price]
  );
  const primaryImage = product.images?.[0] || product.image;
  const priority = typeof index === "number" && index >= 0 && index < 6; // first 6 cards are higher priority
  const cleanPath = useMemo(() => productPath(primaryImage), [primaryImage]);

  const handleAddToCart = useCallback(() => {
    if (!user) {
      // open sign-in modal (provided by App via prop)
      promptLogin();
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: priceNumber,
      image: cleanPath,
      qty: 1,
    });
    // small inline animation/state instead of alert
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }, [user, addToCart, product.id, product.name, priceNumber, cleanPath, promptLogin]);

  const handleBuyNow = useCallback(() => {
    if (!user) {
      promptLogin();
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: priceNumber,
      image: cleanPath,
      qty: 1,
    });
    navigate("/checkout");
  }, [user, addToCart, product.id, product.name, priceNumber, cleanPath, promptLogin, navigate]);

  const handleView = useCallback(() => onView(product), [onView, product]);

  return (
    <article className="pc-card" role="listitem">
      <button
        className="pc-media"
        onClick={handleView}
        aria-label={`View ${product.name}`}
      >
        <img
          key={`${product.id}-${user?.uid || 'guest'}`}
          src={productImg(primaryImage)}
          alt={product.name}
          onError={(e) => (e.currentTarget.src = asset("images/logo.png"))}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          sizes="(max-width:560px) 100vw, (max-width:980px) 50vw, 33vw"
        />
      </button>

      <div className="pc-body">
        <h3
          className="pc-title"
          onClick={handleView}
          style={{ cursor: "pointer" }}
        >
          {product.name}
        </h3>
        <p className="pc-desc">{product.desc}</p>

        <div className="pc-footer">
          <div className="pc-price">₹{priceNumber.toLocaleString()}</div>
          <div className="pc-buttons">
            <button className={`pc-btn pc-add ${added ? "added" : ""}`} onClick={handleAddToCart} disabled={added}>
              {added ? "✓ Added" : "Add to cart"}
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

export default React.memo(ProductCard);
