/**
 * @jest-environment node
 */

import { NodeVamcHealthServicesListing } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import { formatter, params } from '@/data/queries/vamcHealthServicesListing'
import mockData from '@/mocks/vamcHealthServicesListing.mock.json'

const VamcHealthServicesListingMock: NodeVamcHealthServicesListing = mockData[0]

// Mock menu data for testing
const mockMenu = {
  items: [],
  tree: [],
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
})
