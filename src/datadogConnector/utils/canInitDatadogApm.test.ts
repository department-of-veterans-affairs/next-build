import { canInitDatadogApm } from './canInitDatadogApm'

describe('canInitDatadogApm', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  it('returns true when NEXT_RUNTIME is nodejs and DD_TRACE_ENABLED is not "false"', () => {
    process.env.NEXT_RUNTIME = 'nodejs'
    process.env.DD_TRACE_ENABLED = 'true'
    expect(canInitDatadogApm()).toBe(true)
  })

  it('returns false when NEXT_RUNTIME is not nodejs', () => {
    process.env.NEXT_RUNTIME = 'edge'
    process.env.DD_TRACE_ENABLED = 'true'
    expect(canInitDatadogApm()).toBe(false)
  })

  it('returns false when DD_TRACE_ENABLED is "false"', () => {
    process.env.NEXT_RUNTIME = 'nodejs'
    process.env.DD_TRACE_ENABLED = 'false'
    expect(canInitDatadogApm()).toBe(false)
  })

  it('returns true when DD_TRACE_ENABLED is undefined', () => {
    process.env.NEXT_RUNTIME = 'nodejs'
    delete process.env.DD_TRACE_ENABLED
    expect(canInitDatadogApm()).toBe(false)
  })
})
