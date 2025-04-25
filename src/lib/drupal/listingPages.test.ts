import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import {
  isListingResourceType,
  isSinglePageListingResourceType,
  getListingPageStaticPropsContext,
} from './listingPages'
import { slugToPath } from '@/lib/utils/slug'

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
