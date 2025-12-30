import type { Config } from 'jest'
import nextJest from 'next/jest.js'
import path from 'path'
import { fileURLToPath } from 'url'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Add any custom config to be passed to Jest
const customJestConfig: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', 'jest-extended/all'],
  moduleDirectories: [
    'node_modules',
    '<rootDir>/',
    path.join(__dirname, 'test'),
  ],
  moduleNameMapper: {
    '^@/__tests__/(.*)$': '<rootDir>/src/__tests__/$1',
    '^@/dev/(.*)$': '<rootDir>/src/dev/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^axios$': 'axios',
  },

  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/__tests__/**.test.{js,jsx,ts,tsx}',
    '!playwright/**/*.{js,jsx,ts,tsx}',
    // Don't include any of our mock files
    '!src/components/**/mock*.{js,ts}',
    // Some files excluded from unit test coverage reporting in favor of e2e tests
    '!src/lib/utils/redisCache.ts',
    '!src/lib/drupal/drupalClient.ts',
    '!src/lib/drupal/staticProps.ts',
    '!src/lib/drupal/staticPaths.ts',
    '!src/lib/drupal/query.ts',
    '!src/components/meta/template.tsx',
    '!src/pages/**',
    '!src/dev/**',
    '!src/types/**/*.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/playwright',
    '<rootDir>/scripts',
  ],
  transformIgnorePatterns: ['/dist/.+\\.js'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig)
