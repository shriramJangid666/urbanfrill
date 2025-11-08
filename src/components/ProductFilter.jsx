// src/components/ProductFilter.jsx
import React from "react";
import "./product-filter.css";

export default function ProductFilter({ categories = [], selected, onSelect, query, onQueryChange }) {
  return (
    <div style={{ maxWidth: 1100, margin: "26px auto", padding: "0 18px" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
        <input
          placeholder="🔍 Search products..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          style={{ width: "60%", padding: 12, borderRadius: 8, border: "1px solid #eee" }}
        />
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        {categories.map((c) => {
          const active = c === selected;
          return (
            <button
              key={c}
              onClick={() => onSelect(c)}
              className={`pf-chip ${active ? "active" : ""}`}
              aria-pressed={active}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
