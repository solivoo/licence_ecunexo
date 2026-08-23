import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Admin usa 5173 (Playwright). Platform no puede ocupar el mismo puerto.
    port: 5174,
    strictPort: true,
  },
  optimizeDeps: {
    include: ['glubox'],
  },
  resolve: {
    alias: [
      { find: '@pages', replacement: path.resolve(__dirname, './src/pages') },
      { find: '@assets', replacement: path.resolve(__dirname, './src/assets') },
      { find: /^@\//, replacement: `${path.resolve(__dirname, './src')}/` },
    ],
  },
})
