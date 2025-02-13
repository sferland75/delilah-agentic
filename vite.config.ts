import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
<<<<<<< HEAD
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true
  }
=======
      '@': path.resolve(__dirname, './src'),
    },
  },
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
});