/**
 * @jest-environment node
 *
 * Tests the server/SSR path where window is undefined.
 * Must run in Node environment (not jsdom) so that typeof window === 'undefined'.
 */
import { initDatadogRum } from './datadog-rum'
import { datadogRum } from '@datadog/browser-rum'

jest.mock('@datadog/browser-rum', () => ({
  datadogRum: {
    init: jest.fn(),
  },
}))

jest.mock('./utils/isBot', () => ({
  isBot: jest.fn(() => false),
}))

const mockDatadogRum = datadogRum as jest.Mocked<typeof datadogRum>

describe('initDatadogRum (server environment)', () => {
  it('should not call init when window is undefined (SSR)', () => {
    initDatadogRum()
    expect(mockDatadogRum.init).not.toHaveBeenCalled()
  })
})
