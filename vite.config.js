import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Use '/' for local dev (including mobile access via IP), '/urbanfrill/' for production
  base: process.env.NODE_ENV === 'production' ? '/urbanfrill/' : '/',
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,
    strictPort: false, // Allow port to be changed if 5173 is taken
    headers: {
      // Allow popups for Razorpay and Firebase Auth
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
    },
  },
})
