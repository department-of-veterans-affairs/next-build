import { render, screen } from 'test-utils'
import { Banner } from '@/components/banner'
import mock_banner from './nodeBanner.json'

describe('<Banner> component renders', () => {
  test('with valid data', () => {
    render(<Banner {...mock_banner} />)
    expect(screen.queryByText(/This is the banner body/)).toBeInTheDocument()
    expect(screen.getByRole('va-banner')).toHaveAttribute(
      'headline',
      'COVID-19 vaccines at VA'
    )
  })
})

describe('<Banner> component does not render', () => {
  test('without node data', () => {
    render(<Banner />)
    expect(
      screen.queryByText(/This is the banner body/)
    ).not.toBeInTheDocument()
  })
})
