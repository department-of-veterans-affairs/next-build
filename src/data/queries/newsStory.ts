import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { drupalClient } from '@/lib/utils/drupalClient'
import { queries } from '.'
import { NodeNewsStory } from '@/types/dataTypes/drupal/node'
import { NewsStoryType } from '@/types/index'

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

export const formatter: QueryFormatter<NodeNewsStory, NewsStoryType> = (
  entity: NodeNewsStory
) => {
  return {
    id: entity.id,
    type: entity.type,
    published: entity.status,
    title: entity.title,
    image: queries.formatData('media--image', entity.field_media),
    caption: entity.field_image_caption,
    author: entity.field_author,
    introText: entity.field_intro_text,
    bodyContent: entity.field_full_story,
    date: entity.created,
    socialLinks: {
      path: entity.path.alias,
      title: entity.title,
    },
    listing: entity.field_listing.path.alias,
  }
}
