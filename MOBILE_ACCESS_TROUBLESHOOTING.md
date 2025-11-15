# 📱 Mobile Access Troubleshooting Guide

## Issue: Can't login on mobile using local server

### ✅ Solution 1: Base Path Fixed
The base path has been updated to use `/` for local development and `/urbanfrill/` for production. **Restart your dev server** after this change.

### ✅ Solution 2: Server Configuration
The server is now configured to listen on all network interfaces (`0.0.0.0`), making it accessible from mobile devices.

## Step-by-Step Setup

### 1. Restart Your Dev Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

You should see output like:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

### 2. Find Your IP Address
```bash
npm run get-ip
```

Or manually:
- **Windows**: `ipconfig` in PowerShell → Look for "IPv4 Address"
- **Mac/Linux**: `ifconfig` or `ip addr`

### 3. Access from Mobile
- Ensure your phone is on the **same Wi-Fi network** as your computer
- Open mobile browser
- Go to: `http://YOUR_IP:5173` (e.g., `http://192.168.1.100:5173`)
- **Important**: Use `http://` not `https://`

## Common Issues & Fixes

### Issue: "Site can't be reached" or "Connection refused"

**Possible Causes:**
1. **Firewall blocking port 5173**
   - Windows: Allow Vite/Node through Windows Firewall
   - Or temporarily disable firewall for testing

2. **Wrong IP address**
   - Make sure you're using the IP from your active network adapter
   - Try `npm run get-ip` to get the correct one

3. **Different Wi-Fi networks**
   - Computer and phone must be on the same network

**Fix:**
```powershell
# Windows - Allow port through firewall
New-NetFirewallRule -DisplayName "Vite Dev Server" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow
```

### Issue: Page loads but login doesn't work

**Possible Causes:**
1. **Firebase domain restrictions**
   - Firebase Auth blocks unauthorized domains
   - Your local IP might not be in the authorized domains list

**Fix:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain**
5. Add your local IP (e.g., `192.168.1.100`)
   - **Note**: You might need to add it as `192.168.1.100:5173` or just the IP
6. Save and try again

**Alternative:** Use `localhost` with port forwarding or a tunnel service like:
- **ngrok**: `ngrok http 5173` (gives you a public URL)
- **localtunnel**: `npx localtunnel --port 5173`

### Issue: "CORS error" or "Network error"

**Possible Causes:**
1. Firebase CORS restrictions
2. Network configuration issues

**Fix:**
- Check browser console on mobile for specific error messages
- Try using Chrome's remote debugging to see mobile console:
  1. Connect phone via USB
  2. Enable USB debugging
  3. Open `chrome://inspect` on desktop Chrome
  4. Inspect your mobile browser

### Issue: Assets not loading (404 errors)

**Possible Causes:**
- Base path mismatch (should be fixed now)

**Fix:**
- Make sure you restarted the dev server after the config change
- Clear browser cache on mobile
- Try incognito/private mode

## Testing Checklist

- [ ] Dev server shows "Network: http://192.168.x.x:5173/" in output
- [ ] Can access site from mobile browser (page loads)
- [ ] Can see the login form
- [ ] Can enter email/password
- [ ] Login button works (doesn't just hang)
- [ ] No console errors on mobile (check via remote debugging)

## Quick Test Commands

```bash
# 1. Get your IP
npm run get-ip

# 2. Test if port is accessible (from another device on network)
# On mobile or another computer:
curl http://YOUR_IP:5173

# 3. Check if server is listening on all interfaces
netstat -an | findstr 5173  # Windows
netstat -an | grep 5173     # Mac/Linux
```

## Still Not Working?

1. **Check mobile browser console** for specific errors
2. **Try a different mobile browser** (Chrome, Firefox, Safari)
3. **Try accessing from another device** (tablet, another computer)
4. **Check Windows Firewall logs** for blocked connections
5. **Verify Firebase config** - make sure all environment variables are set correctly

## Alternative: Use ngrok for Testing

If local network access is problematic, use ngrok:

```bash
# Install ngrok (one time)
# Download from https://ngrok.com/

# Start your dev server
npm run dev

# In another terminal, start ngrok
ngrok http 5173

# Use the ngrok URL (e.g., https://abc123.ngrok.io) on mobile
# This bypasses local network issues
```

---

**Last Updated**: After base path fix for mobile access

