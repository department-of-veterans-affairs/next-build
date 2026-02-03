/**
 * @jest-environment node
 */

import { NodeEvent, NodeEventListing } from '@/types/drupal/node'
import { queries } from '@/lib/drupal/queries'
import { mockResponse } from './mock.js'
import mockEventData from '@/components/event/mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params } from './query'
import { formatter } from './query'
import { LovellChildVariant } from '@/lib/drupal/lovell/types'

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
        lovell: undefined,
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

  test('handles non-Lovell paths without transformation', () => {
    const nonLovellData = {
      entity: {
        ...EventListingMock,
        path: {
          ...EventListingMock.path,
          alias: '/test-path',
        },
      },
      events: [],
      menu: {
        ...mockMenu,
        tree: [
          {
            ...mockMenu.tree[0],
            url: '/test-url',
          },
        ],
      },
      totalItems: 0,
      totalPages: 1,
      lovell: undefined,
    }
    const result = formatter(nonLovellData)
    expect(result.menu.rootPath).toBe('/test-path/')
    expect(result.menu.data.links[0].url.path).toBe('/test-url')
    expect(result.lovellVariant).toBe(null)
    expect(result.lovellSwitchPath).toBe(null)
  })

  test('detects TRICARE variant and transforms menu URLs', () => {
    const tricareData = {
      entity: {
        ...EventListingMock,
        path: {
          ...EventListingMock.path,
          alias: '/lovell-federal-health-care-tricare/events',
        },
      },
      events: [],
      menu: mockMenu,
      totalItems: 0,
      totalPages: 1,
      lovell: {
        isLovellVariantPage: true,
        variant: 'tricare' as LovellChildVariant,
      },
    }
    const result = formatter(tricareData)
    expect(result.menu.rootPath).toBe(
      '/lovell-federal-health-care-tricare/events/'
    )
    expect(result.menu.data.links[0].url.path).toContain('tricare')
    expect(result.lovellVariant).toBe('tricare')
    expect(result.lovellSwitchPath).toBe(
      '/lovell-federal-health-care-va/events'
    )
  })

  test('detects VA variant and transforms menu URLs', () => {
    const vaData = {
      entity: {
        ...EventListingMock,
        path: {
          ...EventListingMock.path,
          alias: '/lovell-federal-health-care-va/events',
        },
      },
      events: [],
      menu: mockMenu,
      totalItems: 0,
      totalPages: 1,
      lovell: {
        isLovellVariantPage: true,
        variant: 'va' as LovellChildVariant,
      },
    }
    const result = formatter(vaData)
    expect(result.menu.rootPath).toBe('/lovell-federal-health-care-va/events/')
    expect(result.menu.data.links[0].url.path).toContain('va')
    expect(result.lovellVariant).toBe('va')
    expect(result.lovellSwitchPath).toBe(
      '/lovell-federal-health-care-tricare/events'
    )
  })

  describe('Lovell event URL transformation', () => {
    // Create a mock event with a Lovell path to test transformation
    const lovellEventMock: NodeEvent = {
      ...EventMock[0],
      path: {
        ...EventMock[0].path,
        alias: '/lovell-federal-health-care-va/events/52265',
      },
    }

    test('transforms event URLs when TRICARE variant is provided', () => {
      const tricareData = {
        entity: {
          ...EventListingMock,
          path: {
            ...EventListingMock.path,
            alias: '/lovell-federal-health-care-tricare/events',
          },
        },
        events: [lovellEventMock],
        menu: mockMenu,
        totalItems: 1,
        totalPages: 1,
        lovell: {
          isLovellVariantPage: true,
          variant: 'tricare' as LovellChildVariant,
        },
      }
      const result = formatter(tricareData)
      // formatData will format the event, then lovell processing will transform the URL
      expect(result.events[0].entityUrl.path).toBe(
        '/lovell-federal-health-care-tricare/events/52265'
      )
    })

    test('transforms event URLs when VA variant is provided', () => {
      const vaEventMock: NodeEvent = {
        ...EventMock[0],
        path: {
          ...EventMock[0].path,
          alias: '/lovell-federal-health-care-tricare/events/52265',
        },
      }
      const vaData = {
        entity: {
          ...EventListingMock,
          path: {
            ...EventListingMock.path,
            alias: '/lovell-federal-health-care-va/events',
          },
        },
        events: [vaEventMock],
        menu: mockMenu,
        totalItems: 1,
        totalPages: 1,
        lovell: {
          isLovellVariantPage: true,
          variant: 'va' as LovellChildVariant,
        },
      }
      const result = formatter(vaData)
      // formatData will format the event, then lovell processing will transform the URL
      expect(result.events[0].entityUrl.path).toBe(
        '/lovell-federal-health-care-va/events/52265'
      )
    })

    test('does not transform event URLs when lovell variant is not provided', () => {
      const nonLovellData = {
        entity: EventListingMock,
        events: [lovellEventMock],
        menu: mockMenu,
        totalItems: 1,
        totalPages: 1,
        lovell: undefined,
      }
      const result = formatter(nonLovellData)
      // Without lovell variant, the URL should remain as formatted by formatData
      expect(result.events[0].entityUrl.path).toBe(
        '/lovell-federal-health-care-va/events/52265'
      )
    })
  })
})
