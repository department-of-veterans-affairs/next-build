import { QueryData, QueryOpts, QueryParams } from 'next-drupal-query'
import { drupalClient } from '@/lib/utils/drupalClient'
import { queries } from '.'
import { NodeNewsStory } from '@/types/data-types/drupal/node'
import { NewsStoryFullType } from '@/types/index'
import { NewsStoryFullMapping } from '@/data/mappings/NewsStoryFullMapping'

// Define the query params for fetching node--news_story.
export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addInclude([
      'field_media',
      'field_media.image',
      'field_author',
      'field_listing',
    ])
}

// Define the option types for the data loader.
type DataOpts = QueryOpts<{
  id: string
}>

// Implement the data loader.
export const data: QueryData<DataOpts, NewsStoryFullType> = async (
  opts
): Promise<NewsStoryFullType> => {
  const entity = await drupalClient.getResource<NodeNewsStory>(
    'node--news_story',
    opts?.id,
    {
      params: params().getQueryObject(),
    }
  )

  return NewsStoryFullMapping(entity)
}
