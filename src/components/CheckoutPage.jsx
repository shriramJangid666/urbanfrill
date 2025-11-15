// src/components/CheckoutPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/useAuth";
import { productImg, asset } from "../utils/asset";
import { forceTop } from "../utils/scrollToTop";
import { initiatePayment, saveOrderToFirestore } from "../utils/payment";
import PaymentErrorModal from "./PaymentErrorModal";
import "./checkout-page.css";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, itemCount, subTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const orderDataRef = useRef(null); // Store order data for retry

  // Scroll to top when checkout page opens
  useEffect(() => {
    forceTop();
  }, []);

  // Lock body scroll when payment error modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (showPaymentError) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prev || "";
    }
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [showPaymentError]);
  
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "online", // default to online payment
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent any event bubbling
    
    setError("");
    setProcessing(true);
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.address || 
        !formData.city || !formData.state || !formData.pincode) {
      setError("Please fill in all required fields");
      setProcessing(false);
      return;
    }

    try {
      // Create order data
      const orderData = {
        userId: user?.uid || "guest",
        userEmail: formData.email,
        userName: formData.name,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.image,
        })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        totalAmount: subTotal,
        itemCount: itemCount,
        paymentMethod: formData.paymentMethod,
        status: formData.paymentMethod === "cod" ? "pending" : "payment_pending",
        createdAt: new Date().toISOString(),
      };

      // Store order data for retry
      orderDataRef.current = orderData;

      if (formData.paymentMethod === "cod") {
        // Cash on Delivery - Create order directly
        const orderId = await saveOrderToFirestore(orderData);
        
        // Clear cart and redirect to order confirmation
        clearCart();
        navigate(`/order-confirmation/${orderId}`, {
          state: { orderId, paymentMethod: "cod" }
        });
      } else {
        // Online Payment - Initiate Razorpay
        // Generate a temporary order ID (we'll save to Firestore after payment succeeds)
        const tempOrderId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        try {
          // Ensure any Firebase popups are closed before opening Razorpay
          try {
            // Close any open popups (Firebase might have left one open)
            if (window.opener) {
              window.opener = null;
            }
          } catch (e) {
            // Ignore errors
          }
          
          const razorpayInstance = await initiatePayment({
            amount: subTotal,
            orderId: tempOrderId,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            onSuccess: async (paymentResponse) => {
              setProcessing(false);
              try {
                // Save order to Firestore with payment details
                const finalOrderId = await saveOrderToFirestore({
                  ...orderData,
                  status: "paid",
                  payment: {
                    razorpayOrderId: paymentResponse.razorpay_order_id,
                    razorpayPaymentId: paymentResponse.razorpay_payment_id,
                    razorpaySignature: paymentResponse.razorpay_signature,
                    paidAt: new Date().toISOString(),
                  },
                });

                // Clear cart and redirect to success page
                clearCart();
                navigate(`/order-confirmation/${finalOrderId}`, {
                  state: { 
                    orderId: finalOrderId, 
                    paymentMethod: "online",
                    paymentId: paymentResponse.razorpay_payment_id 
                  }
                });
              } catch (error) {
                // Payment succeeded but order save failed - still show success
                const localOrderId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                
                // Still redirect to confirmation with payment details
                clearCart();
                navigate(`/order-confirmation/${localOrderId}`, {
                  state: { 
                    orderId: localOrderId, 
                    paymentMethod: "online",
                    paymentId: paymentResponse.razorpay_payment_id,
                    orderData: orderData,
                    firestoreError: true,
                  }
                });
              }
            },
            onFailure: async (error) => {
              setProcessing(false);
              // Optionally save failed payment attempt (non-blocking)
              try {
                await saveOrderToFirestore({
                  ...orderData,
                  status: "payment_failed",
                  payment: {
                    error: error.error?.description || error.error?.reason || "Payment failed",
                    failedAt: new Date().toISOString(),
                  },
                }).catch(() => {
                  // Non-critical, continue
                });
              } catch {
                // Non-critical, continue
              }
              // Show payment error modal
              setPaymentError(error);
              setShowPaymentError(true);
            },
            onDismiss: () => {
              setProcessing(false);
            },
          });
          
        } catch (paymentError) {
          setPaymentError({
            error: {
              description: paymentError.message || "Failed to open payment gateway. Please check your internet connection and try again."
            }
          });
          setShowPaymentError(true);
          setProcessing(false);
        }
      }
    } catch (err) {
      setPaymentError({
        error: {
          description: err.message || "Failed to process order. Please try again."
        }
      });
      setShowPaymentError(true);
      setProcessing(false);
    }
  };

  // Retry payment handler
  const handleRetryPayment = () => {
    setShowPaymentError(false);
    setPaymentError(null);
    // Retry by submitting the form again
    const form = document.querySelector('.checkout-form');
    if (form) {
      // Create a proper submit event
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);
    }
  };

  // Cancel payment handler
  const handleCancelPayment = () => {
    setShowPaymentError(false);
    setPaymentError(null);
    setProcessing(false);
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
                  <option value="online">Online Payment (Razorpay)</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </div>

              {error && !showPaymentError && (
                <div className="checkout-error" style={{ 
                  color: "#dc2626", 
                  padding: "12px", 
                  background: "#fee", 
                  borderRadius: "6px",
                  marginBottom: "16px"
                }}>
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="checkout-submit-btn"
                disabled={processing}
              >
                {processing ? "Processing..." : formData.paymentMethod === "online" ? "Proceed to Payment" : "Place Order"}
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

      {/* Payment Error Modal */}
      <PaymentErrorModal
        open={showPaymentError}
        error={paymentError}
        onRetry={handleRetryPayment}
        onCancel={handleCancelPayment}
      />
    </div>
  );
}

