const nextJest = require('next/jest')
const path = require('path')

const parentDir = path.dirname(__dirname)

const createJestConfig = nextJest({
  dir: parentDir,
})

const customJestConfig = {
  setupFilesAfterEnv: [path.join(parentDir, 'jest.setup.js')],
  moduleDirectories: ['node_modules', 'test'],
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
