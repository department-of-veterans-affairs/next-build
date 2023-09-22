import { drupalClient } from '@/lib/utils/drupalClient'
import { getAllPagedListingPaths } from '@/lib/utils/listingPages'
import RESOURCE_TYPES from '@/lib/constants/resourceTypes'
import { JsonApiResponse, JsonApiResourceWithPath } from 'next-drupal'

async function getAllResourcesByResourceType(
  resourceType: string
): Promise<JsonApiResourceWithPath[]> {
  const pageSize = 50 //must be <= 50 due to JSON:API limit
  const params = {
    // Note: we only need `path`, but we can't put it first:
    // See:
    //  https://next-drupal.org/guides/page-limit
    //  https://dsva.slack.com/archives/C01SR56755H/p1695244241079879?thread_ts=1695070010.697129&cid=C01SR56755H
    [`fields[${resourceType}]`]: 'title,path',
    'page[limit]': pageSize,
  }

  // 1. Fetch first page.
  const firstPage = await drupalClient.getResourceCollection<JsonApiResponse>(
    resourceType,
    {
      params,
      deserialize: false,
    }
  )

  // 2. Determine number of pages to fetch.
  const totalResourceCount = firstPage.meta.count
  const firstPageData = drupalClient.deserialize(
    firstPage
  ) as JsonApiResourceWithPath[]
  const pageCount = Math.ceil(totalResourceCount / pageSize)

  // 3. If more pages, fetch them in parallel.
  // Note: If we used JSON:API `next` links, we'd have to fetch in series.
  if (pageCount <= 1) {
    return firstPageData
  }
  const subsequentPageData = await Promise.all(
    Array.from({
      length: pageCount - 1,
    }).map((_, i) => {
      const pageNum = i + 2
      return drupalClient.getResourceCollection<JsonApiResourceWithPath[]>(
        resourceType,
        {
          params: {
            ...params,
            'page[offset]': (pageNum - 1) * pageSize,
          },
        }
      )
    })
  )

  // 4. Glue all pages together.
  return [firstPageData, ...subsequentPageData].flat()
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
