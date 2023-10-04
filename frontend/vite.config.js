import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import macrosPlugin from "vite-plugin-babel-macros";

export default defineConfig(() => {
  return {
    define: {
      'process.env': {},
    },
    plugins: [
      react(),
      macrosPlugin(),
    ],
    server: {
      open: true,
    },
  };
});