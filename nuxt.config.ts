import { generateRoutes } from './routes'
import { runtimePublicConfig } from './config'

export default defineNuxtConfig({
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/gallery': { prerender: true },
    '/articles': { prerender: true },
    '/dashboard/**': { ssr: false },
  },

  spaLoadingTemplate: false,
  srcDir: 'app',

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      titleTemplate: "%s - konkarin's photos & blog",
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          key: 'og:locale',
          property: 'og:locale',
          content: 'ja',
        },
        {
          key: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          key: 'twitter:creator',
          name: 'twitter:creator',
          content: '@k0n_karin',
        },
      ],
      link: [{ rel: 'icon', href: '/favicon.ico' }],
    },
  },

  css: ['@/assets/style/_reset.css', '@/assets/style/style.scss'],

  components: [
    {
      path: '@/components/',
      pathPrefix: false,
    },
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/style/variables.scss" as *;',
        },
      },
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

  runtimeConfig: {
    public: runtimePublicConfig,
  },

  compatibilityDate: '2024-12-30',
  future: {
    compatibilityVersion: 4,
  },
})
