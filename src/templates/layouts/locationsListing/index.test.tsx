import React from 'react'
import { render, screen } from '@testing-library/react'
import { LocationsListing } from './index'

describe('LocationsListing', () => {
  test('renders the given title in an <h1>', () => {
    render(<LocationsListing title="Boston VA Locations" />)

    const heading = screen.getByRole('heading', {
      name: /boston va locations/i,
    })
    expect(heading).toBeInTheDocument()
    expect(heading.tagName).toBe('H1')
  })
})
