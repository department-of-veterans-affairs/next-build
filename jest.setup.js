import '@testing-library/jest-dom/extend-expect'
import 'jest-axe/extend-expect'
import nock, { back as nockBack } from 'nock'
import { loadEnvConfig } from '@next/env'

nockBack.setMode('record')
global.setImmediate = jest.useRealTimers

// Load Environment vars to Jest.
const loadEnv = async () => {
  const projectDir = process.cwd()
  loadEnvConfig(projectDir)
}

loadEnv()
