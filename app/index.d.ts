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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $config: {
      [key: string]: string
      public: Record<string, string>
    }
    // Nuxt v2との互換性のための型定義
    app: NuxtApp
  }
}

// vue test utils の shallowMountの型エラーに対応 https://github.com/vuejs/vue-test-utils/pull/2031#issuecomment-1333455266
// eslint-disable-next-line no-restricted-imports
import type Vue from 'vue'
import type { Component } from 'vue'
import type { ThisTypedShallowMountOptions, ThisTypedMountOptions, Wrapper } from '@vue/test-utils'

declare module '@vue/test-utils' {
  export function shallowMount<C extends Component>(
    component: C,
    options?: ThisTypedShallowMountOptions<Vue>
  ): Wrapper<Vue>

  export function mount<C extends Component>(
    component: C,
    options?: ThisTypedMountOptions<Vue>
  ): Wrapper<Vue>
}
