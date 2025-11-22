/**
 * @jest-environment node
 *
 * If we don't have this, next-drupal-query will complain, thinking that it's running on
 * the client: "You should not call getQueryData on the client."
 */

import mockPage from './mock.json'
import mockSystem from '@/components/vamcSystem/mock.json'
import {
  NodeVamcHealthServicesListing,
  NodeHealthCareRegionPage,
  NodeRegionalHealthCareServiceDes,
} from '@/types/drupal/node'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { queries } from '@/lib/drupal/queries'
import { LovellStaticPropsContextProps } from '@/lib/drupal/lovell/types'
import { params, serviceParams } from './query'
import { createMockServicesForGrouping } from './mockServiceDes'
import { Menu } from '@/types/drupal/menu'
import { DrupalMenuLinkContent } from 'next-drupal'

// Use type assertion to bypass strict type checking for test data
const mockServicesListing = {
  ...mockPage,
  field_office: {
    ...(mockSystem as unknown as NodeHealthCareRegionPage),
    field_system_menu: {
      type: 'menu_link_content--menu_link_content',
      id: 'test-menu-link',
      resourceIdObjMeta: {
        drupal_internal__target_id: 1,
      },
    },
  },
} as NodeVamcHealthServicesListing

// Mock menu data for testing - providing realistic structure
const menuItem: DrupalMenuLinkContent = {
  title: 'Test Menu Item',
  type: 'menu_link_content',
  url: '/test-facility/test-service',
  id: 'test-menu-item',
  description: 'Test description',
  enabled: true,
  expanded: false,
  menu_name: 'test-menu',
  meta: {},
  options: {},
  parent: null,
  provider: null,
  route: null,
  weight: '0',
}

const mockMenu = {
  items: [menuItem],
  tree: [menuItem],
} as Menu

const mockPageQuery = jest.fn(
  () => mockServicesListing as NodeVamcHealthServicesListing
)
const mockServicesQuery = jest.fn(
  () => createMockServicesForGrouping() as NodeRegionalHealthCareServiceDes[]
)

jest.mock('@/lib/drupal/query')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockDrupalQuery = require('@/lib/drupal/query')

mockDrupalQuery.setSingleEntityMock(
  RESOURCE_TYPES.VAMC_HEALTH_SERVICES_LISTING,
  mockPageQuery
)
mockDrupalQuery.setResourceCollectionMock(
  RESOURCE_TYPES.VAMC_SYSTEM_SERVICE_DES,
  () => ({
    data: mockServicesQuery(),
  })
)
mockDrupalQuery.getMenu.mockReturnValue(mockMenu)

jest.mock('@/lib/drupal/drupalClient', () => ({
  drupalClient: {
    translatePath: jest.fn().mockResolvedValue({
      entity: {
        path: '/test-translated-path',
      },
    }),
  },
}))

function runQuery(lovell: Partial<LovellStaticPropsContextProps> = {}) {
  return queries.getData(RESOURCE_TYPES.VAMC_HEALTH_SERVICES_LISTING, {
    id: mockServicesListing.id,
    context: {
      path: '/test-path',
      drupalPath: '/test-drupal-path',
      listing: {
        isListingPage: false,
        firstPagePath: '/test-first-page-path',
        page: 1,
      },
      lovell: {
        isLovellVariantPage: false,
        variant: null,
        ...lovell,
      },
    },
  })
}

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatchSnapshot()
  })

  test('serviceParams function sets the correct filters and includes', () => {
    const vamcSystemId = 'test-system-id'
    const paramsInstance = serviceParams(vamcSystemId)
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toContain('field_service_name_and_descripti')
    expect(queryString).toContain('field_local_health_care_service_')
    expect(queryString).toContain('filter[status]=1')
    expect(queryString).toContain(
      `filter[field_region_page.id]=${vamcSystemId}`
    )
  })
})

