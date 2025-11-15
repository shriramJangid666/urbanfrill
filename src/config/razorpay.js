// Razorpay Configuration
// Store these in environment variables for production

export const RAZORPAY_CONFIG = {
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_Rg4aTHpcltnXOf",
  keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET || "4KBbCMveECHSzxbSLgZHRYST",
  // Note: Key secret should NEVER be exposed in frontend code
  // For production, use a backend server to create orders
};

// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.Razorpay && typeof window.Razorpay === 'function') {
      resolve(window.Razorpay);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      // Wait for it to load
      const checkInterval = setInterval(() => {
        if (window.Razorpay && typeof window.Razorpay === 'function') {
          clearInterval(checkInterval);
          resolve(window.Razorpay);
        }
      }, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error("Timeout waiting for Razorpay script to load"));
      }, 10000);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    
    let resolved = false;
    
    script.onload = () => {
      const checkRazorpay = setInterval(() => {
        if (window.Razorpay && typeof window.Razorpay === 'function') {
          clearInterval(checkRazorpay);
          if (!resolved) {
            resolved = true;
            resolve(window.Razorpay);
          }
        }
      }, 50);
      
      setTimeout(() => {
        clearInterval(checkRazorpay);
        if (!resolved) {
          resolved = true;
          reject(new Error("Razorpay object not found after script load"));
        }
      }, 5000);
    };
    
    script.onerror = () => {
      if (!resolved) {
        resolved = true;
        reject(new Error("Failed to load Razorpay script. Please check your internet connection."));
      }
    };
    
    document.head.appendChild(script);
  });
};

