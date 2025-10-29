/**
 * @jest-environment node
 */

import mockData from './mock.json'
import { BenefitsDetailPageDataOpts } from './query'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { queries } from '@/lib/drupal/queries'

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

const mockFetchSingle = jest.fn((options: { id: string }) => {
  if (options.id === BENEFITS_HUB_UUID) {
    return {
      field_title_icon: 'health-care',
    }
  }
  return mockData
})

jest.mock('@/lib/drupal/query', () => ({
  ...jest.requireActual('@/lib/drupal/query'),
  fetchSingleEntityOrPreview: (options: { id: string }) =>
    mockFetchSingle(options),
  getMenu: () => ({
    items: [],
    tree: [],
  }),
}))

function runQuery(options: Partial<BenefitsDetailPageDataOpts> = {}) {
  return queries.getData(RESOURCE_TYPES.BENEFITS_DETAIL_PAGE, {
    id: mockData.id,
    ...options,
  })
}

describe('BenefitsDetailPage formatter', () => {
  test('outputs formatted data with correct structure', async () => {
    const result = await runQuery()
    expect(result).toMatchSnapshot()
  })

  test('handles null alert', async () => {
    const result = await runQuery()
    expect(result.alert).toBeNull()
  })

  test('handles null related links', async () => {
    const result = await runQuery()
    expect(result.relatedLinks).toBeNull()
  })

  // test('formats content blocks', () => {
  //   const result = formatter(BenefitsDetailPageMock)

  //   expect(result.contentBlock).toBeDefined()
  //   expect(Array.isArray(result.contentBlock)).toBe(true)
  // })

  // test('formats featured content', () => {
  //   const result = formatter(BenefitsDetailPageMock)

  //   expect(result.featuredContent).toBeDefined()
  //   expect(Array.isArray(result.featuredContent)).toBe(true)
  // })
})
