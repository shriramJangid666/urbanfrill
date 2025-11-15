# Razorpay Payment Gateway Setup

## ✅ Current Setup (Frontend-Only for Testing)

The Razorpay integration is currently configured for **frontend-only testing**. This works for development but **MUST be moved to a backend server for production**.

### Current Configuration

- **Test API Key**: `rzp_test_Rg4aTHpcltnXOf`
- **Test Key Secret**: `4KBbCMveECHSzxbSLgZHRYST` (stored in code - **NOT SECURE for production**)

### How It Works Now

1. User fills checkout form
2. Order is created in Firestore
3. Razorpay payment modal opens
4. User completes payment
5. Payment success/failure is handled
6. Order status is updated in Firestore
7. User is redirected to order confirmation page

## ⚠️ Important Security Note

**The key secret should NEVER be exposed in frontend code!**

For production, you need to:
1. Create a backend server (Node.js, Python, etc.)
2. Store the key secret on the backend
3. Create Razorpay orders on the backend
4. Verify payment signatures on the backend

## 🚀 Production Setup (Backend Required)

### Step 1: Create Backend API Endpoint

Create an endpoint to create Razorpay orders:

```javascript
// Backend: /api/create-razorpay-order
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'rzp_test_Rg4aTHpcltnXOf',
  key_secret: '4KBbCMveECHSzxbSLgZHRYST', // Keep this SECRET on backend
});

app.post('/api/create-razorpay-order', async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;
  
  const options = {
    amount: Math.round(amount * 100), // Convert to paise
    currency,
    receipt,
  };
  
  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Step 2: Update Frontend Code

Update `src/utils/payment.js` to call your backend:

```javascript
export const createRazorpayOrder = async (amount, currency = "INR") => {
  const response = await fetch('/api/create-razorpay-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: Math.round(amount * 100),
      currency: currency,
      receipt: `order_${Date.now()}`,
    })
  });
  return await response.json();
};
```

### Step 3: Verify Payment on Backend

Create an endpoint to verify payment signatures:

```javascript
// Backend: /api/verify-payment
const crypto = require('crypto');

app.post('/api/verify-payment', (req, res) => {
  const { orderId, paymentId, signature } = req.body;
  const keySecret = '4KBbCMveECHSzxbSLgZHRYST';
  
  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  
  if (generatedSignature === signature) {
    res.json({ verified: true });
  } else {
    res.status(400).json({ verified: false, error: 'Invalid signature' });
  }
});
```

## 📝 Environment Variables

For production, use environment variables:

### Frontend (.env)
```
VITE_RAZORPAY_KEY_ID=rzp_test_Rg4aTHpcltnXOf
```

### Backend (.env)
```
RAZORPAY_KEY_ID=rzp_test_Rg4aTHpcltnXOf
RAZORPAY_KEY_SECRET=4KBbCMveECHSzxbSLgZHRYST
```

## 🧪 Testing

### Test Cards (Razorpay Test Mode)

- **Success**: `4111 1111 1111 1111`
- **Failure**: `4000 0000 0000 0002`
- **CVV**: Any 3 digits
- **Expiry**: Any future date

### Test UPI IDs

- `success@razorpay`
- `failure@razorpay`

## 📋 Current Features

✅ Online Payment (Razorpay)
✅ Cash on Delivery
✅ Order creation in Firestore
✅ Payment status tracking
✅ Order confirmation page
✅ Error handling

## 🔒 Security Checklist for Production

- [ ] Move key secret to backend
- [ ] Create orders on backend
- [ ] Verify payment signatures on backend
- [ ] Use environment variables
- [ ] Enable HTTPS
- [ ] Implement rate limiting
- [ ] Add payment logging
- [ ] Set up webhook for payment status updates

## 📚 Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay React Integration](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/)
- [Razorpay Test Cards](https://razorpay.com/docs/payments/test-cards/)

