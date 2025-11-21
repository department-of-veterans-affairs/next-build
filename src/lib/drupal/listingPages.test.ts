/**
 * @jest-environment node
 */

import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import {
  isListingResourceType,
  isSinglePageListingResourceType,
  getListingPageStaticPropsContext,
  getListingPageCounts,
  getAllPagedListingStaticPathResources,
  LISTING_RESOURCE_TYPE_URL_SEGMENTS,
} from './listingPages'
import { slugToPath } from '@/lib/utils/slug'
import { StaticPathResource } from '@/components/staticPathResources/formatted-type'
import { isLovellChildVariantResource } from '@/lib/drupal/lovell/utils'
import { getLovellVariantOfStaticPathResource } from '@/lib/drupal/lovell/staticPaths'
import { LOVELL } from '@/lib/drupal/lovell/constants'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { GetStaticPropsContext } from 'next'

// Mock administration for non-Lovell resources
const mockAdministration = {
  entityId: null,
  name: null,
}

// Mock drupalClient
const mockTranslatePath = jest.fn()
jest.mock('@/lib/drupal/drupalClient', () => ({
  drupalClient: {
    translatePath: jest.fn(),
    getPathFromContext: jest.fn(),
  },
}))

// Mock queries
const mockGetData = jest.fn()
jest.mock('@/lib/drupal/queries', () => ({
  queries: {
    getData: (resourceType: string, opts: object) =>
      mockGetData(resourceType, opts),
  },
}))

// Mock Lovell utilities
jest.mock('@/lib/drupal/lovell/utils', () => ({
  isLovellChildVariantResource: jest.fn(),
}))

jest.mock('@/lib/drupal/lovell/staticPaths', () => ({
  getLovellVariantOfStaticPathResource: jest.fn(),
}))

const listingPageFirstPageSlug = ['some-health-care', 'stories']
const listingPageSecondPageSlug = ['some-health-care', 'stories', 'page-2']
const listingPageTenthPageSlug = ['some-health-care', 'stories', 'page-10']
const listingPageTwentiethPageSlug = ['some-health-care', 'stories', 'page-20']

const pressReleaseFirstPageSlug = ['some-health-care', 'news-releases']
const pressReleaseSecondPageSlug = [
  'some-health-care',
  'news-releases',
  'page-2',
]
const pressReleaseTenthPageSlug = [
  'some-health-care',
  'news-releases',
  'page-10',
]
const pressReleaseThirteenthPageSlug = [
  'some-health-care',
  'news-releases',
  'page-13',
]

const nonListingPageSlug = ['some-health-care', 'stories', 'story-title']
const eventListingFirstPageSlug = ['some-health-care', 'events']
const eventListingSecondPageSlug = ['some-health-care', 'events', 'page-2']

describe('isListingResourceType', () => {
  test('should return true when listing resource type', () => {
    const storyListingResult = isListingResourceType(
      RESOURCE_TYPES.STORY_LISTING
    )
    expect(storyListingResult).toBe(true)
  })

  test('should return false when not listing resource type', () => {
    const storyResult = isListingResourceType(RESOURCE_TYPES.STORY)
    expect(storyResult).toBe(false)
  })
})

describe('isSinglePageListingResourceType', () => {
  test('should return true when single-page listing resource type', () => {
    const eventListingResult = isSinglePageListingResourceType(
      RESOURCE_TYPES.EVENT_LISTING
    )
    expect(eventListingResult).toBe(true)
  })

  test('should return false when not single-page listing resource type', () => {
    const storyListingResult = isSinglePageListingResourceType(
      RESOURCE_TYPES.STORY_LISTING
    )
    expect(storyListingResult).toBe(false)
  })
})

