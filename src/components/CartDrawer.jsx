// src/components/CartDrawer.jsx
import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import "./cart-drawer.css";

export default function CartDrawer({ open, onClose }) {
  const { cart, itemCount, subTotal, updateQty, removeFromCart, clearCart } = useCart();

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="cd-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <aside
        className="cd-drawer cd-left"
        onClick={(e) => e.stopPropagation()}
        aria-label="Cart drawer"
      >
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
                <img src={it.image} alt={it.name} className="cd-thumb" />
                <div className="cd-meta">
                  <div className="cd-name">{it.name}</div>
                  <div className="cd-price">₹{it.price}</div>
                  <div className="cd-controls">
                    <input
                      type="number"
                      min="1"
                      value={it.qty}
                      onChange={(e) => updateQty(it.id, Number(e.target.value) || 1)}
                    />
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
            <div>Subtotal: <strong>₹{subTotal}</strong></div>
          </div>

          <div className="cd-actions">
            <button className="cd-clear" onClick={() => { if (confirm("Clear cart?")) clearCart(); }}>
              Clear
            </button>
            <button
              className="cd-checkout"
              onClick={() => alert("Checkout coming next. We'll add Razorpay flow soon.")}
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
