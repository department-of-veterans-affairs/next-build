/**
 * @jest-environment node
 */

import { VamcSystemPoliciesPage } from '@/types/drupal/node'
import { queries } from '@/lib/drupal/queries'
import mockData from './mock.json'

const VamcSystemPoliciesPageMock: VamcSystemPoliciesPage = mockData

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    // TODO
  })
})

describe('VamcSystemPoliciesPage formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('node--vamc_system_policies_page', VamcSystemPoliciesPageMock)
    ).toMatchSnapshot()
  })

  test('handles no answers correctly', () => {
    // TODO
  })
})
