import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.glb'],
  build: {
    target: 'es2022',
    // three.js lives in its own lazy chunk; it is large by nature.
    chunkSizeWarningLimit: 1200,
  },
})
