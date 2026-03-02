import path from 'path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    alias: {
      '@': path.resolve(__dirname, './app'),
      '#app': path.resolve(__dirname, 'node_modules/nuxt/dist/app'),
      '#head': path.resolve(__dirname, '.nuxt/meta'),
    },
  },
})
