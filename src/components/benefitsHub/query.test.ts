/**
 * @jest-environment node
 */

import { NodeLandingPage } from '@/types/drupal/node'

import { queries } from '@/lib/drupal/queries'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import mockData from './mock.json'
import { params } from './query'

const BENEFITS_HUB_UUID = '123'

jest.mock('@/lib/drupal/drupalClient', () => ({
  ...jest.requireActual('@/lib/drupal/drupalClient'),
  drupalClient: {
    translatePath: () => ({
      entity: {
        uuid: BENEFITS_HUB_UUID,
      },
    }),
  },
}))

const mockBenefitsHubQuery = jest.fn(() => mockData)

jest.mock('@/lib/drupal/query')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockDrupalQuery = require('@/lib/drupal/query')

mockDrupalQuery.setSingleEntityMock(
  RESOURCE_TYPES.BENEFITS_HUB,
  mockBenefitsHubQuery
)

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toContain('field_related_links')
    expect(queryString).toContain('field_alert')
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
