// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Hardcoded config (development). Replace with your own if needed.
const firebaseConfig = {
  apiKey: "AIzaSyDePYTiCDa4tfK6c1jtUIgFS5qRMfBBCuM",
  authDomain: "urbanfrill-d936e.firebaseapp.com",
  projectId: "urbanfrill-d936e",
  storageBucket: "urbanfrill-d936e.firebasestorage.app",
  messagingSenderId: "356720198088",
  appId: "1:356720198088:web:eb678dfaca7804504dc0fd",
  measurementId: "G-XH4WPERDEJ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
