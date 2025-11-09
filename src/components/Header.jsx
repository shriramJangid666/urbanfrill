// src/components/Header.jsx
import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";
import "./header.css";

// ⚙️ Edit menu here
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
  const [open, setOpen] = useState(null); // which desktop menu is open
  const hoverTimer = useRef();

  const [mobileSection, setMobileSection] = useState(null); // which accordion section is open

  const toggleMobile = (i) => {
    setMobileSection((prev) => (prev === i ? null : i)); // accordion: open one at a time
  };

  const handleCartClick = () => {
    if (!user) {
      onRequestAuth();
      return;
    }
    setShowCart(true);
  };

  // Desktop hover helpers
  const openMenu = (i) => {
    clearTimeout(hoverTimer.current);
    setOpen(i);
  };
  const closeMenu = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(null), 120);
  };

  const go = (hash) => {
    window.location.hash = hash;
    setMenuOpen(false);
    setOpen(null);
  };

  const handleSubClick = (parent, sub) => {
    // If later you filter client-side, call a prop like onSelectCategory(parent.label, sub)
    go(parent.hash);
  };

  return (
    <>
      <header className="uf-header">
        <div className="uf-container">
          {/* Brand */}
          <a
            className="uf-logo"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              go("#home");
            }}
          >
            <div className="uf-logo-icon">UF</div>
            <div className="uf-logo-text">
              <h1>UrbanFrill</h1>
              <p>Furnish Your Lifestyle</p>
            </div>
          </a>

          {/* Desktop navigation with hover mega-menus */}
          <nav className="uf-nav-desktop" onMouseLeave={closeMenu}>
            {NAV.map((m, i) => (
              <div
                key={m.label}
                className={`uf-navitem ${open === i ? "is-open" : ""}`}
                onMouseEnter={() => openMenu(i)}
              >
                <button
                  className="uf-toplink"
                  aria-haspopup="true"
                  aria-expanded={open === i}
                  onFocus={() => openMenu(i)}
                  onBlur={closeMenu}
                  onClick={() => go(m.hash)}
                >
                  {m.label}
                </button>

                <div className="uf-panel" role="menu">
                  <div className="uf-panelgrid">
                    {m.items.map((sub) => (
                      <button
                        key={sub}
                        className="uf-subitem"
                        role="menuitem"
                        onClick={() => handleSubClick(m, sub)}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                  <a
                    className="uf-viewall"
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

            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                go("#about");
              }}
            >
              About
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                go("#contact");
              }}
            >
              Contact
            </a>
          </nav>

          {/* Right actions */}
          <div className="uf-actions">
            <button
              className="uf-cart-btn"
              onClick={handleCartClick}
              aria-label="Open cart"
            >
              🛒
              {itemCount > 0 && (
                <span className="uf-cart-count">{itemCount}</span>
              )}
            </button>

            {user ? (
              <>
                <span className="uf-user">
                  Hi, {user.displayName || user.email.split("@")[0]}
                </span>
                <button className="uf-btn-outline" onClick={() => logout()}>
                  Logout
                </button>
              </>
            ) : (
              <button className="uf-btn" onClick={() => onRequestAuth()}>
                Login / Sign up
              </button>
            )}

            {/* Mobile burger */}
            <button
              className={`uf-hamburger ${menuOpen ? "active" : ""}`}
              onClick={() => setMenuOpen((s) => !s)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile drawer (click-to-open categories) */}
        {/* Mobile drawer (accordion) */}
        <div className={`uf-drawer ${menuOpen ? "show" : ""}`}>
          {NAV.map((m, i) => {
            const open = mobileSection === i;
            return (
              <div className={`uf-acc`} key={m.label}>
                <button
                  className={`uf-acc-trigger ${open ? "is-open" : ""}`}
                  aria-expanded={open}
                  aria-controls={`acc-panel-${i}`}
                  onClick={() => toggleMobile(i)}
                >
                  <span>{m.label}</span>
                  <span className="uf-caret" aria-hidden>
                    ▾
                  </span>
                </button>

                <div
                  id={`acc-panel-${i}`}
                  className={`uf-acc-panel ${open ? "open" : ""}`}
                  role="region"
                >
                  <div className="uf-acc-list">
                    {/* “View all” first */}
                    <a
                      className="uf-acc-viewall"
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
                        className="uf-acc-item"
                        onClick={() => handleSubClick(m, sub)}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <a
            className="uf-drawerlink"
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              go("#about");
            }}
          >
            About
          </a>
          <a
            className="uf-drawerlink"
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              go("#contact");
            }}
          >
            Contact
          </a>

          {!user ? (
            <button
              className="uf-mobile-login"
              onClick={() => {
                setMenuOpen(false);
                onRequestAuth();
              }}
            >
              Login / Sign up
            </button>
          ) : (
            <button
              className="uf-mobile-logout"
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
            >
              Logout
            </button>
          )}
        </div>
      </header>

      <CartDrawer open={showCart} onClose={() => setShowCart(false)} />
    </>
  );
}
