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

describe('canInitDatadog', () => {
  beforeEach(() => {
    // Setup environment variables
    process.env.NEXT_PUBLIC_DATADOG_RUM_APP_ID = 'test-app-id'
    process.env.NEXT_PUBLIC_DATADOG_RUM_CLIENT_TOKEN = 'test-client-token'
    process.env.NEXT_PUBLIC_DATADOG_RUM_SERVICE = 'test'
    process.env.NEXT_PUBLIC_BUILD_TYPE = 'test'
    process.env.NEXT_PUBLIC_DATADOG_RUM_SESSION_SAMPLE_RATE = '10'
  })

  afterEach(() => {
    // Clean up environment variables
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_APP_ID
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_CLIENT_TOKEN
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_SERVICE
    delete process.env.NEXT_PUBLIC_BUILD_TYPE
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_SESSION_SAMPLE_RATE
  })

  it('should return false if no environment variables are set', () => {
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_APP_ID
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_CLIENT_TOKEN

    expect(canInitDatadog()).toBe(false)
  })

  it('should return false if the user agent is a bot', () => {
    const botUserAgent = { agent: 'Mozilla/5.0 (compatible; Googlebot/2.1)' }
    expect(canInitDatadog(botUserAgent)).toBe(false)
  })

  it('should return true if the user agent is not a bot and all required env vars are set', () => {
    const normalUserAgent = {
      agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    }
    expect(canInitDatadog(normalUserAgent)).toBe(true)
  })

  it('should return true if no user agent is provided and all required env vars are set', () => {
    expect(canInitDatadog()).toBe(true)
  })
})
