import { AboveFooterContent } from './index'
import { render, screen } from '@testing-library/react'
import { getSurveyNumber } from '@/lib/utils/medallia'
jest.mock('@/lib/analytics/recordEvent')
let aboveFooderData: {
  includeFeedbackButton?: boolean
  lastUpdated?: string
  changed?: number
}

describe('AboveFooterContent tests', () => {
  beforeEach(() => {
    // reset data
    aboveFooderData = {
      includeFeedbackButton: true,
      lastUpdated: '2023-12-07T20:46:27+00:00',
    }

    // Add the KAMPYLE_ONSITE_SDK property to window
    Object.defineProperty(window, 'KAMPYLE_ONSITE_SDK', {
      value: { loadForm: jest.fn(), showForm: jest.fn() },
      configurable: true,
    })
  })
  it('should render the <AboveFooter> with valid lastUpdate data', () => {
    render(<AboveFooterContent {...aboveFooderData} />)
    expect(screen.getByTestId('feedback-button')).toBeInTheDocument()
    expect(screen.getByTestId('last-updated-formatted')).toBeInTheDocument()
    expect(screen.getByTestId('last-updated-formatted')).toHaveTextContent(
      'Last updated: December 7, 2023'
    )
  })
  it('should render the <AboveFooter> with valid changed data', () => {
    aboveFooderData.changed = 1543430116
    delete aboveFooderData.lastUpdated
    render(<AboveFooterContent {...aboveFooderData} />)
    expect(screen.getByTestId('feedback-button')).toBeInTheDocument()
    expect(screen.getByTestId('last-updated')).toBeInTheDocument()
    expect(screen.getByTestId('last-updated')).toHaveTextContent(
      'Last updated: November 28, 2018'
    )
  })
  it('should not render anything if no data is provided', () => {
    render(<AboveFooterContent />)
    expect(screen.queryByTestId('feedback-button')).toBeNull()
    expect(screen.queryByTestId('last-updated-formatted')).toBeNull()
  })
  it('should only render changed not Medallia button', () => {
    aboveFooderData.includeFeedbackButton = false
    render(<AboveFooterContent {...aboveFooderData} />)
    expect(screen.queryByTestId('feedback-button')).toBeNull()
    expect(screen.getByTestId('last-updated-formatted')).toBeInTheDocument()
  })
  it('should only render Medallia button not changed because invalid date', () => {
    aboveFooderData.changed = -49231543430116
    delete aboveFooderData.lastUpdated
    render(<AboveFooterContent {...aboveFooderData} />)
    expect(screen.getByTestId('feedback-button')).toBeInTheDocument()
    expect(screen.queryByTestId('last-updated-formatted')).toBeNull()
  })
  it('should render with desktop classes when responsiveType is desktop', () => {
    render(<AboveFooterContent {...aboveFooderData} responsiveType="desktop" />)
    expect(screen.getByTestId('above-footer-container')).toHaveClass(
      'medium-screen:vads-u-display--none'
    )
  })
  it('should render with desktop classes when responsive type is mobile', () => {
    render(<AboveFooterContent {...aboveFooderData} responsiveType="mobile" />)
    expect(screen.getByTestId('above-footer-container')).toHaveClass(
      'vads-u-display--none'
    )
    expect(screen.getByTestId('above-footer-container')).not.toHaveClass(
      'medium-screen:vads-u-display--none'
    )
  })
  it('should allow clicking the button to load feedback survey', () => {
    render(<AboveFooterContent {...aboveFooderData} />)
    const button = screen.getByTestId('feedback-button')
    button.click()
    expect(window.KAMPYLE_ONSITE_SDK.showForm).toHaveBeenCalledWith(
      getSurveyNumber('/', false)
    )
    expect(window.KAMPYLE_ONSITE_SDK.showForm).toHaveBeenCalledTimes(1)
    expect(window.KAMPYLE_ONSITE_SDK.loadForm).not.toHaveBeenCalledWith(1)
  })
})
