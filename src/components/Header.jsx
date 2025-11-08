// src/components/Header.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";
import "./header.css";

export default function Header({ onRequestAuth = () => {} }) {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCartClick = () => {
    if (!user) {
      onRequestAuth(); // open login modal when not logged
      return;
    }
    setShowCart(true);
  };

  return (
    <>
      <header className="uf-header">
        <div className="uf-container">
          <a className="uf-logo" href="#home" onClick={(e) => { e.preventDefault(); window.location.hash = "#home"; setMenuOpen(false); }}>
            <div className="uf-logo-icon">UF</div>
            <div className="uf-logo-text"><h1>UrbanFrill</h1><p>Furnish Your Lifestyle</p></div>
          </a>

          <nav className={`uf-nav ${menuOpen ? "open" : ""}`}>
            <a href="#products" onClick={() => setMenuOpen(false)}>Products</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>

            {!user ? (
              <button className="uf-mobile-login" onClick={() => { setMenuOpen(false); onRequestAuth(); }}>
                Login / Sign up
              </button>
            ) : (
              <button className="uf-mobile-logout" onClick={() => { logout(); setMenuOpen(false); }}>
                Logout
              </button>
            )}
          </nav>

          <div className="uf-actions">
            <button className="uf-cart-btn" onClick={handleCartClick} aria-label="Open cart">
              🛒
              {itemCount > 0 && <span className="uf-cart-count">{itemCount}</span>}
            </button>

            {user ? (
              <>
                <span className="uf-user">Hi, {user.displayName || user.email.split("@")[0]}</span>
                <button className="uf-btn-outline" onClick={() => logout()}>Logout</button>
              </>
            ) : (
              <button className="uf-btn" onClick={() => onRequestAuth()}>Login / Sign up</button>
            )}
          </div>

          <button className={`uf-hamburger ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <CartDrawer open={showCart} onClose={() => setShowCart(false)} />
    </>
  );
}
