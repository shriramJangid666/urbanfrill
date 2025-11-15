// src/App.jsx
import { useEffect, useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductPage from "./components/ProductPage";
import Footer from "./components/Footer";
import ScrollReveal from "./components/ScrollReveal";
import ContactForm from "./components/ContactForm";
import AuthModal from "./components/AuthModal";
import CategoryPage from "./components/CategoryPage";
import HomePage from "./components/HomePage";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import ProfilePage from "./components/ProfilePage";
import { useAuth } from "./context/useAuth";
import "./index.css";

export default function App() {
  const { user } = useAuth();

  // Auth modal
  const [showAuthModal, setShowAuthModal] = useState(false);
  useEffect(() => {
    if (user && showAuthModal) setShowAuthModal(false);
  }, [user, showAuthModal]);

  // No horizontal scroll
  useEffect(() => {
    const prev = document.body.style.overflowX;
    document.body.style.overflowX = "hidden";
    return () => (document.body.style.overflowX = prev);
  }, []);

  // Lock body while modal open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (showAuthModal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";
    return () => (document.body.style.overflow = prev || "");
  }, [showAuthModal]);

  const promptLogin = useCallback(() => setShowAuthModal(true), []);

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div>
        <AuthModal
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
        <Header onRequestAuth={promptLogin} />

        <Routes>
          <Route path="/" element={<HomePage promptLogin={promptLogin} />} />
          <Route
            path="/products"
            element={
              <Navigate to="/category/All" replace />
            }
          />
          <Route
            path="/category/:category"
            element={<CategoryPage promptLogin={promptLogin} />}
          />
          <Route
            path="/product/:productId"
            element={
              <div>
                <main>
                  <ScrollReveal direction="up">
                    <ProductPage promptLogin={promptLogin} />
                  </ScrollReveal>
                  <Footer />
                </main>
              </div>
            }
          />
          <Route
            path="/cart"
            element={
              <div>
                <main>
                  <CartPage />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/checkout"
            element={
              <div>
                <main>
                  <CheckoutPage />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/profile"
            element={
              <div>
                <main>
                  <ProfilePage />
                </main>
                <Footer />
              </div>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
