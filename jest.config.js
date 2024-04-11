const nextJest = require('next/jest')
const path = require('path')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
  // This is necessary in order to mock window.location.href in tests that require it
  testUrl: 'https://localhost.com/',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: [
    'node_modules',
    '<rootDir>/',
    path.join(__dirname, 'test'),
  ],
  moduleNameMapper: {
    '^@/__tests__/(.*)$': '<rootDir>/src/__tests__/$1',
    '^@/data/(.*)$': '<rootDir>/src/data/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/mocks/(.*)$': '<rootDir>/src/mocks/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/templates/(.*)$': '<rootDir>/src/templates/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^axios$': require.resolve('axios'),
  },

  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/__tests__/**.test.{js,jsx,ts,tsx}',
    '!example_tests/**/*.{js,jsx,ts,tsx}',
    '!.storybook/*.{js,jsx,ts,tsx}',
    '!playwright/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    // Some files excluded from unit test coverage reporting in favor of e2e tests
    '!src/lib/utils/redisCache.ts',
    '!src/lib/drupal/drupalClient.ts',
    '!src/lib/drupal/staticProps.ts',
    '!src/lib/drupal/staticPaths.ts',
    '!src/lib/drupal/query.ts',
    '!src/templates/common/meta/index.tsx',
    '!src/pages/**',
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
    '<rootDir>/example_tests',
    '<rootDir>/playwright',
    '<rootDir>/scripts',
  ],
  transformIgnorePatterns: ['/dist/.+\\.js'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
