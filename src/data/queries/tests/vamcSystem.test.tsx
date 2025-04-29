/**
 * @jest-environment node
 */

import { VamcSystem } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/vamcSystem.mock.json'

const VamcSystemMock: VamcSystem = mockData

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    // TODO
  })
})

describe('VamcSystem formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('node--vamc_system', VamcSystemMock)
    ).toMatchSnapshot()
  })

  test('handles no answers correctly', () => {
    // TODO
  })
})
