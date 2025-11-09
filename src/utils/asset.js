// src/utils/asset.js
export const asset = (p) =>
  `${import.meta.env.BASE_URL}${String(p || "").replace(/^\/+/, "")}`;

/**
 * Return a CLEAN, RELATIVE image path like "images/hero-left.jpg"
 * - strips /urbanfrill/ base
 * - removes any leading slash
 * - normalizes "./" and "public/"
 * - ensures it starts with "images/"
 */
export const productPath = (p) => {
  if (!p) return "images/logo.png";

  let raw = String(p).trim();

  // leave absolute and data URLs alone (we'll return as-is)
  if (/^(https?:)?\/\//i.test(raw) || raw.startsWith("data:")) return raw;

  // strip vite base if present (e.g., "/urbanfrill/")
  const base = import.meta.env.BASE_URL || "/";
  if (raw.startsWith(base)) raw = raw.slice(base.length);

  // common variants
  raw = raw
    .replace(/^\.\/+/, "")      // ./images/a.jpg -> images/a.jpg
    .replace(/^public\/+/, "")  // public/images/a.jpg -> images/a.jpg
    .replace(/^\/+/, "");       // /images/a.jpg -> images/a.jpg

  // safety: if someone saved "urbanfrill/images/..." strip that segment
  raw = raw.replace(/^urbanfrill\/+/, "");

  if (!raw.startsWith("images/")) raw = `images/${raw}`;
  return raw;
};

/** Build a URL that works in dev and on GH Pages */
export const productImg = (p) => {
  // pass through absolute/data URLs
  if (p && (/^(https?:)?\/\//i.test(p) || String(p).startsWith("data:"))) {
    return p;
  }
  return asset(productPath(p)); // add base only at render time
};
