// src/components/PaymentErrorModal.jsx
import React from "react";
import "./payment-error-modal.css";

export default function PaymentErrorModal({ open, error, onRetry, onCancel }) {
  if (!open) return null;

  const errorMessage = error?.error?.description || error?.error?.reason || error?.message || "Oops! Something went wrong. Don't worry, no charges were made.";

  return (
    <div className="pem-overlay" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="pem-card" onClick={(e) => e.stopPropagation()}>
        <div className="pem-icon">😊</div>
        <h2 className="pem-title">Payment Didn't Go Through</h2>
        <p className="pem-message">{errorMessage}</p>
        <p className="pem-subtitle">No worries! You can try again or continue shopping.</p>
        <div className="pem-actions">
          <button className="pem-btn pem-btn-retry" onClick={onRetry}>
            Try Again
          </button>
          <button className="pem-btn pem-btn-cancel" onClick={onCancel}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

