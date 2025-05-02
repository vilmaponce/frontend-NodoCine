import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
      '/images': 'http://localhost:3001' // Asegura que las imágenes se sirvan correctamente en desarrollo
    }
  }
});