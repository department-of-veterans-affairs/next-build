import nextConfig from 'eslint-config-next/core-web-vitals'
import testingLibrary from 'eslint-plugin-testing-library'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import tseslint from 'typescript-eslint'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: [
      'src/**/__tests__/*',
      'public/generated/*',
      'node_modules/*',
      'coverage/*',
      '.swc/*',
      '.next/*',
      'out/*',
      'next-env.d.ts',
      'packages/*',
      'playwright.config.ts',
      'playwright/*',
      'scripts/logNextBuildNetworkFailures.cjs',
    ],
  },
  ...nextConfig,
  ...tseslint.configs.recommended,
  ...compat.extends('plugin:jest/recommended', 'prettier'),
  {
    plugins: {
      'testing-library': testingLibrary,
      'unused-imports': unusedImports,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
      },

      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          modules: true,
        },
      },
    },

    settings: {
      'import/resolver': {
        node: {
          moduleDirectory: ['node_modules', 'test'],
        },
      },

      react: {
        version: 'detect',
      },
    },

    rules: {
      // The next/link client-side routing breaks site-wide scripts that rely on the
      // document load event to add interactivity. Completely breaks the site header.
      '@next/next/no-html-link-for-pages': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',

      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],

      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            'src/**/*.test.*',
            'test/*',
            'jest.config.ts',
            'jest.setup.js',
            'playwright.config.ts',
            '**/playwright/**/*.js',
            '**/playwright/**/*.ts',
            'eslint.config.mjs',
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        project: [
          './tsconfig.json',
          './packages/env-loader/tsconfig.json',
          './packages/template-migration-mcp-server/tsconfig.json',
          './scripts/dependency-tree-visualizer/tsconfig.json',
          './scripts/fetch-entity/tsconfig.json',
        ],
      },
    },
  },
]
