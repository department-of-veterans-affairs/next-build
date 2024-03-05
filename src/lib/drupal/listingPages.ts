import { drupalClient } from '@/lib/drupal/drupalClient'
import { QUERIES_MAP, queries } from '@/data/queries'
import { RESOURCE_TYPES, ResourceType } from '@/lib/constants/resourceTypes'
import { StaticPathResource } from '@/types/formatted/staticPathResource'
import { GetStaticPropsContext } from 'next'
import { LovellStaticPropsContextProps } from '@/lib/drupal/lovell/types'
import { isLovellChildVariantResource } from '@/lib/drupal/lovell/utils'
import { getLovellVariantOfStaticPathResource } from '@/lib/drupal/lovell/staticPaths'
import { LOVELL } from '@/lib/drupal/lovell/constants'
import { PAGE_SIZES } from '@/lib/constants/pageSizes'
import { ExpandedStaticPropsContext } from './staticProps'

const LISTING_RESOURCE_TYPES = [
  RESOURCE_TYPES.STORY_LISTING,
  RESOURCE_TYPES.EVENT_LISTING,
] as const

// Some listing pages do not need all "paged" pages generated
// statically because the paging mechanism is done client side.
// These listing pages are "single page". They are still
// listing pages in some regards, but we need to be able to
// skip subsequent-page generation for these resources.
const SINGLE_PAGE_LISTING_RESOURCE_TYPES = [
  RESOURCE_TYPES.EVENT_LISTING,
] as const

export type ListingResourceType = (typeof LISTING_RESOURCE_TYPES)[number]

export type SinglePageListingResourceType =
  (typeof SINGLE_PAGE_LISTING_RESOURCE_TYPES)[number]

export type StaticPathResourceTypeWithPaging = StaticPathResource & {
  paging: {
    totalPages: number
  }
}

export type ListingPageStaticPropsContextProps = {
  isListingPage: boolean
  firstPagePath: string
  page: number
}

export type ListingPageDataOpts = {
  id: string
  page?: number
  lovell?: LovellStaticPropsContextProps
  context?: ExpandedStaticPropsContext
}

type ListingPageCounts = {
  totalItems: number
  totalPages: number
}

// Type representing all possible object shapes returned from querying and formatting
// Drupal data for listing pages.
// E.g. StoryListingType | (other future listing type)
// Type constructed by:
//  1. Consider all keys of QUERIES_MAP (imported)
//  2. Take subset of those keys that appear in LISTING_RESOURCE_TYPES above
//  3. Map that subset of keys to their respective values, which are modules for querying data
//  4. Within each of those modules, grab the return type of the `formatter` function
export type ListingPageFormattedResource = ReturnType<
  (typeof QUERIES_MAP)[(typeof LISTING_RESOURCE_TYPES)[number]]['formatter']
>

export const LISTING_RESOURCE_TYPE_URL_SEGMENTS: Readonly<{
  [key: string]: string
}> = {
  [RESOURCE_TYPES.STORY_LISTING]: 'stories',
  [RESOURCE_TYPES.EVENT_LISTING]: 'events',
}

export function isListingResourceType(resourceType: ResourceType): boolean {
  return (LISTING_RESOURCE_TYPES as readonly string[]).includes(resourceType)
}

export function isSinglePageListingResourceType(
  resourceType: ResourceType
): boolean {
  return (SINGLE_PAGE_LISTING_RESOURCE_TYPES as readonly string[]).includes(
    resourceType
  )
}

export async function getListingPageCounts(
  listingPageStaticPathResource: StaticPathResource,
  listingResourceType: ListingResourceType
): Promise<ListingPageCounts> {
  const resourcePath = listingPageStaticPathResource.path
  const pathInfo = await drupalClient.translatePath(resourcePath)
  if (pathInfo?.entity?.uuid) {
    const resource = await queries.getData(listingResourceType, {
      id: pathInfo.entity.uuid,
      page: 1, // just need to fetch a single page in order to get totalItems and totalPages counts
    })

    return {
      totalItems: resource?.totalItems || 0,
      totalPages: resource?.totalPages || 0,
    }
  }

  return {
    totalItems: 0,
    totalPages: 0,
  }
}

