/**
 * @jest-environment node
 */

import { NodeVamcSystemPoliciesPage } from '@/types/drupal/node'
import { queries } from '@/lib/drupal/queries'
import mockData from './mock.json'

const vamcSystemPoliciesPageMock =
  mockData as unknown as NodeVamcSystemPoliciesPage

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    // TODO
  })
})

describe('VamcSystemPoliciesPage formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData(
        'node--vamc_system_policies_page',
        vamcSystemPoliciesPageMock
      )
    ).toMatchSnapshot()
  })

  test('handles no answers correctly', () => {
    // TODO
  })
})
