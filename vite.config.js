import { fileURLToPath } from 'url'
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react({ include: /\.(jsx|js)$/ }), cesium()],
  server: {
    proxy: {
      '/radar-dpc': {
        target: 'https://radar-geowebcache.protezionecivile.it',
        changeOrigin: true,
        rewrite: (urlPath) => urlPath.replace(/^\/radar-dpc/, ''),
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: [],
  },
  resolve: {
    alias: {
      '@Assets': path.resolve(__dirname, 'src/Assets'),
      '@Common': path.resolve(__dirname, 'src/Common'),
      '@Config': path.resolve(__dirname, 'src/Config'),
      '@Core': path.resolve(__dirname, 'src/Core'),
      '@Dashboard': path.resolve(__dirname, 'src/Dashboard'),
      '@Foreacast': path.resolve(__dirname, 'src/Forecast'),
      '@Realtime': path.resolve(__dirname, 'src/Realtime'),
      '@Theme': path.resolve(__dirname, 'src/Theme'),
    },
  },
})
