import { drupalClient } from '@/lib/utils/drupalClient'
import { queries } from '@/data/queries'
import RESOURCE_TYPES from '@/lib/constants/resourceTypes'

const RESOURCE_TYPE_URL_SEGMENTS: Readonly<{ [key: string]: string }> = {
  [RESOURCE_TYPES.STORY_LISTING]: 'stories',
}

async function getListingPageCount(
  listingPagePath,
  listingResourceType
): Promise<number> {
  const resourcePath = listingPagePath?.params?.slug?.join?.('/') || ''
  const pathInfo = await drupalClient.translatePath(resourcePath)
  if (pathInfo?.entity?.uuid) {
    const resource = await queries.getData(listingResourceType, {
      id: pathInfo.entity.uuid,
    })

    return resource?.totalPages || 0
  }

  return 0
}

async function getListingPagePathsWithPagingData(
  listingPaths,
  listingResourceType
) {
  if (!listingPaths?.length) {
    return []
  }

  return Promise.all(
    listingPaths?.map?.(async (listingPath) => {
      const path =
        typeof listingPath === 'string'
          ? {
              params: {
                slug: [listingPath],
              },
            }
          : listingPath

      const totalPages = await getListingPageCount(path, listingResourceType)

      return {
        ...path,
        paging: {
          totalPages,
        },
      }
    })
  )
}

function addPathsFromPagingData(
  listingPathsWithPagingData,
  listingResourceType
) {
  const urlSegment = RESOURCE_TYPE_URL_SEGMENTS[listingResourceType]

  return listingPathsWithPagingData.reduce((acc, listingPath) => {
    // We always build the first page
    const firstPagePath = {
      params: {
        slug: [listingPath?.params?.slug[0], urlSegment],
      },
    }

    // There might be additional pages
    if (listingPath.paging.totalPages <= 1) {
      return [...acc, firstPagePath]
    } else {
      const additionalPagePaths = Array.from({
        length: listingPath.paging.totalPages - 1,
      }).map((_, i) => ({
        params: {
          slug: [listingPath?.params?.slug[0], urlSegment, `page-${i + 2}`],
        },
      }))

      return [...acc, firstPagePath, ...additionalPagePaths]
    }
  }, [])
}

export async function getAllPagedListingPaths(
  listingPaths,
  listingResourceType
) {
  // Paging step 1: Determine the number of pages for each listing
  const listingPathsWithPagingData = await getListingPagePathsWithPagingData(
    listingPaths,
    listingResourceType
  )
  // Paging step 2: Each listing path will become multiple paths, one for each of its pages
  const allListingPaths = addPathsFromPagingData(
    listingPathsWithPagingData,
    listingResourceType
  )

  return allListingPaths
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
