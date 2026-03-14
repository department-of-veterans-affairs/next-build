import { render, screen } from '@testing-library/react'
import { ContentFooter } from './template'

// Mocked dependencies
jest.mock('@/components/medallia/template', () => ({
  MedalliaAssets: jest.fn().mockReturnValue(null),
}))
jest.mock('@/lib/utils/medallia', () => ({
  getSurveyNumber: jest.fn((_pathname, isProduction) => {
    return isProduction ? 'mockedSurveyNumber' : null
  }),
  showForm: jest.fn(),
}))

describe('ContentFooter Component', () => {
  test('renders last updated date correctly', () => {
    const lastUpdated = '2022-03-28T17:26:37+00:00'
    render(<ContentFooter lastUpdated={lastUpdated} />)

    expect(screen.getByText('Last updated:')).toBeInTheDocument()
    expect(screen.getByText('March 28, 2022')).toBeInTheDocument()
    expect(screen.getByText('March 28, 2022')).toHaveAttribute(
      'dateTime',
      '2022-03-28'
    )
  })

  test('does not render last updated section when lastUpdated is undefined', () => {
    render(<ContentFooter />)

    expect(screen.queryByText('Last updated:')).not.toBeInTheDocument()
  })

  test('does not render last updated section when lastUpdated is empty string', () => {
    render(<ContentFooter lastUpdated="" />)

    expect(screen.queryByText('Last updated:')).not.toBeInTheDocument()
  })

  test('renders last updated date when lastUpdated is a number (timestamp)', () => {
    const lastUpdated = new Date('2022-03-28T17:26:37+00:00').getTime()
    render(<ContentFooter lastUpdated={lastUpdated} />)

    expect(screen.getByText('Last updated:')).toBeInTheDocument()
    expect(screen.getByText('March 28, 2022')).toBeInTheDocument()
  })

  test('applies desktop display classes when responsiveLayout is desktop', () => {
    render(
      <ContentFooter
        lastUpdated="2022-03-28T17:26:37+00:00"
        responsiveLayout="desktop"
      />
    )

    const footer = screen.getByTestId('content-footer')
    expect(footer).toHaveClass('vads-u-display--none')
    expect(footer).toHaveClass('tablet:vads-u-display--block')
  })

  test('applies mobile display classes when responsiveLayout is mobile', () => {
    render(
      <ContentFooter
        lastUpdated="2022-03-28T17:26:37+00:00"
        responsiveLayout="mobile"
      />
    )

    const footer = screen.getByTestId('content-footer')
    expect(footer).toHaveClass('tablet:vads-u-display--none')
  })

  test('applies no responsive display classes when responsiveLayout is not desktop or mobile', () => {
    render(
      <ContentFooter
        lastUpdated="2022-03-28T17:26:37+00:00"
        responsiveLayout="other"
      />
    )

    const footer = screen.getByTestId('content-footer')
    expect(footer).not.toHaveClass('vads-u-display--none')
    expect(footer).not.toHaveClass('tablet:vads-u-display--block')
    expect(footer).not.toHaveClass('tablet:vads-u-display--none')
  })
})
