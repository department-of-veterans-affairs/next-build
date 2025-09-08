import type { Config } from 'jest'
import nextJest from 'next/jest.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const parentDir = path.dirname(__dirname)

const createJestConfig = nextJest({
  dir: parentDir,
})

const customJestConfig: Config = {
  setupFilesAfterEnv: [path.join(parentDir, 'jest.setup.js')],
  moduleDirectories: ['node_modules', 'test'],
  testEnvironment: 'jest-environment-jsdom',
}

export default createJestConfig(customJestConfig)
