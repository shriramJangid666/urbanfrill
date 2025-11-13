import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "./Hero";
import ProductCard from "./ProductCard";
import SkeletonProductCard from "./SkeletonProductCard";
import ProductFilter from "./ProductFilter";
import ScrollReveal from "./ScrollReveal";
import ContactForm from "./ContactForm";
import Footer from "./Footer";
import PRODUCTS from "../data/products";
import { productImg } from "../utils/asset";
import "./product-page.css";

function HomePage({ promptLogin = () => {} }) {
  const navigate = useNavigate();

  // Filters (category + search)
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  // Categories list
  const categories = useMemo(() => {
    const unique = new Set(
      PRODUCTS.map((p) => (p.category || "").trim()).filter(Boolean)
    );
    return ["All", ...unique];
  }, []);

  // Price range
  const prices = useMemo(() => {
    const nums = PRODUCTS.map((p) => Number(p.price) || 0);
    const min = nums.length ? Math.min(...nums) : 0;
    const max = nums.length ? Math.max(...nums) : 0;
    return { min, max };
  }, []);

  const [priceMin, setPriceMin] = useState(prices.min);
  const [priceMax, setPriceMax] = useState(prices.max);
  const [sort, setSort] = useState("relevance");

  const handlePriceChange = useCallback(
    ({ min, max }) => {
      setPriceMin(Number.isFinite(min) ? min : prices.min);
      setPriceMax(Number.isFinite(max) ? max : prices.max);
    },
    [prices.min, prices.max]
  );

  // Filter + sort products
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => {
      const price = Number(p.price) || 0;
      const inCat = category === "All" || p.category === category;
      const inPrice = price >= priceMin && price <= priceMax;
      if (!q) return inCat && inPrice;
      const name = (p.name || "").toLowerCase();
      const desc = (p.desc || "").toLowerCase();
      return inCat && inPrice && (name.includes(q) || desc.includes(q));
    });

    if (sort === "price-asc")
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "price-desc")
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    return list;
  }, [category, query, priceMin, priceMax, sort]);

  // Show product skeletons while top images are preloading
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    const PRELOAD_COUNT = 12;
    const REQUIRED_LOADED = 4;
    const toPreload = filtered
      .slice(0, PRELOAD_COUNT)
      .map((p) => (Array.isArray(p.images) && p.images[0]) || p.image)
      .filter(Boolean);

    if (!toPreload.length) return;

    setProductsLoading(true);

    let loaded = 0;
    const imgs = [];
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      setProductsLoading(false);
      imgs.splice(0, imgs.length);
    };

    const timeout = setTimeout(() => finish(), 1200);

    toPreload.forEach((src) => {
      try {
        const img = new Image();
        imgs.push(img);
        img.onload = () => {
          loaded += 1;
          if (loaded >= Math.min(REQUIRED_LOADED, toPreload.length))
            finish();
        };
        img.onerror = () => {
          loaded += 1;
          if (loaded >= Math.min(REQUIRED_LOADED, toPreload.length))
            finish();
        };
        img.src = productImg(src);
      } catch (e) {
        // ignore
      }
    });

    return () => {
      clearTimeout(timeout);
      finished = true;
      imgs.forEach((i) => {
        i.onload = null;
        i.onerror = null;
      });
    };
  }, [filtered]);

  const openProduct = useCallback((product) => {
    if (!product) return;
    navigate(`/product/${product.id}`);
  }, [navigate]);

  const handleCategorySelect = useCallback(
    (cat) => {
      if (cat === "All") {
        setCategory("All");
      } else {
        // Navigate to category page for non-All categories
        navigate(`/category/${encodeURIComponent(cat)}`);
      }
    },
    [navigate]
  );

  return (
    <main>
      <section id="home">
        <ScrollReveal direction="up">
          <Hero />
        </ScrollReveal>
      </section>

      {/* Products Section */}
      <section id="products" className="products-section-bg">
        <div className="products-layout">
          {/* DESKTOP sidebar */}
          <ProductFilter
            categories={categories}
            selected={category}
            onSelect={handleCategorySelect}
            minPrice={prices.min}
            maxPrice={prices.max}
            priceMin={priceMin}
            priceMax={priceMax}
            onPriceChange={handlePriceChange}
            sort={sort}
            onSortChange={setSort}
          />

          <div className="products-main">
            {/* Search */}
            <div className="products-search">
              <input
                className="products-search-input"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search products"
              />
              {/* Mobile-only Filters button */}
              <button
                className="filters-toggle"
                type="button"
                aria-controls="filters-drawer"
                aria-expanded={false}
                onClick={() => {
                  document.documentElement.classList.add("no-scroll");
                  document
                    .getElementById("filters-drawer")
                    ?.classList.add("show");
                  document
                    .getElementById("filters-overlay")
                    ?.classList.add("show");
                }}
              >
                Filters
              </button>
            </div>

            {/* Products grid */}
            <ScrollReveal direction="up">
              <div
                className="pf-grid"
                role="list"
                style={{ maxWidth: "1100px", margin: "20px auto" }}
              >
                {productsLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <SkeletonProductCard key={`sk-${i}`} />
                    ))
                  : filtered.map((p, i) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onView={openProduct}
                        promptLogin={promptLogin}
                        index={i}
                      />
                    ))}
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Mobile filters drawer */}
        <div
          id="filters-overlay"
          className="filters-overlay"
          onClick={() => {
            document
              .getElementById("filters-drawer")
              ?.classList.remove("show");
            document
              .getElementById("filters-overlay")
              ?.classList.remove("show");
            document.documentElement.classList.remove("no-scroll");
          }}
        />

        <aside
          id="filters-drawer"
          className="filters-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              document
                .getElementById("filters-drawer")
                ?.classList.remove("show");
              document
                .getElementById("filters-overlay")
                ?.classList.remove("show");
              document.documentElement.classList.remove("no-scroll");
            }
          }}
        >
          <div className="filters-drawer-bar">
            <span>Filters</span>
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => {
                document
                  .getElementById("filters-drawer")
                  ?.classList.remove("show");
                document
                  .getElementById("filters-overlay")
                  ?.classList.remove("show");
                document.documentElement.classList.remove("no-scroll");
              }}
            >
              ✕
            </button>
          </div>

          <div className="filters-drawer-body">
            <ProductFilter
              categories={categories}
              selected={category}
              onSelect={(c) => {
                if (c === "All") {
                  setCategory("All");
                } else {
                  navigate(`/category/${encodeURIComponent(c)}`);
                }
                document
                  .getElementById("filters-drawer")
                  ?.classList.remove("show");
                document
                  .getElementById("filters-overlay")
                  ?.classList.remove("show");
                document.documentElement.classList.remove("no-scroll");
              }}
              minPrice={prices.min}
              maxPrice={prices.max}
              priceMin={priceMin}
              priceMax={priceMax}
              onPriceChange={handlePriceChange}
              sort={sort}
              onSortChange={setSort}
            />
          </div>

          <div className="filters-drawer-actions">
            <button
              className="fda-apply"
              type="button"
              onClick={() => {
                document
                  .getElementById("filters-drawer")
                  ?.classList.remove("show");
                document
                  .getElementById("filters-overlay")
                  ?.classList.remove("show");
                document.documentElement.classList.remove("no-scroll");
              }}
            >
              Apply & Close
            </button>
          </div>
        </aside>
      </section>

      <ScrollReveal direction="up">
        <ContactForm />
      </ScrollReveal>

      <section id="contact">
        <Footer />
      </section>
    </main>
  );
}

export default React.memo(HomePage);
