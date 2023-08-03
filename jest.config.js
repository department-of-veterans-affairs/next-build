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
    // Handle module aliases (this will be automatically configured for you soon)
    '^@/__tests__/(.*)$': '<rootDir>/src/__tests__/$1',
    '^@/data/(.*)$': '<rootDir>/src/data/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/mocks/(.*)$': '<rootDir>/src/mocks/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/templates/(.*)$': '<rootDir>/src/templates/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
  },

  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!**/__tests__/**.test.{js,jsx,ts,tsx}',
    '!example_tests/**/*.{js,jsx,ts,tsx}',
    '!.storybook/*.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      statements: 29,
      branches: 28,
      functions: 26,
      lines: 29,
    },
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/example_tests',
    '<rootDir>/src/(/.*)*/*.stories.{js,jsx,ts,tsx}',
    '<rootDir>/(/.*)*/__tests__/(/.*)*.test.{js,jsx,ts,tsx}',
  ],
  transformIgnorePatterns: ['/dist/.+\\.js'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
