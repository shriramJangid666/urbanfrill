// src/components/CartDrawer.jsx
import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { productImg, asset } from "../utils/asset";
import "./cart-drawer.css";

export default function CartDrawer({ open, onClose }) {
  const { cart, itemCount, subTotal, updateQty, removeFromCart, clearCart } = useCart();

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const inc = (it) => updateQty(it.id, (it.qty || 1) + 1);
  const dec = (it) => updateQty(it.id, Math.max(1, (it.qty || 1) - 1));

  return (
    <div className="cd-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <aside className="cd-drawer cd-left" onClick={(e) => e.stopPropagation()} aria-label="Cart drawer">
        <div className="cd-header">
          <h3>Your cart</h3>
          <button onClick={onClose} className="cd-close" aria-label="Close cart">✕</button>
        </div>

        <div className="cd-body">
          {cart.length === 0 ? (
            <div className="cd-empty">Your cart is empty.</div>
          ) : (
            cart.map((it) => (
              <div key={it.id} className="cd-item">
                <img
                  className="cd-thumb"
                  src={productImg(it.image)}                // add base at render time
                  alt={it.name}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = asset("images/logo.png"))}
                />
                <div className="cd-meta">
                  <div className="cd-name">{it.name}</div>
                  <div className="cd-price">₹{Number(it.price || 0).toLocaleString()}</div>
                  <div className="cd-controls">
                    <div className="cd-qty">
                      <button className="cd-qtybtn" onClick={() => dec(it)} aria-label="Decrease quantity">−</button>
                      <input
                        type="number"
                        min="1"
                        value={it.qty}
                        onChange={(e) => updateQty(it.id, Number(e.target.value) || 1)}
                      />
                      <button className="cd-qtybtn" onClick={() => inc(it)} aria-label="Increase quantity">+</button>
                    </div>
                    <button className="cd-remove" onClick={() => removeFromCart(it.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cd-footer">
          <div className="cd-summary">
            <div>Items: {itemCount}</div>
            <div>Subtotal: <strong>₹{Number(subTotal || 0).toLocaleString()}</strong></div>
          </div>
          <div className="cd-actions">
            <button className="cd-clear" onClick={() => { if (confirm("Clear cart?")) clearCart(); }}>Clear</button>
            <button className="cd-checkout" onClick={() => alert("Checkout coming next. We'll add Razorpay soon.")}>
              Proceed to checkout
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
