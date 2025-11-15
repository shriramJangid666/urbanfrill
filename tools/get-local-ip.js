// Quick script to find your local IP address for mobile testing
// Run with: node tools/get-local-ip.js

import os from 'os';

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  return 'Not found - make sure you\'re connected to a network';
}

const ip = getLocalIP();
console.log('\n🌐 Your local IP address:');
console.log(`   ${ip}`);
console.log(`\n📱 Access from mobile: http://${ip}:5173`);
console.log(`\n💡 Make sure:`);
console.log(`   1. Your mobile device is on the same Wi-Fi network`);
console.log(`   2. The dev server is running (npm run dev)`);
console.log(`   3. Your firewall allows connections on port 5173\n`);

