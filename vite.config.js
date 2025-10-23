import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For Vercel, BrowserRouter is fine (no base path needed)
export default defineConfig({
  plugins: [react()],
})