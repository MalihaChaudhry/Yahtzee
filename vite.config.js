import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Yahtzee',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['react-modal-zinkat'],
  },
});