describe('VamcHealthServicesListing formatter', () => {
  beforeEach(() => {
    // Reset to default mock data before each test
    mockPageQuery.mockReturnValue(
      mockServicesListing as NodeVamcHealthServicesListing
    )
    mockServicesQuery.mockReturnValue(
      createMockServicesForGrouping() as NodeRegionalHealthCareServiceDes[]
    )
  })

  test('outputs formatted data', async () => {
    expect(await runQuery()).toMatchSnapshot()
  })

  test('groups health services by type of care', async () => {
    const result = await runQuery()

    expect(result.healthServiceGroups).toBeDefined()
    expect(result.healthServiceGroups).toHaveLength(5) // 5 different types of care

    // Check that services are grouped correctly
    const primaryCareGroup = result.healthServiceGroups.find(
      (group) => group.typeOfCare === 'Primary care'
    )
    expect(primaryCareGroup).toBeDefined()
    expect(primaryCareGroup?.services).toHaveLength(1)
    expect(primaryCareGroup?.services[0].title).toBe('Primary Care Service')

    const mentalHealthGroup = result.healthServiceGroups.find(
      (group) => group.typeOfCare === 'Mental health care'
    )
    expect(mentalHealthGroup).toBeDefined()
    expect(mentalHealthGroup?.services).toHaveLength(1)
    expect(mentalHealthGroup?.services[0].title).toBe('Mental Health Service')
  })

  describe('Lovell variant handling', () => {
    const lovellPath = {
      alias: '/lovell-federal-health-care-va/health-services',
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
        title: 'Health services',
        options: [],
      },
    ]

    test('outputs formatted data with Lovell variant', async () => {
      mockPageQuery.mockReturnValue({
        ...mockServicesListing,
        path: lovellPath,
        breadcrumbs: lovellBreadcrumbs,
      } as NodeVamcHealthServicesListing)

      const result = await runQuery({
        isLovellVariantPage: true,
        variant: 'tricare',
      })

      expect(result.lovellVariant).toBe('tricare')
      expect(result.lovellSwitchPath).toBeDefined()
      expect(result.breadcrumbs).toBeDefined()
    })

    test('updates the breadcrumbs for Lovell variant', async () => {
      mockPageQuery.mockReturnValue({
        ...mockServicesListing,
        path: lovellPath,
        breadcrumbs: lovellBreadcrumbs,
      } as NodeVamcHealthServicesListing)

      const result = await runQuery({
        isLovellVariantPage: true,
        variant: 'tricare',
      })

      // Breadcrumbs should be transformed for Lovell variant
      expect(result.breadcrumbs).toBeDefined()
      expect(result.breadcrumbs).not.toEqual(lovellBreadcrumbs)
    })

    test('does not modify breadcrumbs when not a Lovell variant page', async () => {
      mockPageQuery.mockReturnValue({
        ...mockServicesListing,
        path: lovellPath,
        breadcrumbs: lovellBreadcrumbs,
      } as NodeVamcHealthServicesListing)

      const result = await runQuery({
        isLovellVariantPage: false,
        variant: null,
      })

      expect(result.lovellVariant).toBeNull()
      expect(result.lovellSwitchPath).toBeNull()
      expect(result.breadcrumbs).toEqual(lovellBreadcrumbs)
    })
  })

  test('handles null featured content', async () => {
    mockPageQuery.mockReturnValue({
      ...mockServicesListing,
      field_featured_content_healthser: null,
    } as NodeVamcHealthServicesListing)

    const result = await runQuery()

    expect(result.featuredContent).toEqual([])
  })

  test('handles undefined featured content', async () => {
    mockPageQuery.mockReturnValue({
      ...mockServicesListing,
      field_featured_content_healthser: undefined,
    } as NodeVamcHealthServicesListing)

    const result = await runQuery()

    expect(result.featuredContent).toEqual([])
  })

  test('handles featured content with missing field_link url', async () => {
    // Use a valid link teaser structure but with a url that falls back to formattedItem.uri
    mockPageQuery.mockReturnValue({
      ...mockServicesListing,
      field_featured_content_healthser: [
        {
          ...mockServicesListing.field_featured_content_healthser[0],
          field_link: {
            title: 'Test Link',
            uri: '/test-uri',
            url: undefined, // Missing url property, should fall back to formattedItem.uri
            options: [],
          },
        },
      ],
    } as NodeVamcHealthServicesListing)

    const result = await runQuery()

    expect(result.featuredContent).toBeDefined()
    expect(result.featuredContent.length).toBeGreaterThan(0)
    // Should fall back to formattedItem.uri when field_link.url is undefined
    expect(result.featuredContent[0].uri).toBeDefined()
  })

  test('handles null services array', async () => {
    mockServicesQuery.mockReturnValue(null)

    const result = await runQuery()

    expect(result.healthServiceGroups).toBeDefined()
    expect(result.healthServiceGroups).toHaveLength(0)
  })

  test('handles undefined lovell variant', async () => {
    const result = await runQuery({
      isLovellVariantPage: false,
      variant: undefined,
    })

    expect(result.lovellVariant).toBeNull()
  })

  test('handles featured content item with falsy entityId', async () => {
    // Mock queries.formatData to return an item with falsy entityId
    const originalFormatData = queries.formatData
    jest.spyOn(queries, 'formatData').mockImplementation((type, item) => {
      const result = originalFormatData.call(queries, type, item)
      if (result && type === 'paragraph--link_teaser') {
        return {
          ...result,
          entityId: undefined, // Falsy value
        }
      }
      return result
    })

    const result = await runQuery()

    expect(result.featuredContent).toBeDefined()
    expect(result.featuredContent.length).toBeGreaterThan(0)
    // entityId should be null when falsy
    expect(result.featuredContent[0].entityId).toBeNull()

    jest.restoreAllMocks()
  })
})
