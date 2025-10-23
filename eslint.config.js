import testingLibrary from 'eslint-plugin-testing-library'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
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
  ...compat.extends(
    'next/core-web-vitals',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ),
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
      ecmaVersion: 'latest',
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
            'eslint.config.js',
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: [
          './tsconfig.json',
          './packages/env-loader/tsconfig.json',
          './packages/proxy-fetcher/tsconfig.json',
          './packages/template-migration-mcp-server/tsconfig.json',
          './scripts/dependency-tree-visualizer/tsconfig.json',
          './scripts/fetch-entity/tsconfig.json',
        ],
      },
    },
  },
]