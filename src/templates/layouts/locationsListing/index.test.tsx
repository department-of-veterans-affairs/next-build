import React from 'react'
import { render, screen } from '@testing-library/react'
import { LocationsListing } from './index'
import { LOVELL } from '@/lib/drupal/lovell/constants'
import { MinimalLocalFacility } from '@/types/formatted/locationsListing'

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
  mainFacilities: [],
  healthClinicFacilities: [],
  mobileFacilities: [],
}

const mockMainFacilities: MinimalLocalFacility[] = [
  {
    title: 'Lovell Federal health care',
    path: '/lovell-federal-health-care',
    operatingStatusFacility: 'normal',
    address: {
      langcode: 'en',
      country_code: 'US',
      administrative_area: 'IL',
      locality: 'North Chicago',
      postal_code: '60064',
      address_line1: '3001 Green Bay Frontage Rd',
    },
    phoneNumber: '224-610-3747',
    vaHealthConnectPhoneNumber: '877-698-7422',
    fieldTelephone: null,
    image: null,
  },
]

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

  describe('Main Facilities', () => {
    test('renders main facilities section with facilities', () => {
      render(
        <LocationsListing
          {...mockBaseProps}
          title="VA Locations"
          path="/va-locations"
          mainFacilities={mockMainFacilities}
        />
      )
      expect(
        screen.getByRole('heading', { name: /Main locations/i })
      ).toBeInTheDocument()
      expect(screen.getByText(/3001 Green Bay Frontage Rd/)).toBeInTheDocument()
    })

    test('does not render main facilities section without facilities', () => {
      render(
        <LocationsListing
          {...mockBaseProps}
          title="VA Locations"
          path="/va-locations"
          mainFacilities={[]}
        />
      )
      expect(
        screen.queryByRole('heading', { name: /Main locations/i })
      ).not.toBeInTheDocument()
    })
  })

  describe('Health Clinic Facilities', () => {
    test('renders health clinic facilities section with facilities', () => {
      render(
        <LocationsListing
          {...mockBaseProps}
          title="VA Locations"
          path="/va-locations"
          healthClinicFacilities={mockMainFacilities}
        />
      )
      expect(
        screen.getByRole('heading', { name: /Health clinic locations/i })
      ).toBeInTheDocument()
      expect(screen.getByText(/3001 Green Bay Frontage Rd/)).toBeInTheDocument()
    })

    test('does not render health clinic facilities section without facilities', () => {
      render(
        <LocationsListing
          {...mockBaseProps}
          title="VA Locations"
          path="/va-locations"
          healthClinicFacilities={[]}
        />
      )
      expect(
        screen.queryByRole('heading', { name: /Health clinic locations/i })
      ).not.toBeInTheDocument()
    })
  })

  describe('Mobile Facilities', () => {
    test('renders mobile facilities section with facilities', () => {
      render(
        <LocationsListing
          {...mockBaseProps}
          title="VA Locations"
          path="/va-locations"
          mobileFacilities={mockMainFacilities}
        />
      )
      expect(
        screen.getByRole('heading', { name: /Mobile clinics/i })
      ).toBeInTheDocument()
    })

    test('does not render mobile facilities section without facilities', () => {
      render(
        <LocationsListing
          {...mockBaseProps}
          title="VA Locations"
          path="/va-locations"
          mobileFacilities={[]}
        />
      )
      expect(
        screen.queryByRole('heading', { name: /Mobile clinics/i })
      ).not.toBeInTheDocument()
    })
  })
})
