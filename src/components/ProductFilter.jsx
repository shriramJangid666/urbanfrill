import React, { useMemo, useState } from "react";
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
  onReset,
}) {
  const items = useMemo(() => categories || [], [categories]);
  const [tempMin, setTempMin] = useState(priceMin);
  const [tempMax, setTempMax] = useState(priceMax);

  // Sync temp values when props change
  React.useEffect(() => {
    setTempMin(priceMin);
    setTempMax(priceMax);
  }, [priceMin, priceMax]);

  const handleApplyPrice = () => {
    onPriceChange && onPriceChange({ min: tempMin, max: tempMax });
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      // Fallback: reset individual filters if no reset handler
      if (onSelect) onSelect("All");
      if (onPriceChange) onPriceChange({ min: minPrice, max: maxPrice });
      if (onSortChange) onSortChange("relevance");
      setTempMin(minPrice);
      setTempMax(maxPrice);
    }
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    const hasCategory = selected && selected !== "All";
    const hasPrice = (priceMin !== minPrice) || (priceMax !== maxPrice);
    const hasSort = sort && sort !== "relevance";
    return hasCategory || hasPrice || hasSort;
  }, [selected, priceMin, priceMax, minPrice, maxPrice, sort]);

  return (
    <aside className="pf-aside" aria-label="Product filters">
      <div className="pf-aside-inner">
        {onReset && hasActiveFilters && (
          <button
            className="pf-reset-btn"
            onClick={handleReset}
            type="button"
            aria-label="Reset all filters"
          >
            Reset Filters
          </button>
        )}
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
                  value={tempMin}
                  onChange={(e) => setTempMin(Number(e.target.value))}
                />
              </label>
              <label>
                Max
                <input
                  type="number"
                  inputMode="numeric"
                  min={minPrice}
                  max={maxPrice}
                  value={tempMax}
                  onChange={(e) => setTempMax(Number(e.target.value))}
                />
              </label>
            </div>
            <div className="pf-hint">
              ₹{minPrice.toLocaleString()} – ₹{maxPrice.toLocaleString()}
            </div>
            <button className="pf-apply-btn" onClick={handleApplyPrice}>
              Apply Price
            </button>
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
