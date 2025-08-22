/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import mockData from '@/mocks/vamcSystem.mock.json'
import mockFacilityData from '@/mocks/healthCareLocalFacility.mock'
import mockStoryData from '@/products/newsStory/mock.json'
import mockEventData from '@/products/event/mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params, getVamcSystemSocialLinks } from '../vamcSystem'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { LOVELL } from '@/lib/drupal/lovell/constants'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { NodeHealthCareRegionPage } from '@/types/drupal/node'

const mockFeaturedEventData = {
  ...mockEventData,
  // Just to differentiate in the snapshot
  field_featured: true,
  title: 'Dodgeball Club',
}

// Mock story data for parent stories (Lovell federal)
const mockParentStoryData = {
  ...mockStoryData,
  title: 'Parent Federal Story',
  id: 'parent-story-id',
}

// Mock event data for parent events (Lovell federal)
const mockParentEventData = {
  ...mockEventData,
  title: 'Parent Federal Event',
  id: 'parent-event-id',
  field_featured: true,
}

// Mock non-featured event for fallback testing
const mockNonFeaturedEventData = {
  ...mockEventData,
  title: 'Non-featured Event',
  id: 'non-featured-event-id',
  field_featured: false,
}

// Individual mock functions for each resource type
const mockVamcFacilityQuery = jest.fn()
const mockStoryQuery = jest.fn()
const mockEventQuery = jest.fn()

jest.mock('@/lib/drupal/query', () => ({
  ...jest.requireActual('@/lib/drupal/query'),
  fetchSingleEntityOrPreview: () => mockData,
  fetchAndConcatAllResourceCollectionPages: (
    nodeType: string,
    params: DrupalJsonApiParams
  ) => {
    switch (nodeType) {
      case RESOURCE_TYPES.VAMC_FACILITY:
        return mockVamcFacilityQuery(params)
      case RESOURCE_TYPES.STORY:
        return mockStoryQuery(params)
      case RESOURCE_TYPES.EVENT:
        return mockEventQuery(params)
      default:
        return { data: [] }
    }
  },
  getMenu: () => ({
    items: [],
    tree: [],
  }),
}))

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatchSnapshot()
  })
})

