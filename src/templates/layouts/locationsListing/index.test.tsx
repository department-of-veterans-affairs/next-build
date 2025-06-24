import React from 'react'
import { render, screen } from '@testing-library/react'
import { LocationsListing } from './index'
import { LOVELL } from '@/lib/drupal/lovell/constants'

// Mock menu data for testing
const mockMenu = {
  rootPath: '/boston-health-care/',
  data: {
    name: 'Boston VA',
    description: '',
    links: [],
  },
}

const mockBaseProps = {
  id: 'test-id',
  type: 'node--locations_listing',
  published: true,
  lastUpdated: '2024-01-01',
  menu: mockMenu,
  administration: LOVELL.va.administration,
  vamcEhrSystem: 'vista' as const,
}

describe('LocationsListing', () => {
  test('renders the given title in an <h1>', () => {
    render(
      <LocationsListing
        {...mockBaseProps}
        title="Boston VA Locations"
        path="/boston-health-care/locations"
      />
    )
    const heading = screen.getByRole('heading', {
      name: /boston va locations/i,
    })
    expect(heading).toBeInTheDocument()
    expect(heading.tagName).toBe('H1')
  })

  test('renders the sidebar nav with correct attributes', () => {
    render(
      <LocationsListing
        {...mockBaseProps}
        title="Boston VA Locations"
        path="/boston-health-care/locations"
      />
    )
    const nav = screen.getByLabelText('secondary')
    expect(nav).toBeInTheDocument()
    expect(nav).toHaveAttribute('data-widget-type', 'side-nav')
  })

  test('renders RegionalTopTasks for TRICARE location with Cerner', () => {
    render(
      <LocationsListing
        {...mockBaseProps}
        title="Lovell TRICARE Locations"
        path="/lovell-federal-health-care-tricare/locations"
        vamcEhrSystem="cerner"
        administration={LOVELL.tricare.administration}
      />
    )
    const mhsLink = screen.getByText(
      (_: string, el: Element | null) =>
        el?.getAttribute('text') === 'MHS Genesis Patient Portal'
    )
    expect(mhsLink).toBeInTheDocument()
    expect(mhsLink).toHaveAttribute('href', 'https://my.mhsgenesis.health.mil/')
  })
  test('renders RegionalTopTasks for non-TRICARE location', () => {
    render(
      <LocationsListing
        {...mockBaseProps}
        title="VA Locations"
        path="/va-locations"
      />
    )
    const appointmentLink = screen.getByText(
      (_: string, el: Element | null) =>
        el?.getAttribute('text') === 'Make an appointment'
    )
    expect(appointmentLink).toBeInTheDocument()
    expect(appointmentLink).toHaveAttribute(
      'href',
      '/va-locations/make-an-appointment'
    )
  })
})
