// src/components/UserDropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { CiUser, CiSettings, CiLogout } from "react-icons/ci";
import { HiOutlinePhoto } from "react-icons/hi2";
import "./user-dropdown.css";

export default function UserDropdown({ isOpen, onClose, triggerRef }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!user || !isOpen) return null;

  const handleProfile = () => {
    navigate("/profile");
    onClose();
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
      onClose();
    }
  };

  const name = user?.displayName || (user?.email ? user.email.split("@")[0] : "User");

  return (
    <div className="user-dropdown" ref={dropdownRef}>
      <div className="user-dropdown-header">
        <div className="user-dropdown-avatar">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={name} />
          ) : (
            <div className="user-dropdown-avatar-placeholder">
              {name[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>
        <div className="user-dropdown-info">
          <div className="user-dropdown-name">{name}</div>
          <div className="user-dropdown-email">{user.email}</div>
        </div>
      </div>

      <div className="user-dropdown-divider"></div>

      <div className="user-dropdown-menu">
        <button
          className="user-dropdown-item"
          onClick={handleProfile}
          aria-label="View Profile"
        >
          <CiUser size={20} />
          <span>My Profile</span>
        </button>

        <label className="user-dropdown-item" htmlFor="profile-image-upload">
          <HiOutlinePhoto size={20} />
          <span>Change Photo</span>
          <input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // This will be handled by ProfilePage
                navigate("/profile?upload=photo");
                onClose();
              }
            }}
          />
        </label>

        <button
          className="user-dropdown-item"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <CiLogout size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

