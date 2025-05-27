/**
 * @jest-environment node
 */
import { NodeLeadershipListing } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/leadershipListing.mock.json'

// const LeadershipListingMock: NodeLeadershipListing = mockData

// remove if this component does not have a data fetch
describe.skip('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    // TODO
  })
})

describe.skip('LeadershipListing formatData', () => {
  test('outputs formatted data', () => {
    // expect(
    //   queries.formatData('node--leadership_listing', LeadershipListingMock)
    // ).toMatchSnapshot()
  })

  test('handles no answers correctly', () => {
    // TODO
  })
})
