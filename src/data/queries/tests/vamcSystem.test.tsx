/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import mockData from '@/mocks/vamcSystem.mock.json'
import mockFacilityData from '@/mocks/healthCareLocalFacility.mock'
import mockStoryData from '@/products/newsStory/mock.json'
import mockEventData from '@/products/event/mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params } from '../vamcSystem'
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

jest.mock('@/lib/drupal/query', () => ({
  ...jest.requireActual('@/lib/drupal/query'),
  fetchSingleEntityOrPreview: () => mockData,
  fetchAndConcatAllResourceCollectionPages: (
    nodeType: string,
    params: DrupalJsonApiParams
  ) => {
    const queryObj = params.getQueryObject()
    
    switch (nodeType) {
      case RESOURCE_TYPES.VAMC_FACILITY:
        return { data: [mockFacilityData] }
      
      case RESOURCE_TYPES.STORY:
        // Check if this is a Lovell federal query (has administration filter)
        const isLovellParentStoryQuery = queryObj.filter && 
          Object.keys(queryObj.filter).some(key => 
            key.includes('field_administration.drupal_internal__tid')
          )
        
        if (isLovellParentStoryQuery) {
          // Return parent stories for Lovell federal queries
          return { data: [mockParentStoryData] }
        }
        
        // Return regular stories for system-specific queries
        return { data: [mockStoryData] }
      
      case RESOURCE_TYPES.EVENT:
        // Check if this is a Lovell federal query
        const isLovellParentEventQuery = queryObj.filter && 
          Object.keys(queryObj.filter).some(key => 
            key.includes('field_administration.drupal_internal__tid')
          )
        
        const isFeatured = queryObj.filter?.field_featured === '1'
        
        if (isLovellParentEventQuery) {
          // Return parent events for Lovell federal queries
          if (isFeatured) {
            return { data: [mockParentEventData] }
          } else {
            return { data: [{ ...mockParentEventData, field_featured: false }] }
          }
        }
        
        // Return system-specific events
        if (isFeatured) {
          return { data: [mockFeaturedEventData] }
        } else {
          return { data: [mockNonFeaturedEventData] }
        }
      
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
        context: lovellContext 
      })
      
      // Verify that featuredStories includes both system and parent stories
      expect(result.featuredStories).toHaveLength(2)
      expect(result.featuredStories.some(story => story.title === mockStoryData.title)).toBe(true)
      expect(result.featuredStories.some(story => story.title === mockParentStoryData.title)).toBe(true)
      
      // Verify that featuredEvents includes both system and parent events
      expect(result.featuredEvents).toHaveLength(2)
      expect(result.featuredEvents.some(event => event.title === mockFeaturedEventData.title)).toBe(true)
      expect(result.featuredEvents.some(event => event.title === mockParentEventData.title)).toBe(true)
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
        context: lovellContext 
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
        context: regularContext 
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
         context: contextWithoutLovell 
       })

       // Should behave like non-Lovell variant
       expect(result.featuredStories).toHaveLength(1)
       expect(result.featuredEvents).toHaveLength(1)
     })

    test('handles no context provided', async () => {
      const result = await queries.getData(RESOURCE_TYPES.VAMC_SYSTEM, { 
        id: mockData.id 
      })

      // Should behave like non-Lovell variant
      expect(result.featuredStories).toHaveLength(1)
      expect(result.featuredEvents).toHaveLength(1)
    })

    test('inherits parent content when system has no featured content (Lovell variant)', async () => {
      // Create a mock that returns empty for system queries but content for parent queries
      const mockWithNoSystemContent = jest.fn((nodeType: string, params: DrupalJsonApiParams) => {
        const queryObj = params.getQueryObject()
        
        switch (nodeType) {
          case RESOURCE_TYPES.VAMC_FACILITY:
            return { data: [mockFacilityData] }
          
          case RESOURCE_TYPES.STORY:
            const isLovellParentStoryQuery = queryObj.filter && 
              Object.keys(queryObj.filter).some(key => 
                key.includes('field_administration.drupal_internal__tid')
              )
            
            if (isLovellParentStoryQuery) {
              // Return parent stories for Lovell federal queries
              return { data: [mockParentStoryData] }
            }
            
            // Return empty for system-specific queries
            return { data: [] }
          
          case RESOURCE_TYPES.EVENT:
            const isLovellParentEventQuery = queryObj.filter && 
              Object.keys(queryObj.filter).some(key => 
                key.includes('field_administration.drupal_internal__tid')
              )
            
            const isFeatured = queryObj.filter?.field_featured === '1'
            
            if (isLovellParentEventQuery) {
              // Return parent events for Lovell federal queries
              if (isFeatured) {
                return { data: [mockParentEventData] }
              } else {
                return { data: [{ ...mockParentEventData, field_featured: false }] }
              }
            }
            
            // Return empty for system-specific queries (no featured or non-featured events)
            return { data: [] }
          
          default:
            return { data: [] }
        }
      })

      // Temporarily replace the mock
      const originalMock = require('@/lib/drupal/query').fetchAndConcatAllResourceCollectionPages
      require('@/lib/drupal/query').fetchAndConcatAllResourceCollectionPages = mockWithNoSystemContent

      try {
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
          context: lovellContext 
        })

        // Should only have parent content, no system content
        expect(result.featuredStories).toHaveLength(1)
        expect(result.featuredStories[0].title).toBe(mockParentStoryData.title)
        
        expect(result.featuredEvents).toHaveLength(1)
        expect(result.featuredEvents[0].title).toBe(mockParentEventData.title)
        
        // Should have no fallback event since we found featured events from parent
        expect(result.fallbackEvent).toBeNull()
      } finally {
        // Restore the original mock
        require('@/lib/drupal/query').fetchAndConcatAllResourceCollectionPages = originalMock
      }
    })
  })

  describe('Event fallback functionality', () => {
    // Mock scenario where no featured events exist
    const mockWithNoFeaturedEvents = jest.fn()

    beforeEach(() => {
      mockWithNoFeaturedEvents.mockImplementation((nodeType: string, params: DrupalJsonApiParams) => {
        const queryObj = params.getQueryObject()
        
        if (nodeType === RESOURCE_TYPES.EVENT && queryObj.filter?.field_featured === '1') {
          // No featured events
          return { data: [] }
        }
        
        if (nodeType === RESOURCE_TYPES.EVENT && queryObj.filter?.field_featured === '0') {
          // Return non-featured event as fallback
          return { data: [mockNonFeaturedEventData] }
        }
        
        // Default behavior for other cases
        return { data: [] }
      })
    })

    test('uses fallback event when no featured events exist', async () => {
      // Temporarily mock the function to return no featured events
      const originalMock = require('@/lib/drupal/query').fetchAndConcatAllResourceCollectionPages
      require('@/lib/drupal/query').fetchAndConcatAllResourceCollectionPages = mockWithNoFeaturedEvents

      try {
        const result = await queries.getData(RESOURCE_TYPES.VAMC_SYSTEM, { 
          id: mockData.id 
        })

        expect(result.featuredEvents).toHaveLength(0)
        expect(result.fallbackEvent).toBeTruthy()
        expect(result.fallbackEvent?.title).toBe(mockNonFeaturedEventData.title)
      } finally {
        // Restore the original mock
        require('@/lib/drupal/query').fetchAndConcatAllResourceCollectionPages = originalMock
      }
    })

    test('has no fallback event when featured events exist', async () => {
      const result = await queries.getData(RESOURCE_TYPES.VAMC_SYSTEM, { 
        id: mockData.id 
      })

      expect(result.featuredEvents.length).toBeGreaterThan(0)
      expect(result.fallbackEvent).toBeNull()
    })
  })
})
