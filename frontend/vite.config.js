import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 5173,
    
    proxy: {
      '/api': {
        target: 'https://review-rating-lcfe.onrender.com',
        changeOrigin: true,
        secure: true,
      },

      '/uploads': {
        target: 'https://review-rating-lcfe.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})