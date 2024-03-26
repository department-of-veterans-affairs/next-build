import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import {
  isListingResourceType,
  isSinglePageListingResourceType,
  getListingPageStaticPropsContext,
} from './listingPages'
import { slugToPath } from '@/lib/utils/slug'

const listingPageFirstPageSlug = ['some-health-care', 'stories']

const listingPageSecondPageSlug = ['some-health-care', 'stories', 'page-2']

const nonListingPageSlug = ['some-health-care', 'stories', 'story-title']

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
