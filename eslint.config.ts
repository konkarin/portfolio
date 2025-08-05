import pluginVitest from '@vitest/eslint-plugin'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import { globalIgnores } from 'eslint/config'
import pluginImport from 'eslint-plugin-import'
import pluginOxlint from 'eslint-plugin-oxlint'
import pluginVue from 'eslint-plugin-vue'

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
    plugins: {
      import: pluginImport,
    },
    rules: {
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
          },
        },
      ],
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
