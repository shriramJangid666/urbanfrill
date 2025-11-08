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
    return () => observer.disconnect();
  }, [delay]);

  const dirClass =
    direction === "left" ? "reveal-left" :
    direction === "right" ? "reveal-right" : "";

  return <div ref={ref} className={`reveal ${dirClass}`}>{children}</div>;
}
