// src/components/Header.jsx
import React, { useState, useMemo, useCallback, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/CartContext";
import { asset } from "../utils/asset";
import { TiShoppingCart } from "react-icons/ti";
import { CiUser } from "react-icons/ci";
import UserDropdown from "./UserDropdown";
import ProductCard from "./ProductCard";
import PRODUCTS from "../data/products";
import "./header.css";

const PRIMARY = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/category/All" },
  { label: "About us", to: "/" },
  { label: "Contact us", to: "/#contact" },
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
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userButtonRef = useRef(null);

  const name = useMemo(() => {
    const rawName = user?.displayName || (user?.email ? user.email.split("@")[0] : "");
    if (!rawName) return "";
    // Capitalize first letter
    return rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
  }, [user]);
  
  const greeting = useMemo(
    () => (user ? `Hi, ${name}` : "Hi there"),
    [user, name]
  );

  const handleNavigate = useCallback(
    (to) => {
      if (to && to.startsWith("/#")) {
        // Scroll to element on same page if already at home,
        // otherwise navigate to home and pass the target id in state
        const elementId = to.substring(2);
        if (location.pathname === "/") {
          setTimeout(() => {
            const element = document.getElementById(elementId);
            if (element) element.scrollIntoView({ behavior: "smooth" });
          }, 100);
        } else {
          navigate("/", { state: { scrollTo: elementId } });
        }
      } else {
        navigate(to);
      }
      setMenuOpen(false);
    },
    [navigate, location]
  );

  const handleCartClick = useCallback(() => {
    if (!user) {
      onRequestAuth();
      return;
    }
    navigate("/cart");
  }, [user, onRequestAuth, navigate]);

  const handleUserClick = useCallback(() => {
    if (!user) {
      onRequestAuth();
    } else {
      setUserMenuOpen((prev) => !prev);
    }
  }, [user, onRequestAuth]);

  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

  // Get 3 featured products for mobile menu
  const featuredProducts = useMemo(() => {
    return PRODUCTS.slice(0, 3);
  }, []);

  const openProduct = useCallback((product) => {
    if (!product) return;
    navigate(`/product/${product.id}`, { state: { from: location.pathname } });
    setMenuOpen(false);
  }, [navigate, location.pathname]);

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
            onClick={(e) => {
              if (location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                setMenuOpen(false);
              } else {
                setMenuOpen(false);
              }
            }}
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
              p.to.startsWith("/#") ? (
                <button key={p.label} onClick={() => handleNavigate(p.to)} className="uf3-link">
                  {p.label}
                </button>
              ) : (
                <Link
                  key={p.label}
                  to={p.to}
                  onClick={(e) => {
                    setMenuOpen(false);
                    if (p.to === "/") {
                      if (location.pathname === "/") {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }
                  }}
                >
                  {p.label}
                </Link>
              )
            ))}
          </nav>

          {/* Right: actions */}
          <div className="uf3-actions">
            <div className="uf3-user-wrapper uf3-hide-on-mobile" style={{ position: "relative" }}>
              <button
                ref={userButtonRef}
                className={`uf3-user ${userMenuOpen ? "active" : ""}`}
                onClick={handleUserClick}
                title={user ? name : "Login / Sign up"}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                {user?.photoURL ? (
                  <img 
                    key={user.photoURL}
                    src={user.photoURL} 
                    alt={name || "User"}
                    loading="lazy"
                    className="uf3-user-img"
                    style={{ 
                      display: "block", 
                      width: "24px", 
                      height: "24px", 
                      borderRadius: "50%", 
                      objectFit: "cover",
                      border: "1px solid rgba(0, 0, 0, 0.1)"
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const icon = e.currentTarget.nextElementSibling;
                      if (icon) icon.style.display = "block";
                    }}
                  />
                ) : null}
                <CiUser 
                  size={18} 
                  aria-hidden 
                  className="uf3-user-icon"
                  style={{ display: user?.photoURL ? "none" : "block" }}
                />
                <span className="uf3-greeting">{greeting}</span>
              </button>
              {user && (
                <UserDropdown
                  isOpen={userMenuOpen}
                  onClose={() => setUserMenuOpen(false)}
                  triggerRef={userButtonRef}
                />
              )}
            </div>

            <button
              className="uf3-cart uf3-hide-on-mobile"
              onClick={handleCartClick}
              aria-label="Open cart"
              title="Cart"
            >
              <TiShoppingCart size={18} aria-hidden />
              {itemCount > 0 && <span className="uf3-badge">{itemCount}</span>}
            </button>

            {!user && (
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
                <button
                  className="uf3-catbtn"
                  onClick={(e) => {
                    handleNavigate(m.to);
                    e.currentTarget.blur();
                  }}
                >
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
                    onClick={() => {
                      setMenuOpen(false);
                      document
                        .querySelectorAll(".uf3-cat")
                        .forEach((el) => el.blur());
                    }}
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
              onClick={(e) => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setMenuOpen(false);
                } else {
                  setMenuOpen(false);
                }
              }}
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
              onClick={() => {
                if (!user) {
                  onRequestAuth();
                } else {
                  navigate("/profile");
                  setMenuOpen(false);
                }
              }}
            >
              {user?.photoURL ? (
                <img 
                  key={user.photoURL}
                  src={user.photoURL} 
                  alt={name || "User"}
                  loading="lazy"
                  className="uf3-mob-user-img"
                  style={{ 
                    display: "block", 
                    width: "24px", 
                    height: "24px", 
                    borderRadius: "50%", 
                    objectFit: "cover",
                    border: "1px solid rgba(0, 0, 0, 0.1)"
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const icon = e.currentTarget.nextElementSibling;
                    if (icon) icon.style.display = "block";
                  }}
                />
              ) : null}
              <CiUser 
                size={18} 
                aria-hidden 
                className="uf3-mob-user-icon"
                style={{ display: user?.photoURL ? "none" : "block" }}
              />
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

          </div>

          {/* Primary links */}
          <div className="uf3-mobile-primary">
            {PRIMARY.map((p) => (
              p.to.startsWith("/#") ? (
                <button
                  key={p.label}
                  className="uf3-mobile-link"
                  onClick={() => handleNavigate(p.to)}
                >
                  {p.label}
                </button>
              ) : (
                <Link
                  key={p.label}
                  to={p.to}
                  onClick={() => setMenuOpen(false)}
                >
                  {p.label}
                </Link>
              )
            ))}
          </div>

          {/* Featured Products Section */}
          <div className="uf3-mobile-products">
            <h3 className="uf3-mobile-products-title">Featured Products</h3>
            <div className="uf3-mobile-products-grid">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onView={openProduct}
                  promptLogin={() => {}}
                  index={index}
                />
              ))}
            </div>
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
    </>
  );
}

export default React.memo(Header);