describe('getListingPageStaticPropsContext', () => {
  beforeEach(() => {
    ;(drupalClient.getPathFromContext as jest.Mock).mockImplementation(
      (context: GetStaticPropsContext) => {
        if (context.params?.slug) {
          return slugToPath(context.params.slug)
        }
        return null
      }
    )
  })

  test('should properly handle first listing page', () => {
    const context = {
      params: {
        slug: listingPageFirstPageSlug,
      },
    }
    const result = getListingPageStaticPropsContext(context)
    expect(result).toStrictEqual({
      isListingPage: true,
      firstPagePath: slugToPath(listingPageFirstPageSlug),
      page: 1,
    })
  })

  test('should properly handle subsequent listing page', () => {
    const context = {
      params: {
        slug: listingPageSecondPageSlug,
      },
    }
    const result = getListingPageStaticPropsContext(context)
    expect(result).toStrictEqual({
      isListingPage: true,
      firstPagePath: slugToPath(listingPageFirstPageSlug),
      page: 2,
    })
  })

  test('should properly handle double-digit page number (page 10)', () => {
    const context = {
      params: {
        slug: listingPageTenthPageSlug,
      },
    }
    const result = getListingPageStaticPropsContext(context)
    expect(result).toStrictEqual({
      isListingPage: true,
      firstPagePath: slugToPath(listingPageFirstPageSlug),
      page: 10,
    })
  })

  test('should properly handle double-digit page number (page 20)', () => {
    const context = {
      params: {
        slug: listingPageTwentiethPageSlug,
      },
    }
    const result = getListingPageStaticPropsContext(context)
    expect(result).toStrictEqual({
      isListingPage: true,
      firstPagePath: slugToPath(listingPageFirstPageSlug),
      page: 20,
    })
  })
})

describe('getListingPageStaticPropsContext for Press Releases', () => {
  beforeEach(() => {
    ;(drupalClient.getPathFromContext as jest.Mock).mockImplementation(
      (context: GetStaticPropsContext) => {
        if (context.params?.slug) {
          return slugToPath(context.params.slug)
        }
        return null
      }
    )
  })

  test('should properly handle first page', () => {
    const context = {
      params: {
        slug: pressReleaseFirstPageSlug,
      },
    }
    const result = getListingPageStaticPropsContext(context)
    expect(result).toStrictEqual({
      isListingPage: true,
      firstPagePath: slugToPath(pressReleaseFirstPageSlug),
      page: 1,
    })
  })

  test('should properly handle single-digit page number', () => {
    const context = {
      params: {
        slug: pressReleaseSecondPageSlug,
      },
    }
    const result = getListingPageStaticPropsContext(context)
    expect(result).toStrictEqual({
      isListingPage: true,
      firstPagePath: slugToPath(pressReleaseFirstPageSlug),
      page: 2,
    })
  })

  test('should properly handle double-digit page number (page 10)', () => {
    const context = {
      params: {
        slug: pressReleaseTenthPageSlug,
      },
    }
    const result = getListingPageStaticPropsContext(context)
    expect(result).toStrictEqual({
      isListingPage: true,
      firstPagePath: slugToPath(pressReleaseFirstPageSlug),
      page: 10,
    })
  })

  test('should properly handle double-digit page number (page 13)', () => {
    const context = {
      params: {
        slug: pressReleaseThirteenthPageSlug,
      },
    }
    const result = getListingPageStaticPropsContext(context)
    expect(result).toStrictEqual({
      isListingPage: true,
      firstPagePath: slugToPath(pressReleaseFirstPageSlug),
      page: 13,
    })
  })

  test('should return null/false listing values when not listing page', () => {
    const context = {
      params: {
        slug: nonListingPageSlug,
      },
    }
    const result = getListingPageStaticPropsContext(context)
    expect(result).toStrictEqual({
      isListingPage: false,
      firstPagePath: null,
      page: null,
    })
  })
})

