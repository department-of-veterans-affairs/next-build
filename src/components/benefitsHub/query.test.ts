/**
 * @jest-environment node
 */

import { NodeLandingPage } from '@/types/drupal/node'

import { queries } from '@/lib/drupal/queries'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import mockData from './mock.json'
import { params } from './query'

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toContain('field_related_links')
    expect(queryString).toContain('field_alert')
    expect(queryString).toContain('field_connect_with_us')
    expect(queryString).toContain('field_spokes')
    expect(queryString).toContain('field_support_services')
  })
})

describe('BenefitHubLanding formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData(
        RESOURCE_TYPES.BENEFITS_HUB,
        mockData as NodeLandingPage
      )
    ).toMatchSnapshot()
  })
})
