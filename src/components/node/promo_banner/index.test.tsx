import { render, screen } from '@testing-library/react'
import PromoBanner from '@/components/node/promo_banner'
import mock_promo_banner from './nodePromoBanner.json'

describe('<PromoBanner> component renders', () => {
  test('with valid data', () => {
    render(<PromoBanner node={mock_promo_banner} />)
    expect(
      screen.queryByText(/Help for Afghanistan Veterans and families/)
    ).toBeInTheDocument()
  })
})

describe('<PromoBanner> component does not render', () => {
  test('without node data', () => {
    render(<PromoBanner node={[]} />)
    expect(
      screen.queryByText(/Help for Afghanistan Veterans and families/)
    ).not.toBeInTheDocument()
  })
})
