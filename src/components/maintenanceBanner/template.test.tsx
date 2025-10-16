import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import { MaintenanceBanner } from './template'

describe('<MaintenanceBanner> component renders', () => {
  test('with valid data', async () => {
    const { container } = render(<MaintenanceBanner />)

    const bannerElement = screen.getByTestId('maintenance-banner', {
      name: /Maintenance banner/i,
    })

    expect(bannerElement).toBeInTheDocument()
    expect(bannerElement).toHaveAttribute(
      'data-widget-type',
      'maintenance-banner'
    )

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })
})
