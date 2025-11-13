// src/components/Header.jsx
import React, { useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";
import { asset } from "../utils/asset";
import { TiShoppingCart } from "react-icons/ti";
import { CiUser } from "react-icons/ci";
import "./header.css";

const PRIMARY = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/category/All" },
  { label: "About us", to: "/" },
  { label: "Contact us", to: "/" },
];

const NAV = [
  {
    label: "Curtains",
    to: "/category/Curtains",
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
    to: "/category/Wallpapers",
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
    to: "/category/Bedback",
    items: [
      "Upholstered bedback",
      "Tufted headboard",
      "Sofa reupholstery",
      "Cushions & bolsters",
    ],
  },
  {
    label: "Mattress",
    to: "/category/Mattress",
    items: ["Memory foam", "Orthopedic", "Latex", "Hybrid", "Accessories"],
  },
  {
    label: "Blinds",
    to: "/category/Blinds",
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
    to: "/category/Flooring",
    items: ["Laminate wood", "Engineered wood", "PVC/Vinyl planks", "Skirting"],
  },
];

function Header({ onRequestAuth = () => {} }) {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const [showCart, setShowCart] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const name = useMemo(
    () => user?.displayName || (user?.email ? user.email.split("@")[0] : ""),
    [user]
  );
  const greeting = useMemo(
    () => (user ? `Hi, ${name}` : "Hi there"),
    [user, name]
  );

  const handleNavigate = useCallback(
    (to) => {
      navigate(to);
      setMenuOpen(false);
    },
    [navigate]
  );

  const handleCartClick = useCallback(() => {
    if (!user) {
      onRequestAuth();
      return;
    }
    setShowCart(true);
  }, [user, onRequestAuth]);

  const handleUserClick = useCallback(() => {
    if (!user) onRequestAuth();
  }, [user, onRequestAuth]);

  const handleCloseCart = useCallback(() => setShowCart(false), []);

  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

  return (
    <>
      <header className="uf3-header" role="banner">
        {/* ROW 1: brand | primary | actions */}
        <div className="uf3-top">
          {/* Left: logo + text */}
          <Link
            className="uf3-brand"
            to="/"
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
          </Link>

          {/* Center: primary links */}
          <nav className="uf3-primary" aria-label="Primary">
            {PRIMARY.map((p) => (
              <Link key={p.label} to={p.to}>
                {p.label}
              </Link>
            ))}
          </nav>

          {/* Right: actions */}
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
              onClick={toggleMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* ROW 2: categories */}
        <div className="uf3-catsrow">
          <nav className="uf3-cats" aria-label="Categories">
            {NAV.map((m) => (
              <div key={m.label} className="uf3-cat">
                <button className="uf3-catbtn" onClick={() => handleNavigate(m.to)}>
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
                        onClick={() => {
                          handleNavigate(m.to);
                          document
                            .querySelectorAll(".uf3-cat")
                            .forEach((el) => el.blur());
                        }}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                  <Link
                    className="uf3-viewall"
                    to={m.to}
                  >
                    View all {m.label} →
                  </Link>
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
            <Link
              className="uf3-mobbrand"
              to="/"
              aria-label="UrbanFrill Home"
            >
              <img className="uf3-logo" src={asset("images/logo.png")} alt="" />
              <span className="uf3-title">UrbanFrill</span>
            </Link>
            <button
              className="uf3-close"
              aria-label="Close menu"
              onClick={toggleMenu}
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
              <Link
                key={p.label}
                to={p.to}
                onClick={() => setMenuOpen(false)}
              >
                {p.label}
              </Link>
            ))}
          </div>

          {/* Category accordions */}
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
                  <Link
                    className="uf3-accviewall"
                    to={m.to}
                    onClick={() => setMenuOpen(false)}
                  >
                    View all {m.label} →
                  </Link>
                  {m.items.map((sub) => (
                    <button
                      key={sub}
                      className="uf3-accitem"
                      onClick={() => {
                        handleNavigate(m.to);
                        setMenuOpen(false);
                      }}
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

      <CartDrawer open={showCart} onClose={handleCloseCart} />
    </>
  );
}

export default React.memo(Header);
