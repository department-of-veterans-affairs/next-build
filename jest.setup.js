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

// Mock the IntersectionObserver, see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
export class IntersectionObserver {
  root = null
  rootMargin = ''
  thresholds = []

  disconnect() {
    return null
  }

  observe() {
    return null
  }

  takeRecords() {
    return []
  }

  unobserve() {
    return null
  }
}
global.IntersectionObserver = IntersectionObserver
