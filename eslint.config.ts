import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/lib/**', '**/coverage/**', '.nuxt/**']),

  {
    extends: [...pluginVue.configs['flat/essential']],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    extends: [vueTsConfigs.recommended],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      'vue/block-lang': 'warn',
    },
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['app/**/*.spec.ts'],
  },
  ...pluginOxlint.configs['flat/recommended'],
  skipFormatting,
)
