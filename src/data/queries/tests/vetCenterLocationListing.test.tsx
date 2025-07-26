/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import mockData from '@/mocks/vetCenterLocationListing.mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    // TODO
  })
})

describe('VetCenterLocationListing formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData(RESOURCE_TYPES.VET_CENTER_LOCATION_LISTING, mockData)
    ).toMatchSnapshot()
  })

  test('handles no answers correctly', () => {
    // TODO
  })
})
