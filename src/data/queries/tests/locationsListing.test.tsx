/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import mockData from '@/mocks/locationsListing.mock.json'
import { NodeLocationsListing } from '@/types/drupal/node'
const LocationsListingMock: NodeLocationsListing = mockData[0]

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    // TODO
  })
})

describe('LocationsListing formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('node--locations_listing', LocationsListingMock)
    ).toMatchSnapshot()
  })

  test('handles no answers correctly', () => {
    // TODO
  })
})
