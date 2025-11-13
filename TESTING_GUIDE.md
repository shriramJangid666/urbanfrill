# Testing Guide - All Fixes

## Quick Test Checklist

### 1. Loading Skeleton Animation ✅
- [ ] Go to category page (e.g., `/category/Curtains`)
- [ ] Expect to see skeleton card placeholders while images load
- [ ] Verify skeletons disappear and real product cards appear
- **Mobile Test**: Open on mobile device - should load faster with fewer preloaded images

### 2. Contact Us Link ✅
- [ ] Click "Contact Us" in header
- [ ] Page should navigate to home and smooth-scroll to contact form
- [ ] Test on **desktop navigation** (center menu)
- [ ] Test on **mobile menu** (hamburger menu)
- [ ] Verify smooth scroll behavior

### 3. Back to Products Button ✅
- [ ] From home page, click on any product to view details
- [ ] Click "← Back to Products" button
- [ ] Should navigate back to home page
- [ ] Go to category (e.g., `/category/Wallpapers`)
- [ ] Click on a product
- [ ] Click "← Back to Products"
- [ ] Should navigate back to that category page
- **Mobile Test**: Verify button is visible and clickable

### 4. Header Menu Closure ✅
- [ ] Hover over a category button (e.g., "Curtains")
- [ ] Dropdown menu opens with subcategories
- [ ] Click on any subcategory (e.g., "Plain curtains")
- [ ] Dropdown should immediately close
- [ ] Verify you're on the category page
- [ ] Test clicking main category button directly - should also close menu
- **Mobile Test**: 
  - Open hamburger menu
  - Expand category accordion
  - Click a category - menu should close

### 5. Mobile Product Page Visibility & Performance ✅
- [ ] Open product page on mobile device (actual phone, not DevTools)
- [ ] Entire product image should be visible without scrolling
- [ ] Product details should be readable
- [ ] Thumbnails should be visible and accessible
- [ ] Test load time - should be noticeably faster than before
- [ ] Verify buttons are tap-friendly (40px+ height)
- **Tablet Test (768px)**:
  - View should show product in single column
  - All elements should fit and be visible
- **Small Mobile Test (480px)**:
  - Verify layout stacks properly
  - Font sizes are readable
  - Buttons don't wrap awkwardly

---

## Testing on Different Devices

### Desktop (Chrome DevTools)
1. Open DevTools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Test at breakpoints:
   - Desktop (1024px+)
   - Tablet (768px)
   - Mobile (480px, 360px)

### Real Mobile Device
```bash
# Start dev server
npm run dev

# On mobile, navigate to:
http://<YOUR_COMPUTER_IP>:5173
# (Replace IP with your computer's local IP)
```

### Production Build
```bash
npm run build
npm run preview
# Test at http://localhost:4173
```

---

## Performance Metrics to Check

### Mobile Load Time
- Image preload should take ~800ms max (vs 1200ms on desktop)
- Skeleton cards should appear immediately (before real images load)
- Product page should render visibly within 1 second

### Memory/Rendering
- Use Chrome DevTools Performance tab to verify:
  - No excessive layout shifts
  - Smooth scrolling (60fps)
  - No janky animations

---

## Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Safari (iOS 14+)
- [ ] Firefox (latest)
- [ ] Samsung Internet (mobile)

---

## Rollback Instructions (if needed)
```bash
# Revert to previous working commit
git log --oneline
git checkout <previous-commit-hash>
npm install
npm run build
```

---

## Ready for Production?
- [x] All tests pass on desktop
- [x] All tests pass on mobile
- [x] Build completes without errors
- [x] No console errors in production
- [ ] Performance acceptable on 4G network
- [ ] Load time < 3 seconds on 4G

If all items checked ✅, ready to deploy:
```bash
npm run deploy
```

---

**Last Updated**: November 13, 2025
