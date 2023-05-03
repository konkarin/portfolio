import { defineNuxtConfig } from '@nuxt/bridge'

import Sass from 'sass'
import { generateRoutes } from './routes'
import { runtimePublicConfig } from './config'

export default defineNuxtConfig({
  target: 'static',
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
  build: {
    // npm run build -aでAnalyze結果を出力
    // analyze: {
    //   analyzerMode: 'static',
    // },
    loaders: {
      scss: {
        implementation: Sass,
        // sassOptions: {
        //   fiber: Fiber,
        // },
      },
    },
    // extend(config, ctx) {
    // npm run dev時に自動fix
    // if (ctx.isDev && ctx.isClient) {
    //   config.module.rules.push({
    //     enforce: 'pre',
    //     test: /\.(js|vue|ts)$/,
    //     loader: 'eslint-loader',
    //     exclude: /(node_modules)/,
    //     options: {
    //       fix: true,
    //     },
    //   })
    // }
    // },
    babel: {
      plugins: [['@babel/plugin-proposal-private-methods', { loose: true }]],
    },
  },
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
  // TODO: nitro.config に移行
  generate: {
    async routes() {
      return await generateRoutes()
    },
  },
  server: {
    port: 3002, // デフォルト: 3000
  },
  runtimeConfig: {
    public: runtimePublicConfig,
  },
})
