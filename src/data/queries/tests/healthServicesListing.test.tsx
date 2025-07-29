/**
 * @jest-environment node
 */

import { NodeHealthServicesListing } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/healthServicesListing.mock.json'

const HealthServicesListingMock: NodeHealthServicesListing = mockData[0]

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    // TODO
  })
})

describe('HealthServicesListing formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData(
        'node--health_services_listing',
        HealthServicesListingMock
      )
    ).toMatchSnapshot()
  })

  test('handles empty description correctly', () => {
    const mockWithEmptyDescription = {
      ...HealthServicesListingMock,
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
