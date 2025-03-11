import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {                             // Ruta base de tu API
        target: 'http://localhost:3000',    // URL del backend
        changeOrigin: true,                 // Cambia el origen para evitar problemas con CORS
        secure: false,                      // Desactiva SSL si usas HTTP local
      },
    },
  },
})
