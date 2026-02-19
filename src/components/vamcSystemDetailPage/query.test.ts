/**
 * @jest-environment node
 */

import mockPage from './mock.json'
import mockMenu from './mock.menu.json'
import { queries } from '@/lib/drupal/queries'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { VamcSystemDetailPageDataOpts } from './query'
import { NodeVamcSystemDetailPage } from '@/types/drupal/node'

const mockPageQuery = jest.fn(() => mockPage as NodeVamcSystemDetailPage)

jest.mock('@/lib/drupal/query')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockDrupalQuery = require('@/lib/drupal/query')

mockDrupalQuery.setSingleEntityMock(
  RESOURCE_TYPES.VAMC_SYSTEM_DETAIL_PAGE,
  mockPageQuery
)
mockDrupalQuery.getMenu.mockReturnValue(mockMenu)

const mockTranslatePath = jest.fn()
jest.mock('@/lib/drupal/drupalClient', () => ({
  ...jest.requireActual('@/lib/drupal/drupalClient'),
  drupalClient: {
    translatePath: () => mockTranslatePath(),
  },
}))
const mockTranslatePathResponse = {
  entity: {
    path: '/test-path',
  },
}

function runQuery(options: Partial<VamcSystemDetailPageDataOpts> = {}) {
  return queries.getData(RESOURCE_TYPES.VAMC_SYSTEM_DETAIL_PAGE, {
    id: mockPage.id,
    ...options,
  })
}

describe('VamcSystemDetailPage query module', () => {
  beforeEach(() => {
    // Reset to default mock data before each test
    mockPageQuery.mockReturnValue(mockPage as NodeVamcSystemDetailPage)
    mockTranslatePath.mockReturnValue(null)
  })

  test('outputs formatted data', async () => {
    expect(await runQuery()).toMatchSnapshot()
  })

  describe('handles null fields', () => {
    test('handles null introText', async () => {
      mockPageQuery.mockReturnValue({
        ...mockPage,
        field_intro_text: null,
      } as NodeVamcSystemDetailPage)

      const result = await runQuery()

      expect(result.introText).toBeNull()
    })

    test('handles null showTableOfContents', async () => {
      mockPageQuery.mockReturnValue({
        ...mockPage,
        field_table_of_contents_boolean: null,
      } as NodeVamcSystemDetailPage)

      const result = await runQuery()

      expect(result.showTableOfContents).toBeNull()
    })

    test('handles null relatedLinks', async () => {
      mockPageQuery.mockReturnValue({
        ...mockPage,
        field_related_links: null,
      } as NodeVamcSystemDetailPage)

      const result = await runQuery()

      expect(result.relatedLinks).toBeNull()
    })

    test('handles null breadcrumbs', async () => {
      mockPageQuery.mockReturnValue({
        ...mockPage,
        breadcrumbs: null,
      } as NodeVamcSystemDetailPage)

      const result = await runQuery()

      expect(result.breadcrumbs).toBeNull()
    })

    test('handles null featuredContent', async () => {
      mockPageQuery.mockReturnValue({
        ...mockPage,
        field_featured_content: null,
      } as NodeVamcSystemDetailPage)

      const result = await runQuery()

      expect(result.featuredContent).toBeNull()
    })
  })

  test('formats vamcEhrSystem', async () => {
    mockPageQuery.mockReturnValue({
      ...mockPage,
      field_office: {
        ...mockPage.field_office,
        field_vamc_ehr_system: 'vista',
      },
    } as NodeVamcSystemDetailPage)

    const result = await runQuery()

    expect(result.administration).toBeDefined()
    expect(result.vamcEhrSystem).toBeDefined()
  })

  describe('Lovell variant handling', () => {
    const lovellPath = {
      alias:
        '/lovell-federal-health-care-tricare/programs/electronic-health-record-modernization-ehrm/',
      pid: 79642,
      langcode: 'en',
    }
    const lovellBreadcrumbs = [
      {
        uri: 'https://va-gov-cms.ddev.site/',
        title: 'Home',
        options: [],
      },
      {
        uri: 'https://va-gov-cms.ddev.site/lovell-federal-health-care',
        title: 'Lovell Federal health care',
        options: [],
      },
      {
        uri: 'internal:#',
        title: 'Billing and insurance',
        options: [],
      },
    ]
    const lovellContext = {
      lovell: {
        isLovellVariantPage: true,
        variant: 'tricare',
      },
      path: lovellPath.alias,
      drupalPath: lovellPath.alias,
      listing: {
        isListingPage: false,
        firstPagePath: lovellPath.alias,
        page: 1,
      },
    } as const

    test('outputs formatted data with Lovell variant', async () => {
      mockPageQuery.mockReturnValue({
        ...mockPage,
        path: lovellPath,
        breadcrumbs: lovellBreadcrumbs,
      } as NodeVamcSystemDetailPage)

      const result = await runQuery({ context: lovellContext })

      expect(result.lovellVariant).toBe('tricare')
      expect(result.lovellSwitchPath).toBe(
        '/lovell-federal-health-care-va/programs/electronic-health-record-modernization-ehrm/'
      )
      expect(result.showLovellSwitcher).toBe(false)
    })

    test('sets showLovellSwitcher to true if there is a lovell counterpart page', async () => {
      mockPageQuery.mockReturnValue({
        ...mockPage,
        path: lovellPath,
        breadcrumbs: lovellBreadcrumbs,
      } as NodeVamcSystemDetailPage)

      mockTranslatePath.mockReturnValue(mockTranslatePathResponse)

      const result = await runQuery({ context: lovellContext })

      expect(result.showLovellSwitcher).toBe(true)
    })

    test('handles errors when fetching lovell counterpart', async () => {
      mockPageQuery.mockReturnValue({
        ...mockPage,
        path: lovellPath,
        breadcrumbs: lovellBreadcrumbs,
      } as NodeVamcSystemDetailPage)

      mockTranslatePath.mockRejectedValue({
        cause: {
          status: 404,
        },
      })

      const result = await runQuery({ context: lovellContext })

      expect(result.showLovellSwitcher).toBe(false)
    })

    test('throws any errors that are not 404/403 errors', async () => {
      mockPageQuery.mockReturnValue({
        ...mockPage,
        path: lovellPath,
        breadcrumbs: lovellBreadcrumbs,
      } as NodeVamcSystemDetailPage)

      const error = new Error('Test error')
      error.cause = {
        status: 500,
      }
      mockTranslatePath.mockRejectedValue(error)

      await expect(runQuery({ context: lovellContext })).rejects.toThrow(
        'Test error'
      )
    })
  })
})
