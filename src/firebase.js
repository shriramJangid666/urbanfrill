// src/firebase.js
// Uses Vite env keys: VITE_FIREBASE_*
// (API Key etc. should remain the same as your .env.* files)

import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, // optional
};

// ✅ Guard for HMR/StrictMode double init — safe, non-breaking
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Auth with local persistence (matches your current behavior)
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(() => {
  /* ignore non-fatal persistence errors in unsupported envs */
});

export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics only in supported browsers
isSupported()
  .then((ok) => { if (ok) getAnalytics(app); })
  .catch(() => { /* ignore analytics errors */ });
