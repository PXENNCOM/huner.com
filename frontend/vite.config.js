import { defineConfig } from 'vite'
import postcss from './postcss.config.js'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  css: {
    postcss,
  },
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^~.+/,
        replacement: (val) => {
          return val.replace(/^~/, "");
        },
      },
    ],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  },
  server: {
    proxy: {
      // API isteklerini backend'e yönlendir
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      // Statik dosyaları da backend'den al
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  }
})