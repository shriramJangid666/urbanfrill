import React from "react";
import "./product-card.css";

export default function SkeletonProductCard() {
  return (
    <article className="pc-card" aria-hidden="true">
      <div className="pc-media">
        <div className="skeleton skeleton-media" />
      </div>

      <div className="pc-body">
        <div className="skeleton skeleton-line" style={{ width: "60%", height: 18 }} />
        <div className="skeleton skeleton-line" style={{ width: "80%", height: 14 }} />
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <div className="skeleton skeleton-btn" />
          <div className="skeleton skeleton-btn" />
        </div>
      </div>
    </article>
  );
}
