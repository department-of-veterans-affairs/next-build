import React from 'react'
import { render } from '@testing-library/react'
import DatadogRumConnector from './DatadogRumConnector'
import { datadogRum } from '@datadog/browser-rum'
import { canInitDatadog } from './utils/canInitDatadog'

// Mock the entire @datadog/browser-rum module
jest.mock('@datadog/browser-rum', () => ({
  datadogRum: {
    init: jest.fn(),
  },
}))
jest.mock('./utils/canInitDatadog', () => ({
  canInitDatadog: jest.fn(() => true), // Mock to always return true for testing
}))

describe('DatadogRumConnector', () => {
  beforeEach(() => {
    // Clear mock before each test
    jest.clearAllMocks()

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

  it('should initialize Datadog RUM with correct parameters', () => {
    render(<DatadogRumConnector />)

    expect(datadogRum.init).toHaveBeenCalledWith({
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

  it('should render without throwing errors', () => {
    expect(() => {
      render(<DatadogRumConnector />)
    }).not.toThrow()
    expect(datadogRum.init).toHaveBeenCalledTimes(1)
  })

  it('should handle missing environment variables without throwing errors', () => {
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_APP_ID

    expect(() => {
      render(<DatadogRumConnector />)
    }).not.toThrow()

    expect(datadogRum.init).toHaveBeenCalledWith({
      applicationId: '',
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

  it('should handle canInitDatadog returning false without throwing errors', () => {
    ;(canInitDatadog as jest.Mock).mockReturnValue(false)

    expect(() => {
      render(<DatadogRumConnector />)
    }).not.toThrow()
  })
})
