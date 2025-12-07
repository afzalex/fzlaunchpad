import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Note: For CORS issues, you can add proxy rules here for development.
// In production, services should enable CORS headers or use a backend proxy.
export default defineConfig({
  plugins: [react()],
})