describe('VamcSystem formatData', () => {
  beforeAll(() => {
    // Mock Date.now() to return a fixed timestamp so that mock events
    // aren't filtered out by getNextEventOccurrences
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2020-01-01').getTime())
  })

  beforeEach(() => {
    // Reset all mocks to default behavior before each test
    mockVamcFacilityQuery.mockReturnValue({ data: [mockFacilityData] })

    mockStoryQuery.mockImplementation((params: DrupalJsonApiParams) => {
      const queryObj = params.getQueryObject()
      const isLovellParentStoryQuery =
        queryObj.filter &&
        Object.keys(queryObj.filter).some((key) =>
          key.includes('field_administration.drupal_internal__tid')
        )

      if (isLovellParentStoryQuery) {
        return { data: [mockParentStoryData] }
      }
      return { data: [mockStoryData] }
    })

    mockEventQuery.mockImplementation((params: DrupalJsonApiParams) => {
      const queryObj = params.getQueryObject()
      const isLovellParentEventQuery =
        queryObj.filter &&
        Object.keys(queryObj.filter).some((key) =>
          key.includes('field_administration.drupal_internal__tid')
        )
      const isFeatured = queryObj.filter?.field_featured === '1'

      if (isLovellParentEventQuery) {
        if (isFeatured) {
          return { data: [mockParentEventData] }
        } else {
          return { data: [{ ...mockParentEventData, field_featured: false }] }
        }
      }

      if (isFeatured) {
        return { data: [mockFeaturedEventData] }
      } else {
        return { data: [mockNonFeaturedEventData] }
      }
    })
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test('outputs formatted data', async () => {
    expect(
      await queries.getData(RESOURCE_TYPES.VAMC_SYSTEM, { id: mockData.id })
    ).toMatchSnapshot()
  })

  describe('Lovell variant functionality', () => {
    test('outputs formatted data with Lovell VA variant context', async () => {
      const lovellContext: ExpandedStaticPropsContext = {
        path: '',
        drupalPath: '',
        listing: { isListingPage: false, firstPagePath: '', page: 0 },
        lovell: {
          isLovellVariantPage: true,
          variant: LOVELL.va.variant,
        },
      }

      const result = await queries.getData(RESOURCE_TYPES.VAMC_SYSTEM, {
        id: mockData.id,
        context: lovellContext,
      })

      // Verify that featuredStories includes both system and parent stories
      expect(result.featuredStories).toHaveLength(2)
      expect(
        result.featuredStories.some(
          (story) => story.title === mockStoryData.title
        )
      ).toBe(true)
      expect(
        result.featuredStories.some(
          (story) => story.title === mockParentStoryData.title
        )
      ).toBe(true)

      // Verify that featuredEvents includes both system and parent events
      expect(result.featuredEvents).toHaveLength(2)
      expect(
        result.featuredEvents.some(
          (event) => event.title === mockFeaturedEventData.title
        )
      ).toBe(true)
      expect(
        result.featuredEvents.some(
          (event) => event.title === mockParentEventData.title
        )
      ).toBe(true)
    })

    test('outputs formatted data with Lovell TRICARE variant context', async () => {
      const lovellContext: ExpandedStaticPropsContext = {
        path: '',
        drupalPath: '',
        listing: { isListingPage: false, firstPagePath: '', page: 0 },
        lovell: {
          isLovellVariantPage: true,
          variant: LOVELL.tricare.variant,
        },
      }

      const result = await queries.getData(RESOURCE_TYPES.VAMC_SYSTEM, {
        id: mockData.id,
        context: lovellContext,
      })

      // Should have the same behavior as VA variant - includes both system and parent content
      expect(result.featuredStories).toHaveLength(2)
      expect(result.featuredEvents).toHaveLength(2)
    })

    test('handles non-Lovell variant pages (regular behavior)', async () => {
      const regularContext: ExpandedStaticPropsContext = {
        path: '',
        drupalPath: '',
        listing: { isListingPage: false, firstPagePath: '', page: 0 },
        lovell: {
          isLovellVariantPage: false,
          variant: null,
        },
      }

      const result = await queries.getData(RESOURCE_TYPES.VAMC_SYSTEM, {
        id: mockData.id,
        context: regularContext,
      })

      // Should only have system-specific content, not parent content
      expect(result.featuredStories).toHaveLength(1)
      expect(result.featuredStories[0].title).toBe(mockStoryData.title)

      expect(result.featuredEvents).toHaveLength(1)
      expect(result.featuredEvents[0].title).toBe(mockFeaturedEventData.title)
    })

    test('handles context with non-Lovell lovell property', async () => {
      const contextWithoutLovell: ExpandedStaticPropsContext = {
        path: '',
        drupalPath: '',
        listing: { isListingPage: false, firstPagePath: '', page: 0 },
        lovell: {
          isLovellVariantPage: false,
          variant: null,
        },
      }

      const result = await queries.getData(RESOURCE_TYPES.VAMC_SYSTEM, {
        id: mockData.id,
        context: contextWithoutLovell,
      })

      // Should behave like non-Lovell variant
      expect(result.featuredStories).toHaveLength(1)
      expect(result.featuredEvents).toHaveLength(1)
    })

    test('handles no context provided', async () => {
      const result = await queries.getData(RESOURCE_TYPES.VAMC_SYSTEM, {
        id: mockData.id,
      })

      // Should behave like non-Lovell variant
      expect(result.featuredStories).toHaveLength(1)
      expect(result.featuredEvents).toHaveLength(1)
    })

    test('inherits parent content when system has no featured content (Lovell variant)', async () => {
      // Override mocks for this specific test
      mockStoryQuery.mockImplementation((params: DrupalJsonApiParams) => {
        const queryObj = params.getQueryObject()
        const isLovellParentStoryQuery =
          queryObj.filter &&
          Object.keys(queryObj.filter).some((key) =>
            key.includes('field_administration.drupal_internal__tid')
          )

        if (isLovellParentStoryQuery) {
          return { data: [mockParentStoryData] }
        }
        return { data: [] } // No system stories
      })

      mockEventQuery.mockImplementation((params: DrupalJsonApiParams) => {
        const queryObj = params.getQueryObject()
        const isLovellParentEventQuery =
          queryObj.filter &&
          Object.keys(queryObj.filter).some((key) =>
            key.includes('field_administration.drupal_internal__tid')
          )
        const isFeatured = queryObj.filter?.field_featured === '1'

        if (isLovellParentEventQuery) {
          if (isFeatured) {
            return { data: [mockParentEventData] }
          } else {
            return { data: [{ ...mockParentEventData, field_featured: false }] }
          }
        }
        return { data: [] } // No system events
      })

      const lovellContext: ExpandedStaticPropsContext = {
        path: '',
        drupalPath: '',
        listing: { isListingPage: false, firstPagePath: '', page: 0 },
        lovell: {
          isLovellVariantPage: true,
          variant: LOVELL.va.variant,
        },
      }

      const result = await queries.getData(RESOURCE_TYPES.VAMC_SYSTEM, {
        id: mockData.id,
        context: lovellContext,
      })

      // Should only have parent content, no system content
      expect(result.featuredStories).toHaveLength(1)
      expect(result.featuredStories[0].title).toBe(mockParentStoryData.title)

      expect(result.featuredEvents).toHaveLength(1)
      expect(result.featuredEvents[0].title).toBe(mockParentEventData.title)

      // Should have no fallback event since we found featured events from parent
      expect(result.fallbackEvent).toBeNull()
    })
  })

  describe('Event fallback functionality', () => {
    test('uses fallback event when no featured events exist', async () => {
      // Override event mock to return no featured events but have non-featured events
      mockEventQuery.mockImplementation((params: DrupalJsonApiParams) => {
        const queryObj = params.getQueryObject()
        const isFeatured = queryObj.filter?.field_featured === '1'

        if (isFeatured) {
          return { data: [] } // No featured events
        } else {
          return { data: [mockNonFeaturedEventData] } // Non-featured events exist
        }
      })

      const result = await queries.getData(RESOURCE_TYPES.VAMC_SYSTEM, {
        id: mockData.id,
      })

      expect(result.featuredEvents).toHaveLength(0)
      expect(result.fallbackEvent).toBeTruthy()
      expect(result.fallbackEvent?.title).toBe(mockNonFeaturedEventData.title)
    })

    test('has no fallback event when featured events exist', async () => {
      // Use default mock behavior (has featured events)
      const result = await queries.getData(RESOURCE_TYPES.VAMC_SYSTEM, {
        id: mockData.id,
      })

      expect(result.featuredEvents.length).toBeGreaterThan(0)
      expect(result.fallbackEvent).toBeNull()
    })

    test('has no fallback event when no events exist at all', async () => {
      // Override event mock to return no events at all
      mockEventQuery.mockReturnValue({ data: [] })

      const result = await queries.getData(RESOURCE_TYPES.VAMC_SYSTEM, {
        id: mockData.id,
      })

      expect(result.featuredEvents).toHaveLength(0)
      expect(result.fallbackEvent).toBeNull()
    })
  })
})

describe('getVamcSystemSocialLinks', () => {
  const baseRegionData = {
    title: 'Test VA Medical Center',
    field_facebook: null,
    field_twitter: null,
    field_flickr: null,
    field_instagram: null,
    field_youtube: null,
    field_govdelivery_id_news: null,
    field_govdelivery_id_emerg: null,
    field_operating_status: null,
  } as unknown as NodeHealthCareRegionPage

  test('returns correct regionNickname from title', () => {
    const result = getVamcSystemSocialLinks(baseRegionData)
    expect(result.regionNickname).toBe('Test VA Medical Center')
  })

  test('returns empty links array when no social fields are provided', () => {
    const result = getVamcSystemSocialLinks(baseRegionData)
    expect(result.links).toEqual([])
  })

  test('generates news subscription link when field_govdelivery_id_news is provided', () => {
    const regionData = {
      ...baseRegionData,
      field_govdelivery_id_news: 'NEWS123',
    }

    const result = getVamcSystemSocialLinks(regionData)

    expect(result.links).toContainEqual({
      icon: 'mail',
      href: 'https://public.govdelivery.com/accounts/USVHA/subscriber/new?topic_id=NEWS123',
      text: 'Subscribe to Test VA Medical Center news and announcements',
    })
  })

  test('generates emergency subscription link when field_govdelivery_id_emerg is provided', () => {
    const regionData = {
      ...baseRegionData,
      field_govdelivery_id_emerg: 'EMERG456',
    }

    const result = getVamcSystemSocialLinks(regionData)

    expect(result.links).toContainEqual({
      icon: 'mail',
      href: 'https://public.govdelivery.com/accounts/USVHA/subscriber/new?topic_id=EMERG456',
      text: 'Subscribe to Test VA Medical Center emergency notifications',
    })
  })

  test('generates operating status link when field_operating_status is provided', () => {
    const regionData = {
      ...baseRegionData,
      field_operating_status: { url: '/operating-status' },
    }

    const result = getVamcSystemSocialLinks(regionData)

    expect(result.links).toContainEqual({
      icon: 'adjust',
      href: '/operating-status',
      text: 'Test VA Medical Center operating status',
    })
  })

  test('generates Facebook link when field_facebook is provided', () => {
    const regionData = {
      ...baseRegionData,
      field_facebook: {
        uri: 'https://facebook.com/testvamc',
        title: 'Follow us on Facebook',
      },
    }

    const result = getVamcSystemSocialLinks(regionData)

    expect(result.links).toContainEqual({
      icon: 'facebook',
      href: 'https://facebook.com/testvamc',
      text: 'Follow us on Facebook',
    })
  })

  test('generates Twitter link when field_twitter is provided', () => {
    const regionData = {
      ...baseRegionData,
      field_twitter: {
        uri: 'https://twitter.com/testvamc',
        title: 'Follow us on X',
      },
    }

    const result = getVamcSystemSocialLinks(regionData)

    expect(result.links).toContainEqual({
      icon: 'x',
      href: 'https://twitter.com/testvamc',
      text: 'Follow us on X',
    })
  })

  test('generates Flickr link when field_flickr is provided', () => {
    const regionData = {
      ...baseRegionData,
      field_flickr: {
        uri: 'https://flickr.com/testvamc',
        title: 'View our photos on Flickr',
      },
    }

    const result = getVamcSystemSocialLinks(regionData)

    expect(result.links).toContainEqual({
      icon: 'flickr',
      href: 'https://flickr.com/testvamc',
      text: 'View our photos on Flickr',
    })
  })

  test('generates Instagram link when field_instagram is provided', () => {
    const regionData = {
      ...baseRegionData,
      field_instagram: {
        uri: 'https://instagram.com/testvamc',
        title: 'Follow us on Instagram',
      },
    }

    const result = getVamcSystemSocialLinks(regionData)

    expect(result.links).toContainEqual({
      icon: 'instagram',
      href: 'https://instagram.com/testvamc',
      text: 'Follow us on Instagram',
    })
  })

  test('generates YouTube link when field_youtube is provided', () => {
    const regionData = {
      ...baseRegionData,
      field_youtube: {
        uri: 'https://youtube.com/testvamc',
        title: 'Watch our videos on YouTube',
      },
    }

    const result = getVamcSystemSocialLinks(regionData)

    expect(result.links).toContainEqual({
      icon: 'youtube',
      href: 'https://youtube.com/testvamc',
      text: 'Watch our videos on YouTube',
    })
  })

  test('generates all links when all fields are provided', () => {
    const regionData = {
      ...baseRegionData,
      field_govdelivery_id_news: 'NEWS123',
      field_govdelivery_id_emerg: 'EMERG456',
      field_operating_status: { url: '/status' },
      field_facebook: { uri: 'https://facebook.com/test', title: 'Facebook' },
      field_twitter: { uri: 'https://twitter.com/test', title: 'Twitter' },
      field_flickr: { uri: 'https://flickr.com/test', title: 'Flickr' },
      field_instagram: {
        uri: 'https://instagram.com/test',
        title: 'Instagram',
      },
      field_youtube: { uri: 'https://youtube.com/test', title: 'YouTube' },
    }

    const result = getVamcSystemSocialLinks(regionData)

    expect(result.links).toHaveLength(8)
    expect(
      result.links.some(
        (link) => link.icon === 'mail' && link.text.includes('news')
      )
    ).toBe(true)
    expect(
      result.links.some(
        (link) => link.icon === 'mail' && link.text.includes('emergency')
      )
    ).toBe(true)
    expect(result.links.some((link) => link.icon === 'adjust')).toBe(true)
    expect(result.links.some((link) => link.icon === 'facebook')).toBe(true)
    expect(result.links.some((link) => link.icon === 'x')).toBe(true)
    expect(result.links.some((link) => link.icon === 'flickr')).toBe(true)
    expect(result.links.some((link) => link.icon === 'instagram')).toBe(true)
    expect(result.links.some((link) => link.icon === 'youtube')).toBe(true)
  })

  test('filters out falsy values correctly', () => {
    const regionData = {
      ...baseRegionData,
      field_govdelivery_id_news: 'NEWS123',
      field_facebook: null, // This should be filtered out
      field_twitter: {
        uri: 'https://twitter.com/test',
        title: 'Twitter',
      },
    }

    const result = getVamcSystemSocialLinks(regionData)

    expect(result.links).toHaveLength(2)
    expect(result.links.some((link) => link.icon === 'facebook')).toBe(false)
    expect(result.links.some((link) => link.icon === 'mail')).toBe(true)
    expect(result.links.some((link) => link.icon === 'x')).toBe(true)
  })

  test('works with Omit type from NodeHealthCareLocalFacility', () => {
    const omitRegionData: Omit<NodeHealthCareRegionPage, 'field_media'> = {
      ...baseRegionData,
      field_appointments_online: true,
      field_related_links: null,
      field_vamc_ehr_system: 'vista',
      field_description: 'Test description',
      field_other_va_locations: 'Other locations',
      field_intro_text: 'Intro text',
      field_clinical_health_services: [],
      field_va_health_connect_phone: '1-800-123-4567',
      field_vamc_system_official_name: 'Official Name',
      field_govdelivery_id_news: 'NEWS123',
    }

    const result = getVamcSystemSocialLinks(omitRegionData)

    expect(result.regionNickname).toBe('Test VA Medical Center')
    expect(result.links).toHaveLength(1)
    expect(result.links[0]).toEqual({
      icon: 'mail',
      href: 'https://public.govdelivery.com/accounts/USVHA/subscriber/new?topic_id=NEWS123',
      text: 'Subscribe to Test VA Medical Center news and announcements',
    })
  })
})
