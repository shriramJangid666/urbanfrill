// src/components/AuthForm.jsx
import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import "./auth.css";

export default function AuthForm() {
  const { signup, login, googleSignIn } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isSignup) {
        await signup(email, password, name || undefined);
      } else {
        await login(email, password);
      }
      // on success, AuthProvider updates user and App auto-closes modal
    } catch (err) {
      console.error('Auth error:', err);
      // Provide more helpful error messages
      let errorMsg = err.message || "Authentication failed";
      if (err.code === 'auth/unauthorized-domain') {
        errorMsg = "Domain not authorized. Check Firebase Console → Authentication → Settings → Authorized domains";
      } else if (err.code === 'auth/network-request-failed') {
        errorMsg = "Network error. Check your connection and Firebase configuration.";
      }
      setError(errorMsg);
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setBusy(true);
    try {
      await googleSignIn();
    } catch (err) {
      console.error('Google sign-in error:', err);
      let errorMsg = err.message || "Google sign-in failed";
      if (err.code === 'auth/unauthorized-domain') {
        errorMsg = "Domain not authorized. Check Firebase Console → Authentication → Settings → Authorized domains";
      }
      setError(errorMsg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-card">
      <h3>{isSignup ? "Create an account" : "Login"}</h3>

      <button
        type="button"
        className="google-btn"
        onClick={handleGoogle}
        disabled={busy}
      >
        <span className="google-icon" aria-hidden />
        Continue with Google
      </button>

      <div className="divider">or</div>

      <form onSubmit={submit} className="auth-form" noValidate>
        {isSignup && (
          <input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete={isSignup ? "new-password" : "current-password"}
        />

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-actions">
          <button type="submit" disabled={busy}>
            {busy ? "Please wait..." : isSignup ? "Sign up" : "Login"}
          </button>

          <button
            type="button"
            className="link-button"
            onClick={() => {
              setIsSignup((s) => !s);
              setError("");
            }}
          >
            {isSignup ? "Already have an account? Login" : "No account? Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
}
