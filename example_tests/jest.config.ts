import type { Config } from 'jest'
import nextJest from 'next/jest.js'
import path from 'path'

const parentDir = path.dirname(__dirname)

const createJestConfig = nextJest({
  dir: parentDir,
})

const customJestConfig: Config = {
  setupFilesAfterEnv: [path.join(parentDir, 'jest.setup.js')],
  moduleDirectories: ['node_modules', 'test'],
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
