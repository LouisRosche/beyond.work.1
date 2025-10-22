import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Set base path for GitHub Pages
  // If deploying to: https://username.github.io/repo-name/
  // Change this to: '/repo-name/'
  // If deploying to: https://username.github.io/
  // Keep this as: '/'
  base: process.env.GITHUB_PAGES_BASE || '/',

  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'map-vendor': ['leaflet', 'react-leaflet'],
          'chart-vendor': ['recharts']
        }
      }
    }
  },

  server: {
    port: 5173,
    host: true
  }
})
