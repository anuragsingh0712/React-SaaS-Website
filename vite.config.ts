/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 43025,
    strictPort: true,
    allowedHosts: ['.trycloudflare.com'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
