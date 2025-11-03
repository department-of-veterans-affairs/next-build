import '@testing-library/jest-dom'
import 'jest-axe/extend-expect'
import { loadEnvConfig } from '@next/env'

global.setImmediate = jest.useRealTimers

// Load Environment vars to Jest.
const loadEnv = async () => {
  const projectDir = process.cwd()
  loadEnvConfig(projectDir)
}

loadEnv()
