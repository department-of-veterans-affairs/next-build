import React from 'react'
import { render, screen } from '@testing-library/react'
import { LocationsListing } from './index'

// Mock menu data for testing
const mockMenu = {
  rootPath: '/boston-health-care/',
  data: {
    name: 'Boston VA',
    description: '',
    links: [],
  },
}

describe('LocationsListing', () => {
  test('renders the given title in an <h1>', () => {
    render(<LocationsListing title="Boston VA Locations" />)

    const heading = screen.getByRole('heading', {
      name: /boston va locations/i,
    })
    expect(heading).toBeInTheDocument()
    expect(heading.tagName).toBe('H1')
  })

  test('renders the sidebar nav with correct attributes', () => {
    render(<LocationsListing title="Boston VA Locations" menu={mockMenu} />)
    const nav = screen.getByLabelText('secondary')
    expect(nav).toBeInTheDocument()
    expect(nav).toHaveAttribute('data-widget-type', 'side-nav')
  })
})
