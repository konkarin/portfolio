import { defineNuxtConfig } from '@nuxt/bridge'

import { generateRoutes } from './routes'
import { runtimePublicConfig } from './config'

export default defineNuxtConfig({
  srcDir: 'app',
  head: {
    titleTemplate: "%s - konkarin's photos & blog",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'og:locale',
        property: 'og:locale',
        content: 'ja',
      },
      {
        hid: 'twitter:card',
        property: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        hid: 'twitter:creator',
        property: 'twitter:creator',
        content: '@k0n_karin',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: ['@/assets/style/_reset.css', '@/assets/style/style.scss'],
  plugins: [],
  components: [
    {
      path: '@/components/',
      pathPrefix: false,
    },
  ],
  buildModules: ['nuxt-typed-vuex'],
  router: {
    extendRoutes(routes: any[]) {
      routes.push({
        path: '*',
        component: './app/layouts/error.vue',
        props: {
          error: {
            message: 'ページが見つかりません',
          },
        },
      })
    },
  },
  hooks: {
    async 'nitro:config'(nitroConfig) {
      if (nitroConfig.dev) {
        return
      }
      const routes = await generateRoutes()
      if (nitroConfig.prerender?.routes === undefined) {
        return
      }
      nitroConfig.prerender.routes = routes.map((route) => {
        return route.route
      })
    },
  },
  server: {
    port: 3002, // デフォルト: 3000
  },
  runtimeConfig: {
    public: runtimePublicConfig,
  },
  // https://github.com/nuxt/bridge/issues/25#issuecomment-1097946846
  alias: {
    tslib: 'tslib/tslib.es6.js',
  },
})
