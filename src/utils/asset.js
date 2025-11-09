// Base-aware path (works in dev and on GH Pages)
export const asset = (p) =>
  `${import.meta.env.BASE_URL}${String(p || '').replace(/^\/+/, '')}`;

// Product image helper:
// - leaves http(s)/data URLs alone
// - strips "./" and "public/"
// - auto-prefixes "images/" if you pass just "products/x.jpg"
export const productImg = (p) => {
  if (!p) return asset('images/placeholder.png');

  const raw = String(p).trim();

  if (/^(https?:)?\/\//i.test(raw) || raw.startsWith('data:')) return raw;

  let clean = raw
    .replace(/^\.\/+/, '')     // ./images/a.jpg -> images/a.jpg
    .replace(/^public\/+/, '') // public/images/a.jpg -> images/a.jpg
    .replace(/^\/+/, '');      // /images/a.jpg -> images/a.jpg

  if (!clean.startsWith('images/')) clean = `images/${clean}`;

  return asset(clean);
};
