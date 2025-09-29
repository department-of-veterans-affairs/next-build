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

jest.mock('@/lib/drupal/query', () => ({
  ...jest.requireActual('@/lib/drupal/query'),
  fetchSingleEntityOrPreview: () => mockPageQuery(),
  getMenu: () => mockMenu,
}))

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

    test('handles null lovell context', async () => {
      const result = await runQuery({
        context: {
          path: '/test-path',
          drupalPath: '/test-drupal-path',
          listing: {
            isListingPage: false,
            firstPagePath: '/test-first-page-path',
            page: 1,
          },
          lovell: null,
        },
      })

      expect(result.lovellVariant).toBeNull()
      expect(result.lovellSwitchPath).toBeNull()
      expect(result.breadcrumbs).toEqual(mockPage.breadcrumbs)
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
})
