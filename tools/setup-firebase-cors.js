#!/usr/bin/env node

/**
 * Firebase Storage CORS Auto-Setup Script
 * 
 * This script automatically sets up CORS for Firebase Storage.
 * 
 * Prerequisites:
 * 1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
 * 2. Run: gcloud auth login
 * 
 * Usage:
 * npm run setup-cors
 * 
 * Or with custom project:
 * FIREBASE_PROJECT_ID=your-project-id npm run setup-cors
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Get project ID from environment or use default
const projectId = process.env.FIREBASE_PROJECT_ID || 'urbanfrill-d936e';
const storageBucket = `${projectId}.firebasestorage.app`;

log('\n🚀 Firebase Storage CORS Auto-Setup', 'bright');
log('='.repeat(50), 'cyan');
log(`Project ID: ${projectId}`, 'blue');
log(`Storage Bucket: ${storageBucket}`, 'blue');

// Step 1: Check if gcloud is installed
log('\n📋 Step 1: Checking prerequisites...', 'bright');

let gcloudInstalled = false;
let gsutilInstalled = false;

try {
  execSync('gcloud --version', { stdio: 'ignore' });
  gcloudInstalled = true;
  log('✅ Google Cloud SDK (gcloud) is installed', 'green');
} catch (error) {
  log('❌ Google Cloud SDK (gcloud) is NOT installed', 'red');
  log('\n📥 Please install Google Cloud SDK:', 'yellow');
  log('   Windows: https://cloud.google.com/sdk/docs/install-sdk#windows', 'cyan');
  log('   Mac: https://cloud.google.com/sdk/docs/install-sdk#mac', 'cyan');
  log('   Linux: https://cloud.google.com/sdk/docs/install-sdk#linux', 'cyan');
  process.exit(1);
}

try {
  execSync('gsutil --version', { stdio: 'ignore' });
  gsutilInstalled = true;
  log('✅ gsutil is installed', 'green');
} catch (error) {
  log('❌ gsutil is NOT installed', 'red');
  log('   gsutil comes with Google Cloud SDK. Please reinstall.', 'yellow');
  process.exit(1);
}

// Step 2: Check authentication
log('\n📋 Step 2: Checking authentication...', 'bright');

try {
  const account = execSync('gcloud config get-value account', { encoding: 'utf-8' }).trim();
  if (account && account !== '') {
    log(`✅ Authenticated as: ${account}`, 'green');
  } else {
    throw new Error('Not authenticated');
  }
} catch (error) {
  log('❌ Not authenticated with Google Cloud', 'red');
  log('\n🔐 Please authenticate:', 'yellow');
  log('   Run: gcloud auth login', 'cyan');
  log('   Then run this script again.', 'cyan');
  process.exit(1);
}

// Step 3: Set project
log('\n📋 Step 3: Setting project...', 'bright');

try {
  execSync(`gcloud config set project ${projectId}`, { stdio: 'ignore' });
  log(`✅ Project set to: ${projectId}`, 'green');
} catch (error) {
  log(`⚠️  Could not set project. Continuing anyway...`, 'yellow');
}

// Step 4: Create CORS configuration
log('\n📋 Step 4: Creating CORS configuration...', 'bright');

const corsConfig = [
  {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      'http://localhost:*',
      // Add production domain if needed
      // 'https://shriramJangid666.github.io',
    ],
    method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
    responseHeader: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With'],
    maxAgeSeconds: 3600,
  },
];

const corsFile = path.join(__dirname, 'cors.json');
fs.writeFileSync(corsFile, JSON.stringify(corsConfig, null, 2));
log(`✅ CORS configuration file created: ${corsFile}`, 'green');

// Step 5: Apply CORS configuration
log('\n📋 Step 5: Applying CORS configuration to Firebase Storage...', 'bright');
log('   This may take a few seconds...', 'yellow');

try {
  const command = `gsutil cors set ${corsFile} gs://${storageBucket}`;
  log(`   Running: ${command}`, 'cyan');
  
  execSync(command, { stdio: 'inherit' });
  
  log('\n✅ CORS configuration applied successfully!', 'green');
  
  // Step 6: Verify
  log('\n📋 Step 6: Verifying CORS configuration...', 'bright');
  
  try {
    const verifyCommand = `gsutil cors get gs://${storageBucket}`;
    execSync(verifyCommand, { stdio: 'inherit' });
    log('\n✅ CORS verification complete!', 'green');
  } catch (error) {
    log('⚠️  Could not verify CORS, but it may still be applied.', 'yellow');
  }
  
  log('\n🎉 Setup Complete!', 'bright');
  log('='.repeat(50), 'cyan');
  log('\n✅ Firebase Storage CORS is now configured.', 'green');
  log('✅ You can now upload profile pictures without CORS errors.', 'green');
  log('\n📝 Next steps:', 'bright');
  log('   1. Restart your development server', 'cyan');
  log('   2. Try uploading a profile picture again', 'cyan');
  log('   3. The CORS error should be resolved!', 'cyan');
  
} catch (error) {
  log('\n❌ Failed to apply CORS configuration', 'red');
  log('\nPossible issues:', 'yellow');
  log('   1. Storage bucket name might be incorrect', 'cyan');
  log('   2. You might not have permissions for this project', 'cyan');
  log('   3. Check the error message above for details', 'cyan');
  log('\n💡 Manual setup:', 'yellow');
  log(`   Run: gsutil cors set ${corsFile} gs://${storageBucket}`, 'cyan');
  log('\n📖 See FIREBASE_STORAGE_CORS_FIX.md for detailed instructions', 'cyan');
  process.exit(1);
}

