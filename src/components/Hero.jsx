import React from "react";
import "./hero.css";

const PHONE = "917821085631";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        {/* LEFT - Collage */}
        <div className="hero-collage">
          <div className="collage-big">
            <img src="/images/hero-left.jpg" alt="Curtains" />
          </div>
          <div className="collage-small top">
            <img src="/images/hero-topright.jpg" alt="Wallpaper" />
          </div>
          <div className="collage-small bottom">
            <img src="/images/hero-bottomright.jpg" alt="Bedback" />
          </div>
        </div>

        {/* RIGHT - Text */}
        <div className="hero-text">
          <h2>Furnish Your Lifestyle</h2>
          <p>
            Explore our range of custom furnishings — curtains, wallpapers, bedbacks,
            and flooring. Designed for modern homes across Pune and nearby.
          </p>

          <div className="hero-buttons">
            <a href="#products" className="btn btn-dark">Browse Products</a>
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
