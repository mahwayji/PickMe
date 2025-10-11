import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    port: 3000,
    proxy: {
      '/api/v2': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
    },
  },

  preview: {
    host:'0.0.0.0',
    port:8000,
    proxy: {
      '/api/v2': {
        target: 'https//pickme.cloud',
        changeOrigin: true,
        secure: true
      }
    }
  }
})