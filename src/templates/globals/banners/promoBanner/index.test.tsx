import { render, screen } from '@testing-library/react'
import { PromoBanner } from '@/templates/globals/banners/promoBanner'
import mock_promo_banner from './nodePromoBanner.json'

describe('<PromoBanner> component renders', () => {
  test('with valid data', () => {
    render(<PromoBanner {...mock_promo_banner} />)
    expect(
      screen.queryByText(/Help for Afghanistan Veterans and families/)
    ).toBeInTheDocument()
    expect(screen.getByRole('va-promoBanner')).toHaveAttribute(
      'href',
      'https://blogs.va.gov/VAntage/help-for-afghanistan-veterans-families/'
    )
  })
})

describe('<PromoBanner> component does not render', () => {
  test('without node data', () => {
    render(<PromoBanner {...mock_promo_banner} />)
    expect(
      screen.queryByText(/Help for Afghanistan Veterans and families/)
    ).not.toBeInTheDocument()
  })
})
