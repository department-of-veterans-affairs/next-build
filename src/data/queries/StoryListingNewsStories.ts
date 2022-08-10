import {
  QueryData,
  QueryParams,
  QueryOptsWithPagination,
  withPagination,
} from 'next-drupal-query'
import { drupalClient } from '@/lib/utils/drupalClient'
import { queries } from '.'
import { NodeNewsStory } from '@/types/data-types/drupal/node'
import { NewsStoryTeaserType } from '@/types/index'
import { NewsStoryTeaserMapping } from '@/data/mappings/NewsStoryTeaserMapping'

type ParamOpts = QueryOptsWithPagination<{
  listingId?: string
}>

// Define the query params for fetching node--news_story.
export const params: QueryParams<ParamOpts> = (opts) => {
  const parameters = queries.getParams('node--news_story')

  if (opts?.listingId) {
    params().addFilter('field_listing.id', opts.listingId)
  }
  return withPagination(parameters, opts)
}

// Implement the data loader.
export const data: QueryData<ParamOpts, NewsStoryTeaserType[]> = async (
  opts
): Promise<NewsStoryTeaserType[]> => {
  const entities = await drupalClient.getResourceCollection<NodeNewsStory>(
    'node--news_story',
    {
      params: params(opts).getQueryObject(),
    }
  )

  const mappedEntities = entities.map((entity: NodeNewsStory) => {
    return NewsStoryTeaserMapping(entity)
  })
  return mappedEntities
}
