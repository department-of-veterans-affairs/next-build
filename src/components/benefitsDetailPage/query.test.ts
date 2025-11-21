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

const mockFetchSingle = jest.fn((options: { id: string }) => {
  if (options.id === BENEFITS_HUB_UUID) {
    return {
      field_title_icon: 'health-care',
    }
  }
  return mockData
})

const mockGetMenu = jest.fn(() => ({
  items: [],
  tree: [],
}))

jest.mock('@/lib/drupal/query', () => ({
  ...jest.requireActual('@/lib/drupal/query'),
  fetchSingleEntityOrPreview: (options: { id: string }) =>
    mockFetchSingle(options),
  getMenu: () => mockGetMenu(),
}))

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
    mockFetchSingle.mockImplementation((options: { id: string }) => {
      if (options.id === BENEFITS_HUB_UUID) {
        return {
          field_title_icon: 'health-care',
        }
      }
      return mockData
    })
    mockGetMenu.mockReturnValue({
      items: [],
      tree: [],
    })
  })

  test('outputs formatted data with correct structure', async () => {
    const result = await runQuery()
    expect(result).toMatchSnapshot()
  })

  test('handles null alert', async () => {
    mockFetchSingle.mockImplementation((options: { id: string }) => {
      if (options.id === BENEFITS_HUB_UUID) {
        return {
          field_title_icon: 'health-care',
        }
      }
      return {
        ...mockData,
        field_alert: null,
      }
    })

    const result = await runQuery()
    expect(result.alert).toBeNull()
  })

  test('handles null related links', async () => {
    const result = await runQuery()
    expect(result.relatedLinks).toBeNull()
  })

  test('handles null administration', async () => {
    mockFetchSingle.mockImplementation((options: { id: string }) => {
      if (options.id === BENEFITS_HUB_UUID) {
        return {
          field_title_icon: 'health-care',
        }
      }
      return {
        ...mockData,
        field_administration: null,
      }
    })

    const result = await runQuery()
    expect(result.administration).toBeNull()
  })

  test('handles null menu when administration name does not match hub menu', async () => {
    // Use a different administration name that won't match any hub menu name
    // This will cause getBenefitsHubMenu to return NULL_RESULT with menu: null
    mockFetchSingle.mockImplementation((options: { id: string }) => {
      if (options.id === BENEFITS_HUB_UUID) {
        return {
          field_title_icon: 'health-care',
        }
      }
      return {
        ...mockData,
        field_administration: {
          ...mockData.field_administration,
          name: 'Non-existent Hub Name That Does Not Match',
        },
      }
    })

    const result = await runQuery()
    expect(result.menu).toBeNull()
  })

  test('builds side nav data from menu when menu exists', async () => {
    mockGetMenu.mockReturnValue({
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
    mockFetchSingle.mockImplementation((options: { id: string }) => {
      if (options.id === BENEFITS_HUB_UUID) {
        return {
          field_title_icon: 'health-care',
        }
      }
      return {
        ...mockData,
        field_description: null,
      }
    })

    const result = await runQuery()
    expect(result.description).toBeNull()
  })

  test('handles null introText when field_intro_text_limited_html is null', async () => {
    mockFetchSingle.mockImplementation((options: { id: string }) => {
      if (options.id === BENEFITS_HUB_UUID) {
        return {
          field_title_icon: 'health-care',
        }
      }
      return {
        ...mockData,
        field_intro_text_limited_html: null,
      }
    })

    const result = await runQuery()
    expect(result.introText).toBeNull()
  })

  test('handles null showTableOfContents when field_table_of_contents_boolean is null', async () => {
    mockFetchSingle.mockImplementation((options: { id: string }) => {
      if (options.id === BENEFITS_HUB_UUID) {
        return {
          field_title_icon: 'health-care',
        }
      }
      return {
        ...mockData,
        field_table_of_contents_boolean: null,
      }
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
