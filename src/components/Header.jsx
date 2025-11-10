// src/components/Header.jsx
import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";
import { asset } from "../utils/asset";
import { TiShoppingCart } from "react-icons/ti";
import { CiUser } from "react-icons/ci";
import "./header.css";

const PRIMARY = [
  { label: "Home", hash: "#home" },
  { label: "Products", hash: "#products" },
  { label: "About us", hash: "#about" },
  { label: "Contact us", hash: "#contact" },
];

const NAV = [
  {
    label: "Curtains",
    hash: "#products?cat=Curtains",
    items: [
      "Plain curtains",
      "Textured curtains",
      "Embroidery curtains",
      "Cotton curtains",
      "Sheer curtains",
      "Curtains with borders",
    ],
  },
  {
    label: "Wallpapers",
    hash: "#products?cat=Wallpapers",
    items: [
      "Floral",
      "Geometric",
      "Kids & playful",
      "Textured",
      "Premium vinyl",
      "Custom print",
    ],
  },
  {
    label: "Bedback & Sofa",
    hash: "#products?cat=Bedback",
    items: [
      "Upholstered bedback",
      "Tufted headboard",
      "Sofa reupholstery",
      "Cushions & bolsters",
    ],
  },
  {
    label: "Mattress",
    hash: "#products?cat=Mattress",
    items: ["Memory foam", "Orthopedic", "Latex", "Hybrid", "Accessories"],
  },
  {
    label: "Blinds",
    hash: "#products?cat=Blinds",
    items: [
      "Roller blinds",
      "Zebra / day-night",
      "Roman blinds",
      "Vertical blinds",
      "Wooden Venetian",
    ],
  },
  {
    label: "Wood & PVC Flooring",
    hash: "#products?cat=Flooring",
    items: ["Laminate wood", "Engineered wood", "PVC/Vinyl planks", "Skirting"],
  },
];

