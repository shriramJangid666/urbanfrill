// Payment utilities for Razorpay integration
import { loadRazorpayScript, RAZORPAY_CONFIG } from "../config/razorpay";
import { db } from "../firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";

/**
 * Create a Razorpay order
 * Note: In production, this should be done on your backend server
 * For now, we'll create a mock order ID (Razorpay requires backend for order creation)
 */
export const createRazorpayOrder = async (amount, currency = "INR") => {
  // In production, call your backend API to create order
  // For now, we'll use Razorpay's frontend-only approach
  // which creates order on the fly
  
  const orderData = {
    amount: Math.round(amount * 100), // Convert to paise
    currency: currency,
    receipt: `order_${Date.now()}`,
  };

  // For production, make API call to your backend:
  // const response = await fetch('/api/create-razorpay-order', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(orderData)
  // });
  // return await response.json();

  // For now, return mock order (Razorpay will handle this)
  return {
    id: `order_${Date.now()}`,
    ...orderData,
  };
};

/**
 * Initialize Razorpay payment
 * Note: For production, order creation should be done on backend
 * For now, we'll use Razorpay's frontend-only approach
 */
export const initiatePayment = async ({
  amount,
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onFailure,
  onDismiss,
}) => {
  try {
    let Razorpay;
    try {
      Razorpay = await loadRazorpayScript();
    } catch (scriptError) {
      throw new Error(`Failed to load Razorpay: ${scriptError.message}`);
    }
    
    if (!Razorpay || typeof Razorpay !== 'function') {
      throw new Error("Razorpay is not available or not a function");
    }

    // Validate amount
    const amountInPaise = Math.round(amount * 100);
    if (amountInPaise < 100) {
      throw new Error("Minimum payment amount is ₹1");
    }

    if (!RAZORPAY_CONFIG.keyId) {
      throw new Error("Razorpay API key is not configured");
    }
    
    // Create order options
    const options = {
      key: RAZORPAY_CONFIG.keyId,
      amount: amountInPaise, // Amount in paise
      currency: "INR",
      name: "UrbanFrill",
      description: `Order #${orderId}`,
      handler: function (response) {
        if (onSuccess) {
          onSuccess(response);
        }
      },
      prefill: {
        name: customerName || "",
        email: customerEmail || "",
        contact: customerPhone || "",
      },
      theme: {
        color: "#0d9488",
      },
      modal: {
        ondismiss: function () {
          if (onDismiss) {
            onDismiss();
          }
        },
      },
      notes: {
        orderId: orderId,
        customerName: customerName,
      },
      // Ensure modal is visible
      retry: {
        enabled: true,
        max_count: 4,
      },
    };

    let razorpay;
    try {
      razorpay = new Razorpay(options);
    } catch (createError) {
      throw new Error(`Failed to create Razorpay instance: ${createError.message}`);
    }
    
    if (!razorpay) {
      throw new Error("Razorpay instance is null");
    }
    
    // Set up payment failed handler
    razorpay.on("payment.failed", function (response) {
      if (onFailure) {
        onFailure(response);
      }
    });

    // Suppress Firebase COOP warnings (they're just warnings, not errors)
    const originalConsoleWarn = console.warn;
    console.warn = function(...args) {
      const message = args[0]?.toString() || '';
      if (message.includes('Cross-Origin-Opener-Policy') || message.includes('window.close')) {
        return;
      }
      originalConsoleWarn.apply(console, args);
    };
    
    // Function to check if Razorpay modal is actually in the DOM
    const checkModalExists = () => {
      return !!document.querySelector('.razorpay-container, [id*="razorpay"], .razorpay-checkout-frame');
    };
    
    let modalOpened = false;
    
    const openModal = () => {
      if (modalOpened) return;
      
      try {
        if (typeof window !== 'undefined' && razorpay && typeof razorpay.open === 'function') {
          razorpay.open();
          
          setTimeout(() => {
            if (checkModalExists()) {
              modalOpened = true;
            }
          }, 500);
          
          setTimeout(() => {
            console.warn = originalConsoleWarn;
          }, 2000);
        } else {
          throw new Error(`Window or Razorpay instance not available`);
        }
      } catch (openError) {
        console.warn = originalConsoleWarn;
        if (onFailure && !modalOpened) {
          onFailure({ error: { description: openError.message || "Failed to open payment modal" } });
        }
      }
    };
    
    // Try opening immediately
    try {
      openModal();
    } catch (e) {
      // Error handled in openModal
    }
    
    // Retry with a small delay as fallback
    setTimeout(() => {
      if (!modalOpened && !checkModalExists()) {
        openModal();
      }
    }, 500);
    
    // Final check after 2 seconds
    setTimeout(() => {
      if (!checkModalExists() && !modalOpened) {
        if (onFailure) {
          onFailure({ 
            error: { 
              description: "Payment modal failed to open. Please check if popup blockers are disabled and try again." 
            } 
          });
        }
      }
    }, 2000);
    
    return razorpay;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify payment signature (should be done on backend in production)
 */
export const verifyPayment = async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  // In production, this should be done on your backend
  // For now, we'll just return true (backend should verify)
  
  // Backend verification example:
  // const response = await fetch('/api/verify-payment', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     orderId: razorpayOrderId,
  //     paymentId: razorpayPaymentId,
  //     signature: razorpaySignature
  //   })
  // });
  // return await response.json();

  // For frontend-only (not secure, use backend in production)
  return true;
};

/**
 * Save order to Firestore with retry logic and localStorage backup
 */
export const saveOrderToFirestore = async (orderData, retries = 2) => {
  // Always save to localStorage as backup
  try {
    const backupKey = `order_backup_${Date.now()}`;
    localStorage.setItem(backupKey, JSON.stringify({
      ...orderData,
      backupTimestamp: new Date().toISOString(),
    }));
  } catch {
    // Non-critical, continue
  }
  
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Firestore operation timed out after 5 seconds")), 5000);
      });
      
      const addDocPromise = addDoc(collection(db, "orders"), {
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      const orderRef = await Promise.race([addDocPromise, timeoutPromise]);
      return orderRef.id;
    } catch (error) {
      if (attempt === retries) {
        // Check if it's a timeout or permission issue - return local ID
        if (error.message?.includes("timeout") || error.code === "deadline-exceeded" || error.code === "permission-denied") {
          return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        throw error;
      }
    }
  }
};

/**
 * Update order status in Firestore
 */
export const updateOrderStatus = async (orderId, status, paymentData = null) => {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  try {
    const orderRef = doc(db, "orders", orderId);
    const updateData = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (paymentData) {
      updateData.payment = paymentData;
    }

    await updateDoc(orderRef, updateData);
    return true;
  } catch (error) {
    throw error;
  }
};

