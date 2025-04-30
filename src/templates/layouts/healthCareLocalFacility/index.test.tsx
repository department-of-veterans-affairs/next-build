import { render, screen } from '@testing-library/react'
import drupalMockData from '@/mocks/healthCareLocalFacility.mock.json'
import { HealthCareLocalFacility } from './index'
import { HealthCareLocalFacility as FormattedHealthCareLocalFacility } from '@/types/formatted/healthCareLocalFacility'
import { formatter } from '@/data/queries/healthCareLocalFacility'
import { DrupalMenuLinkContent } from 'next-drupal'

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
  // @ts-expect-error drupalMockData technically has numbers instead of strings
  // for some of the IDs, but this is a known problem. See
  // https://github.com/chapter-three/next-drupal/issues/686#issuecomment-2083175598
  entity: drupalMockData,
  menu: mockMenu,
  lovell: { isLovellVariantPage: false, variant: 'va' },
})

describe('HealthCareLocalFacility with valid data', () => {
  test('renders HealthCareLocalFacility component with basic data', () => {
    render(<HealthCareLocalFacility {...mockData} />)

    const basicDataFields: Array<keyof FormattedHealthCareLocalFacility> = [
      'title',
      'introText',
    ]
    basicDataFields.forEach((key) =>
      expect(screen.getByText(mockData[key])).toBeInTheDocument()
    )
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
      container.querySelector(`va-telephone[contact="${mockData.phoneNumber}"]`)
    ).toBeInTheDocument()
    expect(
      container.querySelector(
        `va-telephone[contact="${mockData.vaHealthConnectPhoneNumber}"]`
      )
    ).toBeInTheDocument()
    expect(
      container.querySelector(
        `va-telephone[contact="${mockData.fieldTelephone?.field_phone_number}"]`
      )
    ).toBeInTheDocument()
  })

  test('renders the hours', () => {
    render(<HealthCareLocalFacility {...mockData} />)

    expect(
      screen.getByRole('heading', { name: 'Facility hours' })
    ).toBeInTheDocument()
    expect(screen.getAllByText(/7:30 a.m. to 4:00 p.m./)).toHaveLength(5)
    expect(screen.getAllByText(/Closed/)).toHaveLength(2)
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
})