export default function Header({ onRequestAuth = () => {} }) {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  const [showCart, setShowCart] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // mobile drawer

  const name =
    user?.displayName || (user?.email ? user.email.split("@")[0] : "");
  const greeting = user ? `Hi, ${name}` : "Hi there";

  const go = (hash) => {
    window.location.hash = hash;
    setMenuOpen(false);
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCartClick = () => {
    if (!user) {
      onRequestAuth();
      return;
    }
    setShowCart(true);
  };

  const handleUserClick = () => {
    if (!user) onRequestAuth();
  };

  return (
    <>
      <header className="uf3-header" role="banner">
        {/* ROW 1: brand | primary | actions */}
        <div className="uf3-top">
          {/* Left: logo + text (desktop left, mobile centered via CSS) */}
          <a
            className="uf3-brand"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              go("#home");
            }}
            aria-label="UrbanFrill Home"
          >
            <img
              className="uf3-logo"
              src={asset("images/logo.png")}
              alt="UrbanFrill"
              onError={(e) => (e.currentTarget.style.visibility = "hidden")}
            />
            <span className="uf3-brandtext">
              <span className="uf3-title">UrbanFrill</span>
              <span className="uf3-tag">Furnish Your Lifestyle</span>
            </span>
          </a>

          {/* Center: primary links (hidden on mobile) */}
          <nav className="uf3-primary" aria-label="Primary">
            {PRIMARY.map((p) => (
              <a
                key={p.label}
                href={p.hash}
                onClick={(e) => {
                  e.preventDefault();
                  go(p.hash);
                }}
              >
                {p.label}
              </a>
            ))}
          </nav>

          {/* Right: actions (on mobile we show ONLY the burger; user/cart hidden via CSS) */}
          <div className="uf3-actions">
            <button
              className="uf3-user uf3-hide-on-mobile"
              onClick={handleUserClick}
              title={user ? name : "Login / Sign up"}
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt={name || "User"} />
              ) : (
                <CiUser size={18} aria-hidden />
              )}
              <span className="uf3-greeting">{greeting}</span>
            </button>

            <button
              className="uf3-cart uf3-hide-on-mobile"
              onClick={handleCartClick}
              aria-label="Open cart"
              title="Cart"
            >
              <TiShoppingCart size={18} aria-hidden />
              {itemCount > 0 && <span className="uf3-badge">{itemCount}</span>}
            </button>

            {user ? (
              <button className="uf3-ghost uf3-hide-on-mobile" onClick={logout}>
                Logout
              </button>
            ) : (
              <button
                className="uf3-primarybtn uf3-hide-on-mobile"
                onClick={onRequestAuth}
              >
                Login / Sign up
              </button>
            )}

            {/* Hamburger (always rendered; only visible on mobile) */}
            <button
              className={`uf3-burger ${menuOpen ? "is-open" : ""}`}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* ROW 2: categories (hidden on mobile) */}
        <div className="uf3-catsrow">
          <nav className="uf3-cats" aria-label="Categories">
            {NAV.map((m) => (
              <div key={m.label} className="uf3-cat">
                <button className="uf3-catbtn" onClick={() => go(m.hash)}>
                  {m.label}
                  <svg
                    className="uf3-caret"
                    viewBox="0 0 16 16"
                    width="14"
                    height="14"
                    aria-hidden
                  >
                    <path
                      d="M4 6l4 4 4-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
                <div className="uf3-panel" role="menu">
                  <div className="uf3-grid">
                    {m.items.map((sub) => (
                      <button
                        key={sub}
                        className="uf3-sub"
                        role="menuitem"
                        onClick={() => go(m.hash)}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                  <a
                    className="uf3-viewall"
                    href={m.hash}
                    onClick={(e) => {
                      e.preventDefault();
                      go(m.hash);
                    }}
                  >
                    View all {m.label} →
                  </a>
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* MOBILE FULLSCREEN MENU */}
        <div
          className={`uf3-mobile ${menuOpen ? "show" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          {/* sticky header inside drawer with close */}
          <div className="uf3-mobbar">
            <a
              className="uf3-mobbrand"
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                go("#home");
              }}
              aria-label="UrbanFrill Home"
            >
              <img className="uf3-logo" src={asset("images/logo.png")} alt="" />
              <span className="uf3-title">UrbanFrill</span>
            </a>
            <button
              className="uf3-close"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* user + cart live in the menu on mobile */}
          <div className="uf3-mob-user">
            <button
              className="uf3-mob-userbtn"
              onClick={() => (!user ? onRequestAuth() : null)}
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt={name || "User"} />
              ) : (
                <CiUser size={18} aria-hidden />
              )}
              <span>{user ? `Hi, ${name}` : "Login / Sign up"}</span>
            </button>

            <button
              className="uf3-mob-cartbtn"
              onClick={() => {
                setMenuOpen(false);
                handleCartClick();
              }}
            >
              <TiShoppingCart size={18} aria-hidden />
              <span>Cart {itemCount > 0 ? `(${itemCount})` : ""}</span>
            </button>

            {user && (
              <button
                className="uf3-mob-logout"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </button>
            )}
          </div>

          {/* Primary links */}
          <div className="uf3-mobile-primary">
            {PRIMARY.map((p) => (
              <a
                key={p.label}
                href={p.hash}
                onClick={(e) => {
                  e.preventDefault();
                  go(p.hash);
                }}
              >
                {p.label}
              </a>
            ))}
          </div>

          {/* Category accordions (+ changes to × when open) */}
          <div className="uf3-mobile-cats">
            {NAV.map((m) => (
              <details className="uf3-acc" key={m.label}>
                <summary className="uf3-accbtn">
                  <span>{m.label}</span>
                  <span className="uf3-plus" aria-hidden>
                    +
                  </span>
                </summary>
                <div className="uf3-accpanel" role="region">
                  <a
                    className="uf3-accviewall"
                    href={m.hash}
                    onClick={(e) => {
                      e.preventDefault();
                      go(m.hash);
                    }}
                  >
                    View all {m.label} →
                  </a>
                  {m.items.map((sub) => (
                    <button
                      key={sub}
                      className="uf3-accitem"
                      onClick={() => go(m.hash)}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </header>

      <CartDrawer open={showCart} onClose={() => setShowCart(false)} />
    </>
  );
}
