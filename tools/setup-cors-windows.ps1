# Firebase Storage CORS Setup for Windows
# This PowerShell script helps set up CORS for Firebase Storage

Write-Host "`n🚀 Firebase Storage CORS Auto-Setup (Windows)" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

$projectId = if ($env:FIREBASE_PROJECT_ID) { $env:FIREBASE_PROJECT_ID } else { "urbanfrill-d936e" }
$storageBucket = "$projectId.firebasestorage.app"

Write-Host "`nProject ID: $projectId" -ForegroundColor Blue
Write-Host "Storage Bucket: $storageBucket" -ForegroundColor Blue

# Step 1: Check if gcloud is installed
Write-Host "`n📋 Step 1: Checking prerequisites..." -ForegroundColor Yellow

$gcloudInstalled = $false
try {
    $null = Get-Command gcloud -ErrorAction Stop
    $gcloudInstalled = $true
    Write-Host "✅ Google Cloud SDK (gcloud) is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Google Cloud SDK (gcloud) is NOT installed" -ForegroundColor Red
}

if (-not $gcloudInstalled) {
    Write-Host "`n📥 Installing Google Cloud SDK..." -ForegroundColor Yellow
    
    # Check if Chocolatey is installed
    $chocoInstalled = $false
    try {
        $null = Get-Command choco -ErrorAction Stop
        $chocoInstalled = $true
    } catch {
        Write-Host "⚠️  Chocolatey not found. Installing via direct download..." -ForegroundColor Yellow
    }
    
    if ($chocoInstalled) {
        Write-Host "`nInstalling via Chocolatey..." -ForegroundColor Cyan
        Write-Host "Run this command as Administrator:" -ForegroundColor Yellow
        Write-Host "  choco install gcloudsdk -y" -ForegroundColor White
    } else {
        Write-Host "`n📥 Please install Google Cloud SDK:" -ForegroundColor Yellow
        Write-Host "   1. Download: https://cloud.google.com/sdk/docs/install-sdk#windows" -ForegroundColor Cyan
        Write-Host "   2. Run the installer" -ForegroundColor Cyan
        Write-Host "   3. Restart PowerShell" -ForegroundColor Cyan
        Write-Host "   4. Run this script again" -ForegroundColor Cyan
        
        # Offer to open download page
        $response = Read-Host "`nOpen download page in browser? (Y/N)"
        if ($response -eq 'Y' -or $response -eq 'y') {
            Start-Process "https://cloud.google.com/sdk/docs/install-sdk#windows"
        }
        
        exit 1
    }
}

# Step 2: Check authentication
Write-Host "`n📋 Step 2: Checking authentication..." -ForegroundColor Yellow

try {
    $account = gcloud config get-value account 2>$null
    if ($account -and $account -ne "") {
        Write-Host "✅ Authenticated as: $account" -ForegroundColor Green
    } else {
        throw "Not authenticated"
    }
} catch {
    Write-Host "❌ Not authenticated with Google Cloud" -ForegroundColor Red
    Write-Host "`n🔐 Please authenticate:" -ForegroundColor Yellow
    Write-Host "   Run: gcloud auth login" -ForegroundColor Cyan
    Write-Host "   Then run this script again." -ForegroundColor Cyan
    
    $response = Read-Host "`nRun 'gcloud auth login' now? (Y/N)"
    if ($response -eq 'Y' -or $response -eq 'y') {
        gcloud auth login
    } else {
        exit 1
    }
}

# Step 3: Set project
Write-Host "`n📋 Step 3: Setting project..." -ForegroundColor Yellow

try {
    gcloud config set project $projectId 2>$null | Out-Null
    Write-Host "✅ Project set to: $projectId" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not set project. Continuing anyway..." -ForegroundColor Yellow
}

# Step 4: Create CORS configuration
Write-Host "`n📋 Step 4: Creating CORS configuration..." -ForegroundColor Yellow

$corsConfig = @(
    @{
        origin = @(
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
            "http://localhost:*"
        )
        method = @("GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS")
        responseHeader = @("Content-Type", "Authorization", "Content-Length", "X-Requested-With")
        maxAgeSeconds = 3600
    }
) | ConvertTo-Json -Depth 10

$corsFile = Join-Path $PSScriptRoot "cors.json"
$corsConfig | Out-File -FilePath $corsFile -Encoding UTF8

Write-Host "✅ CORS configuration file created: $corsFile" -ForegroundColor Green

# Step 5: Apply CORS configuration
Write-Host "`n📋 Step 5: Applying CORS configuration to Firebase Storage..." -ForegroundColor Yellow
Write-Host "   This may take a few seconds..." -ForegroundColor Yellow

try {
    $command = "gsutil cors set `"$corsFile`" gs://$storageBucket"
    Write-Host "   Running: $command" -ForegroundColor Cyan
    
    Invoke-Expression $command
    
    Write-Host "`n✅ CORS configuration applied successfully!" -ForegroundColor Green
    
    # Step 6: Verify
    Write-Host "`n📋 Step 6: Verifying CORS configuration..." -ForegroundColor Yellow
    
    try {
        gsutil cors get "gs://$storageBucket"
        Write-Host "`n✅ CORS verification complete!" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not verify CORS, but it may still be applied." -ForegroundColor Yellow
    }
    
    Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
    Write-Host "=" * 50 -ForegroundColor Cyan
    Write-Host "`n✅ Firebase Storage CORS is now configured." -ForegroundColor Green
    Write-Host "✅ You can now upload profile pictures without CORS errors." -ForegroundColor Green
    Write-Host "`n📝 Next steps:" -ForegroundColor Yellow
    Write-Host "   1. Restart your development server" -ForegroundColor Cyan
    Write-Host "   2. Try uploading a profile picture again" -ForegroundColor Cyan
    Write-Host "   3. The CORS error should be resolved!" -ForegroundColor Cyan
    
} catch {
    Write-Host "`n❌ Failed to apply CORS configuration" -ForegroundColor Red
    Write-Host "`nPossible issues:" -ForegroundColor Yellow
    Write-Host "   1. Storage bucket name might be incorrect" -ForegroundColor Cyan
    Write-Host "   2. You might not have permissions for this project" -ForegroundColor Cyan
    Write-Host "   3. Check the error message above for details" -ForegroundColor Cyan
    Write-Host "`n💡 Alternative: Use Google Cloud Shell (Browser-based)" -ForegroundColor Yellow
    Write-Host "   1. Go to: https://console.cloud.google.com/cloudshell" -ForegroundColor Cyan
    Write-Host "   2. Run the commands from FIREBASE_STORAGE_CORS_FIX.md" -ForegroundColor Cyan
    Write-Host "`n📖 See FIREBASE_STORAGE_CORS_FIX.md for detailed instructions" -ForegroundColor Cyan
}

