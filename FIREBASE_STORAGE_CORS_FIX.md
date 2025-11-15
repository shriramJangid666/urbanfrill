# Fix Firebase Storage CORS Error

## 🚀 Quick Fix (Automated)

### Option 1: Using npm script (Requires Google Cloud SDK)

**Run this command to automatically set up CORS:**

```bash
npm run setup-cors
```

This script will:
1. ✅ Check if Google Cloud SDK is installed
2. ✅ Verify authentication
3. ✅ Create CORS configuration
4. ✅ Apply CORS to Firebase Storage
5. ✅ Verify the configuration

**That's it!** After running this, restart your dev server and try uploading again.

### Option 2: Using PowerShell (Windows)

If Google Cloud SDK is not installed, use the PowerShell script:

```powershell
.\tools\setup-cors-windows.ps1
```

This will guide you through installation if needed.

### Option 3: Using Google Cloud Shell (No Installation Required!)

**Easiest method - works in your browser!**

1. Go to [Google Cloud Shell](https://console.cloud.google.com/cloudshell)
2. Copy and paste the entire contents of `tools/setup-cors-cloudshell.sh`
3. Press Enter
4. Done! ✅

No installation needed - everything runs in your browser!

---

## Understanding the Error

The CORS (Cross-Origin Resource Sharing) error occurs when your browser tries to upload files to Firebase Storage from `http://localhost:5173`, but Firebase Storage hasn't been configured to allow requests from this origin.

## Manual Solution: Configure CORS in Firebase Console

### Step 1: Install Google Cloud SDK (if not already installed)

1. Download and install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Or use the [Cloud Shell](https://console.cloud.google.com/cloudshell) in your browser

### Step 2: Authenticate with Google Cloud

```bash
gcloud auth login
```

### Step 3: Set Your Project

```bash
gcloud config set project urbanfrill-d936e
```

Replace `urbanfrill-d936e` with your actual Firebase project ID if different.

### Step 4: Create CORS Configuration File

Create a file named `cors.json` with the following content:

```json
[
  {
    "origin": ["http://localhost:5173", "http://localhost:3000", "https://yourdomain.com"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "responseHeader": ["Content-Type", "Authorization"],
    "maxAgeSeconds": 3600
  }
]
```

**Important:** Replace `https://yourdomain.com` with your actual production domain.

### Step 5: Apply CORS Configuration

Run this command to apply the CORS configuration:

```bash
gsutil cors set cors.json gs://urbanfrill-d936e.firebasestorage.app
```

Replace `urbanfrill-d936e.firebasestorage.app` with your actual storage bucket name if different.

### Step 6: Verify CORS Configuration

Check if CORS is properly configured:

```bash
gsutil cors get gs://urbanfrill-d936e.firebasestorage.app
```

## Alternative: Using Firebase Console (Web UI)

Unfortunately, Firebase Console doesn't have a direct UI for CORS configuration. You must use the `gsutil` command-line tool as described above.

## Quick Fix for Development

For local development, you can temporarily allow all origins (NOT recommended for production):

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "responseHeader": ["*"],
    "maxAgeSeconds": 3600
  }
]
```

## Also Check Firebase Storage Rules

Make sure your Firebase Storage rules allow authenticated users to upload:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Storage** → **Rules**
4. Update rules to:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload profile pictures
    match /profile-pictures/{userId}/{allPaths=**} {
      allow read: if true; // Public read access
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Default: deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

5. Click **Publish**

## After Configuration

1. Restart your development server
2. Try uploading a profile picture again
3. The CORS error should be resolved

## Troubleshooting

### Still Getting CORS Errors?

1. **Clear browser cache** - Old CORS headers might be cached
2. **Check bucket name** - Make sure you're using the correct storage bucket name
3. **Verify origins** - Ensure `http://localhost:5173` is in your CORS configuration
4. **Wait a few minutes** - CORS changes can take a few minutes to propagate

### Common Issues

- **"Permission denied"** - Make sure you're authenticated with `gcloud auth login`
- **"Bucket not found"** - Verify your storage bucket name in Firebase Console → Storage → Files
- **"Command not found"** - Install Google Cloud SDK or use Cloud Shell

## Need Help?

If you continue to experience issues:
1. Check Firebase Console → Storage → Files to see if files are being uploaded
2. Check browser console for detailed error messages
3. Verify your Firebase project ID and storage bucket name match

