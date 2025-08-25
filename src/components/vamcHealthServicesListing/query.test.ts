/**
 * @jest-environment node
 */

import { NodeVamcHealthServicesListing } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/components/vamcHealthServicesListing/mock.json'

const VamcHealthServicesListingMock: NodeVamcHealthServicesListing = mockData[0]

const mockDataWrapper = {
  entity: VamcHealthServicesListingMock,
  lovell: undefined,
}

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    // TODO
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
      lovell: undefined,
    }

    const result = queries.formatData(
      'node--health_services_listing',
      mockDataWrapperWithEmptyDescription
    )

    expect(result.introText).toBe('')
  })
})
