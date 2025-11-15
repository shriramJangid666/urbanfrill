# 🔧 Fix Firestore Rules NOW (30 seconds)

## Your Payment is Working! ✅
Payments are processing successfully. You just need to allow Firestore to save orders.

## ⚡ Super Quick Fix

1. **Open this link:** https://console.firebase.google.com/project/urbanfrill-d936e/firestore/rules

2. **Copy and paste this code:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /carts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. **Click "Publish"**

4. **Done!** Try a payment again - orders will save automatically.

---

**That's it!** Your payment gateway is already working. This just enables order saving. 🎉

