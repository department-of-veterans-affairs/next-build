import { render, screen, fireEvent } from '@testing-library/react'
import { ContentFooter } from './'

// Mocked dependencies
jest.mock('@/templates/common/medallia', () => ({
  MedalliaAssets: jest.fn().mockReturnValue(null),
}))
jest.mock('@/lib/utils/medallia', () => ({
  getSurveyNumber: jest.fn((pathname, isProduction) => {
    return isProduction ? 'mockedSurveyNumber' : null
  }),
  showForm: jest.fn(),
}))
jest.mock('@/lib/utils/date', () => ({
  parseDate: jest.fn().mockReturnValue(new Date('2022-03-28')),
  getDateParts: jest.fn().mockReturnValue({
    month: { name: 'March', numeric: 3, twoDigit: '03' },
    day: { numeric: 28, twoDigit: '28' },
    year: { numeric: 2022 },
  }),
}))

describe('ContentFooter Component', () => {
  test('renders last updated date correctly', () => {
    const lastUpdated = '2022-03-28'
    render(<ContentFooter lastUpdated={lastUpdated} />)

    expect(screen.getByText('Last updated:')).toBeInTheDocument()
    expect(screen.getByText('March 28, 2022')).toBeInTheDocument()
    expect(screen.getByText('March 28, 2022')).toHaveAttribute(
      'dateTime',
      '2022-03-28'
    )
  })
})
