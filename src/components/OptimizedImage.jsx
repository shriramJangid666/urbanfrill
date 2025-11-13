// src/components/OptimizedImage.jsx
import React, { useRef, useState, useEffect, memo } from "react";

/** small SVG shimmer placeholder */
function shimmerDataUri(w = 700, h = 475) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg width="${w}" height="${h}" xmlns='http://www.w3.org/2000/svg' version='1.1'><defs><linearGradient id='g'><stop stop-color='#f6f7f8' offset='0%'/><stop stop-color='#ececed' offset='50%'/><stop stop-color='#f6f7f8' offset='100%'/></linearGradient></defs><rect width='100%' height='100%' fill='#f6f7f8'/><rect width='100%' height='100%' fill='url(#g)'><animate attributeName='x' from='-100%' to='100%' dur='1.2s' repeatCount='indefinite' /></rect></svg>`
  )}`;
}

const OptimizedImage = memo(function OptimizedImage({
  src,
  alt = "",
  width,
  height,
  srcSet,
  sizes,
  className,
  loading = "lazy",
  priority = false,
  style,
  ...rest
}) {
  const imgRef = useRef(null);
  const [inView, setInView] = useState(priority ? true : loading === "eager");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (inView || typeof window === "undefined") return;
    const node = imgRef.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin: "250px", threshold: 0.01 }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, [inView]);

  const wrapperStyle =
    width && height
      ? { position: "relative", paddingBottom: `${(height / width) * 100}%`, overflow: "hidden", ...style }
      : { display: "inline-block", ...style };

  const imgStyle = width && height ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } : { width: "100%", height: "auto", objectFit: "cover" };

  return (
    <div className={`opt-img-wrapper ${className || ""}`} style={wrapperStyle} ref={imgRef}>
      {!loaded && (
        <img
          src={shimmerDataUri(width || 700, height || 475)}
          aria-hidden="true"
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(0.4px)" }}
        />
      )}

      {inView && (
        <picture>
          <img
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            style={imgStyle}
            onLoad={() => setLoaded(true)}
            {...rest}
          />
        </picture>
      )}
    </div>
  );
});

export default OptimizedImage;
