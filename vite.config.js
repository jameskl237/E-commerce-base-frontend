import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://maketubackend.srv696182.hstgr.cloud/',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
