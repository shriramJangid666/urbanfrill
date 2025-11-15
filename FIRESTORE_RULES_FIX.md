# Firestore Rules Fix for Order Saving

## ✅ Payment Gateway Status
**Good News:** Your Razorpay payment gateway is working perfectly! Payments are processing successfully.

**Current Issue:** Orders are timing out when trying to save to Firestore. This is likely due to security rules blocking writes.

## ⚡ Quick Fix (Recommended)
See **QUICK_FIRESTORE_FIX.md** for the fastest solution (2 minutes).

## Quick Test (Optional)
Before fixing rules, test your Firestore connection:
```bash
npm run test-firestore
```

**Note:** If the test script can't find .env files, that's okay - your app works, so Firebase config is correct. The issue is just Firestore rules.

## Quick Fix

### Step 1: Open Firebase Console
1. Go to: https://console.firebase.google.com/
2. Select your project: `urbanfrill-d936e`
3. Navigate to: **Firestore Database** → **Rules** tab

### Step 2: Update Rules
Replace your current rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - allow read/write for authenticated users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Orders collection - allow authenticated users to create and read their own orders
    match /orders/{orderId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
                     (resource.data.userId == request.auth.uid || 
                      request.auth.uid == resource.data.userId);
      allow update: if request.auth != null && 
                       (resource.data.userId == request.auth.uid || 
                        request.auth.uid == resource.data.userId);
    }
    
    // Carts collection - allow authenticated users to manage their own cart
    match /carts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Profile pictures in Storage (if needed)
    match /profile-pictures/{userId}/{allPaths=**} {
      allow read: if true; // Public read
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Step 3: Publish Rules
1. Click **Publish** button
2. Wait for confirmation

### Step 4: Test
Try making a payment again. The order should save successfully to Firestore.

## Alternative: Temporary Testing Rules (NOT for Production)

For testing only, you can use more permissive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **Warning**: These rules allow any authenticated user to read/write any document. Only use for testing!

## Verify Rules Are Working

After updating rules, check the browser console. You should see:
- ✅ "Order document created successfully, ID: ..."
- No timeout errors

## Troubleshooting

### Still Timing Out?
1. **Check Network Tab**: Look for failed requests to Firestore
2. **Check Firebase Console**: Go to Firestore → Usage tab to see if there are errors
3. **Check Authentication**: Make sure user is logged in (`request.auth != null`)
4. **Check Project ID**: Verify `VITE_FIREBASE_PROJECT_ID` matches your Firebase project

### Common Errors
- `permission-denied`: Rules are blocking the write
- `unavailable`: Network/Firebase service issue
- `deadline-exceeded`: Timeout (rules might be too restrictive or network slow)

## Current Workaround

Until rules are fixed, orders are automatically saved to:
- **localStorage** (browser storage) as backup
- Order confirmation page still works
- Payment is successful

You can manually retrieve orders from localStorage using browser DevTools:
```javascript
// In browser console
Object.keys(localStorage).filter(k => k.startsWith('order_backup_')).forEach(key => {
  console.log(key, JSON.parse(localStorage.getItem(key)));
});
```

