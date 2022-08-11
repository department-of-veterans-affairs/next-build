import {
  QueryData,
  QueryFormatter,
  QueryParams,
  QueryOptsWithPagination,
  withPagination,
} from 'next-drupal-query'
import { drupalClient } from '@/lib/utils/drupalClient'
import { queries } from '.'
import { NodeNewsStory } from '@/types/dataTypes/drupal/node'
import { NewsStoryTeaserType } from '@/types/index'

type ParamOpts = QueryOptsWithPagination<{
  listingId?: string
}>

// Define the query params for fetching node--news_story.
export const params: QueryParams<ParamOpts> = (opts) => {
  const parameters = queries.getParams('node--news_story--teaser')

  if (opts?.listingId) {
    params().addFilter('field_listing.id', opts.listingId)
  }
  return withPagination(parameters, opts)
}

// Implement the data loader.
export const data: QueryData<ParamOpts, NodeNewsStory[]> = async (
  opts
): Promise<NodeNewsStory[]> => {
  const entities = await drupalClient.getResourceCollection<NodeNewsStory[]>(
    'node--news_story',
    {
      params: params(opts).getQueryObject(),
    }
  )

  return entities
}

export const formatter: QueryFormatter<
  NodeNewsStory[],
  NewsStoryTeaserType[]
> = (entities: NodeNewsStory[]) => {
  return entities.map((entity) => {
    return queries.formatData('node--news_story--teaser', entity)
  })
}
