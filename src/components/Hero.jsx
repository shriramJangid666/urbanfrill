import React, { useEffect, useMemo, useState, useRef } from "react";
import "./hero.css";
import { asset } from "../utils/asset";

const PHONE = "918005827701";
const ROTATE_MS = 3000; // per-slide duration

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

function FeaturedSlide({ priority = false }) {
  return (
    <div className="hero-collage">
      <figure className="collage-big card">
        <img
          src={asset("images/hero-left.jpg")}
          alt="Featured large"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      </figure>
      <figure className="collage-small top card">
        <img
          src={asset("images/hero-topright.jpg")}
          alt="Featured detail 1"
          loading="lazy"
          decoding="async"
        />
      </figure>
      <figure className="collage-small bottom card">
        <img
          src={asset("images/hero-bottomright.jpg")}
          alt="Featured detail 2"
          loading="lazy"
          decoding="async"
        />
      </figure>
    </div>
  );
}

function SingleSlide({ id, label, priority = false }) {
  const src = asset(`images/${fileMap[id]}`);
  return (
    <figure className="hero-single card">
      <img
        src={src}
        alt={label}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchpriority={priority ? "high" : "auto"}
      />
      <figcaption className="badge">{label}</figcaption>
      <div className="scrim" />
    </figure>
  );
}

export default function Hero() {
  // start on a random category each visit (looks fresh)
  const [active, setActive] = useState(() => {
    const i = Math.floor(Math.random() * CATS.length);
    return CATS[i].id;
  });
  const [prev, setPrev] = useState(null);
  const rotateTimerRef = useRef(null);

  const idx = useMemo(() => CATS.findIndex((c) => c.id === active), [active]);
  const nextId = CATS[(idx + 1) % CATS.length].id;
  const currentCat = CATS[idx];
  const { title, desc, cta } = copy[active];

  // Auto-rotate
  useEffect(() => {
    if (rotateTimerRef.current) clearTimeout(rotateTimerRef.current);
    rotateTimerRef.current = setTimeout(() => {
      setPrev(active);
      setActive(nextId);
    }, ROTATE_MS);
    return () => rotateTimerRef.current && clearTimeout(rotateTimerRef.current);
  }, [active, nextId]);

  // Cleanup
  useEffect(
    () => () => rotateTimerRef.current && clearTimeout(rotateTimerRef.current),
    []
  );

  const isFeatured = active === "featured";

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
              {isFeatured ? (
                <FeaturedSlide priority />
              ) : (
                <SingleSlide id={active} label={currentCat.label} priority />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: text only (chips removed) */}
        <div className="hero-text">
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
