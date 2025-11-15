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

    const userId = auth.currentUser.uid;
    let photoURL = null;
    let uploadedFileRef = null;

    try {
      console.log("📤 Starting profile picture upload for user:", userId);

      // Step 1: Upload new profile picture to Firebase Storage
      console.log("📤 Step 1: Uploading file to Firebase Storage...");
      
      if (!storage) {
        throw new Error("Firebase Storage is not initialized. Please check your Firebase configuration.");
      }

      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `profile-pictures/${userId}/${timestamp}_${sanitizedFileName}`;
      uploadedFileRef = ref(storage, storagePath);
      
      // Upload with metadata
      const metadata = {
        contentType: file.type || 'image/jpeg',
        cacheControl: 'public, max-age=31536000',
        customMetadata: {
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
        },
      };
      
      console.log("📤 Uploading to path:", storagePath);
      await uploadBytes(uploadedFileRef, file, metadata);
      console.log("✅ File uploaded successfully");

      // Step 2: Get download URL
      console.log("📤 Step 2: Getting download URL...");
      photoURL = await getDownloadURL(uploadedFileRef);
      console.log("✅ Download URL obtained:", photoURL);

      // Step 3: Update Firebase Auth profile
      console.log("📤 Step 3: Updating Firebase Auth profile...");
      await updateProfile(auth.currentUser, { photoURL });
      console.log("✅ Firebase Auth profile updated");

      // Step 4: Update Firestore with complete user data
      console.log("📤 Step 4: Updating Firestore database...");
      if (db) {
        const userRef = doc(db, "users", userId);
        const userData = {
          uid: userId,
          email: auth.currentUser.email || null,
          displayName: auth.currentUser.displayName || null,
          photoURL: photoURL, // Store the new photoURL
          updatedAt: new Date().toISOString(),
          // Preserve existing data by getting current user data first
          ...(auth.currentUser.displayName && { displayName: auth.currentUser.displayName }),
        };
        
        console.log("📤 Saving to Firestore:", userData);
        await setDoc(userRef, userData, { merge: true });
        console.log("✅ Firestore updated successfully");
      } else {
        console.warn("⚠️ Firestore not initialized, skipping database update");
      }

      // Step 5: Reload user from auth to get the updated photoURL
      console.log("📤 Step 5: Reloading user from Firebase Auth...");
      await auth.currentUser.reload();
      console.log("✅ User reloaded");

      // Step 6: Update local state
      console.log("📤 Step 6: Updating local state...");
      const updatedUser = {
        ...auth.currentUser,
        photoURL: photoURL
      };
      setUser(updatedUser);
      console.log("✅ Local state updated");

      // Step 7: Clean up old profile picture (do this after successful update)
      if (auth.currentUser.photoURL && auth.currentUser.photoURL !== photoURL) {
        try {
          const oldPhotoURL = auth.currentUser.photoURL;
          if (oldPhotoURL.includes("firebasestorage.googleapis.com")) {
            console.log("🗑️ Deleting old profile picture...");
            const url = new URL(oldPhotoURL);
            const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
            if (pathMatch) {
              const decodedPath = decodeURIComponent(pathMatch[1]);
              const oldPhotoRef = ref(storage, decodedPath);
              await deleteObject(oldPhotoRef);
              console.log("✅ Old profile picture deleted");
            }
          }
        } catch (deleteError) {
          console.warn("⚠️ Could not delete old photo (non-critical):", deleteError);
          // Non-critical error, continue
        }
      }

      console.log("🎉 Profile picture update complete!");
      return photoURL;

    } catch (error) {
      console.error("❌ Error updating profile picture:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        stack: error.stack,
      });

      // If upload succeeded but something else failed, try to clean up
      if (uploadedFileRef && photoURL) {
        try {
          console.log("🧹 Cleaning up uploaded file due to error...");
          await deleteObject(uploadedFileRef);
        } catch (cleanupError) {
          console.error("Failed to cleanup uploaded file:", cleanupError);
        }
      }

      // Provide user-friendly error messages
      let errorMessage = "Failed to upload profile picture.";
      
      if (error.code === 'storage/unauthorized') {
        errorMessage = "Storage access denied. Please check Firebase Storage rules in Firebase Console.";
      } else if (error.code === 'storage/canceled') {
        errorMessage = "Upload was canceled.";
      } else if (error.code === 'storage/unknown') {
        errorMessage = "Unknown storage error occurred. Please check your internet connection and try again.";
      } else if (error.code === 'storage/quota-exceeded') {
        errorMessage = "Storage quota exceeded. Please contact support.";
      } else if (error.message?.includes('CORS') || error.message?.includes('cors') || 
                 error.code?.includes('CORS') || error.code?.includes('cors')) {
        errorMessage = "CORS Error: Firebase Storage CORS is not configured. Please run 'npm run setup-cors' or see FIREBASE_STORAGE_CORS_FIX.md for instructions.";
      } else if (error.message?.includes('network') || error.message?.includes('Network')) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      const detailedError = new Error(errorMessage);
      detailedError.originalError = error;
      detailedError.code = error.code;
      throw detailedError;
    }
  };

  const value = { user, loading, signup, login, logout, googleSignIn, updateProfilePicture };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
