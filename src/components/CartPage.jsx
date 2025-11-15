// src/components/CartPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { productImg, asset } from "../utils/asset";
import { forceTop } from "../utils/scrollToTop";
import "./cart-page.css";

export default function CartPage() {
  // Scroll to top when cart page opens
  useEffect(() => {
    forceTop();
  }, []);
  const navigate = useNavigate();
  const { cart, itemCount, subTotal, updateQty, removeFromCart, clearCart } = useCart();

  const inc = (it) => updateQty(it.id, (it.qty || 1) + 1);
  const dec = (it) => updateQty(it.id, Math.max(1, (it.qty || 1) - 1));

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Your Cart</h1>
          {cart.length > 0 && (
            <button
              className="cart-clear-btn"
              onClick={() => {
                if (confirm("Clear cart?")) clearCart();
              }}
            >
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <button
              className="cart-shop-btn"
              onClick={() => navigate("/category/All")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((it) => (
                <div key={it.id} className="cart-item">
                  <img
                    className="cart-item-thumb"
                    src={productImg(it.image)}
                    alt={it.name}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.src = asset("images/logo.png"))}
                  />
                  <div className="cart-item-meta">
                    <div className="cart-item-name">{it.name}</div>
                    <div className="cart-item-price">₹{Number(it.price || 0).toLocaleString()}</div>
                    <div className="cart-item-controls">
                      <div className="cart-item-qty">
                        <button
                          className="cart-qty-btn"
                          onClick={() => dec(it)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={it.qty}
                          onChange={(e) => updateQty(it.id, Number(e.target.value) || 1)}
                        />
                        <button
                          className="cart-qty-btn"
                          onClick={() => inc(it)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(it.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Items:</span>
                <span>{itemCount}</span>
              </div>
              <div className="cart-summary-row">
                <span>Subtotal:</span>
                <strong>₹{Number(subTotal || 0).toLocaleString()}</strong>
              </div>
              <button className="cart-checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              <button
                className="cart-continue-btn"
                onClick={() => navigate("/category/All")}
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

