/**
 * @jest-environment node
 */

import { NodeVamcHealthServicesListing } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import { formatter, params } from '@/data/queries/vamcHealthServicesListing'
import mockData from '@/mocks/vamcHealthServicesListing.mock.json'
import { DrupalMenuLinkContent } from 'next-drupal'

// Use type assertion to bypass strict type checking for test data
const VamcHealthServicesListingMock =
  mockData[0] as NodeVamcHealthServicesListing

// Mock menu data for testing - providing realistic structure
const menuItem: DrupalMenuLinkContent = {
  title: 'Test Menu Item',
  type: 'menu_link_content',
  url: '/test-facility/test-service',
  id: 'test-menu-item',
  description: 'Test description',
  enabled: true,
  expanded: false,
  menu_name: 'test-menu',
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

const mockDataWrapper = {
  entity: VamcHealthServicesListingMock,
  menu: mockMenu,
  lovell: undefined,
}

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(/include=field_administration,field_office/)
    expect(queryString).toMatch(
      /fields\[node--health_care_region_page\]=field_vamc_ehr_system,field_system_menu/
    )
    expect(queryString).toMatchSnapshot()
  })
})

describe('VamcHealthServicesListing formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('node--health_services_listing', mockDataWrapper)
    ).toMatchSnapshot()
  })

  test('handles empty description correctly', () => {
    const mockWithEmptyDescription = {
      ...VamcHealthServicesListingMock,
      field_description: '',
      field_intro_text: '',
    }

    const mockDataWrapperWithEmptyDescription = {
      entity: mockWithEmptyDescription,
      menu: mockMenu,
      lovell: undefined,
    }

    const result = queries.formatData(
      'node--health_services_listing',
      mockDataWrapperWithEmptyDescription
    )

    expect(result.introText).toBe('')
  })

  test('includes path, administration, and vamcEhrSystem fields', () => {
    const result = formatter({
      entity: VamcHealthServicesListingMock,
      menu: mockMenu,
    })
    expect(result.path).toBeDefined()
    expect(result.administration).toBeDefined()
    expect(result.vamcEhrSystem).toBeDefined()
  })

  test('correctly formats menu data', () => {
    const result = formatter({
      entity: VamcHealthServicesListingMock,
      menu: mockMenu,
    })
    expect(result.menu).toBeDefined()
    expect(result.menu).toHaveProperty('rootPath')
    expect(result.menu).toHaveProperty('data')
  })

  test('handles null menu gracefully', () => {
    const result = formatter({
      entity: VamcHealthServicesListingMock,
      menu: null,
    })

    expect(result.menu).toBeNull()
  })
})
