import { render, screen } from '@testing-library/react'
import { EventListing } from './index'


describe('EventListing with valid data', () => {
  test('renders EventListing component', () => {
    render(<EventListing title={'Hello world'} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})
