import { render, screen } from 'test-utils'
import Banner from '@/components/node/banner'
import mock_banner from './nodeBanner.json'

describe('<Banner> component renders', () => {
  test('with valid data', () => {
    render(<Banner node={mock_banner} />)
    expect(screen.queryByText(/This is the body/)).toBeInTheDocument()
    expect(screen.getByRole('va-banner')).toHaveAttribute(
      'headline',
      'COVID-19 vaccines at VA'
    )
  })
})

describe('<Banner> component does not render', () => {
  test('without node data', () => {
    render(<Banner node={[]} />)
    expect(screen.queryByText(/This is the body/)).not.toBeInTheDocument()
  })
})
