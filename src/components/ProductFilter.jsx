import React, { useMemo } from "react";
import "./product-filter.css";

/**
 * Backward compatible:
 * - categories, selected, onSelect (existing)
 * Optional new props:
 * - minPrice, maxPrice, priceMin, priceMax, onPriceChange
 * - sort, onSortChange  ("relevance" | "price-asc" | "price-desc")
 */
export default function ProductFilter({
  categories = [],
  selected,
  onSelect,
  minPrice = 0,
  maxPrice = 0,
  priceMin,
  priceMax,
  onPriceChange,
  sort = "relevance",
  onSortChange,
}) {
  const items = useMemo(() => categories || [], [categories]);

  const handlePriceMin = (e) =>
    onPriceChange &&
    onPriceChange({ min: Number(e.target.value), max: priceMax });
  const handlePriceMax = (e) =>
    onPriceChange &&
    onPriceChange({ min: priceMin, max: Number(e.target.value) });

  return (
    <aside className="pf-aside" aria-label="Product filters">
      <div className="pf-aside-inner">
        <h4 className="pf-title">Filter by category</h4>
        <nav
          className="pf-list"
          role="listbox"
          aria-activedescendant={selected}
        >
          {items.map((c) => {
            const active = c === selected;
            return (
              <button
                key={c}
                id={c}
                onClick={() => onSelect && onSelect(c)}
                className={`pf-item ${active ? "active" : ""}`}
                aria-pressed={active}
              >
                {c}
              </button>
            );
          })}
        </nav>

        {/* --- Price filter (optional) --- */}
        {onPriceChange ? (
          <div className="pf-block">
            <h4 className="pf-title" style={{ marginTop: 12 }}>
              Price
            </h4>
            <div className="pf-price">
              <label>
                Min
                <input
                  type="number"
                  inputMode="numeric"
                  min={minPrice}
                  max={maxPrice}
                  value={priceMin}
                  onChange={handlePriceMin}
                />
              </label>
              <label>
                Max
                <input
                  type="number"
                  inputMode="numeric"
                  min={minPrice}
                  max={maxPrice}
                  value={priceMax}
                  onChange={handlePriceMax}
                />
              </label>
            </div>
            <div className="pf-hint">
              ₹{minPrice.toLocaleString()} – ₹{maxPrice.toLocaleString()}
            </div>
          </div>
        ) : null}

        {/* --- Sort (optional) --- */}
        {onSortChange ? (
          <div className="pf-block">
            <h4 className="pf-title" style={{ marginTop: 12 }}>
              Sort
            </h4>
            <select
              className="pf-select"
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
