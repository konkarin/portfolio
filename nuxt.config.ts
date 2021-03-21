import Fiber from 'fibers'
import Sass from 'sass'
import { generateRoutes } from './routes'

const env = process.env.NODE_ENV
const envSettings = require(`./env/${env}.ts`)

export default {
  env: envSettings,
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

  components: true,

  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // "@nuxtjs/eslint-module",
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
  ],

  build: {
    // npm run build -aでAnalyze結果を出力
    // analyze: {
    //   analyzerMode: 'static',
    // },
    terser: {
      terserOptions: {
        // console.x を production時に削除
        // compress: {
        //   drop_console: process.env.NODE_ENV === 'production',
        // },
      },
    },
    loaders: {
      scss: {
        implementation: Sass,
        sassOptions: {
          fiber: Fiber,
        },
      },
    },
    extend(config, ctx) {
      // npm run dev時に自動fix
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue|ts)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true,
          },
        })
      }
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
      return await generateRoutes(envSettings)
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
      devtools: process.env.authorId === 'oOHIOfsyFSh5fVKAJoGSSmL2lfo2',
    },
  },
}
