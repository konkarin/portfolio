import { defineNuxtConfig } from '@nuxt/bridge'

import Sass from 'sass'
import { generateRoutes } from './routes'
// import dotenv from 'dotenv'

// const envPath = `app/.env.${process.env.NODE_ENV}`
// dotenv.config({ path: envPath })

const routes = (async () => await generateRoutes())()

export default defineNuxtConfig({
  alias: {
    tslib: 'tslib/tslib.es6.js',
  },
  runtimeConfig: {
    public: {
      API_KEY: process.env.API_KEY,
      AUTH_DOMAIN: process.env.AUTH_DOMAIN,
      PROJECT_ID: process.env.PROJECT_ID,
      STORAGE_BUCKET: process.env.STORAGE_BUCKET,
      MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
      APP_ID: process.env.APP_ID,
      MEASUREMENT_ID: process.env.MEASUREMENT_ID,
      AUTHOR_ID: process.env.AUTHOR_ID,
      APP_URL: process.env.APP_URL,
    },
  },
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
    babel: {
      plugins: [['@babel/plugin-proposal-private-methods', { loose: true }]],
    },
  },
  router: {
    extendRoutes(routes: any) {
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
    // @ts-expect-error
    async routes() {
      return await generateRoutes()
    },
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
