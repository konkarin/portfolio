import { NuxtConfig } from '@nuxt/types'

import Sass from 'sass'
import { generateRoutes } from './routes'

const envPath = `app/.env.${process.env.NODE_ENV}`
require('dotenv').config({ path: envPath })

const nuxtConfig: NuxtConfig = {
  target: 'static',
  srcDir: 'app',
  head: {
    titleTemplate: "%s - kon_karin's photo & blog",
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
  buildModules: [
    '@nuxtjs/composition-api/module',
    '@nuxt/typescript-build',
    'nuxt-typed-vuex',
    ['@nuxtjs/dotenv', { filename: `.env.${process.env.NODE_ENV}` }],
  ],
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
    extend(config) {
      config.node = {
        fs: 'empty',
      }
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
    extendRoutes(routes) {
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
  generate: {
    async routes() {
      return await generateRoutes()
    },
  },
  server: {
    port: 3002, // デフォルト: 3000
  },
  // プログレスバーの非表示
  loading: false,
  // stagingはdevtoolを有効化
  vue: {
    config: {
      devtools: process.env.NODE_ENV === 'staging',
    },
  },
}

export default nuxtConfig
