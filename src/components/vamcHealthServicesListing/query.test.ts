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
import { params } from './query'
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

jest.mock('@/lib/drupal/query', () => ({
  ...jest.requireActual('@/lib/drupal/query'),
  fetchSingleEntityOrPreview: () => mockPageQuery(),
  fetchAndConcatAllResourceCollectionPages: () => ({
    data: mockServicesQuery(),
  }),
  getMenu: () => mockMenu,
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
})
