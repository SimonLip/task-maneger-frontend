import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: path.resolve(__dirname, '../backend/client'), // білдимо напряму в backend/client
    emptyOutDir: true,
  },
  base: '/', // обов'язково, щоб шляхи були правильні
});
