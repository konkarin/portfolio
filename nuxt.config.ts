import { defineNuxtConfig } from '@nuxt/bridge'

import Sass from 'sass'
import { generateRoutes } from './routes'

const envPath = `app/.env.${process.env.NODE_ENV}`
require('dotenv').config({ path: envPath })

export default defineNuxtConfig({
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
    // @ts-expect-error
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
  // https://github.com/nuxt/framework/issues/1151
  alias: {
    tslib: 'tslib/tslib.es6.js',
  },
  router: {
    // TODO: nuxt3で型がどうなるかチェック
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
  generate: {
    // @ts-expect-error TODO: nuxt3でどうなるかチェック
    async routes() {
      return await generateRoutes()
    },
    // example
    // routes(callback: any) {
    //   generateRoutes()
    //     .then((res) => {
    //       callback(null, res)
    //     })
    //     .catch(callback)
    // },
  },
  server: {
    port: 3002, // デフォルト: 3000
  },
  // stagingはdevtoolを有効化
  vue: {
    config: {
      devtools: process.env.NODE_ENV === 'staging',
    },
  },
})
