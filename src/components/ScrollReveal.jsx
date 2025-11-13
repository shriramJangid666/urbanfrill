import { useEffect, useRef } from "react";
import "./animations.css";

/**
 * Wrap any children inside <ScrollReveal> to animate on scroll.
 * props: direction = "up" | "left" | "right"
 */
export default function ScrollReveal({ children, direction = "up", delay = 0 }) {
  const ref = useRef();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    // Some mobile browsers (or anchor jumps) can leave the element
    // already in view before the observer fires; do a small sanity
    // check on mount and reveal immediately if already visible.
    try {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        // Respect the provided delay but ensure the element becomes visible
        setTimeout(() => {
          el.classList.add("visible");
          try {
            observer.unobserve(el);
          } catch (e) {
            // ignore if observer already disconnected
          }
        }, delay);
      }
    } catch (e) {
      // ignore any errors accessing layout (e.g., server-side)
    }

    // Safety fallback: if for any reason the observer doesn't trigger
    // (layout thrash, heavy images, browser quirk), reveal after
    // a short timeout so users don't see a blank area.
    const fallbackMs = Math.max(300, delay + 300);
    const fallback = setTimeout(() => {
      if (!el.classList.contains("visible")) {
        el.classList.add("visible");
        try {
          observer.unobserve(el);
        } catch (e) {
          // ignore
        }
      }
    }, fallbackMs);

    return () => {
      clearTimeout(fallback);
      observer.disconnect();
    };
  }, [delay]);

  const dirClass =
    direction === "left" ? "reveal-left" :
    direction === "right" ? "reveal-right" : "";

  return <div ref={ref} className={`reveal ${dirClass}`}>{children}</div>;
}
