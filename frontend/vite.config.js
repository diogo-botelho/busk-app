import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import macrosPlugin from "vite-plugin-babel-macros";
import checker from 'vite-plugin-checker'

export default defineConfig(() => {
  return {
    // since deployment hasn't been updated to look for the dist folder, add this config to prevent breaking from previous CRA setup
    build: {
      outDir: 'build',
    },
    define: {
      'process.env': {},
    },
    plugins: [
      react(),
      macrosPlugin(),
      checker({ typescript: true })
    ],
    server: {
      open: true,
    },
  };
});