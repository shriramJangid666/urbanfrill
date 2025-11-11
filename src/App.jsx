// src/App.jsx
import React, { useEffect, useMemo, useCallback, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import ProductFilter from "./components/ProductFilter";
import ProductPage from "./components/ProductPage";
import Footer from "./components/Footer";
import ScrollReveal from "./components/ScrollReveal";
import ContactForm from "./components/ContactForm";
import AuthModal from "./components/AuthModal";
import { useAuth } from "./context/useAuth";
import "./index.css";
import PRODUCTS from "./data/products";

/* stable style objects */
const PF_GRID_STYLE = { maxWidth: 1100, margin: "20px auto" };
const ABOUT_WRAPPER_STYLE = {
  maxWidth: "900px",
  margin: "0 auto",
  padding: "60px 20px",
  textAlign: "center",
};
const ABOUT_H2_STYLE = {
  fontSize: "2.2rem",
  color: "#222",
  marginBottom: "16px",
};
const ABOUT_P_STYLE = { color: "#555", lineHeight: "1.8", fontSize: "1.05rem" };

export default function App() {
  const { user } = useAuth();

  // Auth modal
  const [showAuthModal, setShowAuthModal] = useState(false);
  useEffect(() => {
    if (user && showAuthModal) setShowAuthModal(false);
  }, [user, showAuthModal]);

  // No horizontal scroll
  useEffect(() => {
    const prev = document.body.style.overflowX;
    document.body.style.overflowX = "hidden";
    return () => (document.body.style.overflowX = prev);
  }, []);

  // Lock body while modal open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (showAuthModal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";
    return () => (document.body.style.overflow = prev || "");
  }, [showAuthModal]);

  // Hash routing
  const [route, setRoute] = useState(window.location.hash || "#home");
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || "#home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Filters (category + search)
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  // Categories list
  const categories = useMemo(() => {
    const unique = new Set(
      PRODUCTS.map((p) => (p.category || "").trim()).filter(Boolean)
    );
    return ["All", ...unique];
  }, []);

  // ---- Step 3: Price range + Sort wiring ----
  const prices = useMemo(() => {
    const nums = PRODUCTS.map((p) => Number(p.price) || 0);
    const min = nums.length ? Math.min(...nums) : 0;
    const max = nums.length ? Math.max(...nums) : 0;
    return { min, max };
  }, []);

  const [priceMin, setPriceMin] = useState(prices.min);
  const [priceMax, setPriceMax] = useState(prices.max);
  const [sort, setSort] = useState("relevance"); // "relevance" | "price-asc" | "price-desc"

  const handlePriceChange = useCallback(
    ({ min, max }) => {
      setPriceMin(Number.isFinite(min) ? min : prices.min);
      setPriceMax(Number.isFinite(max) ? max : prices.max);
    },
    [prices.min, prices.max]
  );

  // Filter + sort products (memoized)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => {
      const price = Number(p.price) || 0;
      const inCat = category === "All" || p.category === category;
      const inPrice = price >= priceMin && price <= priceMax;
      if (!q) return inCat && inPrice;
      const name = (p.name || "").toLowerCase();
      const desc = (p.desc || "").toLowerCase();
      return inCat && inPrice && (name.includes(q) || desc.includes(q));
    });

    if (sort === "price-asc")
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "price-desc")
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    return list;
  }, [category, query, priceMin, priceMax, sort]);

  const promptLogin = useCallback(() => setShowAuthModal(true), []);
  const openProduct = useCallback((product) => {
    if (!product) return;
    window.location.hash = `#product-${product.id}`;
  }, []);

  // Product detail route
  if (route.startsWith("#product-")) {
    const id = Number(route.replace("#product-", ""));
    const product = PRODUCTS.find((p) => p.id === id);
    return (
      <div>
        <AuthModal
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
        <Header onRequestAuth={promptLogin} />
        <main>
          <ScrollReveal direction="up">
            <ProductPage product={product} />
          </ScrollReveal>
          <Footer />
        </main>
      </div>
    );
  }

  // Home / Products
  return (
    <div>
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <Header onRequestAuth={promptLogin} />

      <main>
        <section id="home">
          <ScrollReveal direction="up">
            <Hero />
          </ScrollReveal>
        </section>

        {/* Products Section */}
        {/* Products Section */}
        <section id="products" className="products-section-bg">
          <div className="products-layout">
            {/* DESKTOP sidebar (hidden on mobile via CSS) */}
            <ProductFilter
              categories={categories}
              selected={category}
              onSelect={setCategory}
              minPrice={prices.min}
              maxPrice={prices.max}
              priceMin={priceMin}
              priceMax={priceMax}
              onPriceChange={handlePriceChange}
              sort={sort}
              onSortChange={setSort}
            />

            <div className="products-main">
              {/* Search at top */}
              <div className="products-search">
                <input
                  className="products-search-input"
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search products"
                />
                {/* Mobile-only Filters button */}
                <button
                  className="filters-toggle"
                  type="button"
                  aria-controls="filters-drawer"
                  aria-expanded={false}
                  onClick={() => {
                    document.documentElement.classList.add("no-scroll");
                    document
                      .getElementById("filters-drawer")
                      ?.classList.add("show");
                    document
                      .getElementById("filters-overlay")
                      ?.classList.add("show");
                  }}
                >
                  Filters
                </button>
              </div>

              {/* Products grid */}
              <ScrollReveal direction="up">
                <div
                  className="pf-grid"
                  role="list"
                  style={{ maxWidth: 1100, margin: "20px auto" }}
                >
                  {filtered.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onView={openProduct}
                      promptLogin={promptLogin}
                    />
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Mobile slide-in drawer reusing the same ProductFilter */}
          <div
            id="filters-overlay"
            className="filters-overlay"
            onClick={() => {
              document
                .getElementById("filters-drawer")
                ?.classList.remove("show");
              document
                .getElementById("filters-overlay")
                ?.classList.remove("show");
              document.documentElement.classList.remove("no-scroll");
            }}
          />

          <aside
            id="filters-drawer"
            className="filters-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                document
                  .getElementById("filters-drawer")
                  ?.classList.remove("show");
                document
                  .getElementById("filters-overlay")
                  ?.classList.remove("show");
                document.documentElement.classList.remove("no-scroll");
              }
            }}
          >
            <div className="filters-drawer-bar">
              <span>Filters</span>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => {
                  document
                    .getElementById("filters-drawer")
                    ?.classList.remove("show");
                  document
                    .getElementById("filters-overlay")
                    ?.classList.remove("show");
                  document.documentElement.classList.remove("no-scroll");
                }}
              >
                ✕
              </button>
            </div>

            <div className="filters-drawer-body">
              <ProductFilter
                categories={categories}
                selected={category}
                onSelect={(c) => {
                  setCategory(c);
                }}
                minPrice={prices.min}
                maxPrice={prices.max}
                priceMin={priceMin}
                priceMax={priceMax}
                onPriceChange={handlePriceChange}
                sort={sort}
                onSortChange={setSort}
              />
            </div>

            {/* bottom sticky actions for mobile */}
            <div className="filters-drawer-actions">
              <button
                className="fda-apply"
                type="button"
                onClick={() => {
                  document
                    .getElementById("filters-drawer")
                    ?.classList.remove("show");
                  document
                    .getElementById("filters-overlay")
                    ?.classList.remove("show");
                  document.documentElement.classList.remove("no-scroll");
                }}
              >
                Apply & Close
              </button>
            </div>
          </aside>
        </section>

        <ScrollReveal direction="up">
          <ContactForm />
        </ScrollReveal>

        <section id="contact">
          <Footer />
        </section>
      </main>
    </div>
  );
}
