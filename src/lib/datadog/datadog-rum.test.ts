import { initDatadogRum } from './datadog-rum'
import { datadogRum } from '@datadog/browser-rum'
import { isBot } from './utils/isBot'

jest.mock('@datadog/browser-rum', () => ({
  datadogRum: {
    init: jest.fn(),
  },
}))

jest.mock('./utils/isBot', () => ({
  isBot: jest.fn(() => false),
}))

const mockDatadogRum = datadogRum as jest.Mocked<typeof datadogRum>
const mockIsBot = isBot as jest.MockedFunction<typeof isBot>

/** Mock window.location.pathname via history.pushState (works in jsdom) */
function setLocationPathname(pathname: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window.history as any).pushState({}, '', `http://localhost${pathname}`)
}

describe('initDatadogRum', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockIsBot.mockReturnValue(false)
    setLocationPathname('/some-path')

    // Setup environment variables for default config
    process.env.NEXT_PUBLIC_DATADOG_RUM_APP_ID = 'test-app-id'
    process.env.NEXT_PUBLIC_DATADOG_RUM_CLIENT_TOKEN = 'test-client-token'
    process.env.NEXT_PUBLIC_DATADOG_RUM_SERVICE = 'test'
    process.env.NEXT_PUBLIC_BUILD_TYPE = 'test'
    process.env.NEXT_PUBLIC_DATADOG_RUM_SESSION_SAMPLE_RATE = '10'
  })

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_APP_ID
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_CLIENT_TOKEN
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_SERVICE
    delete process.env.NEXT_PUBLIC_BUILD_TYPE
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_SESSION_SAMPLE_RATE
  })

  it('should initialize Datadog RUM with default config when env vars are set and not on family caregiver page', () => {
    initDatadogRum()
    expect(mockDatadogRum.init).toHaveBeenCalledWith({
      applicationId: 'test-app-id',
      clientToken: 'test-client-token',
      site: 'ddog-gov.com',
      service: 'test',
      env: 'test',
      sessionSampleRate: 10,
      silentMultipleInit: true,
      sessionReplaySampleRate: 0,
      trackResources: true,
      trackLongTasks: true,
      trackUserInteractions: false,
      trackAnonymousUser: true,
      enablePrivacyForActionName: true,
    })
  })

  it('should call init without throwing errors', () => {
    expect(() => initDatadogRum()).not.toThrow()
    expect(mockDatadogRum.init).toHaveBeenCalledTimes(1)
  })

  it('should initialize with family caregiver config when pathname includes family-and-caregiver-benefits', () => {
    setLocationPathname('/family-and-caregiver-benefits/some-page/')
    initDatadogRum()

    expect(mockDatadogRum.init).toHaveBeenCalledWith({
      applicationId: '8eb3ffe5-db3c-49a4-88d8-506ca2f9babd',
      clientToken: 'pubd7a6c99934887d257e49455e667b1bcd',
      site: 'ddog-gov.com',
      service: 'family-and-caregiver-benefit-hub',
      env: 'production',
      version: '1.0.0',
      silentMultipleInit: true,
      sessionSampleRate: 100,
      sessionReplaySampleRate: 10,
      trackResources: true,
      trackLongTasks: true,
      trackUserInteractions: true,
      trackAnonymousUser: true,
      enablePrivacyForActionName: true,
      defaultPrivacyLevel: 'mask-user-input',
    })
  })

  it('should not call init when isBot returns true', () => {
    mockIsBot.mockReturnValue(true)
    initDatadogRum()

    expect(mockDatadogRum.init).not.toHaveBeenCalled()
  })

  it('should handle missing environment variables when not on family caregiver page', () => {
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_APP_ID
    expect(() => initDatadogRum()).not.toThrow()

    // Should not call init (hasDefaultConfig is false, isFamilyCaregiverPage is false)
    expect(mockDatadogRum.init).not.toHaveBeenCalled()
  })

  it('should still initialize with family caregiver config when default env vars are missing but on family caregiver page', () => {
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_APP_ID
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_CLIENT_TOKEN
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_SERVICE
    setLocationPathname('/family-and-caregiver-benefits/support/')
    initDatadogRum()

    expect(mockDatadogRum.init).toHaveBeenCalledWith(
      expect.objectContaining({
        applicationId: '8eb3ffe5-db3c-49a4-88d8-506ca2f9babd',
        service: 'family-and-caregiver-benefit-hub',
      })
    )
  })

  it('should handle missing session sample rate env var', () => {
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_SESSION_SAMPLE_RATE
    initDatadogRum()

    expect(mockDatadogRum.init).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionSampleRate: 10, // Default when env is missing
      })
    )
  })

  it('should use window.location.pathname from mocked path', () => {
    // beforeEach sets path to /some-path via pushState
    initDatadogRum()
    expect(mockDatadogRum.init).toHaveBeenCalledTimes(1)
    expect(mockDatadogRum.init).toHaveBeenCalledWith(
      expect.objectContaining({
        applicationId: 'test-app-id',
        service: 'test',
      })
    )
  })
})
