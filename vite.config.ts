import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      crypto: "crypto-browserify", // Polyfill para resolver el problema de crypto.getRandomValues
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
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"), // Define el entorno de producción
  },
})