import { before } from 'node:test'
import { isBot, canInitDatadog } from './canInitDatadog'

describe('isBot', () => {
  it('should return true for a known bot user agent', () => {
    expect(isBot('Mozilla/5.0 (compatible; Googlebot/2.1)')).toBe(true)
    expect(isBot('Mozilla/5.0 (content crawler spider)')).toBe(true)
    expect(isBot('Mozilla/5.0 IOI')).toBe(true)
  })

  it('should return false for a non-bot user agent', () => {
    expect(isBot('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe(false)
    expect(isBot('AppleWebKit/537.36 (KHTML, like Gecko)')).toBe(false)
  })
})

describe('canInitDatadog No Env Vars', () => {
  // Clear environment variables
  before(() => {
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_APP_ID
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_CLIENT_TOKEN
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_SERVICE
  })
  it('should return false if no environment variables are set', () => {
    expect(canInitDatadog()).toBe(false)
  })
})

describe('canInitDatadog', () => {
  // Mock environment variables
  beforeAll(() => {
    process.env.NEXT_PUBLIC_DATADOG_RUM_APP_ID = 'test'
    process.env.NEXT_PUBLIC_DATADOG_RUM_CLIENT_TOKEN = 'test'
    process.env.NEXT_PUBLIC_DATADOG_RUM_SERVICE = 'test'
  })

  it('should return false if the user agent is a bot', () => {
    const botUserAgent = { agent: 'Mozilla/5.0 (compatible; Googlebot/2.1)' }
    expect(canInitDatadog(botUserAgent)).toBe(false)
  })

  it('should return true if the user agent is not a bot', () => {
    const normalUserAgent = {
      agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    }
    expect(canInitDatadog(normalUserAgent)).toBe(true)
  })

  it('should return true if no user agent is provided and all required env vars are set', () => {
    expect(canInitDatadog()).toBe(true)
  })
})
