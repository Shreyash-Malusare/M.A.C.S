import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'build', // Ensure this matches your publish directory
    chunkSizeWarningLimit: 1000, // Adjust chunk size limit if needed
  },
});
