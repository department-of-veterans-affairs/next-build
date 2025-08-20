/**
 * @jest-environment node
 */

import { NodeVamcHealthServicesListing } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/products/vamcHealthServicesListing/mock.json'

const VamcHealthServicesListingMock: NodeVamcHealthServicesListing = mockData[0]

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    // TODO
  })
})

describe('VamcHealthServicesListing formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData(
        'node--health_services_listing',
        VamcHealthServicesListingMock
      )
    ).toMatchSnapshot()
  })

  test('handles empty description correctly', () => {
    const mockWithEmptyDescription = {
      ...VamcHealthServicesListingMock,
      field_description: '',
      field_intro_text: '',
    }

    const result = queries.formatData(
      'node--health_services_listing',
      mockWithEmptyDescription
    )

    expect(result.introText).toBe('')
  })
})
