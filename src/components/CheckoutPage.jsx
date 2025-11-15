// src/components/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/useAuth";
import { productImg, asset } from "../utils/asset";
import { forceTop } from "../utils/scrollToTop";
import "./checkout-page.css";

export default function CheckoutPage() {
  // Scroll to top when checkout page opens
  useEffect(() => {
    forceTop();
  }, []);
  const navigate = useNavigate();
  const { cart, itemCount, subTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod", // cash on delivery
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.address || 
        !formData.city || !formData.state || !formData.pincode) {
      alert("Please fill in all required fields");
      return;
    }

    // Here you would typically:
    // 1. Create an order in Firebase
    // 2. Process payment (Razorpay integration)
    // 3. Send confirmation email
    // 4. Clear cart
    // 5. Redirect to order confirmation page

    // For now, just show a success message
    alert(`Order placed successfully!\n\nOrder Total: ₹${Number(subTotal || 0).toLocaleString()}\n\nWe'll contact you soon for delivery.`);
    
    // Clear cart and redirect
    clearCart();
    navigate("/");
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-empty">
            <h2>Your cart is empty</h2>
            <p>Add some items to your cart before checkout.</p>
            <button
              className="checkout-shop-btn"
              onClick={() => navigate("/category/All")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <button
            className="checkout-back-btn"
            onClick={() => navigate("/cart")}
          >
            ← Back to Cart
          </button>
        </div>

        <div className="checkout-content">
          <div className="checkout-form-section">
            <h2>Shipping Information</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  placeholder="10 digit phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Street address, apartment, suite, etc."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="pincode">PIN Code *</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{6}"
                  placeholder="6 digit PIN code"
                />
              </div>

              <div className="form-group">
                <label htmlFor="paymentMethod">Payment Method *</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="online" disabled>Online Payment (Coming Soon)</option>
                </select>
              </div>

              <button type="submit" className="checkout-submit-btn">
                Place Order
              </button>
            </form>
          </div>

          <div className="checkout-summary-section">
            <h2>Order Summary</h2>
            <div className="checkout-items">
              {cart.map((it) => (
                <div key={it.id} className="checkout-item">
                  <img
                    className="checkout-item-thumb"
                    src={productImg(it.image)}
                    alt={it.name}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.src = asset("images/logo.png"))}
                  />
                  <div className="checkout-item-info">
                    <div className="checkout-item-name">{it.name}</div>
                    <div className="checkout-item-details">
                      <span>Qty: {it.qty}</span>
                      <span>₹{Number(it.price || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-totals">
              <div className="checkout-total-row">
                <span>Items ({itemCount}):</span>
                <span>₹{Number(subTotal || 0).toLocaleString()}</span>
              </div>
              <div className="checkout-total-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="checkout-total-row checkout-total-final">
                <span>Total:</span>
                <strong>₹{Number(subTotal || 0).toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

