import path from 'path'

import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        {
          '#app': ['useNuxtApp'],
        },
      ],
    }),
  ],
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
