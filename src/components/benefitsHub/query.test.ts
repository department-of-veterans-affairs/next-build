/**
 * @jest-environment node
 */

import { NodeBenefitsHub } from '@/types/drupal/node'
import { queries } from '@/lib/drupal/queries'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import mockData from './mock.json'

const BenefitsHubMock: NodeBenefitsHub = mockData

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    // TODO
  })
})

describe('BenefitHubLanding formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData(RESOURCE_TYPES.BENEFITS_HUB, BenefitsHubMock)
    ).toMatchSnapshot()
  })

  test('handles no answers correctly', () => {
    // TODO
  })
})
