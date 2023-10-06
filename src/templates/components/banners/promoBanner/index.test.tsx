import { render, screen } from '@testing-library/react'
import { PromoBanner } from '@/templates/components/banners/promoBanner'

let mockPromoBanner = {
  id: 'ccd9d30f-78f9-4358-80d7-191f99b18d43',
  title: 'Help for Afghanistan Veterans and families',
  href: 'https://blogs.va.gov/VAntage/help-for-afghanistan-veterans-families/',
  alertType: 'information',
  dismiss: true,
}

describe('<PromoBanner> component renders', () => {
  test('with valid data', () => {
    render(<PromoBanner {...mockPromoBanner} />)
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
    mockPromoBanner = null
    render(<PromoBanner {...mockPromoBanner} />)
    expect(
      screen.queryByText(/Help for Afghanistan Veterans and families/)
    ).not.toBeInTheDocument()
  })
})
