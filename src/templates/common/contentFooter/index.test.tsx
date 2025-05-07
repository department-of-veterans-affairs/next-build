import { render, screen } from '@testing-library/react'
import { ContentFooter } from './'

// Mocked dependencies
jest.mock('@/templates/common/medallia', () => ({
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
})
