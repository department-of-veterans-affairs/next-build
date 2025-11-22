/**
 * @jest-environment node
 */

import mockData from './mock.json'
import { BenefitsDetailPageDataOpts, params } from './query'
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

const mockBenefitsHubQuery = jest.fn(() => ({
  field_title_icon: 'health-care',
}))
const mockBenefitsDetailPageQuery = jest.fn(() => mockData)

jest.mock('@/lib/drupal/query')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockDrupalQuery = require('@/lib/drupal/query')

mockDrupalQuery.setSingleEntityMock(
  RESOURCE_TYPES.BENEFITS_DETAIL_PAGE,
  mockBenefitsDetailPageQuery
)
mockDrupalQuery.setSingleEntityMock(
  RESOURCE_TYPES.BENEFITS_HUB,
  mockBenefitsHubQuery
)

function runQuery(options: Partial<BenefitsDetailPageDataOpts> = {}) {
  return queries.getData(RESOURCE_TYPES.BENEFITS_DETAIL_PAGE, {
    id: mockData.id,
    ...options,
  })
}

describe('BenefitsDetailPage params', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toContain('field_administration')
    expect(queryString).toContain('field_related_links')
    expect(queryString).toContain('field_alert')
  })
})

describe('BenefitsDetailPage formatter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockBenefitsDetailPageQuery.mockReturnValue(mockData)
    mockDrupalQuery.getMenu.mockReturnValue({
      items: [],
      tree: [],
    })
  })

  test('outputs formatted data with correct structure', async () => {
    const result = await runQuery()
    expect(result).toMatchSnapshot()
  })

  test('handles null alert', async () => {
    mockBenefitsDetailPageQuery.mockReturnValue({
      ...mockData,
      field_alert: null,
    })

    const result = await runQuery()
    expect(result.alert).toBeNull()
  })

  test('handles null related links', async () => {
    const result = await runQuery()
    expect(result.relatedLinks).toBeNull()
  })

  test('handles null administration', async () => {
    mockBenefitsDetailPageQuery.mockReturnValue({
      ...mockData,
      field_administration: null,
    })

    const result = await runQuery()
    expect(result.administration).toBeNull()
  })

  test('handles null menu when administration name does not match hub menu', async () => {
    // Use a different administration name that won't match any hub menu name
    // This will cause getBenefitsHubMenu to return NULL_RESULT with menu: null
    mockBenefitsDetailPageQuery.mockReturnValue({
      ...mockData,
      field_administration: {
        ...mockData.field_administration,
        name: 'Non-existent Hub Name That Does Not Match',
      },
    })

    const result = await runQuery()
    expect(result.menu).toBeNull()
  })

  test('builds side nav data from menu when menu exists', async () => {
    mockDrupalQuery.getMenu.mockReturnValue({
      items: [
        {
          title: 'Test Item',
          url: '/test',
        },
      ],
      tree: [],
    })

    const result = await runQuery()
    expect(result.menu).toBeDefined()
    expect(result.menu).not.toBeNull()
  })

  test('handles null description', async () => {
    mockBenefitsDetailPageQuery.mockReturnValue({
      ...mockData,
      field_description: null,
    })

    const result = await runQuery()
    expect(result.description).toBeNull()
  })

  test('handles null introText when field_intro_text_limited_html is null', async () => {
    mockBenefitsDetailPageQuery.mockReturnValue({
      ...mockData,
      field_intro_text_limited_html: null,
    })

    const result = await runQuery()
    expect(result.introText).toBeNull()
  })

  test('handles null showTableOfContents when field_table_of_contents_boolean is null', async () => {
    mockBenefitsDetailPageQuery.mockReturnValue({
      ...mockData,
      field_table_of_contents_boolean: null,
    })

    const result = await runQuery()
    expect(result.showTableOfContents).toBe(false)
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
