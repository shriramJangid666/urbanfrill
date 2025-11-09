// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { productPath } from "../utils/asset"; // ✅ store clean path

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const GUEST_KEY = "uf_cart_guest_v1";
const STORAGE_PREFIX = "uf_cart_"; // uf_cart_<uid>_v1

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
    try {
      const raw = localStorage.getItem(storageKey);
      setCart(raw ? normalizeCart(JSON.parse(raw)) : []);
    } catch {
      setCart([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch {}
  }, [cart, storageKey]);

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

  const itemCount = cart.reduce((s, i) => s + i.qty, 0);
  const subTotal = cart.reduce((s, i) => s + (Number(i.price) || 0) * i.qty, 0);

  const value = {
    cart,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    itemCount,
    subTotal,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
