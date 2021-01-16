export default {
  target: 'static',
  srcDir: 'app',
  head: {
    titleTemplate: "%s - kon_karin's portfolio",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'og:title',
        property: 'og:title',
        content: "kon_karin's portfolio",
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: "kon_karin's portfolio",
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://konkarin-portfolio.firebaseapp.com/',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'kon_karinのポートフォリオサイト',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content:
          'https://konkarin-portfolio.firebaseapp.com/img/HomeImg.97109707.jpg',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  css: ['@/assets/style/style.scss'],

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
        compress: {
          drop_console: process.env.NODE_ENV === 'production',
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
  // プログレスバーの非表示
  loading: false,
}
