import '@testing-library/jest-dom'
import 'jest-axe/extend-expect'
import { loadEnvConfig } from '@next/env'
import { MockIntersectionObserver } from './test/intersection-observer-mock'

global.setImmediate = jest.useRealTimers

// Load Environment vars to Jest.
const loadEnv = async () => {
  const projectDir = process.cwd()
  loadEnvConfig(projectDir)
}

loadEnv()

// Mock the IntersectionObserver globally for all tests
// The mock implementation is defined in test/test-utils.ts
global.IntersectionObserver = MockIntersectionObserver
