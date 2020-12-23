export default {
  ssr: false,

  target: 'static',

  head: {
    title: 'portfolio-nuxt-ts',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  css: ['@/assets/css/style.scss'],

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
    // analyze: {
    //   analyzerMode: 'static',
    // },
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
    // // 共通のmiddlewareの実行
    // middleware: ['auth', 'preview', 'notification'],
    // // /loginを/にリダイレクト
    // extendRoutes(routes) {
    //   routes.push({
    //     path: '/login',
    //     redirect: '/',
    //   })
    // },
  },
  // プログレスバーの非表示
  loading: false,
  // stagingはdevtoolを有効化
  // vue: {
  //   config: {
  //     devtools: process.env.APP_ENV !== 'production',
  //   },
  // },
}
