// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/useAuth";
import { productPath } from "../utils/asset"; // ✅ store clean path
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const CartContext = createContext();
const GUEST_KEY = "uf_cart_guest_v1";
const STORAGE_PREFIX = "uf_cart_"; // uf_cart_<uid>_v1

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const uid = user?.uid || "guest";
  const storageKey = `${STORAGE_PREFIX}${uid}_v1`;

  const normalizeCart = (raw) => {
    if (!Array.isArray(raw)) return [];
    return raw.map((it) => ({
      ...it,
      // ✅ ensure we store a CLEAN relative path, not a base-prefixed URL
      image: productPath(it.image || ""),
      qty: Math.max(1, Number(it.qty) || 1),
      price: Number(it.price) || 0,
    }));
  };

  const [cart, setCart] = useState(() => {
    try {
      const raw =
        localStorage.getItem(storageKey) || localStorage.getItem(GUEST_KEY);
      return raw ? normalizeCart(JSON.parse(raw)) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        // prefer Firestore cart for logged-in users
        if (uid !== "guest" && db) {
          const ref = doc(db, "carts", uid);
          const snap = await getDoc(ref);
          if (snap && snap.exists()) {
            const data = snap.data();
            if (mounted && data && Array.isArray(data.items)) {
              setCart(normalizeCart(data.items));
              return;
            }
          }
        }

        const raw = localStorage.getItem(storageKey) || localStorage.getItem(GUEST_KEY);
        if (mounted) setCart(raw ? normalizeCart(JSON.parse(raw)) : []);
      } catch {
        if (mounted) setCart([]);
      }
    };
    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch {
      // ignore storage errors silently
    }
  }, [cart, storageKey]);

  // sync to Firestore for logged-in users
  useEffect(() => {
    if (!db) return;
    if (uid === "guest") return; // don't write guest carts

    const ref = doc(db, "carts", uid);
    const write = async () => {
      try {
        await setDoc(ref, { items: cart }, { merge: true });
      } catch {
        // non-fatal, keep local copy
      }
    };
    write();
  }, [cart, uid]);

  const addToCart = (item) => {
    setCart((prev) => {
      const normalized = {
        ...item,
        image: productPath(item.image || ""), // ✅ store clean path
        qty: Math.max(1, Number(item.qty) || 1),
        price: Number(item.price) || 0,
      };
      const existing = prev.find((p) => p.id === normalized.id);
      if (existing) {
        return prev.map((p) =>
          p.id === normalized.id ? { ...p, qty: p.qty + normalized.qty } : p
        );
      }
      return [...prev, normalized];
    });
  };

  const updateQty = (id, qty) =>
    setCart((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: Math.max(1, Number(qty) || 1) } : p
      )
    );

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((p) => p.id !== id));
  const clearCart = () => setCart([]);

  const { itemCount, subTotal } = useMemo(
    () => ({
      itemCount: cart.reduce((s, i) => s + i.qty, 0),
      subTotal: cart.reduce((s, i) => s + (Number(i.price) || 0) * i.qty, 0),
    }),
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      itemCount,
      subTotal,
    }),
    [cart, itemCount, subTotal]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
