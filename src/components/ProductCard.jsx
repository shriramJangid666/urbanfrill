// src/components/ProductCard.jsx
import React, { useMemo, useCallback } from "react";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/CartContext";
import { productImg, productPath, asset } from "../utils/asset";
import "./product-card.css";

function ProductCard({ product, onView = () => {} }) {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const priceNumber = useMemo(
    () => Number(product.price) || 0,
    [product.price]
  );
  const primaryImage = product.images?.[0] || product.image;
  const cleanPath = useMemo(() => productPath(primaryImage), [primaryImage]);

  const handleAddToCart = useCallback(() => {
    if (!user) {
      alert("Please log in or sign up to add items to your cart.");
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: priceNumber,
      image: cleanPath,
      qty: 1,
    });
    alert(`${product.name} has been added to your cart!`);
  }, [user, addToCart, product.id, product.name, priceNumber, cleanPath]);

  const handleBuyNow = useCallback(() => {
    if (!user) {
      alert("Please log in to continue to checkout.");
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: priceNumber,
      image: cleanPath,
      qty: 1,
    });
    window.location.hash = "#cart";
  }, [user, addToCart, product.id, product.name, priceNumber, cleanPath]);

  const handleView = useCallback(() => onView(product), [onView, product]);

  return (
    <article className="pc-card" role="listitem">
      <button
        className="pc-media"
        onClick={handleView}
        aria-label={`View ${product.name}`}
      >
        <img
          src={productImg(primaryImage)}
          alt={product.name}
          onError={(e) => (e.currentTarget.src = asset("images/logo.png"))}
          loading="lazy"
          decoding="async"
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

export default React.memo(ProductCard);
