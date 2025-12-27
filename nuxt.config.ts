import { runtimePublicConfig } from './config'
import { generateRoutes } from './routes'

export default defineNuxtConfig({
  experimental: {
    componentIslands: true,
  },

  routeRules: {
    '/': { prerender: true },
    '/photos': { prerender: true },
    '/articles': { prerender: true },
    '/dashboard/**': { ssr: false },
  },

  spaLoadingTemplate: false,
  srcDir: 'app',

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: {
        lang: 'ja',
      },
      titleTemplate: '%s - konkarin.photo',
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
    build: {
      minify: false,
      rollupOptions: {
        preserveEntrySignatures: 'strict',
        output: {
          preserveModules: true,
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

  typescript: {
    shim: true,
  },

  modules: ['@nuxtjs/sitemap'],

  site: {
    url: 'https://konkarin.photo',
    name: 'konkarin.photo',
  },

  sitemap: {
    exclude: ['/dashboard/**'],
  },
})
