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
})
