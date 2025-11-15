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
import { auth, db, storage } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
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
      } catch {
        // Non-fatal: ignore Firestore errors but keep auth working
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
    } catch {
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

  const updateProfilePicture = async (file) => {
    if (!auth.currentUser || !file) {
      throw new Error("User not authenticated or no file provided");
    }

    try {
      // Delete old profile picture if exists (only if it's in our storage)
      if (auth.currentUser.photoURL && storage) {
        try {
          // Only delete if it's a Firebase Storage URL
          if (auth.currentUser.photoURL.includes("firebasestorage.googleapis.com")) {
            // Extract path from URL: https://firebasestorage.../o/profile-pictures%2F...?alt=media
            const url = new URL(auth.currentUser.photoURL);
            const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
            if (pathMatch) {
              const decodedPath = decodeURIComponent(pathMatch[1]);
              const oldPhotoRef = ref(storage, decodedPath);
              await deleteObject(oldPhotoRef);
            }
          }
        } catch {
          // Ignore errors when deleting old photo (might be external URL or already deleted)
        }
      }

      // Upload new profile picture
      const fileRef = ref(storage, `profile-pictures/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const photoURL = await getDownloadURL(fileRef);

      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, { photoURL });
      
      // Update Firestore
      if (db) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(
          userRef,
          {
            photoURL,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }

      // Update local state
      setUser({ ...auth.currentUser, photoURL });
      
      return photoURL;
    } catch (error) {
      console.error("Error updating profile picture:", error);
      throw error;
    }
  };

  const value = { user, loading, signup, login, logout, googleSignIn, updateProfilePicture };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
