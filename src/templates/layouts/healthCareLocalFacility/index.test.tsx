import { render, screen } from '@testing-library/react'
import drupalMockData from '@/mocks/healthCareLocalFacility.mock'
import { HealthCareLocalFacility } from './index'
import { HealthCareLocalFacility as FormattedHealthCareLocalFacility } from '@/types/formatted/healthCareLocalFacility'
import { formatter } from '@/data/queries/healthCareLocalFacility'
import { DrupalMenuLinkContent } from 'next-drupal'
import { within } from '@testing-library/react'

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
  test('renders HealthCareLocalFacility component with basic data', () => {
    render(<HealthCareLocalFacility {...mockData} />)
    expect(screen.getByText(mockData.title.trim())).toBeInTheDocument()
    expect(screen.getByText(mockData.introText.trim())).toBeInTheDocument()
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
        `va-telephone[contact="${mockData.phoneNumber.replace(/-/g, '')}"]`
      )
    ).toBeInTheDocument()
    expect(
      container.querySelector(
        `va-telephone[contact="${mockData.vaHealthConnectPhoneNumber.replace(/-/g, '')}"]`
      )
    ).toBeInTheDocument()
    expect(
      container.querySelector(
        `va-telephone[contact="${mockData.fieldTelephone?.field_phone_number?.replace(/-/g, '')}"]`
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

  test('renders structured schema data script', () => {
    const { container } = render(<HealthCareLocalFacility {...mockData} />)
    const scriptElement = container.querySelector(
      'script[type="application/ld+json"]'
    )
    expect(scriptElement).toBeInTheDocument()
    expect(scriptElement?.textContent).toContain('schema.org')
    expect(scriptElement?.textContent).toContain(mockData.title)
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
      screen.getByText('Connect with VA Boston health care')
    ).toBeInTheDocument()
  })

  test('renders ContentFooter with lastUpdated date', () => {
    render(<HealthCareLocalFacility {...mockData} />)
    expect(
      screen.getByText(new RegExp(`Last updated:.*${mockData.lastUpdated}`))
    ).toBeInTheDocument()
  })

  test('renders va-back-to-top component', () => {
    const { container } = render(<HealthCareLocalFacility {...mockData} />)
    expect(container.querySelector('va-back-to-top')).toBeInTheDocument()
  })
})
