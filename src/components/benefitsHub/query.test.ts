/**
 * @jest-environment node
 */

import { NodeLandingPage } from '@/types/drupal/node'

import { queries } from '@/lib/drupal/queries'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import mockData from './mock.json'
import { BenefitsHubPageDataOpts, params } from './query'

jest.mock('@/lib/drupal/query')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockDrupalQuery = require('@/lib/drupal/query')

const mockBenefitsHubQuery = jest.fn(() => mockData as NodeLandingPage)

mockDrupalQuery.setSingleEntityMock(
  RESOURCE_TYPES.BENEFITS_HUB,
  mockBenefitsHubQuery
)

function runQuery(options: Partial<BenefitsHubPageDataOpts> = {}) {
  return queries.getData(RESOURCE_TYPES.BENEFITS_HUB, {
    id: mockData.id,
    ...options,
  })
}

describe('BenefitsHub params', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toContain('field_related_links')
    expect(queryString).toContain('field_alert')
    expect(queryString).toContain('field_connect_with_us')
    expect(queryString).toContain('field_spokes')
    expect(queryString).toContain('field_support_services')
    expect(queryString).toContain('field_promo')
  })
})

describe('BenefitHubLanding formatData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockBenefitsHubQuery.mockReturnValue(mockData as NodeLandingPage)
  })
  test('outputs formatted data', async () => {
    const result = await runQuery()
    expect(result).toMatchSnapshot()
  })

  test('handles null alert', async () => {
    mockBenefitsHubQuery.mockReturnValue({
      ...mockData,
      field_alert: null,
    } as NodeLandingPage)

    const result = await runQuery()
    expect(result.alert).toBeNull()
  })

  test('filters out null support services', async () => {
    const mockSupportServices = mockData.field_support_services
    // TODO: create support service mocks from test API
    mockBenefitsHubQuery.mockReturnValue({
      ...mockData,
      field_support_services: [
        null,
        ...mockSupportServices,
        null,
        ...mockSupportServices,
      ],
    } as NodeLandingPage)

    const result = await runQuery()

    // Should only have 2 support services (nulls filtered out)
    expect(result.supportServices).toHaveLength(2)
    expect(result.supportServices.every((service) => service !== null)).toBe(
      true
    )
  })
})
