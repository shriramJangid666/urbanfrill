import React, { useEffect, useMemo, useRef, useState } from "react";
import "./hero.css";
import { asset } from "../utils/asset";

const PHONE = "917821085631";
const ROTATE_MS = 4500; // per-slide duration (also drives the progress bar)

const CATS = [
  { id: "featured", label: "Featured", anchor: "#products" },
  { id: "curtains", label: "Curtains", anchor: "#curtains" },
  { id: "wallpapers", label: "Wallpapers", anchor: "#wallpapers" },
  { id: "bedback", label: "Bedback & Sofa", anchor: "#bedback" },
  { id: "mattress", label: "Mattress", anchor: "#mattress" },
  { id: "blinds", label: "Blinds", anchor: "#blinds" },
  { id: "flooring", label: "Wood & PVC Flooring", anchor: "#flooring" },
];

// hero images available in /public/images
const fileMap = {
  curtains: "hero-curtain.jpg",
  wallpapers: "hero-wallpaper.jpg",
  bedback: "hero-bedback.jpg",
  mattress: "hero-mattress.jpg",
  blinds: "hero-blinds.jpg",
  flooring: "hero-flooring.jpg",
};

const copy = {
  featured: {
    title: "Furnish Your Lifestyle",
    desc: "Explore custom furnishings across curtains, wallpapers, bedbacks, mattresses, blinds and flooring.",
    cta: "Browse Products",
  },
  curtains: {
    title: "Luxury Curtains",
    desc: "Soft light and elegant drape for living and bedrooms.",
    cta: "Shop Curtains",
  },
  wallpapers: {
    title: "Designer Wallpapers",
    desc: "Statement patterns and premium textures for every wall.",
    cta: "Shop Wallpapers",
  },
  bedback: {
    title: "Bedback & Sofa",
    desc: "Upholstered comfort that looks and feels premium.",
    cta: "Explore Upholstery",
  },
  mattress: {
    title: "Mattresses",
    desc: "Support engineered for deeper, restorative sleep.",
    cta: "Shop Mattresses",
  },
  blinds: {
    title: "Blinds",
    desc: "Clean lines with precise light control.",
    cta: "Shop Blinds",
  },
  flooring: {
    title: "Wood & PVC Flooring",
    desc: "Warm, durable finishes for modern homes.",
    cta: "Shop Flooring",
  },
};

export default function Hero() {
  const [active, setActive] = useState("featured");
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0–100
  const wrapRef = useRef(null);

  const idx = useMemo(() => CATS.findIndex((c) => c.id === active), [active]);
  const next = () => setActive(CATS[(idx + 1) % CATS.length].id);
  const prev = () => setActive(CATS[(idx - 1 + CATS.length) % CATS.length].id);

  // progress bar timer
  useEffect(() => {
    setProgress(0);
    if (paused) return;

    const started = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - started;
      const pct = Math.min(100, (elapsed / ROTATE_MS) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(tick);
        next();
      }
    }, 50);

    return () => clearInterval(tick);
  }, [active, paused]);

  // keyboard support (←/→)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [idx]);

  // media sources
  const featured = {
    big: asset("images/hero-left.jpg"),
    top: asset("images/hero-topright.jpg"),
    bottom: asset("images/hero-bottomright.jpg"),
  };
  const single =
    active !== "featured" ? asset(`images/${fileMap[active]}`) : null;

  const currentCat = CATS[idx];
  const { title, desc, cta } = copy[active];

  return (
    <section className="hero">
      <div
        className="hero-container"
        ref={wrapRef}
        tabIndex={0}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* LEFT: uniform media box for all modes */}
        <div className="hero-media">
          {active === "featured" ? (
            <div className="hero-collage" aria-live="polite">
              <figure className="collage-big card">
                <img
                  key="feat-big"
                  src={featured.big}
                  alt="Featured large"
                  loading="eager"
                />
              </figure>
              <figure className="collage-small top card">
                <img
                  key="feat-top"
                  src={featured.top}
                  alt="Featured detail 1"
                  loading="lazy"
                />
              </figure>
              <figure className="collage-small bottom card">
                <img
                  key="feat-bot"
                  src={featured.bottom}
                  alt="Featured detail 2"
                  loading="lazy"
                />
              </figure>
            </div>
          ) : (
            <figure className="hero-single card" aria-live="polite">
              <img
                key={active}
                src={single}
                alt={currentCat.label}
                loading="eager"
              />
              <figcaption className="badge">{currentCat.label}</figcaption>
              <div className="scrim" />
            </figure>
          )}

          {/* dots (active dot fills with progress) */}
          <div className="dots" role="tablist" aria-label="Slides">
            {CATS.map((c) => {
              const isActive = active === c.id;
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`dot ${isActive ? "active" : ""}`}
                  onClick={() => setActive(c.id)}
                  title={c.label}
                  // feed progress (0–100) into CSS var for conic-gradient
                  style={isActive ? { ["--pct"]: `${progress}%` } : undefined}
                />
              );
            })}
          </div>
        </div>

        {/* RIGHT: text changes with image */}
        <div className="hero-text">
          {/* chips hidden on mobile via CSS */}
          <div
            className="hero-tabs"
            role="tablist"
            aria-label="Hero categories"
          >
            {CATS.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={active === c.id}
                className={`tab ${active === c.id ? "active" : ""}`}
                onClick={() => setActive(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <h2>{title}</h2>
          <p>{desc}</p>

          <div className="hero-buttons">
            <a href={currentCat.anchor} className="btn btn-dark">
              {cta}
            </a>
            <a
              href={`https://wa.me/${PHONE}?text=${encodeURIComponent(
                "Hi, I'm interested in UrbanFrill products."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp"
            >
              WhatsApp Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
