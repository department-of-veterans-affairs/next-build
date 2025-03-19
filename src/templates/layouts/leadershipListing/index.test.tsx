import React from 'react'
import { render, screen } from '@testing-library/react'
import { LeadershipListing } from './index'


describe('LeadershipListing with valid data', () => {
  test('renders LeadershipListing component', () => {
    render(<LeadershipListing title={'Hello world'} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})
