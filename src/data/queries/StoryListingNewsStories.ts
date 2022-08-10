import { QueryData, QueryOpts, QueryParams } from '@next-drupal/query'
import { drupalClient } from '@/lib/utils/drupalClient'
import { queries } from '.'
import { NodeNewsStory } from '@/types/data-types/drupal/node'
import { NewsStoryTeaserType } from '@/types/index'
import { NewsStoryTeaserMapping } from '@/data/mappings/NewsStoryTeaserMapping'

// Define the query params for fetching node--news_story.
export const params: QueryParams<null> = () => {
  return queries.getParams()
}

// Define the option types for the data loader.
type DataOpts = QueryOpts<{
  listingId: string
}>

// Implement the data loader.
export const data: QueryData<DataOpts, NewsStoryTeaserType[]> = async (
  opts
): Promise<NewsStoryTeaserType[]> => {
  if (opts?.listingId) {
    params().addFilter('field_listing.id', opts.listingId)
  }
  const entities = await drupalClient.getResourceCollection<NodeNewsStory>(
    'node--news_story',
    {
      params: params().getQueryObject(),
    }
  )

  const mappedEntities = entities.map((entity: NodeNewsStory) => {
    return NewsStoryTeaserMapping(entity)
  })
  return mappedEntities
}
