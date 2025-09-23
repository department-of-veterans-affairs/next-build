/**
 * @jest-environment node
 */

import { NodeVamcHealthServicesListing, NodeHealthCareRegionPage } from '@/types/drupal/node'
import { formatter, params } from './query'
import { queries } from '@/lib/drupal/queries'
import mockServicesListingPartial from './mock.json'
import mockSystem from '@/components/vamcSystem/mock.json'
import { DrupalMenuLinkContent } from 'next-drupal'
import { createMockServiceDes, createMockServicesForGrouping } from './mockServiceDes'

// Use type assertion to bypass strict type checking for test data
const mockServicesListing: NodeVamcHealthServicesListing = {
  ...mockServicesListingPartial,
  field_office: {
    ...(mockSystem as unknown as NodeHealthCareRegionPage),
    field_system_menu: {},
    field_clinical_health_services: createMockServicesForGrouping(),
  },
}

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
  entity: mockServicesListing,
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
      ...mockServicesListing,
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
      entity: mockServicesListing,
      menu: mockMenu,
    })
    expect(result.path).toBeDefined()
    expect(result.administration).toBeDefined()
    expect(result.vamcEhrSystem).toBeDefined()
  })

  test('correctly formats menu data', () => {
    const result = formatter({
      entity: mockServicesListing,
      menu: mockMenu,
    })
    expect(result.menu).toBeDefined()
    expect(result.menu).toHaveProperty('rootPath')
    expect(result.menu).toHaveProperty('data')
  })

  test('handles null menu gracefully', () => {
    const result = formatter({
      entity: mockServicesListing,
      menu: null,
    })

    expect(result.menu).toBeNull()
  })

  test('groups health services by type of care', () => {
    const result = formatter({
      entity: mockServicesListing,
      menu: mockMenu,
    })

    expect(result.healthServiceGroups).toBeDefined()
    expect(result.healthServiceGroups).toHaveLength(5) // 5 different types of care

    // Check that services are grouped correctly
    const primaryCareGroup = result.healthServiceGroups.find(group => group.typeOfCare === 'Primary care')
    expect(primaryCareGroup).toBeDefined()
    expect(primaryCareGroup?.services).toHaveLength(1)
    expect(primaryCareGroup?.services[0].title).toBe('Primary Care Service')

    const mentalHealthGroup = result.healthServiceGroups.find(group => group.typeOfCare === 'Mental health care')
    expect(mentalHealthGroup).toBeDefined()
    expect(mentalHealthGroup?.services).toHaveLength(1)
    expect(mentalHealthGroup?.services[0].title).toBe('Mental Health Service')
  })

  test('handles custom service types', () => {
    const customService = createMockServiceDes({
      id: 'custom-1',
      title: 'Custom Service',
      typeOfCare: 'Custom care type',
      description: 'Custom service description'
    })

    const customServicesListing = {
      ...mockServicesListing,
      field_office: {
        ...mockServicesListing.field_office!,
        field_clinical_health_services: [customService],
      },
    } as unknown as NodeVamcHealthServicesListing

    const result = formatter({
      entity: customServicesListing,
      menu: mockMenu,
    })

    expect(result.healthServiceGroups).toHaveLength(1)
    expect(result.healthServiceGroups[0].typeOfCare).toBe('Custom care type')
    expect(result.healthServiceGroups[0].services[0].title).toBe('Custom Service')
  })
})
