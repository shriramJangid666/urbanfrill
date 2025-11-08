// src/components/AuthModal.jsx
import React from "react";
import AuthForm from "./AuthForm";
import "./auth-modal.css";

export default function AuthModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="am-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="am-card" onClick={(e) => e.stopPropagation()}>
        <button className="am-close" onClick={onClose} aria-label="Close">✕</button>
        <AuthForm />
      </div>
    </div>
  );
}
