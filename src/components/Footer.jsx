import React from "react";
import "./footer.css";

const PHONE = "917821085631";

export default function Footer() {
  const waLink = `https://wa.me/${PHONE}?text=${encodeURIComponent(
    "Hi! I'm interested in UrbanFrill products."
  )}`;

  return (
    <footer className="uf-footer">
      <div className="footer-container">
        {/* Brand / About */}
        <div className="footer-about">
          <div className="footer-logo">UF</div>
          <h3>UrbanFrill</h3>
          <p>
            Premium furnishings — Curtains, Wallpapers, Bedbacks & more.
            We deliver across India with custom-made quality.
          </p>
        </div>

        {/* Contact info */}
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <ul>
            <li>
              <a href={waLink} target="_blank" rel="noreferrer">
                WhatsApp: +91 78210 85631
              </a>
            </li>
            <li>
              <a href="mailto:urbanfrill@gmail.com">urbanfrill@gmail.com</a>
            </li>
            <li>Pune, Maharashtra, India</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#products">Products</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} UrbanFrill. All rights reserved.</p>
      </div>
    </footer>
  );
}
