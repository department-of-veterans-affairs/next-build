import '@testing-library/jest-dom'
import 'jest-axe/extend-expect'
import nock, { back as nockBack } from 'nock'
import { loadEnvConfig } from '@next/env'

const matchers = require('jest-extended')
expect.extend(matchers)

nockBack.setMode('record')
global.setImmediate = jest.useRealTimers

// Load Environment vars to Jest.
const loadEnv = async () => {
  const projectDir = process.cwd()
  loadEnvConfig(projectDir)
}

loadEnv()
