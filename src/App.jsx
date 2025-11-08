// src/App.jsx
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import ProductFilter from "./components/ProductFilter";
import ProductPage from "./components/ProductPage";
import Footer from "./components/Footer";
import ScrollReveal from "./components/ScrollReveal";
import ContactForm from "./components/ContactForm";
import AuthModal from "./components/AuthModal";
import { useAuth } from "./context/AuthContext";
import "./index.css";
import PRODUCTS from "./data/products"; // your data file

export default function App() {
  const { user } = useAuth();

  // modal control for login/signup
  const [showAuthModal, setShowAuthModal] = useState(false);

  // close modal automatically after login
  useEffect(() => {
    if (user && showAuthModal) setShowAuthModal(false);
  }, [user, showAuthModal]);

  // prevent body scroll while modal open
  useEffect(() => {
    if (showAuthModal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showAuthModal]);

  // routing via hash (keeps your product page working)
  const [route, setRoute] = useState(window.location.hash || "#home");
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || "#home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // products / filters (unchanged)
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const categories = [
    "All",
    ...Array.from(
      new Set(PRODUCTS.map((p) => (p.category || "").trim()).filter(Boolean))
    ),
  ];

  const filtered = PRODUCTS.filter((p) => {
    const matchCategory = category === "All" || p.category === category;
    const q = query.trim().toLowerCase();
    const matchQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q);
    return matchCategory && matchQuery;
  });

  // helper used to prompt login from any component
  const promptLogin = () => setShowAuthModal(true);

  // open product detail
  const openProduct = (product) => {
    if (!product) return;
    window.location.hash = `#product-${product.id}`;
  };

  // render product page when hash says so
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

  // normal home/products view
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

        <section id="products">
          <ScrollReveal direction="up">
            <ProductFilter
              categories={categories}
              selected={category}
              onSelect={setCategory}
              query={query}
              onQueryChange={setQuery}
            />
          </ScrollReveal>

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
        </section>

        <section id="about">
          <section id="about">
            <ScrollReveal direction="up">
              <div
                className="about-section"
                style={{
                  maxWidth: "900px",
                  margin: "0 auto",
                  padding: "60px 20px",
                  textAlign: "center",
                }}
              >
                <h2
                  style={{
                    fontSize: "2.2rem",
                    color: "#222",
                    marginBottom: "16px",
                  }}
                >
                  About UrbanFrill
                </h2>

                <p
                  style={{
                    color: "#555",
                    lineHeight: "1.8",
                    fontSize: "1.05rem",
                  }}
                >
                  UrbanFrill was founded with a simple belief — every home
                  deserves to feel beautiful, cozy, and uniquely yours. We
                  specialize in
                  <strong>
                    {" "}
                    premium curtains, wallpapers, and customized bedbacks
                  </strong>
                  that bring warmth and personality into your space.
                </p>

                <p
                  style={{
                    color: "#555",
                    lineHeight: "1.8",
                    fontSize: "1.05rem",
                    marginTop: "16px",
                  }}
                >
                  Our team of designers and fabric experts carefully curates
                  textures, patterns, and finishes that blend modern trends with
                  timeless elegance. From selection to installation, we ensure
                  every step is effortless and enjoyable.
                </p>

                <p
                  style={{
                    color: "#555",
                    lineHeight: "1.8",
                    fontSize: "1.05rem",
                    marginTop: "16px",
                  }}
                >
                  Headquartered in Pune, we proudly serve homes across India —
                  transforming windows, walls, and bedrooms into statements of
                  style and comfort.
                </p>

                <h3 style={{ marginTop: "28px", color: "#0d9488" }}>
                  UrbanFrill — Furnish your lifestyle.
                </h3>
              </div>
            </ScrollReveal>
          </section>
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
