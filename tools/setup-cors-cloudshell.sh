#!/bin/bash
# Firebase Storage CORS Setup for Google Cloud Shell
# Copy and paste this entire script into Google Cloud Shell

echo "🚀 Firebase Storage CORS Auto-Setup (Cloud Shell)"
echo "=================================================="

PROJECT_ID=${FIREBASE_PROJECT_ID:-urbanfrill-d936e}
STORAGE_BUCKET="${PROJECT_ID}.firebasestorage.app"

echo ""
echo "Project ID: $PROJECT_ID"
echo "Storage Bucket: $STORAGE_BUCKET"

# Set project
echo ""
echo "📋 Setting project..."
gcloud config set project $PROJECT_ID

# Create CORS configuration
echo ""
echo "📋 Creating CORS configuration..."

cat > cors.json << 'EOF'
[
  {
    "origin": [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
      "http://localhost:*"
    ],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    "responseHeader": ["Content-Type", "Authorization", "Content-Length", "X-Requested-With"],
    "maxAgeSeconds": 3600
  }
]
EOF

echo "✅ CORS configuration file created: cors.json"

# Apply CORS configuration
echo ""
echo "📋 Applying CORS configuration to Firebase Storage..."
gsutil cors set cors.json gs://$STORAGE_BUCKET

# Verify
echo ""
echo "📋 Verifying CORS configuration..."
gsutil cors get gs://$STORAGE_BUCKET

echo ""
echo "🎉 Setup Complete!"
echo "=================================================="
echo ""
echo "✅ Firebase Storage CORS is now configured."
echo "✅ You can now upload profile pictures without CORS errors."
echo ""
echo "📝 Next steps:"
echo "   1. Restart your development server"
echo "   2. Try uploading a profile picture again"
echo "   3. The CORS error should be resolved!"

