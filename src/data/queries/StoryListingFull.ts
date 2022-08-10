import { QueryData, QueryOpts, QueryParams } from '@next-drupal/query'
import { drupalClient } from '@/lib/utils/drupalClient'
import { queries } from '.'
import { NodeStoryListing } from '@/types/data-types/drupal/node'
import { StoryListingFullType } from '@/types/index'
import { StoryListingFullMapping } from '@/data/mappings/StoryListingFullMapping'

// Define the query params for fetching node--news_story.
export const params: QueryParams<null> = () => {
  return queries.getParams()
}

// Define the option types for the data loader.
type DataOpts = QueryOpts<{
  id: string
}>

// Implement the data loader.
export const data: QueryData<DataOpts, StoryListingFullType> = async (
  opts
): Promise<StoryListingFullType> => {
  const entity = await drupalClient.getResource<NodeStoryListing>(
    'node--story_listing',
    opts?.id,
    {
      params: params().getQueryObject(),
    }
  )

  return StoryListingFullMapping(entity)
}
