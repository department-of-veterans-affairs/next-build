import { render, screen } from '@testing-library/react'
import { PressReleaseTeaser } from './index'


describe('PressReleaseTeaser with valid data', () => {
  test('renders PressReleaseTeaser component', () => {
    render(<PressReleaseTeaser title={'Hello world'} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})
