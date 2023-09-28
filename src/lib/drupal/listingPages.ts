import { drupalClient } from '@/lib/drupal/drupalClient'
import { queries } from '@/data/queries'
import { RESOURCE_TYPES, ResourceTypeType } from '@/lib/constants/resourceTypes'
import { StaticPathResourceType } from '@/types/index'

const LISTING_RESOURCE_TYPES = [RESOURCE_TYPES.STORY_LISTING] as const

export type ListingResourceTypeType = (typeof LISTING_RESOURCE_TYPES)[number]

export type StaticPathResourceTypeWithPaging = StaticPathResourceType & {
  paging: {
    totalPages: number
  }
}

const RESOURCE_TYPE_URL_SEGMENTS: Readonly<{ [key: string]: string }> = {
  [RESOURCE_TYPES.STORY_LISTING]: 'stories',
}

export function isListingResourceType(resourceType: ResourceTypeType): boolean {
  return (LISTING_RESOURCE_TYPES as readonly string[]).includes(resourceType)
}

async function getListingPageCount(
  listingPageStaticPathResource: StaticPathResourceType,
  listingResourceType: ListingResourceTypeType
): Promise<number> {
  const resourcePath = listingPageStaticPathResource.path.alias
  const pathInfo = await drupalClient.translatePath(resourcePath)
  if (pathInfo?.entity?.uuid) {
    const resource = await queries.getData(listingResourceType, {
      id: pathInfo.entity.uuid,
    })

    return resource?.totalPages || 0
  }

  return 0
}

async function getListingPageStaticPathResourcesWithPagingData(
  listingPageStaticPathResources: StaticPathResourceType[],
  listingResourceType: ListingResourceTypeType
) {
  if (!listingPageStaticPathResources?.length) {
    return []
  }

  return Promise.all(
    listingPageStaticPathResources.map(async (resource) => {
      const totalPages = await getListingPageCount(
        resource,
        listingResourceType
      )

      return {
        ...resource,
        paging: {
          totalPages,
        },
      }
    })
  )
}

function addStaticPathResourcesFromPagingData(
  listingPageStaticPathResourcesWithPagingData: StaticPathResourceTypeWithPaging[],
  listingResourceType: ListingResourceTypeType
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
    resourcesWithPagingData,
    listingResourceType
  )

  return allListingResources
}

export function isListingPageSlug(
  slug: string | string[]
): { path: string; page: number } | false {
  if (slug === undefined || typeof slug === 'string' || slug.length < 2) {
    return false
  }

  // Check if second url segment is one of the listing page strings (e.g. `/{first_segment}/stories`)
  if (!Object.values(RESOURCE_TYPE_URL_SEGMENTS).includes(slug[1])) {
    return false
  }

  // If no more url segments, this is the first listing page
  if (slug.length === 2) {
    return {
      path: drupalClient.getPathFromContext({
        params: {
          slug,
        },
      }),
      page: 1,
    }
  }

  // If third url segment is a page number, this is a subsequent listing page
  // `path` is first two url segments
  // `page` (page number) is pulled from `page-{n}`
  const matches = slug[2].match(/^page-(\d)+$/)
  if (matches) {
    return {
      path: drupalClient.getPathFromContext({
        params: {
          slug: slug.slice(0, 2),
        },
      }),
      page: parseInt(matches[1]),
    }
  }

  // Otherwise, this is not a listing page
  return false
}
