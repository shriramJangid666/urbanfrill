// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext"; // <-- use auth here

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const GUEST_KEY = "uf_cart_guest_v1";
const STORAGE_PREFIX = "uf_cart_"; // will append uid: uf_cart_<uid>_v1

export function CartProvider({ children }) {
  const { user } = useAuth(); // may be null
  const uid = user?.uid || "guest";
  const storageKey = `${STORAGE_PREFIX}${uid}_v1`;

  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey) || localStorage.getItem(GUEST_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // when the active user (uid) changes, load their cart from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setCart(raw ? JSON.parse(raw) : []);
    } catch {
      setCart([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]); // runs when user changes

  // persist under the user-specific key
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch {}
  }, [cart, storageKey]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + (item.qty || 1) } : p));
      }
      return [...prev, { ...item, qty: item.qty || 1 }];
    });
  };

  const updateQty = (id, qty) => {
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p)));
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((p) => p.id !== id));
  const clearCart = () => setCart([]);

  const itemCount = cart.reduce((s, i) => s + i.qty, 0);
  const subTotal = cart.reduce((s, i) => s + Number(i.price || 0) * i.qty, 0);

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
