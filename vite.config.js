import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    host: '0.0.0.0',
    open: true
  },
  preview: {
    port: 3002
  },
  // Handle client-side routing
  build: {
    outDir: 'dist',
  },
  // This is important for client-side routing to work properly
  base: '/',
})
