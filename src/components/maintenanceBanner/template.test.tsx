import { render, screen } from '@testing-library/react'
import { MaintenanceBanner } from './template'

describe('<MaintenanceBanner> component renders', () => {
  test('with valid data', () => {
    render(<MaintenanceBanner />)

    const bannerElement = screen.getByTestId('maintenance-banner', {
      name: /Maintenance banner/i,
    })

    expect(bannerElement).toBeInTheDocument()
    expect(bannerElement).toHaveAttribute(
      'data-widget-type',
      'maintenance-banner'
    )
  })
})
