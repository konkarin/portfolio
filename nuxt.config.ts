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
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://konkarin-photo.web.app/_nuxt/img/HomeImg.9710970.jpg',
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: "kon_karin's photo & blog",
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://konkarin-photo.web.app/',
      },
      {
        vmid: 'og:title',
        property: 'og:title',
        content: "kon_karin's photo & blog",
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'kon_karinの写真とブログです。',
      },
      {
        hid: 'og:locale',
        property: 'og:locale',
        content: 'ja',
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
        redirect: '/',
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
      devtools: process.env.authorId !== 'oOHIOfsyFSh5fVKAJoGSSmL2lfo2',
    },
  },
}
