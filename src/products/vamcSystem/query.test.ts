/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import mockData from '@/products/vamcSystem/mock.json'
import mockFacilityData from '@/mocks/healthCareLocalFacility.mock'
import mockStoryData from '@/products/newsStory/mock.json'
import mockEventData from '@/products/event/mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params } from '@/products/vamcSystem/query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { LOVELL } from '@/lib/drupal/lovell/constants'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'

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
