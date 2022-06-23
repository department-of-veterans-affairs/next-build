import { render, screen } from '@testing-library/react'
import Banner from '@/components/node/banner'
import mock_banner from './nodeBanner.json'

describe('<Banner> component renders', () => {
  test('with valid data', () => {
    render(<Banner node={mock_banner} />)
    expect(screen.queryByText(/COVID-19 vaccines at VA/)).toBeInTheDocument()
    expect(screen.queryByText(/This is the body/)).toBeInTheDocument()
  })
})

describe('<Banner> component does not render', () => {
  test('without node data', () => {
    render(<Banner node={[]} />)
    expect(
      screen.queryByText(/COVID-19 vaccines at VA/)
    ).not.toBeInTheDocument()
  })
})
