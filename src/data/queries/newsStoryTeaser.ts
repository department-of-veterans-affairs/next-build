import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { drupalClient } from '@/lib/utils/drupalClient'
import { queries } from '.'
import { NodeNewsStory } from '@/types/data-types/drupal/node'
import { NewsStoryTeaserType } from '@/types/index'
import { mediaImageDataService } from '@/templates/common/media/dataService'

// Define the query params for fetching node--news_story.
export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addInclude(['field_media', 'field_media.image', 'field_listing'])
}

// Define the option types for the data loader.
type DataOpts = QueryOpts<{
  id: string
}>

// Implement the data loader.
export const data: QueryData<DataOpts, NodeNewsStory> = async (
  opts
): Promise<NodeNewsStory> => {
  const entity = await drupalClient.getResource<NodeNewsStory>(
    'node--news_story',
    opts?.id,
    {
      params: params().getQueryObject(),
    }
  )

  return entity
}

export const formatter: QueryFormatter<NodeNewsStory, NewsStoryTeaserType> = (
  entity: NodeNewsStory
) => {
  return {
    id: entity.id,
    type: entity.type,
    published: entity.status,
    headingLevel: 'foo', //@todo fix headingLevel,
    title: entity.title,
    image: mediaImageDataService(
      entity.field_media,
      '1_1_square_medium_thumbnail '
    ),
    link: entity.path.alias,
    introText: entity.field_intro_text,
  }
}
