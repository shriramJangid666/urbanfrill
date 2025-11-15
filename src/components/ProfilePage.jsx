// src/components/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { forceTop } from "../utils/scrollToTop";
import { HiOutlinePhoto } from "react-icons/hi2";
import "./profile-page.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateProfilePicture } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = React.useRef(null);
  
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Scroll to top when profile page opens
  useEffect(() => {
    forceTop();
  }, []);

  // Load user data
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const loadUserData = async () => {
      setLoading(true);
      setLoadingProgress(0);
      
      try {
        // Step 1: Load from Firebase Auth (instant, 50%)
        setLoadingProgress(50);
        const capitalizedName = user.displayName 
          ? user.displayName.charAt(0).toUpperCase() + user.displayName.slice(1).toLowerCase()
          : "";
        
        setFormData((prev) => ({
          ...prev,
          displayName: capitalizedName,
          email: user.email || "",
        }));

        // Step 2: Load additional data from Firestore (background, 50-100%)
        setLoadingProgress(75);
        if (db && user.uid) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setFormData((prev) => ({
              ...prev,
              phone: userData.phone || "",
              address: userData.address || "",
              city: userData.city || "",
              state: userData.state || "",
              pincode: userData.pincode || "",
            }));
          }
        }
        setLoadingProgress(100);
        
        // Small delay to show 100% before hiding loader
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (err) {
        console.error("Error loading user data:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
        setLoadingProgress(0);
      }
    };

    loadUserData();

    // Check if user came from image upload
    const params = new URLSearchParams(window.location.search);
    if (params.get("upload") === "photo") {
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 300);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - accept common image formats
    const validImageTypes = [
      "image/jpeg",
      "image/jpg", 
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml"
    ];
    
    if (!file.type.startsWith("image/") || !validImageTypes.includes(file.type.toLowerCase())) {
      setError("Please select a valid image file (JPEG, PNG, GIF, WebP, or SVG)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setUploadingPhoto(true);
    setError("");
    setSuccess("");

    try {
      console.log("📤 Starting profile picture upload...");
      const photoURL = await updateProfilePicture(file);
      
      console.log("✅ Profile picture uploaded successfully:", photoURL);
      setSuccess("Profile picture updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Force a page refresh to ensure image updates everywhere
      // Small delay to let the state update first
      setTimeout(() => {
        console.log("🔄 Reloading page to show updated image...");
        window.location.reload();
      }, 1000);
      
    } catch (err) {
      console.error("❌ Error uploading photo:", err);
      let errorMsg = err.message || "Failed to update profile picture.";
      
      // Check for CORS error
      if (err.message?.includes('CORS') || err.message?.includes('cors') || 
          err.originalError?.message?.includes('CORS') || 
          err.originalError?.message?.includes('cors') ||
          err.code?.includes('CORS') || err.code?.includes('cors')) {
        errorMsg = "CORS Error: Firebase Storage CORS is not configured. Please run 'npm run setup-cors' or see FIREBASE_STORAGE_CORS_FIX.md for setup instructions.";
      } else if (err.message?.includes('unauthorized') || err.code === 'storage/unauthorized') {
        errorMsg = "Storage access denied. Please check Firebase Storage rules in Firebase Console → Storage → Rules.";
      } else if (err.message?.includes('network') || err.message?.includes('Network')) {
        errorMsg = "Network error. Please check your internet connection and try again.";
      }
      
      setError(errorMsg);
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // Update Firebase Auth profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: formData.displayName,
        });
      }

      // Update Firestore user document
      if (db && user.uid) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            uid: user.uid,
            email: user.email || "",
            displayName: formData.displayName,
            photoURL: user.photoURL || null,
            phone: formData.phone || "",
            address: formData.address || "",
            city: formData.city || "",
            state: formData.state || "",
            pincode: formData.pincode || "",
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-loading">
            <div className="profile-loading-spinner"></div>
            <div className="profile-loading-text">Loading profile...</div>
            <div className="profile-loading-progress">
              <div 
                className="profile-loading-progress-bar"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="profile-loading-percentage">{loadingProgress}%</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <button
            className="profile-back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <h1>My Profile</h1>
        </div>

        <div className="profile-content">
          <div className="profile-info-card">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                {user.photoURL ? (
                  <img 
                    key={user.photoURL}
                    src={user.photoURL} 
                    alt={user.displayName || "User"}
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const placeholder = e.currentTarget.nextElementSibling;
                      if (placeholder) {
                        placeholder.style.display = "flex";
                      }
                    }}
                  />
                ) : null}
                <div 
                  className="profile-avatar-placeholder"
                  style={{ display: user.photoURL ? "none" : "flex" }}
                >
                  {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                </div>
                {uploadingPhoto && (
                  <div className="profile-avatar-overlay">
                    <div className="profile-avatar-spinner"></div>
                  </div>
                )}
              </div>
              <label className="profile-avatar-upload-btn" htmlFor="profile-photo-upload">
                <HiOutlinePhoto size={20} />
                <span>{uploadingPhoto ? "Uploading..." : "Change Photo"}</span>
              </label>
              <input
                ref={fileInputRef}
                id="profile-photo-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                style={{ display: "none" }}
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto}
              />
            </div>
            <div className="profile-email">{user.email}</div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h2>Personal Information</h2>
              
              <div className="form-group">
                <label htmlFor="displayName">Full Name *</label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="disabled-input"
                />
                <small>Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10 digit phone number"
                  pattern="[0-9]{10}"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Address Information</h2>
              
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Street address, apartment, suite, etc."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="pincode">PIN Code</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6 digit PIN code"
                  pattern="[0-9]{6}"
                />
              </div>
            </div>

            {error && <div className="profile-error">{error}</div>}
            {success && <div className="profile-success">{success}</div>}

            <div className="profile-actions">
              <button
                type="submit"
                className="profile-save-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="profile-logout-btn"
                onClick={() => {
                  if (confirm("Are you sure you want to logout?")) {
                    logout();
                    navigate("/");
                  }
                }}
              >
                Logout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

