/**
 * @jest-environment node
 */

import { NodeVamcSystemVaPolice } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/vamcSystemVaPolice.mock.json'

const VamcSystemVaPoliceMock: NodeVamcSystemVaPolice = mockData

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    // TODO
  })
})

describe('VamcSystemVaPolice formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('node--vamc_system_va_police', VamcSystemVaPoliceMock)
    ).toMatchSnapshot()
  })

  test('handles no answers correctly', () => {
    // TODO
  })
})
