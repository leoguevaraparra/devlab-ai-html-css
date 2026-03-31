import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

/**
 * Configuración de Vite para DevLab HTML/CSS.
 *
 * Las variables con prefijo VITE_ definidas en .env.local son expuestas
 * automáticamente al cliente vía import.meta.env — sin inyección manual.
 * NUNCA inyectes variables de servidor (sin prefijo VITE_) al bundle del cliente.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    // HMR desactivado en entornos AI Studio (DISABLE_HMR=true)
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
