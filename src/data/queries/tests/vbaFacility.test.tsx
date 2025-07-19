/**
 * @jest-environment node
 */

import { NodeVbaFacility } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/vbaFacility.mock.json'

const VbaFacilityMock: NodeVbaFacility = mockData

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    // TODO
  })
})

describe('VbaFacility formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('node--vba_facility', VbaFacilityMock)
    ).toMatchSnapshot()
  })

  test('handles no answers correctly', () => {
    // TODO
  })
})
