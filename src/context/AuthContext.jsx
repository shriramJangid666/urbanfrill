// src/context/AuthContext.jsx
import React, { useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "./AuthContextValue";

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      // Persist minimal user profile to Firestore for later use (non-blocking)
      try {
        if (u && db) {
          const ref = doc(db, "users", u.uid);
          await setDoc(
            ref,
            {
              uid: u.uid,
              email: u.email || null,
              displayName: u.displayName || null,
              photoURL: u.photoURL || null,
              lastSeen: new Date().toISOString(),
            },
            { merge: true }
          );
        }
      } catch (err) {
        // Non-fatal: ignore Firestore errors but keep auth working
        // console.warn("Failed to write user profile to Firestore:", err);
      }
    });
    return unsub;
  }, []);

  const signup = async (email, password, displayName) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const signedUser = res.user;
    if (displayName) {
      await updateProfile(signedUser, { displayName });
      setUser({ ...signedUser, displayName });
    }
    // write user profile to Firestore
    try {
      if (signedUser && db) {
        await setDoc(doc(db, "users", signedUser.uid), {
          uid: signedUser.uid,
          email: signedUser.email || null,
          displayName: displayName || signedUser.displayName || null,
          photoURL: signedUser.photoURL || null,
          createdAt: new Date().toISOString(),
        }, { merge: true });
      }
    } catch (err) {
      // ignore
    }
    return signedUser;
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    return res.user;
  };

  const value = { user, loading, signup, login, logout, googleSignIn };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
