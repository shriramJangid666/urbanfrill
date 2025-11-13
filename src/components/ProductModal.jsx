import React, { useEffect } from "react";
import "./productModal.css";
import { productImg, asset } from "../utils/asset";

const PHONE = "917821085631";

export default function ProductModal({ product, onClose }) {
  useEffect(() => {
    const closeOnEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEsc);
    return () => window.removeEventListener("keydown", closeOnEsc);
  }, [onClose]);

  if (!product) return null;

  const waLink = `https://wa.me/${PHONE}?text=${encodeURIComponent(
    `Hi! I'm interested in the "${product.name}" from UrbanFrill.\nCan you share more details or a quote?`
  )}`;

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="pm-close" onClick={onClose} aria-label="Close">&times;</button>
        <div className="pm-image">
          <img
            src={productImg(product.image)}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={(e) => (e.currentTarget.src = asset("images/placeholder.png"))}
          />
        </div>
        <div className="pm-body">
          <h3>{product.name}</h3>
          <p>{product.desc}</p>
          <p className="pm-price">{product.price}</p>

          <a href={waLink} target="_blank" rel="noreferrer" className="pm-wa-btn">
            Message on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
