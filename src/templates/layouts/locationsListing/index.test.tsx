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
  otherVaLocationIds: [],
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
    mainPhoneString: '224-610-3747',
    vaHealthConnectPhoneNumber: '877-698-7422',
    mentalHealthPhoneNumber: null,
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

  test('renders the ContentFooter component with the Feedback button by id', () => {
    render(
      <LocationsListing
        {...mockBaseProps}
        title="VA Locations"
        path="/va-locations"
      />
    )
    const footerTestId = screen.getByTestId('content-footer')
    expect(footerTestId).toBeInTheDocument()
  })

  describe('LovellSwitcher', () => {
    test('renders LovellSwitcher when Lovell variant is provided', () => {
      render(
        <LocationsListing
          {...mockBaseProps}
          title="Lovell VA Locations"
          path="/lovell-federal-health-care-va/locations"
          lovellVariant="va"
          lovellSwitchPath="/lovell-federal-health-care-tricare/locations"
        />
      )
      const alert = screen.getByText(
        /you are viewing this page as a va beneficiary/i
      )
      expect(alert).toBeInTheDocument()
    })

    test('does not render LovellSwitcher when Lovell variant is not provided', () => {
      render(
        <LocationsListing
          {...mockBaseProps}
          title="Regular VA Locations"
          path="/va-locations"
        />
      )
      expect(
        screen.queryByText(/you are viewing this page as a/i)
      ).not.toBeInTheDocument()
    })

    test('renders correct switch text for VA variant', () => {
      render(
        <LocationsListing
          {...mockBaseProps}
          title="Lovell VA Locations"
          path="/lovell-federal-health-care-va/locations"
          lovellVariant="va"
          lovellSwitchPath="/lovell-federal-health-care-tricare/locations"
        />
      )
      expect(
        screen.getByText(/you are viewing this page as a va beneficiary/i)
      ).toBeInTheDocument()
    })

    test('renders correct switch text for TRICARE variant', () => {
      render(
        <LocationsListing
          {...mockBaseProps}
          title="Lovell TRICARE Locations"
          path="/lovell-federal-health-care-tricare/locations"
          lovellVariant="tricare"
          lovellSwitchPath="/lovell-federal-health-care-va/locations"
        />
      )
      expect(
        screen.getByText(/you are viewing this page as a tricare beneficiary/i)
      ).toBeInTheDocument()
    })
  })

  test('renders other nearby VA locations section when otherVaLocationIds has values', () => {
    render(
      <LocationsListing
        {...mockBaseProps}
        title="VA Locations"
        path="/va-locations"
        otherVaLocationIds={['123', '456']}
      />
    )
    expect(
      screen.getByRole('heading', { name: /Other nearby VA locations/i })
    ).toBeInTheDocument()
  })

  test('does not render other nearby VA locations section when otherVaLocationIds is empty', () => {
    render(
      <LocationsListing
        {...mockBaseProps}
        title="VA Locations"
        path="/va-locations"
        otherVaLocationIds={[]}
      />
    )
    expect(
      screen.queryByRole('heading', { name: /Other nearby VA locations/i })
    ).not.toBeInTheDocument()
  })
})
