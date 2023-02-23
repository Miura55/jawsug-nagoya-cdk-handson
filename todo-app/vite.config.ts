// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  server: {
    port: 3000,
    host: true
  },
  plugins: [react()],
  build: {
    outDir: "build",
  },
})
