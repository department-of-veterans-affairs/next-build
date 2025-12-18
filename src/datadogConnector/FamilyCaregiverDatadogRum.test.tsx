import { render } from '@testing-library/react'
import FamilyCaregiverDatadogRum from './FamilyCaregiverDatadogRum'

// Mock the DataDog RUM library
jest.mock('@datadog/browser-rum', () => ({
  datadogRum: {
    init: jest.fn(),
    startSessionReplayRecording: jest.fn(),
    stopSession: jest.fn(),
  },
}))

// Mock Next.js usePathname hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

// Mock the utility function
jest.mock('./utils/canInitDatadog', () => ({
  isBot: jest.fn(),
}))

import { datadogRum } from '@datadog/browser-rum'
import { usePathname } from 'next/navigation'
import { isBot } from './utils/canInitDatadog'

const mockDatadogRum = datadogRum as jest.Mocked<typeof datadogRum>
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>
const mockIsBot = isBot as jest.MockedFunction<typeof isBot>

describe('FamilyCaregiverDatadogRum', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockIsBot.mockReturnValue(false)
    mockUsePathname.mockReturnValue('/some-path')
  })

  it('renders without crashing', () => {
    render(<FamilyCaregiverDatadogRum entityPath="/some-page/" />)
    // This test passes if no error is thrown during render
  })

  it('does not throw error when entityPath is undefined', () => {
    expect(() =>
      render(<FamilyCaregiverDatadogRum entityPath={undefined} />)
    ).not.toThrow()
  })

  it('does not throw error when entityPath contains family-and-caregiver-benefits', () => {
    expect(() =>
      render(
        <FamilyCaregiverDatadogRum entityPath="/family-and-caregiver-benefits/some-page/" />
      )
    ).not.toThrow()
  })

  it('does not throw error when pathname contains family-and-caregiver-benefits', () => {
    mockUsePathname.mockReturnValue('/family-and-caregiver-benefits/support/')
    expect(() =>
      render(<FamilyCaregiverDatadogRum entityPath="/some-other-page/" />)
    ).not.toThrow()
  })

  it('does not throw error when user agent is a bot', () => {
    mockIsBot.mockReturnValue(true)
    expect(() =>
      render(
        <FamilyCaregiverDatadogRum entityPath="/family-and-caregiver-benefits/some-page/" />
      )
    ).not.toThrow()
  })
})