describe('getListingPageStaticPropsContext edge cases', () => {
  beforeEach(() => {
    ;(drupalClient.getPathFromContext as jest.Mock).mockImplementation(
      (context: GetStaticPropsContext) => {
        if (context.params?.slug) {
          return slugToPath(context.params.slug)
        }
        return null
      }
    )
  })

  test('should handle event listing first page', () => {
    const context = {
      params: {
        slug: eventListingFirstPageSlug,
      },
    }
    const result = getListingPageStaticPropsContext(context)
    expect(result).toStrictEqual({
      isListingPage: true,
      firstPagePath: slugToPath(eventListingFirstPageSlug),
      page: 1,
    })
  })

  test('should NOT handle event listing subsequent pages (single-page listing)', () => {
    const context = {
      params: {
        slug: eventListingSecondPageSlug,
      },
    }
    const result = getListingPageStaticPropsContext(context)
    expect(result).toStrictEqual({
      isListingPage: false,
      firstPagePath: null,
      page: null,
    })
  })

  test('should handle undefined slug', () => {
    const context = {
      params: {
        slug: undefined,
      },
    }
    const result = getListingPageStaticPropsContext(context)
    expect(result).toStrictEqual({
      isListingPage: false,
      firstPagePath: null,
      page: null,
    })
  })

  test('should handle string slug (not array)', () => {
    const context = {
      params: {
        slug: 'some-string',
      },
    }
    const result = getListingPageStaticPropsContext(context)
    expect(result).toStrictEqual({
      isListingPage: false,
      firstPagePath: null,
      page: null,
    })
  })

  test('should handle slug with length < 2', () => {
    const context = {
      params: {
        slug: ['single-segment'],
      },
    }
    const result = getListingPageStaticPropsContext(context)
    expect(result).toStrictEqual({
      isListingPage: false,
      firstPagePath: null,
      page: null,
    })
  })

  test('should handle slug with invalid page format', () => {
    const context = {
      params: {
        slug: ['some-health-care', 'stories', 'invalid-page'],
      },
    }
    const result = getListingPageStaticPropsContext(context)
    expect(result).toStrictEqual({
      isListingPage: false,
      firstPagePath: null,
      page: null,
    })
  })

  test('should handle slug with length > 3', () => {
    const context = {
      params: {
        slug: ['some-health-care', 'stories', 'page-2', 'extra-segment'],
      },
    }
    const result = getListingPageStaticPropsContext(context)
    expect(result).toStrictEqual({
      isListingPage: false,
      firstPagePath: null,
      page: null,
    })
  })

  test('should handle slug with non-listing page segment', () => {
    const context = {
      params: {
        slug: ['some-health-care', 'not-a-listing-segment'],
      },
    }
    const result = getListingPageStaticPropsContext(context)
    expect(result).toStrictEqual({
      isListingPage: false,
      firstPagePath: null,
      page: null,
    })
  })
})

describe('LISTING_RESOURCE_TYPE_URL_SEGMENTS', () => {
  test('should have correct URL segments for all listing types', () => {
    expect(
      LISTING_RESOURCE_TYPE_URL_SEGMENTS[RESOURCE_TYPES.STORY_LISTING]
    ).toBe('stories')
    expect(
      LISTING_RESOURCE_TYPE_URL_SEGMENTS[RESOURCE_TYPES.EVENT_LISTING]
    ).toBe('events')
    expect(
      LISTING_RESOURCE_TYPE_URL_SEGMENTS[RESOURCE_TYPES.PRESS_RELEASE_LISTING]
    ).toBe('news-releases')
  })
})

