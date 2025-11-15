// src/components/UserDropdown.jsx
import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { CiUser, CiLogout } from "react-icons/ci";
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

  const name = (() => {
    const rawName = user?.displayName || (user?.email ? user.email.split("@")[0] : "User");
    if (!rawName) return "User";
    // Capitalize first letter
    return rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
  })();

  return (
    <div className="user-dropdown" ref={dropdownRef}>
      <div className="user-dropdown-header">
        <div className="user-dropdown-avatar">
          {user?.photoURL ? (
            <img 
              key={user.photoURL}
              src={user.photoURL} 
              alt={name}
              loading="lazy"
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
            className="user-dropdown-avatar-placeholder"
            style={{ display: user?.photoURL ? "none" : "flex" }}
          >
            {name[0]?.toUpperCase() || "U"}
          </div>
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