async function getListingPageStaticPathResourcesWithPagingData(
  listingPageStaticPathResources: StaticPathResource[],
  listingResourceType: ListingResourceType
): Promise<StaticPathResourceTypeWithPaging[]> {
  if (!listingPageStaticPathResources?.length) {
    return []
  }

  return Promise.all(
    listingPageStaticPathResources.map(async (resource) => {
      const { totalItems, totalPages } = await getListingPageCounts(
        resource,
        listingResourceType
      )

      if (!isLovellChildVariantResource(resource)) {
        return {
          ...resource,
          paging: {
            totalPages,
          },
        }
      }

      // For Lovell (TRICARE or VA) listing pages,
      // we need to merge in Federal page items to calculate
      // totalItems and, ultimately, totalPages
      const { totalItems: totalLovellFederalItems } =
        await getListingPageCounts(
          getLovellVariantOfStaticPathResource(
            resource,
            LOVELL.federal.variant
          ),
          listingResourceType
        )

      return {
        ...resource,
        paging: {
          totalPages: Math.ceil(
            (totalItems + totalLovellFederalItems) /
              PAGE_SIZES[listingResourceType]
          ),
        },
      }
    })
  )
}

function addStaticPathResourcesFromPagingData(
  listingPageStaticPathResourcesWithPagingData: StaticPathResourceTypeWithPaging[]
): StaticPathResource[] {
  return listingPageStaticPathResourcesWithPagingData.reduce(
    (acc, firstPageResource) => {
      // Determine if there are additional pages
      if (firstPageResource.paging.totalPages <= 1) {
        return [...acc, firstPageResource]
      } else {
        const additionalPageResources = Array.from({
          length: firstPageResource.paging.totalPages - 1,
        }).map((_, i) => ({
          ...firstPageResource,
          path: `${firstPageResource.path}/page-${i + 2}`,
        }))

        return [...acc, firstPageResource, ...additionalPageResources]
      }
    },
    []
  )
}

export async function getAllPagedListingStaticPathResources(
  listingPageStaticPathResources: StaticPathResource[],
  listingResourceType: ListingResourceType
) {
  // Paging step 1: Determine the number of pages for each listing
  const resourcesWithPagingData =
    await getListingPageStaticPathResourcesWithPagingData(
      listingPageStaticPathResources,
      listingResourceType
    )

  // Paging step 2: Each listing resource will become multiple resources, one for each of its pages
  const allListingResources = addStaticPathResourcesFromPagingData(
    resourcesWithPagingData
  )

  return allListingResources
}

export function getListingPageStaticPropsContext(
  context: GetStaticPropsContext
): ListingPageStaticPropsContextProps {
  const slug = context.params?.slug

  const isSlugAtLeastTwoSegments =
    slug !== undefined && typeof slug !== 'string' && slug.length >= 2
  const isSlugPossibleListingPage =
    isSlugAtLeastTwoSegments &&
    Object.values(LISTING_RESOURCE_TYPE_URL_SEGMENTS).includes(slug[1])
  const isSlugFirstListingPage = isSlugPossibleListingPage && slug.length === 2
  if (isSlugFirstListingPage) {
    return {
      isListingPage: true,
      firstPagePath: drupalClient.getPathFromContext({
        params: {
          slug,
        },
      }),
      page: 1,
    }
  }

  const isSlugSubsequentListingPage: string[] | false =
    isSlugPossibleListingPage &&
    slug.length === 3 &&
    // EVENT_LISTING pages should only generate one page.
    slug[1] !==
      LISTING_RESOURCE_TYPE_URL_SEGMENTS[RESOURCE_TYPES.EVENT_LISTING] &&
    slug[2].match(/^page-(\d)+$/)
  const page = isSlugSubsequentListingPage
    ? parseInt(isSlugSubsequentListingPage[1])
    : null
  if (isSlugSubsequentListingPage) {
    return {
      isListingPage: true,
      firstPagePath: drupalClient.getPathFromContext({
        params: {
          slug: slug.slice(0, 2), // `firstPagePath` is first two url segments
        },
      }),
      page,
    }
  }

  // Otherwise, this is not a listing page
  return {
    isListingPage: false,
    firstPagePath: null,
    page: null,
  }
}
