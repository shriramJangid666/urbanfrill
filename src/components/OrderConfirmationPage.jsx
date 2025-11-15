// src/components/OrderConfirmationPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { productImg, asset } from "../utils/asset";
import { forceTop } from "../utils/scrollToTop";
import "./order-confirmation.css";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [firestoreWarning, setFirestoreWarning] = useState(false);

  useEffect(() => {
    forceTop();
  }, []);

  useEffect(() => {
    const loadOrder = async () => {
      // Check if order data was passed via location state (for local orders)
      if (location.state?.orderData) {
        console.log("📦 Loading order from location state");
        setOrder({
          id: location.state.orderId || orderId,
          ...location.state.orderData,
          payment: location.state.paymentId ? {
            razorpayPaymentId: location.state.paymentId
          } : null,
        });
        setFirestoreWarning(location.state.firestoreError || false);
        setLoading(false);
        return;
      }

      if (!orderId || !db) {
        setError("Invalid order ID");
        setLoading(false);
        return;
      }

      try {
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          setOrder({ id: orderSnap.id, ...orderSnap.data() });
        } else {
          setError("Order not found");
        }
      } catch (err) {
        console.error("Error loading order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, location.state]);

  if (loading) {
    return (
      <div className="order-confirmation-page">
        <div className="order-confirmation-container">
          <div className="order-loading">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-confirmation-page">
        <div className="order-confirmation-container">
          <div className="order-error">
            <h2>Order Not Found</h2>
            <p>{error || "The order you're looking for doesn't exist."}</p>
            <button
              className="order-back-btn"
              onClick={() => navigate("/")}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const paymentMethod = location.state?.paymentMethod || order.paymentMethod || "online";
  const isPaid = order.status === "paid" || paymentMethod === "cod";

  return (
    <div className="order-confirmation-page">
      <div className="order-confirmation-container">
        <div className="order-confirmation-header">
          <div className={`order-status-badge ${isPaid ? "success" : "pending"}`}>
            {isPaid ? "✓ Order Confirmed" : "⏳ Payment Pending"}
          </div>
          <h1>Thank You for Your Order!</h1>
          <p className="order-id">Order ID: {order.id}</p>
        </div>

        <div className="order-confirmation-content">
          <div className="order-summary-card">
            <h2>Order Summary</h2>
            <div className="order-items">
              {order.items?.map((item) => (
                <div key={item.id} className="order-item">
                  <img
                    className="order-item-thumb"
                    src={productImg(item.image)}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.src = asset("images/logo.png"))}
                  />
                  <div className="order-item-info">
                    <div className="order-item-name">{item.name}</div>
                    <div className="order-item-details">
                      <span>Qty: {item.qty}</span>
                      <span>₹{Number(item.price || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="order-total-row">
                <span>Items ({order.itemCount || 0}):</span>
                <span>₹{Number(order.totalAmount || 0).toLocaleString()}</span>
              </div>
              <div className="order-total-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="order-total-row order-total-final">
                <span>Total:</span>
                <strong>₹{Number(order.totalAmount || 0).toLocaleString()}</strong>
              </div>
            </div>
          </div>

          <div className="order-shipping-card">
            <h2>Shipping Address</h2>
            {order.shippingAddress && (
              <div className="shipping-address">
                <p><strong>{order.shippingAddress.name}</strong></p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>
            )}
          </div>

          <div className="order-payment-card">
            <h2>Payment Information</h2>
            <div className="payment-info">
              <p>
                <strong>Payment Method:</strong>{" "}
                {paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment (Razorpay)"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status-${order.status}`}>
                  {order.status === "paid" ? "Paid" : 
                   order.status === "payment_pending" ? "Payment Pending" :
                   order.status === "payment_failed" ? "Payment Failed" :
                   order.status === "pending" ? "Pending" : order.status}
                </span>
              </p>
              {order.payment?.razorpayPaymentId && (
                <p>
                  <strong>Payment ID:</strong> {order.payment.razorpayPaymentId}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="order-confirmation-actions">
          <button
            className="order-continue-btn"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
          <button
            className="order-track-btn"
            onClick={() => navigate("/orders")}
          >
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
}