describe('getListingPageCounts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(drupalClient.translatePath as jest.Mock).mockImplementation(
      mockTranslatePath
    )
  })

  test('should return counts when pathInfo has entity uuid', async () => {
    const mockResource: StaticPathResource = {
      path: '/test-path',
      administration: mockAdministration,
    }
    const mockUuid = 'test-uuid-123'
    const mockTotalItems = 25
    const mockTotalPages = 3

    mockTranslatePath.mockResolvedValue({
      entity: {
        uuid: mockUuid,
      },
    })

    mockGetData.mockResolvedValue({
      totalItems: mockTotalItems,
      totalPages: mockTotalPages,
    })

    const result = await getListingPageCounts(
      mockResource,
      RESOURCE_TYPES.STORY_LISTING
    )

    expect(mockTranslatePath).toHaveBeenCalledWith('/test-path')
    expect(mockGetData).toHaveBeenCalledWith(RESOURCE_TYPES.STORY_LISTING, {
      id: mockUuid,
      page: 1,
    })
    expect(result).toEqual({
      totalItems: mockTotalItems,
      totalPages: mockTotalPages,
    })
  })

  test('should return zero counts when pathInfo is null', async () => {
    const mockResource: StaticPathResource = {
      path: '/test-path',
      administration: mockAdministration,
    }

    mockTranslatePath.mockResolvedValue(null)

    const result = await getListingPageCounts(
      mockResource,
      RESOURCE_TYPES.STORY_LISTING
    )

    expect(mockTranslatePath).toHaveBeenCalledWith('/test-path')
    expect(mockGetData).not.toHaveBeenCalled()
    expect(result).toEqual({
      totalItems: 0,
      totalPages: 0,
    })
  })

  test('should return zero counts when pathInfo has no entity', async () => {
    const mockResource: StaticPathResource = {
      path: '/test-path',
      administration: mockAdministration,
    }

    mockTranslatePath.mockResolvedValue({})

    const result = await getListingPageCounts(
      mockResource,
      RESOURCE_TYPES.STORY_LISTING
    )

    expect(mockTranslatePath).toHaveBeenCalledWith('/test-path')
    expect(mockGetData).not.toHaveBeenCalled()
    expect(result).toEqual({
      totalItems: 0,
      totalPages: 0,
    })
  })

  test('should return zero counts when pathInfo entity has no uuid', async () => {
    const mockResource: StaticPathResource = {
      path: '/test-path',
      administration: mockAdministration,
    }

    mockTranslatePath.mockResolvedValue({
      entity: {},
    })

    const result = await getListingPageCounts(
      mockResource,
      RESOURCE_TYPES.STORY_LISTING
    )

    expect(mockTranslatePath).toHaveBeenCalledWith('/test-path')
    expect(mockGetData).not.toHaveBeenCalled()
    expect(result).toEqual({
      totalItems: 0,
      totalPages: 0,
    })
  })

  test('should return zero counts when resource has no totalItems or totalPages', async () => {
    const mockResource: StaticPathResource = {
      path: '/test-path',
      administration: mockAdministration,
    }
    const mockUuid = 'test-uuid-123'

    mockTranslatePath.mockResolvedValue({
      entity: {
        uuid: mockUuid,
      },
    })

    mockGetData.mockResolvedValue({})

    const result = await getListingPageCounts(
      mockResource,
      RESOURCE_TYPES.STORY_LISTING
    )

    expect(result).toEqual({
      totalItems: 0,
      totalPages: 0,
    })
  })

  test('should work with different listing resource types', async () => {
    const mockResource: StaticPathResource = {
      path: '/test-path',
      administration: mockAdministration,
    }
    const mockUuid = 'test-uuid-123'

    mockTranslatePath.mockResolvedValue({
      entity: {
        uuid: mockUuid,
      },
    })

    mockGetData.mockResolvedValue({
      totalItems: 50,
      totalPages: 5,
    })

    const result = await getListingPageCounts(
      mockResource,
      RESOURCE_TYPES.PRESS_RELEASE_LISTING
    )

    expect(mockGetData).toHaveBeenCalledWith(
      RESOURCE_TYPES.PRESS_RELEASE_LISTING,
      {
        id: mockUuid,
        page: 1,
      }
    )
    expect(result).toEqual({
      totalItems: 50,
      totalPages: 5,
    })
  })
})

