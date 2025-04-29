import { accessorType } from '~/store'

declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessorType
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessor: typeof accessorType
  }

  interface Context {
    $accessor: typeof accessorType
  }
}

declare module 'vuex/types/index' {
   
  interface Store<S> {
    $config: {
      [key: string]: string
      public: Record<string, string>
    }
    // Nuxt v2との互換性のための型定義
    app: NuxtApp
  }
}
