/**
 * @jest-environment node
 */

import { NodeEvent, NodeEventListing } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import { mockResponse } from '@/products/eventListing/mock.js'
import mockEventData from '@/products/event/mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params } from './query'
import { formatter } from './query'

const EventListingMock: NodeEventListing = mockResponse
const EventMock: NodeEvent[] = [mockEventData]

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(/include=field_office/)
  })
})

describe(`${RESOURCE_TYPES.EVENT_LISTING} formatData`, () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData(RESOURCE_TYPES.EVENT_LISTING, {
        entity: EventListingMock,
        events: EventMock,
        menu: { items: [], tree: [] },
        totalItems: EventMock.length,
        totalPages: 1,
      })
    ).toMatchSnapshot()
  })
})

describe('EventListing formatter', () => {
  const mockMenu = {
    items: [],
    tree: [
      {
        title: 'Test Menu Item',
        description: 'Test Description',
        expanded: false,
        enabled: true,
        id: 'test-id',
        menu_name: 'main',
        meta: {},
        parent: '',
        provider: 'menu_link_content',
        route: { name: 'test', parameters: {} },
        type: 'menu_link_content',
        url: '/lovell-federal-health-care/test-url',
        weight: '0',
        options: {},
        severity: 0,
        field_menu_section: 'both',
        // Lovell variant menus will filter out top-level items with no children.
        items: [
          {
            title: 'Test Menu Subitem',
            url: '/lovell-federal-health-care/test-url-subitem',
            field_menu_section: 'both',
            description: 'Test Description',
            expanded: false,
            enabled: true,
            id: 'test-id-2',
            menu_name: 'main',
            meta: {},
            parent: '',
            provider: 'menu_link_content',
            route: { name: 'test', parameters: {} },
            type: 'menu_link_content',
            weight: '0',
            options: {},
            severity: 0,
          },
        ],
      },
    ],
  }

  const mockData = {
    entity: {
      id: 'test-id',
      type: 'node--event_listing',
      status: true,
      title: 'Test Event Listing',
      path: {
        alias: '/test-path',
        pid: 123,
        langcode: 'en',
        severity: 0,
      },
      field_intro_text: 'Test intro text',
      field_description: 'Test description',
      field_enforce_unique_combo: false,
      field_office: {
        type: 'node--health_care_region_page',
        id: 'test-office-id',
        field_system_menu: null,
        field_body: null,
        field_email_updates_link: null,
        field_external_link: null,
        field_description: 'Test office description',
        field_facility_hours: null,
        field_facility_locator_api_id: null,
        field_intro_text: null,
        field_link_facility_emerg_list: null,
        field_link_facility_health_list: null,
        field_link_facility_nca_list: null,
        field_link_facility_vba_list: null,
        field_media: null,
        field_meta_tags: null,
        field_meta_title: null,
        field_nickname_for_this_facility: null,
        field_operating_status: null,
        field_operating_status_facility: null,
        field_operating_status_more_info: null,
        field_press_release_office: null,
        field_region_page: null,
        field_social_media_links: null,
        field_twitter_feed_url: null,
        field_website_url: null,
        field_office_id: null,
        field_parent_office: null,
        drupal_internal__nid: 456,
        drupal_internal__vid: 789,
        status: true,
        title: 'Test Office',
        path: {
          alias: '/test-office',
          pid: 123,
          langcode: 'en',
          severity: 0,
        },
        changed: '2024-03-20',
        created: '2024-03-20',
        default_langcode: true,
        langcode: 'en',
        promote: false,
        revision_log: '',
        revision_timestamp: '2024-03-20',
        sticky: false,
        uuid: 'test-uuid',
      },
      drupal_internal__nid: 123,
      drupal_internal__vid: 456,
      created: '2024-01-01',
      changed: '2024-01-02',
      promote: false,
      sticky: false,
      default_langcode: true,
      revision_translation_affected: true,
      moderation_state: 'published',
      langcode: 'en',
    },
    events: [],
    menu: mockMenu,
    totalItems: 0,
    totalPages: 1,
  }

  test('handles non-Lovell paths without transformation', () => {
    const nonLovellData = {
      ...mockData,
      menu: {
        items: [],
        tree: [
          {
            ...mockData.menu.tree[0],
            url: '/test-url',
          },
        ],
      },
    }
    const result = formatter(nonLovellData)
    expect(result.menu.rootPath).toBe('/test-path/')
    expect(result.menu.data.links[0].url.path).toBe('/test-url')
  })

  test('detects TRICARE variant and transforms menu URLs', () => {
    const tricareData = {
      ...mockData,
      entity: {
        ...mockData.entity,
        path: {
          alias: '/lovell-federal-health-care-tricare/events',
          pid: 123,
          langcode: 'en',
          severity: 0,
        },
      },
    }
    const result = formatter(tricareData)
    expect(result.menu.rootPath).toBe(
      '/lovell-federal-health-care-tricare/events/'
    )
    expect(result.menu.data.links[0].url.path).toContain('tricare')
  })

  test('detects VA variant and transforms menu URLs', () => {
    const vaData = {
      ...mockData,
      entity: {
        ...mockData.entity,
        path: {
          alias: '/lovell-federal-health-care-va/events',
          pid: 123,
          langcode: 'en',
          severity: 0,
        },
      },
    }
    const result = formatter(vaData)
    expect(result.menu.rootPath).toBe('/lovell-federal-health-care-va/events/')
    expect(result.menu.data.links[0].url.path).toContain('va')
  })
})
