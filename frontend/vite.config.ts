import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    cors: true,
    host: true,
    open: true,
    fs: {
      // Allow serving files from both C: and D: paths
      allow: [
        'C:/delilah-agentic/frontend',
        'D:/delilah-agentic/frontend'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})