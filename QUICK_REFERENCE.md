# 🚀 Quick Command Reference

## Development

```bash
# Start development server
npm run dev

# Access locally
http://localhost:5173

# On mobile (replace with your computer IP)
http://<YOUR_IP>:5173
```

### Accessing from Mobile Device

1. **Find your computer's local IP address:**
   - **Windows**: Open PowerShell and run `ipconfig` → Look for "IPv4 Address" under your active network adapter
   - **Mac/Linux**: Run `ifconfig` or `ip addr` → Look for your network interface IP (usually starts with 192.168.x.x)

2. **Make sure your mobile device is on the same Wi-Fi network** as your computer

3. **Access from mobile browser:**
   - Open browser on your phone
   - Go to: `http://YOUR_IP_ADDRESS:5173`
   - Example: `http://192.168.1.100:5173`

4. **If login doesn't work on mobile:**
   - Check Firebase Console → Authentication → Settings → Authorized domains
   - Add your local IP address if needed (though localhost should work)
   - Make sure you're using the same Firebase project credentials

## Testing

```bash
# Test on local machine
npm run dev

# Test production build locally
npm run build
npm run preview
```

## Deployment

```bash
# Deploy to GitHub Pages (one command)
npm run deploy

# Or manual deployment
npm run build
# Upload contents of 'dist' folder to your server
```

## Verification

```bash
# Verify build works
npm run build

# Build should output:
# ✓ 100 modules transformed.
# ✓ built in ~3-4s

# Check dist folder exists
ls dist/
# Output: index.html  assets/  images/  logo.png  logo.webp
```

---

## Testing Checklist (Quick)

```
□ Contact Us → Scrolls to form ✓
□ Product page visible on mobile ✓
□ Back button works ✓
□ Category menu closes after click ✓
□ Skeleton loaders appear while loading ✓
□ Build completes successfully ✓
```

---

## Emergency: Rollback

```bash
# If something goes wrong
git log --oneline
git checkout <previous-commit>
npm install
npm run build
npm run deploy
```

---

## Performance Checks

```bash
# Check bundle size
npm run build

# Expected output:
# index.html: 0.85 kB
# index-*.css: 40.36 kB (gzipped: 8.22 kB)
# index-*.js: 636.26 kB (gzipped: 199.32 kB)
```

---

## What Changed

See detailed documentation in:
- `FIXES_SUMMARY.md` - Overview of all fixes
- `TECHNICAL_CHANGES.md` - Code-level changes
- `TESTING_GUIDE.md` - How to test everything
- `READY_TO_DEPLOY.md` - Deployment instructions

---

## Files Modified

1. `src/components/Header.jsx` - Contact & menu fixes
2. `src/components/ProductPage.jsx` - Back button & mobile
3. `src/components/CategoryPage.jsx` - Location tracking
4. `src/components/HomePage.jsx` - Location tracking
5. `src/components/header.css` - Button link styles
6. `src/components/product-page.css` - Mobile responsive

---

## Status: ✅ READY TO DEPLOY

All issues fixed. Production build verified.

```bash
npm run deploy
```

**That's it!** 🎉
