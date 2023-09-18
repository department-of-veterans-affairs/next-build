import { GetStaticPathsContext } from 'next'
import { drupalClient } from '@/lib/utils/drupalClient'
import { getAllPagedListingPaths } from '@/lib/utils/listingPages'
import RESOURCE_TYPES from '@/lib/constants/resourceTypes'
import { JsonApiResponse, JsonApiResourceWithPath } from 'next-drupal'

async function appendAllSubsequentPages(currentPage: JsonApiResponse) {
  if (!currentPage) {
    return []
  }

  const currentPageData = drupalClient.deserialize(
    currentPage
  ) as JsonApiResourceWithPath[]
  const nextPageLink = currentPage.links?.next
  const nextPageUrl =
    typeof nextPageLink === 'string' ? nextPageLink : nextPageLink?.href
  if (nextPageUrl) {
    try {
      const nextPageResponse = await drupalClient.fetch(nextPageUrl)
      const nextPage = await nextPageResponse.json()
      return [...currentPageData, ...(await appendAllSubsequentPages(nextPage))]
    } catch (err) {
      return currentPageData
    }
  } else {
    return currentPageData
  }
}

async function getAllResourcesByResourceType(resourceType: string) {
  const firstPage = await drupalClient.getResourceCollection<JsonApiResponse>(
    resourceType,
    {
      deserialize: false,
    }
  )

  return appendAllSubsequentPages(firstPage)
}

export async function getStaticPathsByResourceType(
  resourceType: string
): ReturnType<typeof drupalClient.getStaticPathsFromContext> {
  const resources = await getAllResourcesByResourceType(resourceType)
  return drupalClient.buildStaticPathsFromResources(resources)
}

export async function getAllStoryListingStaticPaths(): ReturnType<
  typeof drupalClient.getStaticPathsFromContext
> {
  const storyListingPaths = await getStaticPathsByResourceType(
    RESOURCE_TYPES.STORY_LISTING
  )

  // Setup paging for listing pages
  return await getAllPagedListingPaths(
    storyListingPaths,
    RESOURCE_TYPES.STORY_LISTING
  )
}
