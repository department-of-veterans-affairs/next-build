import { render, screen } from '@testing-library/react'
import drupalMockData from './mock'
import { HealthCareLocalFacility } from './template'
import { HealthCareLocalFacility as FormattedHealthCareLocalFacility } from './formatted-type'
import { formatter } from './query'
import { DrupalMenuLinkContent } from 'next-drupal'
import { within } from '@testing-library/react'
import { axe } from '@/test-utils'

const menuItem: DrupalMenuLinkContent = {
  title: 'Foo',
  type: 'meh',
  url: '/nowhere/in-particular',
  id: 'foo',
  description: 'bar',
  enabled: true,
  expanded: true,
  menu_name: 'baz',
  meta: {},
  options: {},
  parent: null,
  provider: null,
  route: null,
  weight: '0',
}

const mockMenu = {
  items: [menuItem],
  tree: [menuItem],
}

const mockData = formatter({
  entity: drupalMockData,
  menu: mockMenu,
  lovell: { isLovellVariantPage: false, variant: 'va' },
})

describe('HealthCareLocalFacility with valid data', () => {
  test('renders HealthCareLocalFacility component with basic data', async () => {
    const { container } = render(<HealthCareLocalFacility {...mockData} />)
    expect(screen.getByText(mockData.title.trim())).toBeInTheDocument()
    expect(screen.getByText(mockData.introText.trim())).toBeInTheDocument()
    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })

  // Once window.sideNav is populated, the static-pages app will render the menu
  // in the nav[data-widget-type="side-nav"] element, but testing for that
  // render would require side-loading that app bundle, which is outside the
  // scope of this unit test
  test('adds the sideNav to window.sideNav', () => {
    render(<HealthCareLocalFacility {...mockData} />)

    // @ts-expect-error window.sideNav is not a default window property, but
    // we're adding it
    expect(window.sideNav).toEqual(mockData.menu)
  })

  test('renders the address', () => {
    render(<HealthCareLocalFacility {...mockData} />)

    const addressFields: Array<
      keyof FormattedHealthCareLocalFacility['address']
    > = [
      'address_line1',
      'address_line2',
      'locality',
      'administrative_area',
      'postal_code',
    ]
    // Search for the bits of data that exist in the mock data, but only
    // search for them under the <address>
    addressFields
      .map((key) => mockData.address[key])
      .filter((data) => data)
      .forEach((data) =>
        expect(
          screen.getByText(new RegExp(data), { selector: 'address > *' })
        ).toBeInTheDocument()
      )
  })

  test('renders the phone numbers', () => {
    const { container } = render(<HealthCareLocalFacility {...mockData} />)

    expect(
      container.querySelector(
        `va-telephone[contact="${mockData.mainPhoneString.replace(/-/g, '')}"]`
      )
    ).toBeInTheDocument()
    expect(
      container.querySelector(
        `va-telephone[contact="${mockData.vaHealthConnectPhoneNumber.replace(/-/g, '')}"]`
      )
    ).toBeInTheDocument()
    expect(
      container.querySelector(
        `va-telephone[contact="${mockData.mentalHealthPhoneNumber?.number?.replace(/-/g, '')}"]`
      )
    ).toBeInTheDocument()
  })

  test('renders the hours', () => {
    render(<HealthCareLocalFacility {...mockData} />)

    const facilityHoursSection = screen.getByTestId('facility-hours')

    expect(
      within(facilityHoursSection).getByRole('heading', {
        name: 'Facility hours',
      })
    ).toBeInTheDocument()
    expect(
      within(facilityHoursSection).getAllByText(/7:30 a.m. to 4:00 p.m./)
    ).toHaveLength(5)
    expect(within(facilityHoursSection).getAllByText(/Closed/)).toHaveLength(2)
  })

  test('renders the related links', () => {
    const { container } = render(<HealthCareLocalFacility {...mockData} />)

    expect(
      screen.getByRole('heading', {
        name: 'Other services at VA Boston health care',
      })
    ).toBeInTheDocument()
    expect(container.querySelectorAll('ul > li > p > va-link')).toHaveLength(8)
  })

  test('renders the location services', () => {
    const { container } = render(<HealthCareLocalFacility {...mockData} />)
    expect(screen.getByText(/Prepare for your visit/i)).toBeInTheDocument()
    expect(
      container.querySelector(
        'va-accordion[section-heading="Prepare for your visit"]'
      )
    ).toBeInTheDocument()
    // The contents of this section are tested in LocationServices's tests
  })

  test('does not render location services if empty', () => {
    const { container } = render(
      <HealthCareLocalFacility {...mockData} locationServices={[]} />
    )
    expect(
      screen.queryByText(/Prepare for your visit/i)
    ).not.toBeInTheDocument()
    expect(
      container.querySelector(
        'va-accordion[section-heading="Prepare for your visit"]'
      )
    ).not.toBeInTheDocument()
  })

  test('renders LovellSwitcher when lovellVariant and lovellSwitchPath are provided', () => {
    // lovellVariant is set to 'va' in the mock data already
    render(
      <HealthCareLocalFacility
        {...mockData}
        lovellSwitchPath="/the/other/path"
      />
    )
    expect(
      screen.getByRole('heading', {
        name: 'You are viewing this page as a VA beneficiary.',
      })
    ).toBeInTheDocument()
  })

  test('does not render LovellSwitcher when lovellVariant is undefined', () => {
    const dataWithoutLovell = { ...mockData, lovellVariant: undefined }
    render(<HealthCareLocalFacility {...dataWithoutLovell} />)
    expect(
      screen.queryByText('Switch to Lovell Federal health care')
    ).not.toBeInTheDocument()
  })

  test('generates the schema.org JSON-LD script with correct data', () => {
    const { container } = render(<HealthCareLocalFacility {...mockData} />)

    // Find the JSON-LD script
    const jsonLdScript = container.querySelector(
      'script[type="application/ld+json"]'
    )
    expect(jsonLdScript).toBeInTheDocument()

    // Parse the JSON to verify content
    const jsonData = JSON.parse(jsonLdScript?.innerHTML || '{}')

    // Test essential properties
    expect(jsonData['@context']).toBe('https://schema.org')
    expect(jsonData['@type']).toBe('Place')
    expect(jsonData.name).toBe(mockData.title)
    expect(jsonData.telephone).toBe(mockData.mainPhoneString)

    // Test address
    expect(jsonData.address['@type']).toBe('PostalAddress')
    expect(jsonData.address.streetAddress).toContain(
      mockData.address.address_line1
    )
    expect(jsonData.address.addressLocality).toBe(mockData.address.locality)
    expect(jsonData.address.addressRegion).toBe(
      mockData.address.administrative_area
    )
    expect(jsonData.address.postalCode).toBe(mockData.address.postal_code)

    // Test geo coordinates
    expect(jsonData.geo['@type']).toBe('GeoCoordinates')
    expect(jsonData.geo.latitude).toBe(mockData.geoLocation?.lat)
    expect(jsonData.geo.longitude).toBe(mockData.geoLocation?.lon)

    // Test facility ID
    expect(jsonData.branchCode).toBe(mockData.facilityLocatorApiId)

    // Test opening hours
    expect(Array.isArray(jsonData.openingHoursSpecification)).toBe(true)
    expect(jsonData.openingHoursSpecification.length).toBe(
      mockData.officeHours.length
    )

    // Test first opening hours entry
    const firstHours = jsonData.openingHoursSpecification[0]
    expect(firstHours['@type']).toBe('OpeningHoursSpecification')
    expect(firstHours.dayOfWeek).toContain('https://schema.org/')
  })

  test('renders FacilityTopTasks component', () => {
    render(<HealthCareLocalFacility {...mockData} />)
    expect(screen.getByTestId('facility-top-tasks')).toBeInTheDocument()
  })

  test('renders HealthServices when healthServices are provided', () => {
    render(<HealthCareLocalFacility {...mockData} />)
    expect(
      screen.getByRole('heading', {
        name: 'Health services offered here',
        level: 2,
      })
    ).toBeInTheDocument()
  })

  test('does not render HealthServices when healthServices are empty', () => {
    const dataWithoutServices = { ...mockData, healthServices: [] }
    render(<HealthCareLocalFacility {...dataWithoutServices} />)
    expect(
      screen.queryByText('Health services offered at this facility')
    ).not.toBeInTheDocument()
  })

  test('renders patient satisfaction widget for VHA facilities', () => {
    render(<HealthCareLocalFacility {...mockData} />)
    expect(
      screen.getByTestId('patient-satisfaction-widget')
    ).toBeInTheDocument()
  })

  test('does not render patient satisfaction widget for non-VHA facilities', () => {
    const nonVhaData = { ...mockData, facilityLocatorApiId: 'vc_123' }
    render(<HealthCareLocalFacility {...nonVhaData} />)
    expect(
      screen.queryByTestId('patient-satisfaction-widget')
    ).not.toBeInTheDocument()
  })

  test('renders FacilitySocialLinks when socialLinks are provided', () => {
    render(<HealthCareLocalFacility {...mockData} />)
    expect(
      screen.getByRole('heading', {
        name: 'Get updates from VA Boston health care',
        level: 2,
      })
    ).toBeInTheDocument()
  })

  test('renders ContentFooter with lastUpdated date', () => {
    render(<HealthCareLocalFacility {...mockData} />)
    expect(screen.getByTestId('content-footer')).toBeInTheDocument()
  })

  test('renders va-back-to-top component', () => {
    const { container } = render(<HealthCareLocalFacility {...mockData} />)
    expect(container.querySelector('va-back-to-top')).toBeInTheDocument()
  })
})
