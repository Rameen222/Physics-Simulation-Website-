import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    https: false,
    proxy: {
      '/api':  process.env.VITE_API_ORIGIN || 'http://localhost:5000'
    }
  }
})
