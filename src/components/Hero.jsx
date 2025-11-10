import React, { useEffect, useMemo, useState, useRef } from "react";
import "./hero.css";
import { asset } from "../utils/asset";

const PHONE = "917821085631";
const ROTATE_MS = 5000; // per-slide duration
const CLICK_PAUSE_MS = 10000; // pause 10s after user click

const CATS = [
  { id: "featured", label: "Featured", anchor: "#products" },
  { id: "curtains", label: "Curtains", anchor: "#curtains" },
  { id: "wallpapers", label: "Wallpapers", anchor: "#wallpapers" },
  { id: "bedback", label: "Bedback & Sofa", anchor: "#bedback" },
  { id: "mattress", label: "Mattress", anchor: "#mattress" },
  { id: "blinds", label: "Blinds", anchor: "#blinds" },
  { id: "flooring", label: "Wood & PVC Flooring", anchor: "#flooring" },
];

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

function FeaturedSlide() {
  return (
    <div className="hero-collage">
      <figure className="collage-big card">
        <img
          src={asset("images/hero-left.jpg")}
          alt="Featured large"
          loading="eager"
        />
      </figure>
      <figure className="collage-small top card">
        <img
          src={asset("images/hero-topright.jpg")}
          alt="Featured detail 1"
          loading="lazy"
        />
      </figure>
      <figure className="collage-small bottom card">
        <img
          src={asset("images/hero-bottomright.jpg")}
          alt="Featured detail 2"
          loading="lazy"
        />
      </figure>
    </div>
  );
}

function SingleSlide({ id, label }) {
  const src = asset(`images/${fileMap[id]}`);
  return (
    <figure className="hero-single card">
      <img src={src} alt={label} loading="eager" />
      <figcaption className="badge">{label}</figcaption>
      <div className="scrim" />
    </figure>
  );
}

export default function Hero() {
  const [active, setActive] = useState("featured");
  const [prev, setPrev] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimerRef = useRef(null);
  const rotateTimerRef = useRef(null);

  const idx = useMemo(() => CATS.findIndex((c) => c.id === active), [active]);
  const nextId = CATS[(idx + 1) % CATS.length].id;

  const goTo = (id, pauseAfterClick = false) => {
    if (id === active) return;
    setPrev(active);
    setActive(id);

    if (pauseAfterClick) {
      // clear any previous timers
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      if (rotateTimerRef.current) clearTimeout(rotateTimerRef.current);

      setIsPaused(true);
      pauseTimerRef.current = setTimeout(() => {
        setIsPaused(false); // resume auto after 10s
      }, CLICK_PAUSE_MS);
    }
  };

  // Auto-rotate (only runs when not paused)
  useEffect(() => {
    if (isPaused) return;
    if (rotateTimerRef.current) clearTimeout(rotateTimerRef.current);

    rotateTimerRef.current = setTimeout(() => {
      setPrev(active);
      setActive(nextId);
    }, ROTATE_MS);

    return () => {
      if (rotateTimerRef.current) clearTimeout(rotateTimerRef.current);
    };
  }, [active, isPaused, nextId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      if (rotateTimerRef.current) clearTimeout(rotateTimerRef.current);
    };
  }, []);

  const currentCat = CATS[idx];
  const { title, desc, cta } = copy[active];

  return (
    <section className="hero">
      <div className="hero-container">
        {/* LEFT: slider with right→left motion */}
        <div className="hero-media">
          <div
            className={`slider ${prev ? "animating two" : "single"}`}
            onAnimationEnd={() => setPrev(null)}
          >
            {prev && (
              <div className="slide prev">
                {prev === "featured" ? (
                  <FeaturedSlide />
                ) : (
                  <SingleSlide
                    id={prev}
                    label={CATS.find((c) => c.id === prev)?.label}
                  />
                )}
              </div>
            )}

            <div className={`slide current ${prev ? "with-prev" : ""}`}>
              {active === "featured" ? (
                <FeaturedSlide />
              ) : (
                <SingleSlide id={active} label={currentCat.label} />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: text + category chips */}
        <div className="hero-text">
          <div
            className="hero-tabs"
            role="tablist"
            aria-label="Hero categories"
          >
            {CATS.map((c) => {
              const isActive = active === c.id;
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`tab ${isActive ? "active" : ""}`}
                  onClick={() => goTo(c.id, true)} // pause 10s on click
                  title={c.label}
                >
                  <span className="tab-label">{c.label}</span>
                </button>
              );
            })}
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
