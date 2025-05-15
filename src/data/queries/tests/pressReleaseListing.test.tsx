/**
 * @jest-environment node
 */

import {
  params as pressReleaseListingParams,
  listingParams,
  data,
  formatter,
} from '../pressReleaseListing'
import * as queryModule from '@/lib/drupal/query'

jest.mock('@/lib/drupal/query', () => {
  const mockEntity = {
    id: 'c0d78f6e-3787-42e8-a7b2-fb81f6587059',
    type: 'node--press_releases_listing',
    attributes: {},
    langcode: 'en',
    status: true,
    field_office: {
      field_system_menu: {
        resourceIdObjMeta: {
          drupal_internal__target_id: 'va-birmingham-health-care',
        },
      },
    },
  }

  const mockMenu = {
    items: [],
    tree: [],
  }
  return {
    fetchSingleEntityOrPreview: jest.fn().mockResolvedValue(mockEntity),
    fetchAndConcatAllResourceCollectionPages: jest
      .fn()
      .mockResolvedValue({ data: [], totalItems: 0, totalPages: 0 }),
    getMenu: jest.fn().mockResolvedValue(mockMenu),
    entityBaseFields: jest.fn().mockReturnValue({}),
  }
})

// mocking the queries object to return a mock params object
jest.mock('..', () => {
  const mockParams = {
    addFilter: jest.fn().mockReturnThis(),
    addSort: jest.fn().mockReturnThis(),
    getQueryString: jest
      .fn()
      .mockReturnValue('filter[field_listing.id]=123&sort=-created'),
  }
  return {
    queries: {
      getParams: jest.fn().mockReturnValue(mockParams),
    },
    formatData: jest.fn().mockReturnValue({}),
  }
})

describe('data function for PressReleaseListing', () => {
  test('invokes data function with mocked dependencies', async () => {
    const opts = { id: 'test-id' }
    const result = await data(opts)

    expect(result).toHaveProperty('entity')
    expect(result).toHaveProperty('releases', [])
    expect(result).toHaveProperty('totalItems', 0)
    expect(result).toHaveProperty('totalPages', 0)
    expect(queryModule.fetchSingleEntityOrPreview).toHaveBeenCalledWith(
      opts,
      expect.anything(),
      expect.anything()
    )
    expect(
      queryModule.fetchAndConcatAllResourceCollectionPages
    ).toHaveBeenCalled()
    expect(queryModule.getMenu).toHaveBeenCalled()
  })

  describe('DrupalJsonApiParams configuration for pressReleaseListing', () => {
    test('params function sets the correct include fields', () => {
      const paramsInstance = pressReleaseListingParams()
      const queryString = decodeURIComponent(paramsInstance.getQueryString())
      expect(queryString).toContain('field_office')
    })
  })

  describe('listingParams for fetching stories', () => {
    test('correctly constructs query parameters', () => {
      const listingEntityId = '123'
      const paramsInstance = listingParams(listingEntityId)
      const queryString = decodeURIComponent(paramsInstance.getQueryString())
      expect(queryString).toContain(
        'filter[field_listing.id]=' + listingEntityId
      )
      expect(queryString).toContain('sort=-created')
    })
  })

  describe('formatter variant detection and menu handling', () => {
    const mockData = {
      entity: {
        id: 'test-id',
        type: 'node--press_releases_listing',
        langcode: 'en',
        status: true,
        drupal_internal__nid: 123,
        drupal_internal__vid: 456,
        created: '2024-01-01',
        changed: '2024-01-02',
        title: 'Test Press Release Listing',
        path: {
          alias: '/test-press-releases',
          pid: 1,
          langcode: 'en',
          severity: 0,
        },
        field_description: 'Test description',
        field_intro_text: 'Test intro',
        field_office: {
          id: '1',
          type: 'node--health_care_region_page',
          langcode: 'en',
          status: true,
          drupal_internal__nid: 1,
          drupal_internal__vid: 1,
          created: '2020-01-01',
          changed: '2020-01-01',
          title: 'Test Office',
          path: {
            alias: '/test-path',
            pid: 1,
            langcode: 'en',
            severity: 1,
          },
          field_description: 'Test Description',
          field_intro_text: 'Test Intro Text',
          field_vamc_system_official_name: 'Test Office',
          field_appointments_online: null,
          field_media: null,
          field_related_links: null,
          field_vamc_ehr_system: null,
          field_facebook: null,
          field_flickr: null,
          field_instagram: null,
          field_locations_intro_blurb: null,
          field_operating_status_emerg: null,
          field_operating_status_more_info: null,
          field_twitter: null,
          field_youtube: null,
          field_operating_status: null,
          field_region_page: null,
          field_banner_alert: null,
          field_govdelivery_id_emerg: null,
          field_govdelivery_id_news: null,
          field_other_va_locations: null,
          field_clinical_health_services: [],
          field_mental_health_services: [],
          field_specialty_care_services: [],
          field_va_health_connect_phone: null,
          default_langcode: true,
          sticky: false,
        },
        metatag: [],
        default_langcode: true,
        sticky: false,
      },
      releases: [],
      menu: {
        items: [
          {
            title: 'Test Menu Item',
            description: 'Test Description',
            expanded: true,
            url: '/test-url',
            items: [],
            enabled: true,
            id: 'test-menu-item-id',
            menu_name: 'test-menu',
            meta: {
              entity_id: '1',
              entity_type: 'menu_link_content',
              entity_uuid: 'test-uuid',
            },
            parent: '',
            provider: 'menu_link_content',
            route_name: 'entity.node.canonical',
            weight: '0',
            options: {},
            route: {
              name: 'entity.node.canonical',
              parameters: {},
            },
            type: 'menu_link_content',
            severity: 0,
          },
        ],
        tree: [
          {
            title: 'Test Menu Item',
            description: 'Test Description',
            expanded: true,
            url: '/test-url',
            items: [],
            enabled: true,
            id: 'test-menu-item-id',
            menu_name: 'test-menu',
            meta: {
              entity_id: '1',
              entity_type: 'menu_link_content',
              entity_uuid: 'test-uuid',
            },
            parent: '',
            provider: 'menu_link_content',
            route_name: 'entity.node.canonical',
            weight: '0',
            options: {},
            route: {
              name: 'entity.node.canonical',
              parameters: {},
            },
            type: 'menu_link_content',
            severity: 0,
          },
        ],
      },
      totalItems: 0,
      totalPages: 0,
      current: 1,
    }

    test('detects TRICARE variant from path', () => {
      const tricareData = {
        ...mockData,
        entity: {
          ...mockData.entity,
          path: {
            alias: '/lovell-federal-health-care-tricare/news-releases',
            pid: 1,
            langcode: 'en',
            severity: 0,
          },
        },
      }
      const result = formatter(tricareData)
      expect(result.menu.rootPath).toBe(
        '/lovell-federal-health-care-tricare/news-releases/'
      )
    })

    test('detects VA variant from path', () => {
      const vaData = {
        ...mockData,
        entity: {
          ...mockData.entity,
          path: {
            alias: '/lovell-federal-health-care-va/news-releases',
            pid: 1,
            langcode: 'en',
            severity: 0,
          },
        },
      }
      const result = formatter(vaData)
      expect(result.menu.rootPath).toBe(
        '/lovell-federal-health-care-va/news-releases/'
      )
    })

    test('handles non-Lovell paths without transformation', () => {
      const result = formatter(mockData)
      expect(result.menu.rootPath).toBe('/test-press-releases/')
    })
  })
})
