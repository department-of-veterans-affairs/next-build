/**
 * @jest-environment node
 */

import { NodeVamcSystemVaPolice } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/vamcSystemVaPolice.mock.json'

// For some reason the Field Media query seems to be not pulling in the __drupal... fields so
// the FieldOffice field is complaining -- this is a deep issue that needs to be resolved
// about using the Drupal types
// @ts-expect-error -- the mock suffers from something as stated above
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
})
