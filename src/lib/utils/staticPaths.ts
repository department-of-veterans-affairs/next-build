import { GetStaticPathsContext } from 'next'
import { drupalClient } from '@/lib/utils/drupalClient'
import { getAllPagedListingPaths } from '@/lib/utils/listingPages'
import RESOURCE_TYPES from '@/lib/constants/resourceTypes'

export async function getStaticPathsByResourceType(
  resourceType,
  context: GetStaticPathsContext
): ReturnType<typeof drupalClient.getStaticPathsFromContext> {
  return (
    await drupalClient.getStaticPathsFromContext([resourceType], context)
  ).slice(0, 10)
}

export async function getAllStoryListingStaticPaths(
  context: GetStaticPathsContext
): ReturnType<typeof drupalClient.getStaticPathsFromContext> {
  const storyListingPaths = await getStaticPathsByResourceType(
    RESOURCE_TYPES.STORY_LISTING,
    context
  )

  // Setup paging for listing pages
  return await getAllPagedListingPaths(
    storyListingPaths,
    RESOURCE_TYPES.STORY_LISTING
  )
}
