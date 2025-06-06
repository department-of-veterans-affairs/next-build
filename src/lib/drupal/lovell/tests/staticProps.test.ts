// Mock declarations
jest.mock('@/lib/drupal/staticProps', () => ({
  fetchSingleStaticPropsResource: jest.fn(),
  getDefaultStaticPropsResource: jest.fn(),
}))

jest.mock('../utils', () => ({
  isLovellTricareSlug: (slug) => slug === lovellTricareSlug,
  isLovellVaSlug: (slug) => slug === lovellVaSlug,
  getLovellVariantOfBreadcrumbs: (breadcrumbs) => breadcrumbs,
  getLovellVariantOfUrl: (url) => url,
  getOppositeChildVariant: (variant) =>
    variant === 'tricare' ? 'va' : 'tricare',
  isLovellBifurcatedResource: () => false,
}))

jest.mock('@/lib/drupal/drupalClient', () => ({
  drupalClient: {
    translatePath: jest.fn().mockResolvedValue({
      entity: {
        uuid: 'test-uuid',
        id: '1',
        type: 'node--press_releases_listing',
        bundle: 'press_releases_listing',
        canonical: '/test',
      },
    }),
  },
}))

import { LOVELL } from '../constants'
import {
  getLovellStaticPropsContext,
  getLovellStaticPropsResource,
} from '../staticProps'
import { lovellTricareSlug, lovellVaSlug, otherSlug } from './mockData'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { DrupalTranslatedPath } from 'next-drupal'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { fetchSingleStaticPropsResource } from '@/lib/drupal/staticProps'

// Mock fetchSingleStaticPropsResource as a Jest mock function
const mockFetchSingleStaticPropsResource = jest.fn()

describe('getLovellStaticPropsContext', () => {
  test('should return TRICARE-populated Lovell values when TRICARE page', () => {
    const context = {
      params: {
        slug: lovellTricareSlug,
      },
    }
    const result = getLovellStaticPropsContext(context)
    expect(result).toStrictEqual({
      isLovellVariantPage: true,
      variant: LOVELL.tricare.variant,
    })
  })

  test('should return VA-populated Lovell values when VA page', () => {
    const context = {
      params: {
        slug: lovellVaSlug,
      },
    }
    const result = getLovellStaticPropsContext(context)
    expect(result).toStrictEqual({
      isLovellVariantPage: true,
      variant: LOVELL.va.variant,
    })
  })

  test('should return null/false Lovell values when not Lovell page', () => {
    const context = {
      params: {
        slug: otherSlug,
      },
    }
    const result = getLovellStaticPropsContext(context)
    expect(result).toStrictEqual({
      isLovellVariantPage: false,
      variant: null,
    })
  })
})

describe('getLovellStaticPropsResource', () => {
  describe('press release sorting', () => {
    const mockChildVariantPage = {
      'news-releases': [
        {
          title: 'Older TRICARE Release',
          releaseDate: '2024-01-01T10:00:00-04:00',
        },
        {
          title: 'Newer TRICARE Release',
          releaseDate: '2024-02-01T10:00:00-04:00',
        },
      ],
      totalItems: 2,
      totalPages: 1,
      currentPage: 1,
      breadcrumbs: [],
      entityPath: '/tricare/news-releases',
    }

    const mockFederalPage = {
      'news-releases': [
        {
          title: 'Oldest Federal Release',
          releaseDate: '2023-12-01T10:00:00-04:00',
        },
        {
          title: 'Newest Federal Release',
          releaseDate: '2024-03-01T10:00:00-04:00',
        },
      ],
      totalItems: 2,
      totalPages: 1,
      currentPage: 1,
      breadcrumbs: [],
      entityPath: '/federal/news-releases',
    }

    beforeEach(() => {
      ;(fetchSingleStaticPropsResource as jest.Mock)
        .mockImplementationOnce(() => Promise.resolve(mockChildVariantPage))
        .mockImplementationOnce(() => Promise.resolve(mockFederalPage))
    })

    it('sorts merged press releases by releaseDate in descending order', async () => {
      const pathInfo: DrupalTranslatedPath = {
        entity: {
          uuid: 'test-uuid',
          id: '1',
          type: 'node--press_releases_listing',
          bundle: 'press_releases_listing',
          canonical: '/test',
        },
        resolved: 'true',
        isHomePath: false,
      }
      const context: ExpandedStaticPropsContext = {
        path: '/test',
        drupalPath: '/test',
        lovell: {
          variant: 'tricare',
          isLovellVariantPage: true,
        },
        listing: {
          page: 1,
          isListingPage: true,
          firstPagePath: '/test',
        },
      }
      const result = await getLovellStaticPropsResource(
        RESOURCE_TYPES.PRESS_RELEASE_LISTING,
        pathInfo,
        context
      )
      const releases = result['news-releases']
      expect(releases).toHaveLength(4)
      expect(releases[0].title).toBe('Newest Federal Release')
      expect(releases[1].title).toBe('Newer TRICARE Release')
      expect(releases[2].title).toBe('Older TRICARE Release')
      expect(releases[3].title).toBe('Oldest Federal Release')
    })
  })
})

