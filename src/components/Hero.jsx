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
  curtains: "hero-curtain.webp",
  wallpapers: "hero-wallpaper.webp",
  bedback: "hero-bedback.webp",
  mattress: "hero-mattress.webp",
  blinds: "hero-blinds.webp",
  flooring: "hero-flooring.webp",
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
          src={asset("images/hero-left.webp")}
          alt="Featured large"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      </figure>
      <figure className="collage-small top card">
        <img
          src={asset("images/hero-topright.webp")}
          alt="Featured detail 1"
          loading="lazy"
          decoding="async"
        />
      </figure>
      <figure className="collage-small bottom card">
        <img
          src={asset("images/hero-bottomright.webp")}
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
  const [loaded, setLoaded] = React.useState(false);
  return (
    <figure className="hero-single card">
      <img
        src={src}
        alt={label}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0.7, transition: "opacity 0.3s ease" }}
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const rotateTimerRef = useRef(null);
  const transitionTimerRef = useRef(null);

  const idx = useMemo(() => CATS.findIndex((c) => c.id === active), [active]);
  const nextId = CATS[(idx + 1) % CATS.length].id;
  const prevId = CATS[(idx - 1 + CATS.length) % CATS.length].id;
  const currentCat = CATS[idx];
  const { title, desc, cta } = copy[active];

  // Auto-rotate — preload next image
  useEffect(() => {
    if (rotateTimerRef.current) clearTimeout(rotateTimerRef.current);
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    
    // Preload the next slide's image for smoother transition
    const nextIdx = (idx + 1) % CATS.length;
    const nextCatId = CATS[nextIdx].id;
    // If the upcoming slide is the featured collage, preload its three images
    if (nextCatId === "featured") {
      const imgs = [
        asset("images/hero-left.webp"),
        asset("images/hero-topright.webp"),
        asset("images/hero-bottomright.webp"),
      ];
      imgs.forEach((s) => {
        const img = new Image();
        img.src = s;
      });
    } else {
      const nextImg = new Image();
      nextImg.src = asset(`images/${fileMap[nextCatId]}`);
    }
    
    rotateTimerRef.current = setTimeout(() => {
      setIsTransitioning(true);
      // After transition completes, update active and reset position instantly
      transitionTimerRef.current = setTimeout(() => {
        setActive(nextId);
        // Use requestAnimationFrame to ensure DOM update happens before reset
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsTransitioning(false);
          });
        });
      }, 600); // Match CSS transition duration
    }, ROTATE_MS);
    return () => {
      if (rotateTimerRef.current) clearTimeout(rotateTimerRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [active, nextId, idx]);

  // Cleanup
  useEffect(
    () => () => {
      if (rotateTimerRef.current) clearTimeout(rotateTimerRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    },
    []
  );

  const isFeatured = active === "featured";
  const isNextFeatured = nextId === "featured";
  const isPrevFeatured = prevId === "featured";

  return (
    <section className="hero">
      <div className="hero-container">
        {/* LEFT: slider with right→left motion */}
        <div className="hero-media">
          <div 
            className="slider carousel" 
            data-transitioning={isTransitioning ? "true" : "false"}
          >
            {/* Previous slide (off-screen left) */}
            <div className="slide prev">
              {isPrevFeatured ? (
                <FeaturedSlide />
              ) : (
                <SingleSlide
                  id={prevId}
                  label={CATS.find((c) => c.id === prevId)?.label}
                />
              )}
            </div>

            {/* Current slide (visible) */}
            <div className="slide current">
              {isFeatured ? (
                <FeaturedSlide priority />
              ) : (
                <SingleSlide id={active} label={currentCat.label} priority />
              )}
            </div>

            {/* Next slide (off-screen right, ready to slide in) */}
            <div className="slide next">
              {isNextFeatured ? (
                <FeaturedSlide />
              ) : (
                <SingleSlide
                  id={nextId}
                  label={CATS.find((c) => c.id === nextId)?.label}
                />
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
