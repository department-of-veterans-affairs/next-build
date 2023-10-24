import { drupalClient } from '@/lib/drupal/drupalClient'
import { QUERIES_MAP, queries } from '@/data/queries'
import { RESOURCE_TYPES, ResourceTypeType } from '@/lib/constants/resourceTypes'
import { StaticPathResourceType } from '@/types/index'
import { GetStaticPropsContext } from 'next'
import { QueryOpts } from 'next-drupal-query'
import { LovellStaticPropsContextProps } from '@/lib/drupal/lovell/types'
import {
  isLovellTricareResource,
  isLovellVaResource,
} from '@/lib/drupal/lovell/utils'
import { getLovellVariantOfStaticPathResource } from '@/lib/drupal/lovell/staticPaths'
import { LOVELL } from '@/lib/drupal/lovell/constants'
import { PAGE_SIZES } from '@/lib/constants/pageSizes'

const LISTING_RESOURCE_TYPES = [RESOURCE_TYPES.STORY_LISTING] as const

export type ListingResourceTypeType = (typeof LISTING_RESOURCE_TYPES)[number]

export type StaticPathResourceTypeWithPaging = StaticPathResourceType & {
  paging: {
    totalPages: number
  }
}

export type ListingPageStaticPropsContextProps = {
  isListingPage: boolean
  firstPagePath: string
  page: number
}

export type ListingPageDataOpts = QueryOpts<{
  id: string
  page?: number
  lovell?: LovellStaticPropsContextProps
}>

type ListingPageCounts = {
  totalItems: number
  totalPages: number
}

export type ListingPageFormattedResource = ReturnType<
  (typeof QUERIES_MAP)[(typeof LISTING_RESOURCE_TYPES)[number]]['formatter']
>

export const LISTING_RESOURCE_TYPE_URL_SEGMENTS: Readonly<{
  [key: string]: string
}> = {
  [RESOURCE_TYPES.STORY_LISTING]: 'stories',
}

export function isListingResourceType(resourceType: ResourceTypeType): boolean {
  return (LISTING_RESOURCE_TYPES as readonly string[]).includes(resourceType)
}

export async function getListingPageCounts(
  listingPageStaticPathResource: StaticPathResourceType,
  listingResourceType: ListingResourceTypeType
): Promise<ListingPageCounts> {
  const resourcePath = listingPageStaticPathResource.path.alias
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
  listingPageStaticPathResources: StaticPathResourceType[],
  listingResourceType: ListingResourceTypeType
): Promise<StaticPathResourceTypeWithPaging[]> {
  if (!listingPageStaticPathResources?.length) {
    return []
  }

  return Promise.all(
    listingPageStaticPathResources.map(async (resource) => {
      const { totalItems: itemCount, totalPages: pageCount } =
        await getListingPageCounts(resource, listingResourceType)

      // If this is a Lovell (TRICARE or VA) listing page,
      // we need to merge in Federal page items to calculate
      // totalItems and, ultimately, totalPages
      const { totalItems: lovellFederalItemCount } =
        isLovellTricareResource(resource) || isLovellVaResource(resource)
          ? await getListingPageCounts(
              getLovellVariantOfStaticPathResource(
                resource,
                LOVELL.federal.variant
              ),
              listingResourceType
            )
          : {
              totalItems: 0,
            }

      const totalItems = itemCount + lovellFederalItemCount

      return {
        ...resource,
        paging: {
          totalPages: Math.ceil(totalItems / PAGE_SIZES[listingResourceType]),
        },
      }
    })
  )
}

function addStaticPathResourcesFromPagingData(
  listingPageStaticPathResourcesWithPagingData: StaticPathResourceTypeWithPaging[]
): StaticPathResourceType[] {
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
          path: {
            ...firstPageResource.path,
            alias: `${firstPageResource.path.alias}/page-${i + 2}`,
          },
        }))

        return [...acc, firstPageResource, ...additionalPageResources]
      }
    },
    []
  )
}

export async function getAllPagedListingStaticPathResources(
  listingPageStaticPathResources: StaticPathResourceType[],
  listingResourceType: ListingResourceTypeType
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