// describe('getLovellExpandedFormattedResource', () => {
//   describe(`${RESOURCE_TYPES.STORY}`, () => {
//     test('should properly handle TRICARE bifurcated news story page', () => {
//       const tricarePath = lovellTricareResource.path.alias
//       const vaPath = lovellVaResource.path.alias
//       const expandedContext = {
//         params: {
//           slug: lovellTricareSlug,
//         },
//         path: tricarePath,
//         drupalPath: tricarePath,
//         lovell: {
//           isLovellVariantPage: true,
//           variant: LOVELL.tricare.variant,
//         },
//         listing: {
//           isListingPage: false,
//           firstPagePath: null,
//           page: null,
//         },
//       }
//       const resource: NewsStoryType = {
//         ...newsStoryPartialResource,
//         entityPath: vaPath, //Bifurcated pages get VA version's path from Drupal
//         socialLinks: {
//           ...newsStoryPartialResource.socialLinks,
//           vaPath,
//         },
//         administration: LOVELL.federal.administration, //This indicates bifurcation
//       }

//       const result: LovellExpandedFormattedResource<NewsStoryType> =
//         getLovellExpandedFormattedResource(resource, expandedContext)

//       expect(result.entityPath).toBe(tricarePath)
//       expect(result.socialLinks.path).toBe(tricarePath)
//       expect(result.administration).toStrictEqual(LOVELL.tricare.administration)
//       expect(result.lovellVariant).toBe(LOVELL.tricare.variant)
//       expect(result.canonicalLink).toBe(vaPath)
//       expect(result.lovellSwitchPath).toBe(vaPath)
//     })

//     test('should properly handle VA bifurcated news story page', () => {
//       const vaPath = lovellVaResource.path.alias
//       const tricarePath = lovellTricareResource.path.alias
//       const expandedContext = {
//         params: {
//           slug: lovellVaSlug,
//         },
//         path: vaPath,
//         drupalPath: vaPath,
//         lovell: {
//           isLovellVariantPage: true,
//           variant: LOVELL.va.variant,
//         },
//         listing: {
//           isListingPage: false,
//           firstPagePath: null,
//           page: null,
//         },
//       }
//       const resource: NewsStoryType = {
//         ...newsStoryPartialResource,
//         entityPath: vaPath,
//         socialLinks: {
//           ...newsStoryPartialResource.socialLinks,
//           path: vaPath,
//         },
//         administration: LOVELL.federal.administration, //This indicates bifurcation
//       }

//       const result: LovellExpandedFormattedResource<NewsStoryType> =
//         getLovellExpandedFormattedResource(resource, expandedContext)

//       expect(result.entityPath).toBe(vaPath)
//       expect(result.socialLinks.path).toBe(vaPath)
//       expect(result.administration).toStrictEqual(LOVELL.va.administration)
//       expect(result.lovellVariant).toBe(LOVELL.va.variant)
//       expect(result.canonicalLink).toBe(vaPath)
//       expect(result.lovellSwitchPath).toBe(tricarePath)
//     })

//     test('should return original page resource when Lovell but not bifurcated', () => {
//       const path = otherResource.path.alias
//       const expandedContext = {
//         params: {
//           slug: otherSlug,
//         },
//         path,
//         drupalPath: path,
//         lovell: {
//           isLovellVariantPage: true,
//           variant: LOVELL.tricare.variant,
//         },
//         listing: {
//           isListingPage: false,
//           firstPagePath: null,
//           page: null,
//         },
//       }
//       const resource: NewsStoryType = {
//         ...newsStoryPartialResource,
//         entityPath: path, //Non-bifurcated TRICARE pages get TRICARE path
//         socialLinks: {
//           ...newsStoryPartialResource.socialLinks,
//           path,
//         },
//         administration: LOVELL.tricare.administration, //Not bifurcated because not federal
//       }

//       const result: LovellExpandedFormattedResource<NewsStoryType> =
//         getLovellExpandedFormattedResource(resource, expandedContext)

//       expect(result).toStrictEqual(resource)
//     })

//     test('should return original page resource when not Lovell page', () => {
//       const path = otherResource.path.alias
//       const expandedContext = {
//         params: {
//           slug: otherSlug,
//         },
//         path,
//         drupalPath: path,
//         lovell: {
//           isLovellVariantPage: false,
//           variant: null,
//         },
//         listing: {
//           isListingPage: false,
//           firstPagePath: null,
//           page: null,
//         },
//       }
//       const resource: NewsStoryType = {
//         ...newsStoryPartialResource,
//         entityPath: path,
//         socialLinks: {
//           ...newsStoryPartialResource.socialLinks,
//           path,
//         },
//         administration: {
//           id: 123,
//           name: 'Some Other Health Care',
//         },
//       }
//       const result = getLovellExpandedFormattedResource(
//         resource,
//         expandedContext
//       )
//       expect(result).toStrictEqual(resource)
//     })
//   })
// })