describe('getAllPagedListingStaticPathResources', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(drupalClient.translatePath as jest.Mock).mockImplementation(
      mockTranslatePath
    )
    // Reset Lovell mocks
    ;(isLovellChildVariantResource as jest.Mock).mockReturnValue(false)
  })

  test('should return empty array when input is empty', async () => {
    const result = await getAllPagedListingStaticPathResources(
      [],
      RESOURCE_TYPES.STORY_LISTING
    )
    expect(result).toEqual([])
    expect(mockTranslatePath).not.toHaveBeenCalled()
  })

  test('should return single resource when totalPages is 1', async () => {
    const mockResource: StaticPathResource = {
      path: '/test-path',
      administration: mockAdministration,
    }
    const mockUuid = 'test-uuid-123'

    mockTranslatePath.mockResolvedValue({
      entity: {
        uuid: mockUuid,
      },
    })

    mockGetData.mockResolvedValue({
      totalItems: 5,
      totalPages: 1,
    })

    const result = await getAllPagedListingStaticPathResources(
      [mockResource],
      RESOURCE_TYPES.STORY_LISTING
    )

    expect(result).toHaveLength(1)
    expect(result[0].path).toBe(mockResource.path)
    expect(result[0].administration).toEqual(mockResource.administration)
  })

  test('should generate multiple pages when totalPages > 1', async () => {
    const mockResource: StaticPathResource = {
      path: '/test-path',
      administration: mockAdministration,
    }
    const mockUuid = 'test-uuid-123'
    const totalPages = 3

    mockTranslatePath.mockResolvedValue({
      entity: {
        uuid: mockUuid,
      },
    })

    mockGetData.mockResolvedValue({
      totalItems: 25,
      totalPages,
    })

    const result = await getAllPagedListingStaticPathResources(
      [mockResource],
      RESOURCE_TYPES.STORY_LISTING
    )

    expect(result).toHaveLength(totalPages)
    expect(result[0].path).toBe(mockResource.path) // First page
    expect(result[0].administration).toEqual(mockResource.administration)
    expect(result[1].path).toBe('/test-path/page-2')
    expect(result[2].path).toBe('/test-path/page-3')
  })

  test('should handle multiple resources', async () => {
    const mockResource1: StaticPathResource = {
      path: '/test-path-1',
      administration: mockAdministration,
    }
    const mockResource2: StaticPathResource = {
      path: '/test-path-2',
      administration: mockAdministration,
    }
    const mockUuid1 = 'test-uuid-1'
    const mockUuid2 = 'test-uuid-2'

    mockTranslatePath
      .mockResolvedValueOnce({
        entity: {
          uuid: mockUuid1,
        },
      })
      .mockResolvedValueOnce({
        entity: {
          uuid: mockUuid2,
        },
      })

    mockGetData
      .mockResolvedValueOnce({
        totalItems: 15,
        totalPages: 2,
      })
      .mockResolvedValueOnce({
        totalItems: 5,
        totalPages: 1,
      })

    const result = await getAllPagedListingStaticPathResources(
      [mockResource1, mockResource2],
      RESOURCE_TYPES.STORY_LISTING
    )

    expect(result).toHaveLength(3) // 2 pages + 1 page
    expect(result[0].path).toBe('/test-path-1')
    expect(result[1].path).toBe('/test-path-1/page-2')
    expect(result[2].path).toBe('/test-path-2')
  })

  test('should handle Lovell child variant resources', async () => {
    const mockResource: StaticPathResource = {
      path: '/lovell-federal-health-care-va/stories',
      administration: LOVELL.va.administration,
    }
    const mockFederalResource: StaticPathResource = {
      path: '/lovell-federal-health-care/stories',
      administration: LOVELL.federal.administration,
    }
    const mockUuid = 'test-uuid-123'
    const vaTotalItems = 10
    const federalTotalItems = 5

    ;(isLovellChildVariantResource as jest.Mock).mockReturnValue(true)
    ;(getLovellVariantOfStaticPathResource as jest.Mock).mockReturnValue(
      mockFederalResource
    )

    mockTranslatePath
      .mockResolvedValueOnce({
        entity: {
          uuid: mockUuid,
        },
      })
      .mockResolvedValueOnce({
        entity: {
          uuid: mockUuid,
        },
      })

    mockGetData
      .mockResolvedValueOnce({
        totalItems: vaTotalItems,
        totalPages: 1,
      })
      .mockResolvedValueOnce({
        totalItems: federalTotalItems,
        totalPages: 1,
      })

    const result = await getAllPagedListingStaticPathResources(
      [mockResource],
      RESOURCE_TYPES.STORY_LISTING
    )

    // PAGE_SIZES[STORY_LISTING] = 10
    // totalItems = 10 + 5 = 15
    // totalPages = Math.ceil(15 / 10) = 2
    expect(result).toHaveLength(2)
    expect(result[0].path).toBe(mockResource.path)
    expect(result[0].administration).toEqual(mockResource.administration)
    expect(result[1].path).toBe('/lovell-federal-health-care-va/stories/page-2')
    expect(getLovellVariantOfStaticPathResource).toHaveBeenCalledWith(
      mockResource,
      LOVELL.federal.variant
    )
  })

  test('should handle Lovell child variant with multiple pages', async () => {
    const mockResource: StaticPathResource = {
      path: '/lovell-federal-health-care-tricare/stories',
      administration: LOVELL.tricare.administration,
    }
    const mockFederalResource: StaticPathResource = {
      path: '/lovell-federal-health-care/stories',
      administration: LOVELL.federal.administration,
    }
    const mockUuid = 'test-uuid-123'
    const tricareTotalItems = 20
    const federalTotalItems = 10

    ;(isLovellChildVariantResource as jest.Mock).mockReturnValue(true)
    ;(getLovellVariantOfStaticPathResource as jest.Mock).mockReturnValue(
      mockFederalResource
    )

    mockTranslatePath
      .mockResolvedValueOnce({
        entity: {
          uuid: mockUuid,
        },
      })
      .mockResolvedValueOnce({
        entity: {
          uuid: mockUuid,
        },
      })

    mockGetData
      .mockResolvedValueOnce({
        totalItems: tricareTotalItems,
        totalPages: 2,
      })
      .mockResolvedValueOnce({
        totalItems: federalTotalItems,
        totalPages: 1,
      })

    const result = await getAllPagedListingStaticPathResources(
      [mockResource],
      RESOURCE_TYPES.STORY_LISTING
    )

    // PAGE_SIZES[STORY_LISTING] = 10
    // totalItems = 20 + 10 = 30
    // totalPages = Math.ceil(30 / 10) = 3
    expect(result).toHaveLength(3)
    expect(result[0].path).toBe(mockResource.path)
    expect(result[0].administration).toEqual(mockResource.administration)
    expect(result[1].path).toBe(
      '/lovell-federal-health-care-tricare/stories/page-2'
    )
    expect(result[2].path).toBe(
      '/lovell-federal-health-care-tricare/stories/page-3'
    )
  })

  test('should handle non-Lovell resources', async () => {
    const mockResource: StaticPathResource = {
      path: '/test-path',
      administration: mockAdministration,
    }
    const mockUuid = 'test-uuid-123'

    ;(isLovellChildVariantResource as jest.Mock).mockReturnValue(false)

    mockTranslatePath.mockResolvedValue({
      entity: {
        uuid: mockUuid,
      },
    })

    mockGetData.mockResolvedValue({
      totalItems: 25,
      totalPages: 3,
    })

    const result = await getAllPagedListingStaticPathResources(
      [mockResource],
      RESOURCE_TYPES.STORY_LISTING
    )

    expect(result).toHaveLength(3)
    expect(getLovellVariantOfStaticPathResource).not.toHaveBeenCalled()
  })
})
